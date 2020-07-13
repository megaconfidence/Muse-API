import mongoose from 'mongoose'
import musicDB from './musicdb'

const genreSchema = new mongoose.Schema({
  name: {
    trim: true,
    unique: true,
    type: String,
    required: true,
    lowercase: true
  },
  createdAt: { type: Date, default: Date.now }
})

export const Genre = musicDB.model('genre', genreSchema)
