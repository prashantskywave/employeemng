// import DepartmentClient from "./DepartmentClient";

// export default function Page() {
//   return <DepartmentClient />;
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Department = {
  _id: string;
  departmentId: string;
  name: string;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDept, setNewDept] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const router = useRouter();

  //   export const metadata = {
  //   title: "HRMS | Departments",
  // };

  const { data: session, status: sessionStatus } = useSession();
  const userDepartment = session?.user?.department?.toLowerCase() ?? "";
  const canManageEmployee =
    userDepartment === "admin" || userDepartment === "super_admin";

  const fetchDepartments = async () => {
    const res = await fetch("/api/departments");
    const data = await res.json();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async () => {
    if (!newDept.trim()) return;

    const res = await fetch("/api/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDept })
    });

    if (!res.ok) {
      toast.error("Not authorized");
      return;
    }

    toast.success("Department added");
    setNewDept("");
    fetchDepartments();
  };

  const handleUpdate = async (_id: string) => {
    if (!editingName.trim()) {
      toast.error("Department name cannot be empty");
      return;
    }
    const res = await fetch("/api/departments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: _id,
        name: editingName,
      })
    });

    if (!res.ok) {
      toast.error("Update failed");
      return;
    }

    toast.success("Department updated");
    setEditingId(null);
    fetchDepartments();
  };

  const handleDelete = (_id: string) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Are you sure you want to delete this role?</p>
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                const res = await fetch("/api/departments", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: _id }),
                });

                if (!res.ok) {
                  toast.error("Delete failed");
                } else {
                  toast.success("Department deleted");
                  fetchDepartments();
                }

                toast.dismiss(t.id);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <div className="p-6">
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="space-y-4 pt-2 pb-6">
          <CardTitle className="text-xl font-medium mb-2">Departments</CardTitle>

          {canManageEmployee && (
            <div className="flex gap-2 mb-6 max-w-md">
              <Input
                placeholder="Department name"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              />
              <Button onClick={handleAdd}>Add</Button>
            </div>
          )}
          <div className="overflow-x-auto">
            <Table className="w-full border rounded-md">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="p-2 border w-[300px] text-center">Dept ID</TableHead>
                  <TableHead className="p-2 border text-center">Department</TableHead>
                  <TableHead className="p-2 border text-center">Roles</TableHead>
                  {canManageEmployee && (
                    <TableHead className="p-2 border w-[200px] text-center">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="p-4 text-center text-muted-foreground">
                      No departments
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((dept) => (
                    <TableRow key={dept._id}>
                      <TableCell className="p-2 border text-center">{dept.departmentId}</TableCell>
                      <TableCell className="p-2 border text-center">
                        {editingId === dept._id ? (
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                          />
                        ) : (
                          dept.name
                        )}
                      </TableCell>
                      <TableCell className="p-2 border text-center">
                        <Button
                          size="sm"
                          variant="link"
                          onClick={() =>
                             //router.push(`/roles?departmentId=${dept._id}&departmentName=${dept.name}`)
                             router.push(`/roles/${dept._id}`)
                          }
                        >
                          View Roles
                        </Button>
                      </TableCell>
                      {canManageEmployee && (
                        <TableCell className="p-2 border">
                          <div className="flex gap-2 justify-center">
                            {editingId === dept._id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdate(dept._id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingId(dept._id);
                                    setEditingName(dept.name);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(dept._id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

