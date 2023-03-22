const router = require('express').Router()
const blogCategory = require('../controllers/blogCategory.controller')
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')


router.post('/', verifyAccessToken, isAdmin, blogCategory.createCategory)
router.get('/', blogCategory.getCategory)
router.put('/:bcid', verifyAccessToken, isAdmin, blogCategory.updateCategory)
router.delete('/:bcid', verifyAccessToken, isAdmin, blogCategory.deleteCategory)





module.exports = router