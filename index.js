const express = require('express')
const cors = require('cors')
const initRoute = require('./src/route')
require('./ConnectionDB')
require('dotenv').config()

const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))





initRoute(app)





const PORT = process.env.PORT

const listener = app.listen(PORT, () => {
    console.log("Server is running on PORT " + listener.address())
})
