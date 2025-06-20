import jwt from "jsonwebtoken"
import crypto from "crypto"
import { promisify } from "util"
import User from "../models/userModel.js"
import { catchAsync } from "../utils/catchAsync.js"
import { AppError } from "../utils/appError.js"
import { sendEmail } from "../utils/email.js"
import { config } from "../config/env.js"

// Create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  })
}

// Send JWT via cookie
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id)

  const cookieOptions = {
    expires: new Date(Date.now() + config.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  }

  res.cookie("jwt", token, cookieOptions)

  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  })
}

// Register a new user - Simplified version for debugging
export const signup = catchAsync(async (req, res, next) => {
  console.log("Signup request received:", req.body)

  try {
    const { name, email, password, passwordConfirm, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      console.log("Email already in use:", email)
      return res.status(400).json({
        status: "fail",
        message: "Email already in use",
      })
    }

    console.log("Creating new user with email:", email)

    // Create new user with minimal validation for testing
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role: role === "admin" ? "user" : role, // Prevent creating admin users directly
      verified: true, // Auto-verify for testing
    })

    console.log("User created successfully:", newUser._id)

    // Skip email verification for now to simplify testing
    createSendToken(newUser, 201, req, res)
  } catch (error) {
    console.error("Error in signup controller:", error)
    res.status(500).json({
      status: "error",
      message: "Registration failed",
      error: error.message,
    })
  }
})

// Verify email
export const verifyEmail = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  })

  // If token has expired or is invalid
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400))
  }

  // Activate account
  user.verified = true
  user.verificationToken = undefined
  user.verificationTokenExpires = undefined
  await user.save({ validateBeforeSave: false })

  res.status(200).json({
    status: "success",
    message: "Email verified successfully. You can now log in.",
  })
})

// Login user
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400))
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password")
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401))
  }

  // Check if user is verified
  if (!user.verified) {
    return next(new AppError("Please verify your email before logging in", 401))
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / (1000 * 60))
    return next(new AppError(`Account is locked. Please try again in ${minutesLeft} minutes`, 401))
  }

  // Reset login attempts if account was previously locked
  if (user.loginAttempts > 0) {
    user.loginAttempts = 0
    user.lockedUntil = undefined
    await user.save({ validateBeforeSave: false })
  }

  // Update last login
  user.lastLogin = Date.now()
  await user.save({ validateBeforeSave: false })

  // Send token to client
  createSendToken(user, 200, req, res)
})

// Logout user
export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })
  res.status(200).json({ status: "success" })
}

// Protect routes - Authentication middleware
export const protect = catchAsync(async (req, res, next) => {
  // Get token and check if it exists
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401))
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET)

  // Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401))
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password! Please log in again.", 401))
  }

  // Grant access to protected route
  req.user = currentUser
  res.locals.user = currentUser
  next()
})

// Restrict to certain roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }
    next()
  }
}

// Forgot password
export const forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError("There is no user with that email address.", 404))
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    })

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(new AppError("There was an error sending the email. Try again later!", 500))
  }
})

// Reset password
export const resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  // If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // Log the user in, send JWT
  createSendToken(user, 200, req, res)
})

// Update password
export const updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user.id).select("+password")

  // Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401))
  }

  // If so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  // Log user in, send JWT
  createSendToken(user, 200, req, res)
})

// Get current user
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  })
})

// Update current user
export const updateMe = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /update-password.", 400))
  }

  // Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "phoneNumber",
    "address",
    "dateOfBirth",
    "gender",
    "emergencyContact",
    "preferences",
  )

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  })
})

// Delete current user
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: "success",
    data: null,
  })
})

// Helper function to filter object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}
