const express = require('express')
const app = express()
const PORT = 3000
const router = require('./routes/index')
//const todoRoutes = require('./routes/index')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', router)

app.listen(PORT, ()=> {console.log('running on port', PORT);})