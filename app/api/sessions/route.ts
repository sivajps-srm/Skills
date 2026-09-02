import { env } from "cloudflare:workers";
import { activityKeys,ensureDefaultSession } from "../../lib/session-data";
import { readSession } from "../../lib/auth";

function random(size:number){const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";const bytes=crypto.getRandomValues(new Uint8Array(size));return Array.from(bytes,b=>alphabet[b%alphabet.length]).join("")}
async function guard(){const s=await readSession();return s?.role==="facilitator"||s?.role==="admin"?s:null}

export async function GET(){
  if(!await guard())return Response.json({error:"Facilitator access required."},{status:401});
  await ensureDefaultSession();
  const rows=await env.DB.prepare("SELECT * FROM training_sessions ORDER BY created_at DESC").all();
  return Response.json({sessions:rows.results});
}

export async function POST(request:Request){
  if(!await guard())return Response.json({error:"Facilitator access required."},{status:401});
  const body=await request.json() as {name?:string};const name=(body.name??"").trim();
  if(!name)return Response.json({error:"Enter a cohort or session name."},{status:400});
  for(let i=0;i<5;i++){
    const code=`S4S-${random(5)}`,learnerCode=random(14);
    try{await env.DB.prepare("INSERT INTO training_sessions (code, name, learner_code) VALUES (?, ?, ?)").bind(code,name,learnerCode).run();const row=await env.DB.prepare("SELECT * FROM training_sessions WHERE code = ?").bind(code).first();return Response.json({session:row},{status:201})}catch{}
  }
  return Response.json({error:"Could not create the session. Please try again."},{status:500});
}

export async function PATCH(request:Request){
  if(!await guard())return Response.json({error:"Facilitator access required."},{status:401});
  const body=await request.json() as {sessionCode?:string;activity?:string;open?:boolean;debriefResponseId?:number|null;debriefVisible?:boolean;deckOpen?:boolean;deckSlide?:number;promptVisible?:boolean;presentationClosed?:boolean};
  const code=(body.sessionCode??"").trim();if(!code)return Response.json({error:"Choose a session."},{status:400});
  if(body.activity){
    if(!activityKeys.includes(body.activity as never))return Response.json({error:"Unknown activity."},{status:400});
    const column=`${body.activity}_open`;
    await env.DB.prepare(`UPDATE training_sessions SET ${column} = ? WHERE code = ?`).bind(body.open?1:0,code).run();
  }
  if(body.debriefVisible!==undefined)await env.DB.prepare("UPDATE training_sessions SET debrief_response_id = ?, debrief_visible = ? WHERE code = ?").bind(body.debriefResponseId??null,body.debriefVisible?1:0,code).run();
  if(body.deckOpen!==undefined||body.deckSlide!==undefined||body.promptVisible!==undefined||body.presentationClosed!==undefined){const slide=Math.max(0,Math.min(16,Number(body.deckSlide??0)));await env.DB.prepare("UPDATE training_sessions SET deck_open = COALESCE(?, deck_open), deck_slide = ?, prompt_visible = COALESCE(?, prompt_visible), presentation_closed = COALESCE(?, presentation_closed) WHERE code = ?").bind(body.deckOpen===undefined?null:body.deckOpen?1:0,slide,body.promptVisible===undefined?null:body.promptVisible?1:0,body.presentationClosed===undefined?null:body.presentationClosed?1:0,code).run();}
  const row=await env.DB.prepare("SELECT * FROM training_sessions WHERE code = ?").bind(code).first();return Response.json({session:row});
}
