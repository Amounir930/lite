import { describe, it, expect } from "vitest";
import { hasPermission } from "@/lib/rbac";

describe("RBAC Engine Logic", () => {
  it("should allow Super Admin (*) to access anything", () => {
    const permissions = ["*"];
    expect(hasPermission(permissions, "USERS_DELETE")).toBe(true);
    expect(hasPermission(permissions, "SETTINGS_MANAGE")).toBe(true);
  });

  it("should allow users with specific permissions", () => {
    const permissions = ["USERS_VIEW", "USERS_CREATE"];
    expect(hasPermission(permissions, "USERS_VIEW")).toBe(true);
    expect(hasPermission(permissions, "USERS_CREATE")).toBe(true);
  });

  it("should deny access if permission is missing", () => {
    const permissions = ["USERS_VIEW"];
    expect(hasPermission(permissions, "USERS_DELETE")).toBe(false);
  });

  it("should handle empty permissions correctly", () => {
    const permissions: string[] = [];
    expect(hasPermission(permissions, "USERS_VIEW")).toBe(false);
  });
});
