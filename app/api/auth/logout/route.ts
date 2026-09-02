export async function POST() {
  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", "set-cookie": "s4s_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0" } });
}
