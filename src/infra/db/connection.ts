import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as usersSchema from "./schema/users";
import * as contactsSchema from "./schema/contacts";

const schema = { ...usersSchema, ...contactsSchema };

// Disable prefetch as it is not supported for "Transaction" mode
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, { schema });

export type DbType = typeof db;
