const userRouter = require('./user.route')
const productRouter = require('./product.route')
const { notFound, errHandler } = require('../middleware/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)

    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes

// nếu chạy hàm trong controller bị lỗi thì lỗi nó sẽ bán ra route và được xử lú bới hàm notFound và erHandler