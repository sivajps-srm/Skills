import { env } from "cloudflare:workers";

export const activityKeys=["pulse","workbook","cards","roleplay","case","finish"] as const;
export type ActivityKey=(typeof activityKeys)[number];

export async function ensureDefaultSession(){
  const learnerCode=env.LEARNER_ACCESS_CODE??"DEMO";
  await env.DB.prepare("INSERT OR IGNORE INTO training_sessions (code, name, learner_code) VALUES (?, ?, ?)").bind("WEDNESDAY-DEMO","Wednesday Client Demo",learnerCode).run();
}

export async function sessionForLearnerCode(code:string){
  await ensureDefaultSession();
  return env.DB.prepare("SELECT * FROM training_sessions WHERE learner_code = ? LIMIT 1").bind(code).first<Record<string,unknown>>();
}

export async function currentSession(code?:string){
  await ensureDefaultSession();
  const target=code||"WEDNESDAY-DEMO";
  return env.DB.prepare("SELECT * FROM training_sessions WHERE code = ? LIMIT 1").bind(target).first<Record<string,unknown>>();
}
