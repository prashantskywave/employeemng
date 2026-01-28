import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Department from "@/models/Department";
import "@/lib/db";

// GET all departments
export async function GET() {
  const departments = await Department.find().sort({ createdAt: -1 });
  return NextResponse.json(departments);
}

// ADD department
export async function POST(req: Request) {
  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "Name required" }, { status: 400 });
  }

  const count = await Department.countDocuments();
  const departmentId = `DEPT-${String(count + 1).padStart(3, "0")}`;

  const department = await Department.create({
    name,
    departmentId,
  });

  return NextResponse.json(department);
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
export async function DELETE(req: Request) {
  const { id } = await req.json();

  console.log("DELETE ID RECEIVED:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid MongoDB ID" },
      { status: 400 }
    );
  }

  await Department.deleteOne({ _id: id });

  return NextResponse.json({ success: true });
}


