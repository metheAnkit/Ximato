import { connectDatabase } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDatabase().then((database) => database.command({ ping: 1 }));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
