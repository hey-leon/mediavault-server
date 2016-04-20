import mongoose from 'mongoose'

export default mongoose.model(
  'file',
  new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    mimetype: { type: String, required: true },
    uri: { type: String, required: true },
    thumburi: { type: String },
    meta: { type: String }
  })
)
