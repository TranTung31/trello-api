/* eslint-disable no-useless-escape */
import { userModel } from '~/models/userModel'
import bcrypt from 'bcrypt'

const createNew = async (reqBody) => {
  try {
    const saltRounds = 10
    const hashPassword = bcrypt.hashSync(reqBody.password, saltRounds)
    const newUser = {
      ...reqBody,
      password: hashPassword,
      username: reqBody.email.split('@')[0],
      displayName: reqBody.email.split('@')[0]
    }
    delete newUser.confirmPassword

    const createdUser = await userModel.createNew(newUser)

    if (createdUser?.insertedId) {
      return { status: 'SUCCESS', userMessage: 'Register sucessfully!' }
    }

    return createdUser
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    return await userModel.login(reqBody)
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  login
}
