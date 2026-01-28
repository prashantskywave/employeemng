import mongoose, { Schema, model, models } from "mongoose";

const RoleSchema = new Schema({
  roleId: { type: String, unique: true },
  name: { type: String, required: true },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true
  }
});

const Role = models.Role || model("Role", RoleSchema);
export default Role;
