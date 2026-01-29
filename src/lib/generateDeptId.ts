import Department from "@/models/Department";
import { connectDB } from "@/lib/db";

export async function generateDeptId() {
  await connectDB();

  const lastDept = await Department.findOne()
    .sort({ createdAt: -1 })
    .select("departmentId");

  if (!lastDept?.departmentId) {
    return "DEPT-0001";
  }

  const lastNumber = parseInt(lastDept.departmentId.split("-")[1]);
  const nextNumber = (lastNumber + 1).toString().padStart(4, "0");

  return `DEPT-${nextNumber}`;
}
