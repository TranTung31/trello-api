/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Hello ${env.AUTHOR}, Back-end Server is running at http://${env.APP_HOST}:${env.APP_PORT}`)
  })

  exitHook(() => {
    CLOSE_DB()
  })
}

// Cú pháp IIFE
// Chỉ khi kết nối thành công tới Databse thì mới Start Server Back-end lên
(async () => {
  try {
    console.log('1. Connect to Database!')
    await CONNECT_DB()
    console.log('2. Connect to Database successfully!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// Chỉ khi kết nối thành công tới Databse thì mới Start Server Back-end lên
// console.log('1. Connect to Database!')
// CONNECT_DB()
//   .then(() => console.log('2. Connect to Database successfully!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })