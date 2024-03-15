import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  /*
    - Mặc định không cần custom message ở phía BE làm gì, vì để cho FE tự validate và custom message phía
    FE cho đẹp.
    - BE chỉ cần validate đảm bảo dữ liệu chuẩn xác và trả về message mặc định từ thư viện là được.
    - Validate bắt buộc phải có ở phía BE vì đây là điểm cuối trước khi lưu trữ dữ liệu vào Database.
    - Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở cả FE và BE.
  */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title length must be at least 3 characters long',
      'string.max': 'Title length must be less than or equal to 5 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict()
  })

  try {
    // Chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false })

    // Nếu validate dữ liệu thành công thì chuyển sang tầng Controller
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const errorCustom = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(errorCustom)
  }
}

export const boardValidation = {
  createNew
}
