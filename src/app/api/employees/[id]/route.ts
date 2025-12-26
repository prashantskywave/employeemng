import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "ID not provided" },
      { status: 400 }
    );
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    return NextResponse.json(
      { message: "Employee not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(employee, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const body = await req.json();

  const updatedEmployee = await Employee.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  );

  if (!updatedEmployee) {
    return NextResponse.json(
      { message: "Employee not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedEmployee, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "ID not provided" },
      { status: 400 }
    );
  }

  const deletedEmployee = await Employee.findByIdAndDelete(id);

  if (!deletedEmployee) {
    return NextResponse.json(
      { message: "Employee not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "Employee deleted permanently" },
    { status: 200 }
  );
}
