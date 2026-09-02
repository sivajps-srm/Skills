import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { activityResponses } from "../../../db/schema";
import { readSession } from "../../lib/auth";

export async function POST(request: Request) {
  const session = await readSession();
  if (session?.role !== "learner") return Response.json({ error: "Learner access required." }, { status: 401 });
  const body = await request.json() as { activity?: string; response?: unknown; score?: number };
  if (!body.activity || body.response === undefined) return Response.json({ error: "Activity and response are required." }, { status: 400 });
  const [saved] = await getDb().insert(activityResponses).values({ learnerName: session.name, sessionCode:session.sessionCode??"WEDNESDAY-DEMO",activity: body.activity, response: JSON.stringify(body.response), score: Number.isFinite(body.score) ? body.score : null }).returning();
  return Response.json({ saved }, { status: 201 });
}

export async function GET(request:Request) {
  const session = await readSession();
  if (session?.role !== "facilitator" && session?.role !== "admin") return Response.json({ error: "Facilitator access required." }, { status: 401 });
  const code=new URL(request.url).searchParams.get("sessionCode")??"WEDNESDAY-DEMO";
  const rows = await getDb().select().from(activityResponses).where(eq(activityResponses.sessionCode,code)).orderBy(desc(activityResponses.createdAt), desc(activityResponses.id)).limit(200);
  return Response.json({ responses: rows });
}

export async function DELETE(request:Request) {
  const session = await readSession();
  if (session?.role !== "facilitator" && session?.role !== "admin") return Response.json({ error: "Facilitator access required." }, { status: 401 });
  const code = new URL(request.url).searchParams.get("sessionCode") ?? "WEDNESDAY-DEMO";
  await getDb().delete(activityResponses).where(eq(activityResponses.sessionCode, code));
  return Response.json({ cleared: true, sessionCode: code });
}
