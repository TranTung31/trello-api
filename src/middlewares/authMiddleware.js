import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

export const authUserMiddleware = (req, res, next) => {
  const token = req.headers.token
  if (token) {
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        res.status(StatusCodes.FORBIDDEN).json({ status: 'ERROR', message: 'Token is not valid!' })
      } else {
        req.user = user
        next()
      }
    })
  } else {
    res.status(StatusCodes.FORBIDDEN).json({
      status: 'ERROR',
      message: 'You are not authenticated!'
    })
  }
}

export const genarateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: '30s' })
}

export const genarateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: '30d' })
}