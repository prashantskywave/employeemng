import { Employee } from "@/types/employee";

const BASE_URL = "/api/employees";

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}
export async function deleteEmployee(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}
