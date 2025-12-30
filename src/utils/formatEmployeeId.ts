export function formatEmployeeId(id: string) {
  if (id.startsWith("EMP")) return id;

  const digitsOnly = id.replace(/\D/g, ""); 
  const lastFour = digitsOnly.slice(-4);

  return `EMP${lastFour.padStart(4, "0")}`;
}
