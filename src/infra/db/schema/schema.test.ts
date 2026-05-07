import { describe, it, expect } from "vitest";
import { users, tenants } from "./users";
import { getTableConfig } from "drizzle-orm/pg-core";

describe("Database Schema Definitions", () => {
  it("should have correct table names", () => {
    const usersConfig = getTableConfig(users);
    const tenantsConfig = getTableConfig(tenants);
    
    expect(usersConfig.name).toBe("users");
    expect(tenantsConfig.name).toBe("tenants");
  });

  it("should have required columns in users table", () => {
    const { columns } = getTableConfig(users);
    
    const columnNames = columns.map(c => c.name);
    expect(columnNames).toContain("id");
    expect(columnNames).toContain("email");
    expect(columnNames).toContain("password_hash");
    expect(columnNames).toContain("tenant_id");
  });

  it("should have timestamp columns in all tables", () => {
    const usersCols = getTableConfig(users).columns.map(c => c.name);
    const tenantsCols = getTableConfig(tenants).columns.map(c => c.name);
    
    expect(usersCols).toContain("created_at");
    expect(tenantsCols).toContain("created_at");
  });
});
