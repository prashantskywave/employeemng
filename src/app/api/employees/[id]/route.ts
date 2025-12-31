import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ message: "ID not provided" }, { status: 400 });
  }

  const employee = await Employee.findOne({ employeeId: id })

  if (!employee) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employee, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;
  const body = await req.json();

  const updatedEmployee = await Employee.findOneAndUpdate({ employeeId: id }, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedEmployee) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(updatedEmployee, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try{
  await connectDB();
  const { reason } = await req.json();
  const { id } = await context.params;

  if (!reason) {
    return NextResponse.json(
      { message: "Delete reason required" },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json({ message: "ID not provided" }, { status: 400 });
  }

  const employee = await Employee.findOneAndUpdate(
    { employeeId: id },
    {
      isDeleted: true,
      deleteReason: reason,
      deletedAt: new Date(),
    },
    { new: true }
  );

  if (!employee) {
    return NextResponse.json(
      { message: "Employee not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
}catch (error) {
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}

