const router = require('express').Router()
const productController = require('../controllers/product.controller')
const { verifyAccessToken, isAdmin } = require('../middleware/verifyToken')


router.post('/',verifyAccessToken, isAdmin, productController.createProduct)
router.get('/',  productController.getAllProducts)
router.put('/ratings', verifyAccessToken, productController.ratings)

router.put('/:pid',verifyAccessToken, isAdmin, productController.updateProduct)
router.delete('/:pid',verifyAccessToken, isAdmin, productController.deleteProduct)
router.get('/:pid', productController.getProduct)



module.exports = router