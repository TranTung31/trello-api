const express = require('express')
const app = express()

const hostname = 'localhost'
const port = '8017'

app.get('/', (req, res) => {
  res.send('<h1>Hello World NodeJS TranTung31!</h1>')
})

app.listen(port, hostname, () => {
  console.log(`Hello TranTung31, I'am running server at http://${hostname}:${port}/`);
})