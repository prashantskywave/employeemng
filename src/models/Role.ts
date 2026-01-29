import mongoose , { Schema, models, model } from "mongoose";

const RoleSchema = new Schema(
  {
    roleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

const Role = models.Role || model("Role", RoleSchema);
export default Role;
