import { env } from "cloudflare:workers";
import { readSession } from "../../lib/auth";
import { currentSession } from "../../lib/session-data";

export async function GET(){
  const user=await readSession();if(user?.role!=="learner")return Response.json({error:"Learner access required."},{status:401});
  const session=await currentSession(user.sessionCode);
  if(!session)return Response.json({error:"Session not found."},{status:404});
  let debrief=null;
  if(session.debrief_visible&&session.debrief_response_id){
    const row=await env.DB.prepare("SELECT activity, response FROM activity_responses WHERE id = ? AND session_code = ? LIMIT 1").bind(session.debrief_response_id,session.code).first<{activity:string;response:string}>();
    if(row)debrief={activity:row.activity,response:JSON.parse(row.response)};
  }
  return Response.json({session:{code:session.code,name:session.name,activities:{pulse:Boolean(session.pulse_open),workbook:Boolean(session.workbook_open),cards:Boolean(session.cards_open),roleplay:Boolean(session.roleplay_open),case:Boolean(session.case_open),finish:Boolean(session.finish_open)},presentation:{open:Boolean(session.deck_open),slide:Number(session.deck_slide)||0},debrief}});
}
