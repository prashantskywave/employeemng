import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  roleId: { type: String, required: true },
  name: { type: String, required: true },
});

const DepartmentSchema = new mongoose.Schema(
  {
    departmentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    roles: [RoleSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Department ||
  mongoose.model("Department", DepartmentSchema);
