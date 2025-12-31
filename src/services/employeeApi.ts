import { Employee } from "@/types/employee";

const BASE_URL = "/api/employees";

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}
export const deleteEmployee = async (
  id: string,
  reason: string
) => {
  const res = await fetch(`/api/employees/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }
  console.log("Deleting employee:", id, reason);

};
