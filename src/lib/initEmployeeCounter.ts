import Employee from "@/models/Employee";
import Counter from "@/models/Counter";

export const initEmployeeCounter = async () => {
  const lastEmployee = await Employee.findOne({}).sort({ createdAt: -1 });
  const lastSeq = lastEmployee
    ? parseInt(lastEmployee.employeeId.replace("EMP", ""))
    : 0;

  // Build-safe workaround: cast Counter as any
  await (Counter as any).findOneAndUpdate(
    { name: "employee" },
    { seq: lastSeq },
    { upsert: true }
  );

  console.log(`Employee counter initialized at ${lastSeq}`);
};
