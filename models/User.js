import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  points: { type: Number, default: 0 },
  wasteHistory: [{
    type: String,
    weight: Number,
    points: Number,
    createdAt: { type: Date, default: Date.now }
  }]
})

export default mongoose.models.User || mongoose.model('User', UserSchema)