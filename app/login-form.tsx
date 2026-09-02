"use client";
import { useState } from "react";
import type { PortalRole } from "./lib/auth";

export default function LoginForm({ role }: { role: PortalRole }) {
  const [name, setName] = useState(""); const [username, setUsername] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setError(""); const res = await fetch("/api/auth/login", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({role,name,username,password}) }); const data = await res.json() as {destination?:string;error?:string}; if(res.ok && data.destination) location.href=data.destination; else {setError(data.error ?? "Unable to sign in.");setBusy(false);} };
  return <form className="login-form" onSubmit={submit}>
    <p className="login-role">{role === "learner" ? "Learner access" : `${role} hub`}</p>
    <h1>{role === "learner" ? "Enter your learning journey" : `Sign in as ${role}`}</h1>
    <p>{role === "learner" ? "Use the access code shared by your facilitator." : "Use your authorised hub credentials."}</p>
    {role === "learner" ? <label>Your name<input value={name} onChange={e=>setName(e.target.value)} required autoComplete="name" placeholder="How should we address you?"/></label> : <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required autoComplete="username" placeholder={`${role} username`}/></label>}
    <label>{role === "learner" ? "Access code" : "Password"}<input value={password} onChange={e=>setPassword(e.target.value)} required type="password" autoComplete={role === "learner" ? "one-time-code" : "current-password"} placeholder={role === "learner" ? "Enter access code" : "Enter password"}/></label>
    {error && <div className="login-error">{error}</div>}
    <button className="primary full" disabled={busy}>{busy ? "Checking…" : "Continue securely →"}</button><a href="/">← Back to role selection</a>
  </form>;
}
