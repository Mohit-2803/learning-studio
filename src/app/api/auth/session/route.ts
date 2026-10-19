import { NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "../../../../lib/firebase-session";
import { SESSION_COOKIE, sessionCookieOptions } from "../../../../lib/session-cookie";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const user = await verifyFirebaseIdToken(body?.idToken);
  if (!user) return NextResponse.json({ error: "Invalid sign-in session." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, body.idToken, sessionCookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
