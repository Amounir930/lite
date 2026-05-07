import { pgTable, uuid, varchar, timestamp, text, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tenants, users } from "./users";

// 🛡️ Roles Table
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .references(() => tenants.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Manager", "Support"
  permissions: jsonb("permissions").default([]).notNull(), // Array of permission strings
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 🔗 Relations
export const rolesRelations = relations(roles, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [roles.tenantId],
    references: [tenants.id],
  }),
  users: many(users),
}));

// Update Users to include Role Reference (Circular dependency handled by Drizzle)
// Note: In real scenarios, we might add role_id to users table via a migration.
