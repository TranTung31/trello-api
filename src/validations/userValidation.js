import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { REGEX_PASSWORD_RULE, REGEX_PASSWORD_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().email().trim().strict(),
    password: Joi.string().required().min(8).pattern(REGEX_PASSWORD_RULE).message(REGEX_PASSWORD_RULE_MESSAGE),
    confirmPassword: Joi.ref('password')
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const errorCustom = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(errorCustom)
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().email().trim().strict(),
    password: Joi.string().required().min(8).pattern(REGEX_PASSWORD_RULE).message(REGEX_PASSWORD_RULE_MESSAGE),
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const errorCustom = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(errorCustom)
  }
}

export const userValidation = {
  createNew,
  login
}
