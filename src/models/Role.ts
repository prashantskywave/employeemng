import mongoose, { Schema, Types, model, models } from "mongoose";

export interface IRole {
  roleId: string;
  name: string;
  departmentId: Types.ObjectId;
}

const RoleSchema = new Schema<IRole>(
  {
    roleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

const Role =
  models.Role || model<IRole>("Role", RoleSchema);

export default Role;
