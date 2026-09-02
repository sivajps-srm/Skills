import { env } from "cloudflare:workers";
import { readSession } from "../../lib/auth";

export async function GET(){
  const user=await readSession();if(user?.role!=="learner")return Response.json({error:"Learner access required."},{status:401});
  const code=user.sessionCode??"WEDNESDAY-DEMO";
  const rows=await env.DB.prepare("SELECT activity, response, score FROM activity_responses WHERE learner_name = ? AND session_code = ? ORDER BY id DESC").bind(user.name,code).all<{activity:string;response:string;score:number|null}>();
  const latest:Record<string,unknown>={};for(const row of rows.results)if(latest[row.activity]===undefined)latest[row.activity]={response:JSON.parse(row.response),score:row.score};
  return Response.json({progress:latest});
}
