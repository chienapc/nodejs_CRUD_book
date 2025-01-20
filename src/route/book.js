import * as controller from '../controller'
import express from 'express'
import verifyToken from '../middlewares/verify_token'
import {isAdmin} from '../middlewares/verify_roles'

const router = express.Router()

router.get('/', controller.getBooks)

router.use(verifyToken)
router.use(isAdmin)

router.post('/', controller.createBooks)

module.exports = router
