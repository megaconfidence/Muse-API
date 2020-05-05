import mongoose from 'mongoose'

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

export const Genre = mongoose.model('genre', genreSchema)
