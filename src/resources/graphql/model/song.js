import mongoose from 'mongoose'
import musicDB from './musicdb'
const songSchema = new mongoose.Schema({
  name: {
    trim: true,
    type: String,
    required: true,
    lowercase: true
  },
  duration: {
    trim: true,
    type: String
  },
  playId: {
    trim: true,
    type: String
  },
  album: {
    ref: 'internet_album',
    type: mongoose.SchemaTypes.ObjectId
  },
  createdAt: { type: Date, default: Date.now }
})

songSchema.index({ album: 1, name: 1 }, { unique: true })

export const Song = musicDB.model('song', songSchema)
