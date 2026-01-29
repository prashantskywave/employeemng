import mongoose, { Schema, models } from "mongoose";

const DepartmentSchema = new Schema(
  {
    departmentId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
//console.log("Department schema fields:", Object.keys(DepartmentSchema.paths));

export default models.Department ||
  mongoose.model("Department", DepartmentSchema);
