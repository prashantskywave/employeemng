export function formatEmployeeId(id: string) {
  if (id.startsWith("EMP")) return id;
  return `EMP${id.padStart(4, "0")}`;
}
