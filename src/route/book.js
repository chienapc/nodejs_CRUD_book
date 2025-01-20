import * as controller from '../controller'
import express from 'express'

const router = express.Router()

router.get('/', controller.getBooks)

module.exports = router
