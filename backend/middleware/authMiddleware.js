import jwt from "jsonwebtoken"
import { promisify } from "util"
import { config } from "../../config/env.js"
import User from "../models/userModel.js"
import AppError from "../utils/appError.js"
import catchAsync from "../utils/catchAsync.js"

export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token and check if it exists
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401))
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, config.JWT_SECRET)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401))
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password! Please log in again.", 401))
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  res.locals.user = currentUser
  next()
})


export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'doctor']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }

    next()
  }
}
