import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

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

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  login
}
