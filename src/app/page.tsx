// import EmployeeTable from "@/components/EmployeeTable";

// export default function HomePage() {
//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-bold mb-4">
//         Employee Management
//       </h1>
//       <EmployeeTable />
//     </main>
//   );
// }

import EmployeeTableClient from "@/components/EmployeeTableClient";

export default function HomePage() {
  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">
        Employee Management
      </h1>
      <EmployeeTableClient />
    </main>
  );
}



