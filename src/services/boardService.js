/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { ObjectId } from 'mongodb'

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

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')

    const resBoard = cloneDeep(board)

    // Đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      // Cách dùng equals này là bởi vì ObjectId trong MongoDB có support method equals
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

      // Cách convert ObjectId về string bằng hàm toString()
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const arrColumnOrderIds = reqBody.columnOrderIds
    const arr = []
    arrColumnOrderIds.forEach((columnId) => {
      arr.push(new ObjectId(columnId))
    })

    const updateData = {
      columnOrderIds: [...arr],
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update
}
