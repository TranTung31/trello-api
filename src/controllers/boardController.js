import { StatusCodes } from 'http-status-codes'

const createNew = (req, res) => {
  try {
    console.log('req body: ', req.body)
    console.log('req query: ', req.query)
    console.log('req params: ', req.params)
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API post board' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    })
  }
}

export const boardController = {
  createNew
}
