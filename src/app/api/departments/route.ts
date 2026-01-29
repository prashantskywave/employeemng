import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Department from "@/models/Department";
import "@/lib/db";
import { generateDeptId } from "@/lib/generateDeptId";
import { connectDB } from "@/lib/db";

// GET all departments
export async function GET() {
   await connectDB();
  const departments = await Department.find().sort({ createdAt: 1 });
  return NextResponse.json(departments);
}

// ADD department
export async function POST(req: Request) {
  await connectDB();
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "Department name is required" }, { status: 400 });
  }

    const departmentId = await generateDeptId();

  const department = await Department.create({
    departmentId,
    name,
  });

  return NextResponse.json(department, { status: 201 });
}

// UPDATE department
export async function PUT(req: Request) {
  const { id, name } = await req.json();

  console.log("PUT ID RECEIVED:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid MongoDB ID" },
      { status: 400 }
    );
  }

  const updated = await Department.findByIdAndUpdate(
    id,
    { name },
    {
      returnDocument: "after",
      lean: true,
      includeResultMetadata: true
    } // Mongoose v8 way
  );

  return NextResponse.json(updated);
}

// DELETE department
import Role from "@/models/Role";

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { message: "Department id required" },
      { status: 400 }
    );
  }

  // Delete all roles under this department
  await Role.deleteMany({ departmentId: id });

  // Delete the department itself
  await Department.deleteOne({ _id: id });

  return NextResponse.json({
    message: "Department and related roles deleted successfully",
  });
}


