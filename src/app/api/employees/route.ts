// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectDB } from "@/lib/db";
// import Employee from "@/models/Employee";
// import { getNextEmployeeId } from "@/models/Counter";

// export async function POST(request: Request) {
//   try {
//     await connectDB();

//     const formData = await request.formData();

//     const name = formData.get("name") as string;
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;
//     const contact = formData.get("contact") as string;
//     const department = formData.get("department") as string;
//     const role = formData.get("role") as string;
//     const joiningDate = formData.get("joiningDate") as string;
//     const status = formData.get("status") as string;
//     const file = formData.get("profileImage") as File | null;

//     const employeeId = await getNextEmployeeId();
//     const hashedPassword = await bcrypt.hash(password, 10);

//     let profileImage = "";
//     if (file) {
//       profileImage = `/uploads/${file.name}`; 
//     }

//     const employee = await Employee.create({
//       employeeId,
//       firstName: body.firstName,
//       lastName: body.lastName,
//       email: body.email,
//       name,
//       email,
//       password: hashedPassword,
//       contact,
//       department,
//       role,
//       joiningDate,
//       status,
//       profileImage, 
//     });

//     return NextResponse.json(employee, { status: 201 });
//   } catch (error: any) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Employee creation failed" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectDB();
//     const employees = await Employee.find({ isDeleted: false }).sort({
//       createdAt: -1,
//     });
//     return NextResponse.json(employees);
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Failed to fetch employees" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import { getNextEmployeeId } from "@/models/Counter";

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const contact = formData.get("contact") as string;
    const department = formData.get("department") as string;
    const role = formData.get("role") as string;
    const joiningDate = formData.get("joiningDate") as string;
    const status = formData.get("status") as string;
    const file = formData.get("profileImage") as File | null;

    const employeeId = await getNextEmployeeId();
    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = "";
    if (file) {
      // For simplicity, we store file under /uploads. In production, save to disk/cloud
      profileImage = `/uploads/${file.name}`;
    }

    // Create Employee
    const employee = await Employee.create({
      employeeId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contact,
      department,
      role,
      joiningDate,
      status,
      profileImage,
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Employee creation failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const employees = await Employee.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
