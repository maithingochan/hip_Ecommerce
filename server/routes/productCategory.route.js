const router = require('express').Router()
const productCategory = require('../controllers/productCategory.controller')
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')


router.post('/', verifyAccessToken, isAdmin, productCategory.createCategory)
router.get('/', productCategory.getCategory)
router.put('/:pcid', verifyAccessToken, isAdmin, productCategory.updateCategory)
router.delete('/:pcid', verifyAccessToken, isAdmin, productCategory.deleteCategory)





module.exports = router