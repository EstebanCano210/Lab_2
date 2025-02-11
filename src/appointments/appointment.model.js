import { Schema, model } from "mongoose";

const AppointmentSchema = new Schema(
  {
    adopter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Appointment", AppointmentSchema);
