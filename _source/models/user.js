import mongoose from 'mongoose'

export default mongoose.model(
  'user',
  new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    token: { type: String, required: true }
  })
)
