import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/refresh-token')
  .post(userController.refreshAccessToken)

export const userRoute = Router