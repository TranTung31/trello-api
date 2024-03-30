/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import { env } from '~/config/environment'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from '~/routes/v1'
import cookieParser from 'cookie-parser'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())
  app.use(cookieParser())

  // Use APIs V1
  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.get('/', (req, res) => {
    res.send('Hello world!')
  })

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(`3. Production: Hello ${env.AUTHOR}, Back-end Server is running at port: ${process.env.PORT}`)
    })
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`3. Local: Hello ${env.LOCAL_DEV_AUTHOR}, Back-end Server is running at http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}`)
    })
  }


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