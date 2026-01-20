import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017/hrms"; // 🔴 change DB name

// Employee schema (temporary, only for migration)
const EmployeeSchema = new mongoose.Schema(
  {
    name: String,
    firstName: String,
    lastName: String,
  },
  { collection: "employees" }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

// Helper function to split name
function splitName(fullName: string) {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

async function migrate() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    const employees = await Employee.find({
      name: { $exists: true, $ne: "" },
    });

    console.log(`📄 Found ${employees.length} records to migrate`);

    for (const emp of employees) {
      const { firstName, lastName } = splitName(emp.name);

      await Employee.updateOne(
        { _id: emp._id },
        {
          $set: { firstName, lastName },
          $unset: { name: "" }
        }
      );

      console.log(`✅ ${emp.name} → ${firstName} ${lastName}`);
    }

    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
