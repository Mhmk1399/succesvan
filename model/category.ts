import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  type: { type: String, enum: ["van", "minBus"], required: true },
  servicesPeriod:{
    tire: {type:Date , required:true , default:Date.now()},
    oil: {type:Date , required:true , default:Date.now()},
    battery:{type:Date , required:true , default:Date.now()},
    air: {type:Date , required:true , default:Date.now()},
    service: {type:Date , required:true , default:Date.now()},
  }
}, { timestamps: true });

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
