import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  emaildata:{
    emailAddress: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
  },
  phoneData:{
    phoneNumber: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  licenceAttached: {
    front: { type: String },
    back: { type: String },
  },
}, { timestamps: true })

export default mongoose.models.User || mongoose.model("User", userSchema)



