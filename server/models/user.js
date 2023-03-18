const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
      type: String,
      default: 'user'
    },
    cart: {
      type: Array,
      default:[]
    },
    address: [
      {
        type: mongoose.Types.ObjectId, ref: 'Address'
      }
    ],
    wishlist: [{
      type: mongoose.Types.ObjectId, ref: 'Product'
    }],
    isBlocked: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String
    },
    passwordResetToken: {
      type: String
    },
    passwordResetExpires: {
      type: String
    }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
 // kiểm tra xem password đã băm hay chưa
  if (!this.isModified('password')) {
    next()
  }
  const salt = bcrypt.genSaltSync(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password)
  },
  createPasswordChangedToken: function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    //được sử dụng để tạo ra mã băm (hash) của chuỗi `resetToken` với thuật toán băm SHA256 trong Node.js.
    //Phương thức `update` cập nhật nội dung của chuỗi hash hiện tại bằng chuỗi mới được cung cấp. Khi chuỗi mới được cung cấp được thêm vào (update) sau đó, chuỗi hash sẽ được cập nhật để bao gồm nội dung mới này. Trong trường hợp này, `resetToken` được sử dụng để cập nhật nội dung của chuỗi hash đang được tạo ra.
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 15 *60 *1000
    return resetToken
  }
}


//Export the model
module.exports = mongoose.model('User', userSchema);