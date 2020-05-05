import mongoose from 'mongoose'

const internetArtistSchema = new mongoose.Schema({
  name: {
    trim: true,
    unique: true,
    type: String,
    required: true,
    lowercase: true
  },
  createdAt: { type: Date, default: Date.now }
})

export const Artist = mongoose.model('artist', internetArtistSchema)
