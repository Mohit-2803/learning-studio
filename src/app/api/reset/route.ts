import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import data from "../../../server/data";
import { verifyFirebaseIdToken } from "../../../lib/firebase-session";
import { SESSION_COOKIE } from "../../../lib/session-cookie";

export const runtime = "nodejs";

export async function POST() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifyFirebaseIdToken(token))) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  const state = data.resetStore();
  return NextResponse.json({
    ok: true,
    message: "Library data reset to starter state.",
    state,
  });
}
