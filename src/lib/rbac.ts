export type Permission = 
  | "PAGE_DASHBOARD"
  | "PAGE_CONTACTS"
  | "PAGE_CHAT"
  | "PAGE_ADMIN_USERS"
  | "PAGE_ADMIN_DEPTS"
  | "PAGE_ADMIN_ROLES"
  | "PAGE_AUTOMATION"
  | "PAGE_REPORTS"
  | "PAGE_SETTINGS"
  | "USERS_CREATE"
  | "USERS_DELETE"
  | "DEPARTMENTS_MANAGE"
  | "ROLES_MANAGE";

export const ALL_PERMISSIONS: Permission[] = [
  "PAGE_DASHBOARD",
  "PAGE_CONTACTS",
  "PAGE_CHAT",
  "PAGE_ADMIN_USERS",
  "PAGE_ADMIN_DEPTS",
  "PAGE_ADMIN_ROLES",
  "PAGE_AUTOMATION",
  "PAGE_REPORTS",
  "PAGE_SETTINGS",
  "USERS_CREATE",
  "USERS_DELETE",
  "DEPARTMENTS_MANAGE",
  "ROLES_MANAGE"
];

export function hasPermission(userPermissions: string[], requiredPermission: Permission): boolean {
  if (userPermissions.includes("ADMIN_ALL")) return true; // Super Admin bypass
  return userPermissions.includes(requiredPermission);
}
