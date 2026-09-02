import { env } from "cloudflare:workers";
import { readSession } from "../../lib/auth";

function newCode(){const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";const bytes=crypto.getRandomValues(new Uint8Array(6));return Array.from(bytes,b=>alphabet[b%alphabet.length]).join("")}
async function guard(){const s=await readSession();return s?.role==="facilitator"||s?.role==="admin"?s:null}

export async function POST(request:Request){
  const user=await guard();if(!user)return Response.json({error:"Facilitator access required."},{status:401});
  const body=await request.json() as {sessionCode?:string};const sessionCode=body.sessionCode??"WEDNESDAY-DEMO";
  for(let attempt=0;attempt<5;attempt++){
    const code=newCode();try{await env.DB.prepare("INSERT INTO triads (code, created_by, session_code) VALUES (?, ?, ?)").bind(code,user.name,sessionCode).run();const triad=await env.DB.prepare("SELECT * FROM triads WHERE code = ?").bind(code).first();return Response.json({triad},{status:201})}catch{}
  }
  return Response.json({error:"A triad code could not be generated. Please try again."},{status:500});
}

export async function GET(request:Request){
  if(!await guard())return Response.json({error:"Facilitator access required."},{status:401});
  const sessionCode=new URL(request.url).searchParams.get("sessionCode")??"WEDNESDAY-DEMO";
  const rows=await env.DB.prepare("SELECT t.*, (SELECT COUNT(*) FROM triad_members m WHERE m.triad_code = t.code) AS member_count FROM triads t WHERE session_code = ? ORDER BY created_at DESC LIMIT 20").bind(sessionCode).all();
  return Response.json({triads:rows.results});
}

export async function PATCH(request:Request){
  if(!await guard())return Response.json({error:"Facilitator access required."},{status:401});
  const body=await request.json() as {code?:string;action?:"start"|"pause"|"reset"|"next"|"close"};const code=(body.code??"").toUpperCase();
  const triad=await env.DB.prepare("SELECT * FROM triads WHERE code = ? LIMIT 1").bind(code).first<Record<string,number|string>>();if(!triad)return Response.json({error:"Triad not found."},{status:404});
  const now=Date.now();
  if(body.action==="start"){const remaining=Number(triad.timer_remaining)||480;await env.DB.prepare("UPDATE triads SET timer_running = 1, timer_ends_at = ? WHERE code = ?").bind(now+remaining*1000,code).run()}
  if(body.action==="pause"){const remaining=Math.max(0,Math.ceil((Number(triad.timer_ends_at)-now)/1000));await env.DB.prepare("UPDATE triads SET timer_running = 0, timer_remaining = ?, timer_ends_at = NULL WHERE code = ?").bind(remaining,code).run()}
  if(body.action==="reset")await env.DB.prepare("UPDATE triads SET timer_running = 0, timer_remaining = 480, timer_ends_at = NULL WHERE code = ?").bind(code).run();
  if(body.action==="next")await env.DB.prepare("UPDATE triads SET round = CASE WHEN round < 3 THEN round + 1 ELSE 1 END, timer_running = 0, timer_remaining = 480, timer_ends_at = NULL WHERE code = ?").bind(code).run();
  if(body.action==="close")await env.DB.prepare("UPDATE triads SET active = 0, timer_running = 0 WHERE code = ?").bind(code).run();
  const updated=await env.DB.prepare("SELECT * FROM triads WHERE code = ?").bind(code).first();return Response.json({triad:updated});
}
export async function DELETE(request:Request){if(!await guard())return Response.json({error:"Facilitator access required."},{status:401});const code=(new URL(request.url).searchParams.get("code")??"").toUpperCase();if(!code)return Response.json({error:"Triad code required."},{status:400});await env.DB.prepare("DELETE FROM triad_members WHERE triad_code = ?").bind(code).run();await env.DB.prepare("DELETE FROM triads WHERE code = ?").bind(code).run();return Response.json({deleted:true,code})}
