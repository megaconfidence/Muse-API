import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema(
  {
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

likeSchema.index({ user: 1, name: 1 })

export const Like = mongoose.model('like', likeSchema)
