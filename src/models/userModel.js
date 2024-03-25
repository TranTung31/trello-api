import Joi from 'joi'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { GET_DB } from '~/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().email().trim().strict(),
  password: Joi.string().required(),
  username: Joi.string().default(null),
  displayName: Joi.string().default(null),
  avatar: Joi.string().default(null),
  role: Joi.string().default('client'),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const findOneByEmail = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: validData.email
    })
    if (findOneByEmail) return { status: 'ERROR', userMessage: 'The email is definded!' }
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (error) {
    throw new Error(error)
  }
}

const login = async (data) => {
  try {
    const { email, password } = data

    const findOneByEmail = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email
    })
    if (!findOneByEmail) return { status: 'ERROR', userMessage: 'The email is not definded!' }
    if (bcrypt.compareSync(password, findOneByEmail.password)) {
      return { status: 'SUCCESS', userMessage: 'Login successfully!' }
    } else {
      return { status: 'ERROR', userMessage: 'The password is incorrect!' }
    }
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  login,
  findOneById
}
