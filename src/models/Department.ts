import mongoose, { Schema, models, model } from "mongoose";

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

const Department =
  models.Department || model("Department", DepartmentSchema, "departments");

export default Department;
