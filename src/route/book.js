import * as controller from '../controller'
import express from 'express'
import verifyToken from '../middlewares/verify_token'
import {isAdmin} from '../middlewares/verify_roles'
import uploadCloud from '../middlewares/uploader'


const router = express.Router()

router.get('/', controller.getBooks)

router.use(verifyToken)
router.use(isAdmin)

router.post('/', uploadCloud.single('image'), controller.createBooks)

module.exports = router
