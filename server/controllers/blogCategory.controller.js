const BlogCategory = require('../models/BlogCategory')
const asyncHandler  = require('express-async-handler')

const createCategory = asyncHandler(async (req, res) => {
  const response = await BlogCategory.create(req.body)
  return res.json({
    success: response ? true : false,
    createCategory: response ? response : 'Cannot create product-category'
  })
})

const getCategory = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find().select('title _id')
  return res.json({
    success: response ? true : false,
    productCategories: response ? response : 'Cannot get product-category'
  })
})
const updateCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params
  const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true })
  console.log(res.json)
  return res.json({
    success: response ? true : false,
    updateProCategory: response ? response : 'Cannot update product-category'
  })
})

const deleteCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params
  const response = await BlogCategory.findByIdAndDelete(bcid, req.body, { new: true })
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