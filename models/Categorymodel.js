import mongoose from "mongoose";

const categorymodelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
});

const categorymodel = mongoose.model("categorymodel", categorymodelSchema);

export default categorymodel;
