import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }

    // Gọi tới tầng Model để xử lý lưu bản ghi newCard vào trong Database
    const createdCard = await cardModel.createNew(newCard)

    const dataCreatedCard = await cardModel.findOneById(createdCard.insertedId)

    return dataCreatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}
