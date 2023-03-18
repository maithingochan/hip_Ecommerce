const router = require('express').Router()
const userController = require('../controllers/user.controller')
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')


router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/current', verifyAccessToken, userController.getCurrent)
router.post('/refreshtoken', userController.refreshAccessTokens)
router.get('/logout',  userController.logout)
router.get('/forgotpassword', userController.forgotPassword)
router.put('/resetpassword', userController.resetPassword)
// router.use(verifyAccessToken)
// co the viet nhu the nay khi code chay thi // router.use(verifyAccessToken) 
// se duoc kich hoat vaf bao ve cac route o duoi ma khong can them middwere

router.get('/', verifyAccessToken, isAdmin, userController.getUsers)
router.delete('/',verifyAccessToken, isAdmin,  userController.deleteUser)
router.put('/current',verifyAccessToken,  userController.updateUser)
router.put('/:uid',verifyAccessToken, isAdmin, userController.updateUserByAdmin)





module.exports = router

// CRUD |  Create - Read - Update - Delete | POST - GET - PUT - DELETE
// CREATE (POST) - PUT - body
// GET + DELETE - query