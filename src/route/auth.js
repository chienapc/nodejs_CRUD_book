 import * as controller from '../controller'
 
 const router = require('express').Router()

 router.post('/register', controller.register)
 router.post("/login", controller.login)

 module.exports = router