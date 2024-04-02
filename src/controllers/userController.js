import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'
import jwt from 'jsonwebtoken'
import { genarateAccessToken, genarateRefreshToken } from '~/middlewares/authMiddleware'

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)

    if (createdUser?.status === 'ERROR') {
      res.status(StatusCodes.BAD_REQUEST).json(createdUser)
    }

    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    if (result?.status === 'ERROR') {
      res.status(StatusCodes.BAD_REQUEST).json(result)
    }

    res.cookie('refreshToken', result?.data?.refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) res.status(StatusCodes.UNAUTHORIZED).json({
    status: 'ERROR',
    message: 'You are not authenticated!'
  })

  jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
    if (err) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: 'ERROR', message: 'Token is not valid!' })
    } else {
      const { _id, role } = user
      const newAccessToken = genarateAccessToken({ _id, role })
      const newRefreshToken = genarateRefreshToken({ _id, role })
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })
      res.status(StatusCodes.OK).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
    }
  })
}

export const userController = {
  createNew,
  login,
  refreshAccessToken
}
