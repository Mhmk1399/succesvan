import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  type: { type: String, enum: ["van", "minBus"], required: true },
  servicesPeriod:{
    tire: {type: Number, required: true, min: 1},
    oil: {type: Number, required: true, min: 1},
    battery: {type: Number, required: true, min: 1},
    air: {type: Number, required: true, min: 1},
    service: {type: Number, required: true, min: 1}
  }
}, { timestamps: true });

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
