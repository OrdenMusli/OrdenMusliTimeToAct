"use server";

import { sql } from "@vercel/postgres";

export async function toggleComplete(id: string, completed: boolean) {
  await sql`UPDATE todos SET completed = ${
    completed ? 1 : 0
  } WHERE key = ${id}`;
  return { ok: true };
}
