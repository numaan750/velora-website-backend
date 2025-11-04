import mongoose from "mongoose";

const vusermodelSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    postalcode: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("vuser", vusermodelSchema);
