 import * as controller from '../controller'
 
 const router = require('express').Router()

 router.post('/register', controller.register)
 router.post("/login", controller.login)
 router.post("/refresh_token", controller.refreshTokenController)

 module.exports = router