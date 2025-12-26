"use client";

import { Input } from "@/components/ui/input";

export default function SearchFilter({ onSearch }: any) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-sm font-medium">Search</span>
      <Input
        placeholder="Search by name or ID..."
        onChange={(e) => onSearch(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
