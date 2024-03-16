/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)

    const dataCreatedBoard = await boardModel.findOneById(createdBoard.insertedId)

    return dataCreatedBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}
