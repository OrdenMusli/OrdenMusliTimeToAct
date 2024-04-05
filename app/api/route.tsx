import { TableBody } from "@/components/ui/table";
import { sql } from "@vercel/postgres";
import { Key } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest, res: NextResponse) {
  const items = await sql`SELECT text, key FROM todos`;
  return NextResponse.json(items.rows);
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    if (body) {
      await sql`INSERT INTO todos (text, key) VALUES(${body.text}, ${body.key})`;
    }
  } catch (e: any) {
    return NextResponse.json(e, { status: 500 });
  }
  return NextResponse.json({ status: 200 });
}
