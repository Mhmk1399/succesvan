import mongoose from "mongoose";

const officeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    address: { type: String, required: true },
    phone: { type: String, required: true },
    workingTime: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
          required: true,
        },
        isOpen: { type: Boolean, required: true, default: true },
        startTime: {
          type: String,
          required: function () {
            return this.isOpen;
          },
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
        endTime: {
          type: String,
          required: function () {
            return this.isOpen;
          },
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
        pickupExtension: {
          hoursBefore: { type: Number, default: 0, min: 0 },
          hoursAfter: { type: Number, default: 0, min: 0 },
          flatPrice: { type: Number, default: 0, min: 0 },
        },
        returnExtension: {
          hoursBefore: { type: Number, default: 0, min: 0 },
          hoursAfter: { type: Number, default: 0, min: 0 },
          flatPrice: { type: Number, default: 0, min: 0 },
        },
      },
    ],
    specialDays: [
      {
        month: { type: Number, required: true, min: 1, max: 12 },
        day: { type: Number, required: true, min: 1, max: 31 },
        isOpen: { type: Boolean, required: true, default: false },
        startTime: {
          type: String,
          required: function () {
            return this.isOpen;
          },
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
        endTime: {
          type: String,
          required: function () {
            return this.isOpen;
          },
          match: /^([01]\d|2[0-3]):([0-5]\d)$/,
        },
        reason: { type: String },
      },
    ],
    vehicles: [
      {
        vehicle: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vehicle",
          required: true,
        },
        inventory: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Office = mongoose.models.Office || mongoose.model("Office", officeSchema);

export default Office;
