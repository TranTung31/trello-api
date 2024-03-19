import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newColumn vào trong Database
    const createdColumn = await columnModel.createNew(newColumn)

    const dataCreatedColumn = await columnModel.findOneById(createdColumn.insertedId)

    return dataCreatedColumn
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew
}
