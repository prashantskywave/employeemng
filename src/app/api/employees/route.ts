import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import { getNextEmployeeId } from "@/lib/getNextEmployeeId";

export async function GET() {
  try {
    await connectDB();
    const employees = await Employee.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const employeeId = await getNextEmployeeId();

    const employee = await Employee.create({
      employeeId,
      name: body.name,
      email: body.email,
      contact: body.contact,
      department: body.department,
      role: body.role,
      joiningDate: body.joiningDate,
      status: body.status,
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create employee" },
      { status: 400 }
    );
  }
}




