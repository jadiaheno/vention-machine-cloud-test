import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import drizzleConfig from './drizzle.config';
import * as schema from './src/server/db/schema';

const connection = postgres(drizzleConfig.dbCredentials.connectionString, { max: 1 });
const db = drizzle(connection, { schema });
await migrate(db, { migrationsFolder: drizzleConfig.out })
await connection.end();