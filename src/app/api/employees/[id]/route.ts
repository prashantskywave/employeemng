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

  let body: any = {};
  let profileImagePath = "";

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    for (const [key, value] of formData.entries()) {
      if (key === "profileImage" && value instanceof File) {
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}-${value.name}`;
        const filePath = `public/uploads/${fileName}`;

        await require("fs").promises.writeFile(filePath, buffer);
        profileImagePath = `/uploads/${fileName}`;
      } else {
        body[key] = value;
      }
    }
  } else {
    body = await req.json();
  }

  if (profileImagePath) {
  body.profileImage = profileImagePath;
}

delete body.profileImageUrl;


const updatedEmployee = await Employee.findOneAndUpdate(
  { employeeId: id },
  { $set: body },
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
  context: { params: Promise<{ id: string }> }
) {
  try {
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
        status: "Inactive",
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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}

