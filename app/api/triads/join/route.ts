import { env } from "cloudflare:workers";
import { readSession } from "../../../lib/auth";

const roles=["salesperson","customer","observer"] as const;type Role=(typeof roles)[number];
const briefs:Record<Role,{title:string;copy:string;task:string}>={salesperson:{title:"You own the opportunity",copy:"Priya has accepted an eight-minute discovery conversation. Do not pitch. Establish relevance, explore consequence and earn a multi-stakeholder next step.",task:"Prepare your opening and three questions."},customer:{title:"You are Priya Nair",copy:"You are under pressure to support two EV customer launches. Share the six-week release delay only if the salesperson asks about business impact. You distrust transformation theatre.",task:"Respond naturally; reveal information only when earned."},observer:{title:"You are the conversation coach",copy:"Watch for relevance, purposeful questions, follow-up on significant words, stakeholder discovery, premature solutioning and a clear next step.",task:"Record one effective move and one better move."}};
function rotated(base:Role,round:number){return roles[(roles.indexOf(base)+Math.max(0,round-1))%roles.length]}
async function state(code:string,name:string){
  const triad=await env.DB.prepare("SELECT * FROM triads WHERE code = ? LIMIT 1").bind(code).first<Record<string,number|string>>();if(!triad)return null;
  const own=await env.DB.prepare("SELECT role FROM triad_members WHERE triad_code = ? AND learner_name = ? LIMIT 1").bind(code,name).first<{role:Role}>();
  const taken=await env.DB.prepare("SELECT role FROM triad_members WHERE triad_code = ?").bind(code).all<{role:Role}>();const unavailable=taken.results.map(row=>row.role);const round=Number(triad.round)||1;const role=own?.role?rotated(own.role,round):null;
  const remaining=triad.timer_running?Math.max(0,Math.ceil((Number(triad.timer_ends_at)-Date.now())/1000)):Number(triad.timer_remaining)||480;
  return {code,round,baseRole:own?.role??null,role,brief:role?briefs[role]:null,unavailable,available:roles.filter(r=>!unavailable.includes(r)),memberCount:unavailable.length,timerRunning:Boolean(triad.timer_running),timerEndsAt:triad.timer_ends_at?Number(triad.timer_ends_at):null,timerRemaining:remaining,active:Boolean(triad.active)};
}
export async function POST(request:Request){
  const user=await readSession();if(user?.role!=="learner")return Response.json({error:"Learner access required."},{status:401});
  const body=await request.json() as {code?:string;role?:Role};const code=(body.code??"").trim().toUpperCase();if(!code)return Response.json({error:"Enter the triad code."},{status:400});
  const triad=await env.DB.prepare("SELECT code FROM triads WHERE code = ? AND session_code = ? AND active = 1 LIMIT 1").bind(code,user.sessionCode??"WEDNESDAY-DEMO").first();if(!triad)return Response.json({error:"This triad code is not active for your session."},{status:404});
  const current=await state(code,user.name);if(current?.role)return Response.json(current);if(!body.role)return Response.json(current);if(!roles.includes(body.role))return Response.json({error:"Choose an available role."},{status:400});
  try{await env.DB.prepare("INSERT INTO triad_members (triad_code, learner_name, role) VALUES (?, ?, ?)").bind(code,user.name,body.role).run()}catch{return Response.json({error:"That role has just been taken. Choose another available role.",...(await state(code,user.name))},{status:409})}
  return Response.json(await state(code,user.name),{status:201});
}
