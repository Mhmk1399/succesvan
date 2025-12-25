import mongoose from "mongoose";
// Import to ensure dynamicServices model is registered before populate
 
const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  percentage: { type: Number, required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  usageLimit: { type: Number, default: null },
  usageCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "inactive", "expired"],
    default: "inactive",
  },
});
export default mongoose.models.Discount ||
  mongoose.model("Discount", discountSchema);
