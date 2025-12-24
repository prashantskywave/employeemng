export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  contact: string;
  department: string;
  role: string;
  joiningDate: string;
  status: "Active" | "Inactive";
}
