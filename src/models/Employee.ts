import mongoose, { Schema, model, models, Model } from "mongoose";

export interface EmployeeDocument {
  employeeId: string;
  name: string;
  email?: string;
  contact?: string;
  department: string;
  role: string;
  joiningDate: Date;
  status: "Active" | "Inactive";
}

const employeeSchema = new Schema<EmployeeDocument>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Employee: Model<EmployeeDocument> =
  models.Employee || model<EmployeeDocument>("Employee", employeeSchema);

export default Employee;
