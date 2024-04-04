import { sql } from "@vercel/postgres";

export async function query(q, values) {
  const result = await sql(q, ...values);
  return result;
}