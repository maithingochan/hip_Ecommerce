const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const { propfind } = require('../routes/product.route')

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
  const newProduct = await Product.create(req.body)
  return res.status(200).json({
    success: newProduct ? true : false,
    createProduct: newProduct ? newProduct : "Cannot create new product"
  })
})

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const product = await Product.findById(pid)
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Cannot find product"
  })
})

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
  return res.status(200).json({
    success: products ? true : false,
    productData: products ? products : "Cannot find product"
  })
})

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
  const updateProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true})
  return res.status(200).json({
    success: updateProduct ? true : false,
    productData: updateProduct ? updateProduct : "Cannot update product"
  })
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params
  const deleteProduct = await Product.findByIdAndDelete(pid)
  return res.status(200).json({
    success: deleteProduct ? true : false,
    productData: deleteProduct ? deleteProduct : "Cannot delete product"
  })
})

module.exports  = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
}