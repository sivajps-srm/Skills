import { env } from "cloudflare:workers";
import { readSession } from "../../lib/auth";

export async function GET(){
  const user=await readSession();if(user?.role!=="learner")return Response.json({error:"Learner access required."},{status:401});
  const rows=await env.DB.prepare("SELECT topic, entry, updated_at FROM journal_entries WHERE learner_name = ? AND session_code = ? ORDER BY updated_at DESC").bind(user.name,user.sessionCode??"WEDNESDAY-DEMO").all();
  return Response.json({entries:rows.results});
}

export async function PUT(request:Request){
  const user=await readSession();if(user?.role!=="learner")return Response.json({error:"Learner access required."},{status:401});
  const body=await request.json() as {topic?:string;entry?:string};const topic=(body.topic??"").trim(),entry=(body.entry??"").trim();if(!topic||!entry)return Response.json({error:"Topic and journal entry are required."},{status:400});
  const code=user.sessionCode??"WEDNESDAY-DEMO";
  await env.DB.prepare("INSERT INTO journal_entries (learner_name, session_code, topic, entry, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT (learner_name, session_code, topic) DO UPDATE SET entry = excluded.entry, updated_at = CURRENT_TIMESTAMP").bind(user.name,code,topic,entry).run();
  const saved=await env.DB.prepare("SELECT topic, entry, updated_at FROM journal_entries WHERE learner_name = ? AND session_code = ? AND topic = ?").bind(user.name,code,topic).first();return Response.json({entry:saved});
}
