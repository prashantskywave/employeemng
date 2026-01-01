import Employee from "@/models/Employee";

export const getNextEmployeeId = async () => {
  const lastEmployee = await Employee.findOne({}).sort({ employeeId: -1 });
  if (!lastEmployee) return "EMP0001";

  const lastIdNumber = parseInt(lastEmployee.employeeId.replace("EMP", ""));
  const nextIdNumber = lastIdNumber + 1;
  return `EMP${nextIdNumber.toString().padStart(4, "0")}`;
};
