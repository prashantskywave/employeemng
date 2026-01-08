
"use client";

interface StatusProps {
  status: string;
}

export default function Status({ status }: StatusProps) {
  const isActive = status.toLowerCase() === "active";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium
        ${isActive
          ? "bg-green-700 text-white"
          : "bg-red-700 text-white"}
      `}
    >
      {status}
    </span>
  );
}
