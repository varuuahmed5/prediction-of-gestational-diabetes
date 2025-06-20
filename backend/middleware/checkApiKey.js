import { config } from "../../config/env.js"

export const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"]

  if (!apiKey || apiKey !== config.API_KEY) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized: Invalid API key",
    })
  }

  next()
}
