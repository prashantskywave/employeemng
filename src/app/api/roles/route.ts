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

    const formatted = roles.map((role: any) => ({
    _id: role._id,
    roleId: role.roleId,
    name: role.name,
    departmentName: role.departmentId?.name,
  }));
  return Response.json(formatted);

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
    const { name, departmentId } = await req.json();

    if (!name || !departmentId) {
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
    const roleId = generateRoleId(department.name, name);

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
      name,         
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

   try {
    const body = await req.json();
    console.log("PUT BODY:", body);

    const { id, name, departmentId } = body;

    if (!id || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData: any = { name };

    if (departmentId) {
      updateData.departmentId = new Types.ObjectId(departmentId);
    }

  // // ✅ DEFINE ObjectIds properly
  // const roleId = new Types.ObjectId(id);
  // const deptId = new Types.ObjectId(departmentId);

 const updatedRole = await Role.findByIdAndUpdate(
  id,
  updateData,
  { new: true } as any
);


if (!updatedRole) {
  return NextResponse.json(
    { message: "Role not found" },
    { status: 404 }
  );
}

return NextResponse.json(updatedRole);

  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
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

