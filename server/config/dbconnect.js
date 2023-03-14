const { default: mongoose } =require('mongoose')
mongoose.set('strictQuery', false)
const  dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGDB_URI)
    if(conn.connection.readyState === 1) console.log('DB connect successfully')
    else console.log('DB connect is failed')
  } catch(err) {
    console.log('DB connect is failed')
    throw new Error(err)
  }
}

module.exports = dbConnect