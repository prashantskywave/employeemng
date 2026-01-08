export function canEditEmployee(
  editorDept: string,
  targetDept: string
) {
  const editor = editorDept.toLowerCase();
  const target = targetDept.toLowerCase();

  if (editor === "super_admin") return true;

  if (editor === "admin") {
    return target !== "super_admin";
  }

  if (editor === "humanresources") {
    return !["admin", "super_admin"].includes(target);
  }

  return false;
}

export const normalize = (value?: string) =>
  value?.toLowerCase().trim() ?? "";

export const canAccessAddEmployee = (department?: string) => {
  const role = normalize(department);
  return role === "admin" || role === "super_admin";
};

export const canAccessEditEmployee = (department?: string) => {
  const role = normalize(department);
  return (
    role === "super_admin" ||
    role === "admin" ||
    role === "humanresources"
  );
};
