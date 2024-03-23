import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { ObjectId } from 'mongodb'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong Database
    const createdColumn = await columnModel.createNew(newColumn)
    const dataCreatedColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (dataCreatedColumn) {
      dataCreatedColumn.cards = []
      await boardModel.pushColumnOrderIds(dataCreatedColumn)
    }

    return dataCreatedColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const arrCardOrderIds = reqBody.cardOrderIds
    const arr = []
    arrCardOrderIds.forEach((cardId) => {
      arr.push(new ObjectId(cardId))
    })

    const updateData = {
      cardOrderIds: [...arr],
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)

    if (!targetColumn) throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')

    // Xóa 1 column
    await columnModel.deleteOneById(columnId)

    // Xóa nhiều cards
    await cardModel.deleteManyById(columnId)

    // Xóa columnId trong columnOrderIds của collection board
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its Cards deleted successfully!' }
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}
