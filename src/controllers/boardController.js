import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = (req, res, next) => {
  try {
    // console.log('req body: ', req.body)
    // console.log('req query: ', req.query)
    // console.log('req params: ', req.params)
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API post board' })
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew
}
