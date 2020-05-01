import mongoose from 'mongoose'

const albumSchema = new mongoose.Schema({
  cover: {
    trim: true,
    type: String
  },
  name: {
    trim: true,
    type: String,
    required: true,
    lowercase: true
  },
  year: {
    trim: true,
    type: String
  },
  url: {
    trim: true,
    type: String,
    required: true
  },
  genre: [
    {
      ref: 'internet_genre',
      type: mongoose.SchemaTypes.ObjectId
    }
  ],
  artist: [
    {
      ref: 'internet_artist',
      type: mongoose.SchemaTypes.ObjectId
    }
  ],
  createdAt: { type: Date, default: Date.now }
})

albumSchema.index({ artist: 1, name: 1 }, { unique: true })

export const Album = mongoose.model('album', albumSchema)
