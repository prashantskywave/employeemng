export function generateRoleId(
  departmentName: string,
  roleName: string
) {
  const deptWords = departmentName.trim().split(/\s+/);

  const dept =
    deptWords.length === 1
      ? deptWords[0].slice(0, 3).toUpperCase() 
      : deptWords
          .map(word => word[0])
          .join("")
          .toUpperCase(); 

  const role = roleName
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .toUpperCase(); 

  return `${dept}-${role}`;
}
