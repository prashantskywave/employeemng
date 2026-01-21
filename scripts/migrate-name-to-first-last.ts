import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://Vercel-Admin-employee_management:kPr0TGMsTSDhSAAI@employee-management.8i3zyxe.mongodb.net/?retryWrites=true&w=majority";
const EmployeeSchema = new mongoose.Schema(
  {
    name: String,
    firstName: String,
    lastName: String,
  },
  { collection: "employees" }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

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
    console.log("📦 Connected DB:", mongoose.connection.name);

    const employees = await Employee.find({
      name: { $type: "string" },
    });

    console.log(`📄 Found ${employees.length} records to migrate`);

    for (const emp of employees) {
      const fullName = emp.name?.trim();
      if (!fullName) continue;

      // const parts = fullName.split(" ");
      // const firstName = parts[0];
      // const lastName = parts.slice(1).join(" ");

      const parts = fullName.trim().split(/\s+/);
      const lastName = parts.pop() || "";
      const firstName = parts.join(" ");

      await Employee.updateOne(
        { _id: emp._id },
        {
          $set: {
            firstName,
            lastName,
          },
          $unset: {
            name: ""
          }
        }
      );

      console.log(`✅ Migrated: ${fullName}`);
    }

    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
