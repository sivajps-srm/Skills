import LoginForm from "../../login-form";
import type { PortalRole } from "../../lib/auth";

export default async function RoleLogin({ params }: { params: Promise<{role:string}> }) {
  const {role} = await params; const valid = ["learner","facilitator","admin"].includes(role);
  if(!valid) return <main className="login-page"><div className="login-shell"><h1>Role not found</h1><a href="/">Return home</a></div></main>;
  return <main className="login-page"><div className="login-aside"><a className="brand" href="/"><img className="brand-logo" src="/s4s-login-logo.png" alt="Skills4Sales"/><span><strong>Skills4Sales</strong><small>LEARNING COMPANION</small></span></a><blockquote>“The right access.<br/>The right experience.”</blockquote><p>Connect · Discover · Create · Advance</p></div><div className="login-shell"><LoginForm role={role as PortalRole}/></div></main>;
}
