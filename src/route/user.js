const router = require('express').Router()
const { default: verifyToken } = require('../middlewares/verify_token')
const userController = require('../controller/user')

import { isAdmin } from '../middlewares/verify_roles'


router.use(verifyToken)
router.get('/',  userController.getCurrent)

module.exports = router
