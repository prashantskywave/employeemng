import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import Role from "@/models/Role";
import Department from "@/models/Department";
import { getCurrentUser } from "@/lib/auth";
import "@/lib/db";
import { generateRoleId } from "@/lib/generateRoleId";

// GET roles (all or filtered by department)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("departmentId");

  const filter: any = {};

  if (departmentId) {
    filter.departmentId = new mongoose.Types.ObjectId(departmentId);
  }

  const roles = await Role.find(filter) 
    .populate("departmentId", "name")
    .sort({ createdAt: -1 });
  return Response.json(roles);

}

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const departmentId = searchParams.get("departmentId");

//   let query = Role.find();

//   if (departmentId) {
//     query = query.where("departmentId").equals(
//       new mongoose.Types.ObjectId(departmentId)
//     );
//   }
//   //console.log("DepartmentId:", departmentId);
//   const roles = await query.populate("departmentId", "name");
//   return NextResponse.json(roles);
// }

// POST create role
export async function POST(req: Request) {
  try {
    const { roleName, departmentId } = await req.json();

    if (!roleName || !departmentId) {
      return NextResponse.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // Get department name
    const department = await (Department as any).findById(departmentId);

    if (!department) {
      return NextResponse.json(
        { message: "Department not found" },
        { status: 404 }
      );
    }

    // Generate roleId 
    const roleId = generateRoleId(department.name, roleName);

    // Prevent duplicate Role ID
    const existingRole = await (Role as any).findOne({ roleId });

    if (existingRole) {
      return NextResponse.json(
        { message: "Role already exists" },
        { status: 409 }
      );
    }

    const role = await Role.create({
      roleId,
      name: roleName,         
      departmentId: department._id,
    });

    return NextResponse.json(role, { status: 201 });

  } catch (error) {
    console.error("Create role error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
// export async function POST(req: Request) {
//   const user = await getCurrentUser();
//   if (!user || !["admin", "super_admin"].includes(user.role)) {
//     return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//   }

//   const body = await req.json();
//   if (!body.name || !body.departmentId) {
//     return NextResponse.json(
//       { message: "Missing required fields" },
//       { status: 400 }
//     );
//   }

//   if (!body.roleId) body.roleId = `ROLE-${Date.now()}`;

//   const role = await Role.create(body);
//   return NextResponse.json(role);
// }

// PUT update role
export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user || !["admin", "super_admin"].includes(user.role)) {
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
  if (!user || !["admin", "super_admin"].includes(user.role)) {
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

