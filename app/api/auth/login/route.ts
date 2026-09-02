import { credentialsFor, makeSession, PortalRole, safeEqual } from "../../../lib/auth";
import { sessionForLearnerCode } from "../../../lib/session-data";

export async function POST(request: Request) {
  const body = await request.json() as { role?: PortalRole; username?: string; password?: string; name?: string };
  if (!body.role || !["learner", "facilitator", "admin"].includes(body.role)) return Response.json({ error: "Choose a valid role." }, { status: 400 });
  const username = body.role === "learner" ? "learner" : (body.username ?? "").trim();
  const password = (body.password ?? "").trim();
  const expected = credentialsFor(body.role);
  const learnerSession=body.role==="learner"?await sessionForLearnerCode(password):null;
  const ok = body.role==="learner"?Boolean(learnerSession):Boolean(expected.password) && await safeEqual(username, expected.username) && await safeEqual(password, expected.password);
  if (!ok) return Response.json({ error: body.role === "learner" ? "That access code is not valid." : "The username or password is incorrect." }, { status: 401 });
  const displayName = body.role === "learner" ? ((body.name ?? "Learner").trim() || "Learner") : username;
  const session = await makeSession(body.role, displayName, body.role==="learner"?String(learnerSession?.code??"WEDNESDAY-DEMO"):undefined);
  const destination = body.role === "learner" ? "/learner" : `/${body.role}`;
  return new Response(JSON.stringify({ destination }), { status: 200, headers: { "content-type": "application/json", "set-cookie": `s4s_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800` } });
}
