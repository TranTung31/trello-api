/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'

const START_SERVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    // console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1>')
  })

  app.listen(port, hostname, () => {
    console.log(`3. Hello TranTungDev, Back-end Server is running at http://${ hostname }:${ port }`)
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