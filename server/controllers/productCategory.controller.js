const ProductCategory = require('../models/ProductCategory')
const asyncHandler  = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
  const response = await ProductCategory.create(req.body)
  return res.json({
    success: response ? true : false,
    createCategory: response ? response : 'Cannot create product-category'
  })
})

const getCategory = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find().select('title _id')
  return res.json({
    success: response ? true : false,
    productCategories: response ? response : 'Cannot get product-category'
  })
})
const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params
  const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true })
  console.log(res.json)
  return res.json({
    success: response ? true : false,
    updateProCategory: response ? response : 'Cannot update product-category'
  })
})

const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params
  const response = await ProductCategory.findByIdAndDelete(pcid, req.body, { new: true })
  console.log(res.json)
  return res.json({
    success: response ? true : false,
    updateProCategory: response ? response : 'Cannot delete product-category'
  })
})



module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory
}