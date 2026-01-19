export interface Employee {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName?: string;
  name: string;
  email?: string;
  password: string;
  contact?: string;
  department: string;
  role: string;
  joiningDate: string;
  status: "Active" | "Inactive";
  image?: string;

}
