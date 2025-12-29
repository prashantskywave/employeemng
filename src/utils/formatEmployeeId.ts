export function formatEmployeeId(id: string) {
  if (id.startsWith("EMP")) return id;

  const digitsOnly = id.replace(/\D/g, ""); // remove non-digits
  const firstFour = digitsOnly.slice(0, 4);

  return `EMP${firstFour.padStart(4, "0")}`;
}
