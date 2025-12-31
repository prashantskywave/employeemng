import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";


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

    const lastEmployee = await Employee.aggregate([
      {
        $project: {
          number: {
            $toInt: {
              $substr: ["$employeeId", 3, 10], 
            },
          },
        },
      },
      { $sort: { number: -1 } },
      { $limit: 1 },
    ]);

    let nextNumber = 1;

    if (lastEmployee.length > 0) {
      nextNumber = lastEmployee[0].number + 1;
    }
    const nextEmployeeId = `EMP${String(nextNumber).padStart(4, "0")}`;

    const employee = await Employee.create({
      employeeId: nextEmployeeId,
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


