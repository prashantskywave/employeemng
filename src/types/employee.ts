export interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  email?: string;
  password: string;
  contact?: string;
  department: string;
  role: string;
  joiningDate: string;
  status: "Active" | "Inactive";
}
