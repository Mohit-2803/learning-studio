import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import data from "../../../server/data";
import schema from "../../../server/schema";
import { verifyFirebaseIdToken } from "../../../lib/firebase-session";
import { SESSION_COOKIE } from "../../../lib/session-cookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifyFirebaseIdToken(token))) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, state: data.getSnapshot(), schemaSDL: schema.schemaSDL });
}
