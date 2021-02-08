if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const router = require('./routes/index')
const errorHandler = require('./helper/errorHandler')
var cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())

app.use('/', router)

app.use(errorHandler)

app.listen(PORT, ()=> {console.log('running on port', PORT);})