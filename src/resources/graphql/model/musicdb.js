import mongoose from 'mongoose'
export default mongoose.createConnection(
  process.env.PROD_MUSIC_DB || 'mongodb://localhost:27017/music'
)
