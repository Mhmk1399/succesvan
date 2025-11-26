import mongoose from "mongoose";

const officeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  workingTime: [
    {
      day: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        required: true,
      },
      isOpen: { type: Boolean, required: true, default: true },
      startTime: {
        type: String,
        required: function () {
          return this.isOpen;
        },
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ // Validates HH:MM format
      },
      endTime: {
        type: String,
        required: function () {
          return this.isOpen;
        },
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ // Validates HH:MM format
      },
    },
  ],
  specialDays: [
    {
      date: { type: Date, required: true }, // Store as UTC date (e.g., new Date('2025-12-25'))
      isOpen: { type: Boolean, required: true, default: false }, // Defaults to closed for holidays
      startTime: {
        type: String,
        required: function () {
          return this.isOpen;
        },
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ // Validates HH:MM format
      },
      endTime: {
        type: String,
        required: function () {
          return this.isOpen;
        },
        match: /^([01]\d|2[0-3]):([0-5]\d)$/ // Validates HH:MM format
      },
      reason: { type: String }, // Optional, e.g., "Christmas Holiday"
    },
  ],
  vehicles: [
    {
      vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
      inventory: { type: Number, required: true, min: 0 },
    },
  ],
}, { timestamps: true });

// Indexes for better query performance
officeSchema.index({ "specialDays.date": 1 }); // Speed up lookups for specific dates

export default mongoose.models.Office || mongoose.model("Office", officeSchema);
