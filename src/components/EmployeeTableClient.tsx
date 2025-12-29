"use client";

import dynamic from "next/dynamic";

const EmployeeTable = dynamic(
  () => import("./EmployeeTable"),
  { ssr: false }
);

export default function EmployeeTableClient() {
  return <EmployeeTable />;
}
