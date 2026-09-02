import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

export type PortalRole = "learner" | "facilitator" | "admin";
type Session = { role: PortalRole; name: string; exp: number; sessionCode?: string };

const encoder = new TextEncoder();
const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const fromB64 = (value: string) => Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/")), c => c.charCodeAt(0));

async function signature(payload: string) {
  const secret = env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toB64(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload))));
}

export async function makeSession(role: PortalRole, name: string, sessionCode?: string) {
  const data: Session = { role, name, exp: Date.now() + 8 * 60 * 60 * 1000, sessionCode };
  const payload = toB64(encoder.encode(JSON.stringify(data)));
  return `${payload}.${await signature(payload)}`;
}

export async function readSession(): Promise<Session | null> {
  try {
    const raw = (await cookies()).get("s4s_session")?.value;
    if (!raw) return null;
    const [payload, sig] = raw.split(".");
    if (!payload || !sig || sig !== await signature(payload)) return null;
    const parsed = JSON.parse(new TextDecoder().decode(fromB64(payload))) as Session;
    return parsed.exp > Date.now() ? parsed : null;
  } catch { return null; }
}

export function credentialsFor(role: PortalRole) {
  if (role === "learner") return { username: "learner", password: env.LEARNER_ACCESS_CODE ?? "" };
  if (role === "facilitator") return { username: env.FACILITATOR_USERNAME ?? "", password: env.FACILITATOR_PASSWORD ?? "" };
  return { username: env.ADMIN_USERNAME ?? "", password: env.ADMIN_PASSWORD ?? "" };
}

export async function safeEqual(a: string, b: string) {
  const [left, right] = await Promise.all([a, b].map(v => crypto.subtle.digest("SHA-256", encoder.encode(v))));
  const x = new Uint8Array(left), y = new Uint8Array(right);
  if (x.length !== y.length) return false;
  let diff = 0; for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
