import { TableBody } from "@/components/ui/table";
import { sql } from "@vercel/postgres";
import { Key } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Extrahiere den Schlüssel und den zu aktualisierenden Text aus der Anfrage
    const key = params.slug;
    const { text } = await req.json(); // Annahme: Der neue Text wird im Request-Body übermittelt

    if (!key || !text) {
      return NextResponse.json(
        { error: "Key or text is missing" },
        { status: 400 }
      );
    }

    // Führe die Aktualisierung in der Datenbank durch
    await sql`UPDATE todos SET text = ${text} WHERE key = ${key}`;

    // Antwort bei Erfolg
    return NextResponse.json({
      message: "Todo updated successfully",
      status: 200,
    });
  } catch (e: any) {
    // Fehlerbehandlung
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const key = params.slug;
    if (!key) {
      return NextResponse.json({ error: "Key is missing" }, { status: 400 });
    }
    await sql`DELETE FROM todos WHERE key = ${key}`;
    return NextResponse.json({
      message: "Todo deleted successfully",
      status: 200,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
