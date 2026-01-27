import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Department from "@/models/Department";

export async function GET() {
  await connectDB();
  const departments = await Department.find().sort({ createdAt: -1 });
  return NextResponse.json(departments);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const count = await Department.countDocuments();
  const departmentId = `DEPT-${String(count + 1).padStart(3, "0")}`;

  const department = await Department.create({
    departmentId,
    name: body.name,
    roles: body.roles || [],
  });

  return NextResponse.json(department);
}
