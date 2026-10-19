import { graphql } from "graphql";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import schemaModule from "../../server/schema";
import data from "../../server/data";
import resolversModule from "../../server/resolvers";
import { verifyFirebaseIdToken } from "../../lib/firebase-session";
import { SESSION_COOKIE } from "../../lib/session-cookie";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifyFirebaseIdToken(token))) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const { query, variables } = (await request.json()) as {
      query?: string;
      variables?: Record<string, unknown>;
    };
    const trace: Array<{ resolver: string; type: string; detail: string; ms: number }> = [];
    const startedAt = performance.now();
    const result = await graphql({
      schema: schemaModule.schema,
      source: query || "",
      rootValue: resolversModule.createRootResolvers(trace),
      contextValue: { trace },
      variableValues: variables || {},
    });
    const durationMs = Number((performance.now() - startedAt).toFixed(2));
    return NextResponse.json({
      ...result,
      extensions: { durationMs, trace, state: data.getSnapshot() },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid GraphQL request.";
    return NextResponse.json({ errors: [{ message }] }, { status: 400 });
  }
}
