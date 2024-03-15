import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.route('/:id')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get board' })
  })
  .post(boardValidation.createNew, boardController.createNew)

export const boardRoute = Router
