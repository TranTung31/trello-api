/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

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

    const updateData = {
      columnOrderIds: arrColumnOrderIds,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // B1: Cập nhật lại mảng cardOrderIds của column ban đầu (Xóa _id của card được kéo ra khỏi mảng)
    await columnModel.update(
      reqBody.prevColumnId,
      { cardOrderIds: reqBody.prevCardOrderIds, updatedAt: Date.now() }
    )

    // B2: Cập nhật lại mảng cardOrderIds của column tiếp theo (Thêm _id của card vào mảng)
    await columnModel.update(
      reqBody.nextColumnId,
      { cardOrderIds: reqBody.nextCardOrderIds, updatedAt: Date.now() }
    )

    // B3: Cập nhật lại trường columnId của card đã kéo
    await cardModel.update(reqBody.currentCardId, { columnId: reqBody.nextColumnId, updatedAt: Date.now() })

    return { moveCardToDifferentColumnMessage: 'Success!' }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
