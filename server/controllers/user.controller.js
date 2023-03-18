const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const sendMail = require('../utility/sendmail')
const { generateAccessToken, generateRefressToken } = require('../middleware/jwt')

const register = asyncHandler(async(req, res) => {
  const {email, password, firstname, lastname } = req.body
  if (!email || !password || !lastname || !firstname)
    return res.status(400).json({
      success: false,
      mes: 'Missing inputs'
    })
  const user = await User.findOne({email})
  if (user)
    throw new Error('user has exsited')
  else {
    const newUser = await User.create(req.body)
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser ? 'Register is successfully. Please go login~' : 'Something went wrong'
    })
    }
})

// distructurin chỉ dùng trong plain object, mongoose sẽ trar về 1 instant, nên covert từ 1 instant sang object ta dung tôbject
// Refresh token => Cấp mới access token
// Access token => Xactuecj người dùng, phân quyền người dùng
const login = asyncHandler(async(req, res) => {
  const {email, password } = req.body
  if (!email || !password )
    return res.status(400).json({
      success: false,
      mes: 'Missing inputs'
    })
  const response = await User.findOne({email})
  if (response === null) throw new Error('Username is wrong!!!')
  console.log(await response.isCorrectPassword(password))
  if (response && await response.isCorrectPassword(password)) {
    //Tách password và role ra khỏi response
    const {password, role, refreshToken, ...userData} = response.toObject()
    // Tạo access token
    const accessToken = generateAccessToken(response._id, role)
    // Tạo refresh token
    const newRefreshToken = generateRefressToken(response._id)

    //Luu refresstoken vao database
    await User.findByIdAndUpdate(response._id, { newRefreshToken }, { new: true})
    // Lưu refresh token vào cookie
    res.cookie('refreshToken', refreshToken,{
      httpOnly: true, 
      maxAge: 7*24*60*60*1000,
      secure:  true,
      path: "/", 
      sameSite: "strict"
    })
  
    return res.status(200).json({
      success: true,
      accessToken,
      userData
    })
  } else {
    throw new Error('Invalid credentials!')
  }
})

const getCurrent = asyncHandler(async (req, res) => {
  const {_id} = req.user
  const user = await User.findById(_id).select('-refreshToken -role -password')
  return res.status(200).json({
    success: user ? true : false,
    res: user ? user : 'User not found'
  })
})

const refreshAccessTokens = asyncHandler(async (req, res) => {
  //Lấy token từ cookie
  const cookie = req.cookies
  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookie')
  // Check toke có hợp lệ hay không
  const result = jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    // Check xem tiken có khớp với token đã lưu trong db 
  const response =  await User.findOne({_id: result._id, refreshToken: cookie.refreshToken})
    return res.status(200).json({
      success: response ? true : false,
      newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })
})

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
  //xoa refreshToken o databse
  await User.findOne({ refreshToken: cookie.refreshToken}, {refreshToken: ''}, { new: true })
  //xoa refreshToken o cookie trinh duyet
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure:  true
  })
  return res.status.json({
    success: true,
    mes: 'Logout is done'
  })
})
// Client gui lem email 
// Server check co hop le hay khong => gui mail + kem theo link (password change token)
// Client check mail => click link
// client api kem theo token
// check toekn co giong voi token ma server gui mail  hay khong 
// change password

const forgotPassword = asyncHandler(async(req, res) => {
  const {email} = req.query
  if (!email)  throw new Error('Missing email')
  const user = await User.findOne({email})
  if (!user) throw new Error('User not found')
  const resetToken = user.createPasswordChangedToken()
  // khi dung mot ham tu dinh nghia trong model phai dung save de luu vao db
  // luu resetToken trong data
  await user.save()

  const html = `Please click the link below to reset your password.This link will expire in 15 minutes <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`

  const data = {
    email,
    html
  }
  const rs = await sendMail(data)
  return res.status(200).json({
    success: true,
    rs
  })
})

const resetPassword = asyncHandler(async (req, res) => {
  const {password, token } = req.body
  console.log({token, password })
  if (!token || !password) throw new Error("Missing input")
  const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
  const user = await User.findOne({passwordResetToken, passwordResetExpires: {$gt: Date.now()}})
  if (!user) throw new Error('Invalid reset token')
  user.password = password
  user.passwordResetToken = undefined
  user.passwordChangeAt = Date.now()
  user.passwordResetExpires = undefined
  await user.save()
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? 'Update password' : 'Something went wrong'
  })
})
//get all users
const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select('-refreshToken -role -password')
  return res.status(200).json({
    success: response ? true : false,
    users: response
  })

})
// delete user
const deleteUser = asyncHandler(async (req, res) => {
  const {_id } = req.query
  if (!_id) throw new Error('Missing inputs')
  const response = await User.findByIdAndDelete(_id)
  console.log(response)
  return res.status(200).json({
    success: response ? true : false,
    deleteUser: response ? `User with email ${response.email} delete`: 'No user delete'
  })

})
// update user
// req.body la 1 object khi truyen len rong no van la true
const updateUser = asyncHandler(async (req, res) => {
  const {_id } = req.user
  if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing inputs')
  const response = await User.findByIdAndUpdate(_id, req.body, {new: true}).select('-role -password')
  console.log('thanhha', req.user)
  return res.status(200).json({
    success: response ? true : false,
    deleteUser: response ? response : 'Something went wrong!'
  })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params
  if (Object.keys(req.body).length === 0) throw new Error('Missing inputs')
  const response = await User.findByIdAndUpdate(uid, req.body, {new: true}).select('-role -password -refreshToken')
  console.log('thanhha', req.user)
  return res.status(200).json({
    success: response ? true : false,
    deleteUser: response ? response : 'Something went wrong!'
  })
})
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessTokens,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin
}

