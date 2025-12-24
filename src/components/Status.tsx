import { Badge } from "@/components/ui/badge";

export default function Status({ status }: { status: string }) {
  return (
    <Badge variant={status === "Active" ? "default" : "secondary"}>
      {status}
    </Badge>
  );
}
