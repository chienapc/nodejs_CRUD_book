const user = require('./user')
const auth= require('./auth')
const insert = require('./insert')
import {notFound } from '../middlewares/handle_error'


const initRoute = (app) => {

    app.use('/api/v1/user', user)

    app.use('/api/v1/auth', auth)

    app.use('/api/v1/insert', insert)


    



    app.use('/', notFound)

    
}

module.exports = initRoute
 
