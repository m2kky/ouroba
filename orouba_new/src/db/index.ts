import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const maxConnections = Number(process.env.POSTGRES_MAX_CONNECTIONS ?? 1);
const queryClient = postgres(process.env.DATABASE_URL!, {
  max: Number.isFinite(maxConnections) && maxConnections > 0 ? maxConnections : 1,
});
export const db = drizzle(queryClient, { schema });
