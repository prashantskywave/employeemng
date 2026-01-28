import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import Role from "@/models/Role";
import { getCurrentUser } from "@/lib/auth";
import "@/lib/db";

// GET roles (all or filtered by department)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("departmentId");

  let query = Role.find();

  if (departmentId) {
    query = query.where("departmentId").equals(
      new mongoose.Types.ObjectId(departmentId)
    );
  }
  console.log("DepartmentId:", departmentId);

  const roles = await query.populate("departmentId", "name");
  return NextResponse.json(roles);
}

// POST create role
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.name || !body.departmentId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // Optional: generate roleId if missing
  if (!body.roleId) body.roleId = `ROLE-${Date.now()}`;

  const role = await Role.create(body);
  return NextResponse.json(role);
}

// PUT update role
export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { _id, name, departmentId } = body;

  if (!_id || !name || !departmentId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ DEFINE ObjectIds properly
  const roleId = new Types.ObjectId(_id);
  const deptId = new Types.ObjectId(departmentId);

  const updatedRole = await (Role as any).findOneAndUpdate(
  { _id: roleId },        // filter
  { name, departmentId: deptId }, // update
  {
    returnDocument: "after",
    lean: true,
    includeResultMetadata: true,
  }
);

  if (!updatedRole?.value) {
    return NextResponse.json({ message: "Role not found" }, { status: 404 });
  }

  return NextResponse.json(updatedRole.value);
}


// DELETE role
export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Missing role ID" }, { status: 400 });
  }

  await Role.deleteOne({ _id: id });
  return NextResponse.json({ message: "Role deleted successfully" });
}

