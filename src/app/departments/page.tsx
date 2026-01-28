// import DepartmentClient from "./DepartmentClient";

// export default function Page() {
//   return <DepartmentClient />;
// }

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

type Department = {
  _id: string;
  name: string;
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDept, setNewDept] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  //   export const metadata = {
  //   title: "HRMS | Departments",
  // };

  // 🔄 Fetch departments
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
      body: JSON.stringify({ name: newDept  })
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
        <p className="font-medium">Delete this department?</p>
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
      <h1 className="text-xl font-semibold mb-6">Departments</h1>

      <div className="flex gap-2 mb-6 max-w-md">
        <Input
          placeholder="Department name"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>

      <table className="w-full border rounded-md">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border text-left">Department</th>
            <th className="p-2 border w-[200px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan={2} className="p-4 text-center text-muted-foreground">
                No departments
              </td>
            </tr>
          ) : (
            departments.map((dept) => (
              <tr key={dept._id}>
                <td className="p-2 border">
                  {editingId === dept._id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                  ) : (
                    dept.name
                  )}
                </td>
                <td className="p-2 border">
                  <div className="flex gap-2">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

