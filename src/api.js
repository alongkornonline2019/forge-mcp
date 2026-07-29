// Forge control-plane calls. The ONLY business call the Runtime makes itself is
// minting a device token at login; everything else is transparent MCP forwarding.
import { serverUrl } from "./config.js";

// Derive the forge-auth endpoint from the forge-mcp URL (same Supabase functions base).
function authUrl(server = serverUrl()) {
  return server.replace("forge-mcp", "forge-auth") + "/device-token";
}

// POST the ACCOUNT key, get back a per-device child token (raw, once). The account key
// is used here transiently and never persisted (Invariant 3).
export async function mintDeviceToken({ server, accountKey, label }) {
  let res;
  try {
    res = await fetch(authUrl(server), {
      method: "POST",
      headers: { authorization: `Bearer ${accountKey}`, "content-type": "application/json" },
      body: JSON.stringify({ label }),
    });
  } catch (e) {
    throw new Error(`Cannot reach Forge (${e.message}). Check your connection.`);
  }
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text.slice(0, 200) };
  }
  if (!res.ok) throw new Error(data.error || `device-token failed (HTTP ${res.status})`);
  return data;
}
