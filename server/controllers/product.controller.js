const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')


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
    productData: product ? product : "Cannot get product"
  })
})
// price[gt] -> price : { gt:5000 }
// distructuring tro ve 1 o nho va phep gan a= b tra e 2 o nho
const getAllProducts = asyncHandler(async (req, res) => {
  // Tach cac truong dat biet ra khoi query
  const queries = { ...req.query }
  const excludedFields = ['page', 'sort', 'limit', 'fields']
  excludedFields.forEach(el => delete queries[el])

   // Format lai cac operators cho dung cu phap cua mongoose
  let queryString = JSON.stringify(queries)
  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)    
  let formatedQueries = JSON.parse(queryString)

  //Filtering
  if (queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'}
  // Để làm cho việc tìm kiếm là không phân biệt kiểu chữ, bạn sử dụng tham số $options với giá trị $i
  // trang thai cho pending
  let queryCommand = Product.find(formatedQueries)


  // Sorting 
  if (req.query.sort) {
    // query -> abc,def => [abc, def] => abc efg
    const sortBy = req.query.sort.split(',').join(' ')
    // sort('quantity title')
    queryCommand = queryCommand.sort(sortBy)
  }

  // Fiels limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    queryCommand = queryCommand.select(fields)
  }
  // Pagination
  // 2 tham so 
  // -limit: so object: lay ve 1 lan goi api
  // skip: 2 bo qua 2 cai dau tien lay cai thu 3 -> page
  // +req.query.page conver dang string sang number
  const page = +req.query.page || 1
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT
  const skip = limit * (page - 1 )
  queryCommand.skip(skip).limit(limit)

  // Excute query
  // so luong san pham thoa man dieu kien !== so luong san pham tra ve mot lan goi api
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message)
    const counts = await Product.find(formatedQueries).countDocuments()
    return res.status(200).json({
      success: response ? true : false,
      counts,
      productsDatas: response ? response : "Cannot get products"
    })
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
// **************** Rating *********************
const ratings =asyncHandler(async (req, res) => {
  // lay tu token ben cookie
  const { _id } = req.user
  const {star, comment, pid } = req.body
  if (!star || !pid) throw new Error('Missing inputs')
  const ratingRating = await Product.findById(pid)
  const alreadyRating = ratingRating?.ratings?.find(el => el.postedBy.toString() === _id)
  // Object
  console.log("j",alreadyRating)
  // da co danh gia
  if (alreadyRating) {
    // update star $comment
    await Product.updateOne({
      // dung o bang san pham update cai ratings co chua object alreadyRating
      ratings: { $elemMatch: alreadyRating }
    }, {
      // ratings.$.star $ tuong trung cho elemMatch tim duoc
      $set: { "ratings.$.star": star, "ratings.$.comment": comment}
    }, {new: true})

  } else {
    // add star & comment
    await Product.findByIdAndUpdate(pid, {
      $push: {ratings: {star, comment, postedBy: _id}}
    }, {new: true})
  }

  //sum ratings
  const updatedProduct = await Product.findById(pid)
  const ratingCount = updatedProduct.ratings.length
  const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
  updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10
  await updatedProduct.save()

  return res.status(200).json({
    success: true,
    updatedProduct
  })
})
module.exports  = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  ratings
}
//filter https://jeffdevslife.com/p/1-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/


// let queryString = JSON.stringify(queryObj)
// queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)    
// let formatedQuery = JSON.parse(queryString)

// Sao chép tất cả các query từ một request `req` vào một đối tượng `queries`, sử dụng toán tử spread (`...`).
// Tạo một mảng `excludeFields` chứa các trường thông tin mà ta không muốn lấy trong các query.
// Duyệt qua `excludeFields` và xóa các trường tương ứng trong đối tượng `queries`.
// Sử dụng `queryString()` để chuyển các query còn lại thành một chuỗi truy vấn URL (ví dụ: "?key1=value1&key2=value2").
// Trong chuỗi truy vấn URL trên, sử dụng regex để tìm và thay thế các từ khoá "gte", "gt", "lt", "lte" bằng các chuỗi tương ứng với MongoDB query syntax.

// Giải thích phần cuối cùng của đoạn mã: JavaScipt regex sử dụng cú pháp `/pattern/modifiers`, với `pattern` là một biểu thức chính quy (regex), và `modifiers`
// là tùy chọn có thể thêm vào để làm cho regex hoạt động theo cách tùy chỉnh.


// Trong đoạn mã trên, regex `/pattern/modifiers` là `/\\b(gte|gt|lt|lte)\\b/g`, trong đó:


// `\\b` là một ký tự đặc biệt đại diện cho ranh giới từ, để regex không tìm kiếm các từ bắt đầu với "gte", "gt", "lt", "lte".
// `(gte|gt|lt|lte)` là một nhóm các từ khoá được nối với nhau bằng dấu `|`, biểu thị cho các toán tử so sánh tương ứng.
// `/g` modifier là optional, và giúp regex tìm và thay thế tất cả các kết quả trong chuỗi thay vì chỉ kết quả đầu tiên.

// if (queryObj?.title) formatedQuery.title = {$regex: queryObj.title, $option: 'i'}
//   let queryComannd = Product.find(formatedQuery)

// Trong hàm `replace()`, ta sử dụng hàm arrow function để định nghĩa hành động thay thế. Biến `mactheEl` trong arrow function sẽ chứa các từ khoá
// tìm thấy bởi regex, và các từ này sẽ được thay thế bằng các từ có dấu $ trước.
