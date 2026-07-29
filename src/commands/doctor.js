// `forge doctor` — quick health check (Phase 1: Runtime + connection). Phase 3 adds
// per-client "configured?" rows + a one-tap "Configure X".
import { getToken, serverUrl, paths } from "../config.js";
import { RUNTIME_VERSION, MCP_PROTOCOL } from "../version.js";

const ok = (s) => console.log(`  ✔ ${s}`);
const bad = (s) => console.log(`  ✖ ${s}`);

export async function runDoctor() {
  console.log("Forge doctor\n");
  ok(`Forge Runtime ${RUNTIME_VERSION} (MCP ${MCP_PROTOCOL})`);

  const token = getToken();
  token ? ok(`Device token present (${paths().token})`) : bad("No device token — run: forge login");

  const url = serverUrl();
  let reachable = false;
  try {
    // Unauthenticated public discovery: initialize is allowed without a token, so a 200
    // here proves the hosted server is up and reachable.
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: MCP_PROTOCOL, capabilities: {}, clientInfo: { name: "forge-doctor", version: RUNTIME_VERSION } } }),
    });
    reachable = res.ok;
    reachable ? ok(`Hosted server reachable (${url})`) : bad(`Server returned HTTP ${res.status} (${url})`);
  } catch (e) {
    bad(`Cannot reach ${url} (${e.message})`);
  }

  console.log("");
  if (token && reachable) console.log("All good. Point a client at:  { \"command\": \"forge\", \"args\": [\"mcp\"] }");
  else console.log("Fix the ✖ items above, then re-run: forge doctor");
}
