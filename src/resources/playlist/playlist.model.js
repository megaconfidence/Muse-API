import mongoose from 'mongoose'

const playListSchema = new mongoose.Schema(
  {
    name: {
      trim: true,
      type: String,
      required: true
    },
    songs: {
      type: Array,
      required: true
    },
    createdBy: {
      ref: 'user',
      required: true,
      type: mongoose.SchemaTypes.ObjectId
    }
  },
  { timestamps: true }
)

playListSchema.index({ user: 1, name: 1 })

export const PlayList = mongoose.model('playlist', playListSchema)
