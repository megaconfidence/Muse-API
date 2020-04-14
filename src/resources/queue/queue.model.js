import mongoose from 'mongoose'

const queueSchema = new mongoose.Schema(
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

queueSchema.index({ user: 1, name: 1 })

export const Queue = mongoose.model('queue', queueSchema)
