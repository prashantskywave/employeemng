/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/ui/input";

export default function SearchFilter({ onSearch }: any) {
  return (
    <Input
      placeholder="Search by name or ID..."
      onChange={(e) => onSearch(e.target.value)}
      className="max-w-sm mb-4"
    />
  );
}
