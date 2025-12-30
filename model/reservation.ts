import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    office: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Office",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled", "delivered", "completed"],
      default: "pending",
    },
    driverAge: { type: Number, required: true },
    selectedGear: { type: String, enum: ["manual", "automatic"] },
    messege: { type: String },
    addOns: [
      {
        addOn: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AddOn",
        },
        quantity: { type: Number, required: true, min: 1 },
        selectedTierIndex: { type: Number },
      },
    ],
    discountCode: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);
