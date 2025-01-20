 import * as controller from '../controller'
 
 const router = require('express').Router()

 
 router.post("/", controller.insertData)

 module.exports = router