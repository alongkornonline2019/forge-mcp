// `forge mcp` — run as a stdio MCP server that the AI client spawns, and transparently
// forward every JSON-RPC message to the hosted Forge MCP over HTTP (with the Device
// Token attached). This is the whole Runtime in one file: a message pump. No tools, no
// business logic, no cache (Invariant 1).
//
// Invariants enforced here:
//   2 stdout is sacred — protocol only; ALL diagnostics go to process.stderr.
//   4 never hang — no token / unreachable server => fail fast with a clear stderr line.
//   + version negotiation — refuse to forward blindly against a newer server.
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { RemoteTransport } from "../transport.js";
import { getToken, serverUrl } from "../config.js";
import { RUNTIME_VERSION, cmpSemver } from "../version.js";

const err = (s) => process.stderr.write(s.endsWith("\n") ? s : s + "\n");

export async function runMcp(args) {
  const token = getToken();
  if (!token) {
    err("Forge: not logged in. Run:  forge login");
    process.exit(1);
  }
  const url = serverUrl();
  // --project is accepted for forward-compat; per-call project_id from the agent is the
  // v1 path (account-scoped token reaches every project). Pinning is a later enhancement.
  const projectFlag = flagValue(args, "--project") || process.env.FORGE_PROJECT;
  if (projectFlag) err(`Forge: default project ${projectFlag} noted (agents may still pass project_id per call).`);

  const agent = new StdioServerTransport(); // ⇄ the AI client, over stdio
  const remote = new RemoteTransport({ url, token }); // ⇄ hosted Forge MCP, over HTTP

  let done = false;
  const die = (msg, code = 1) => {
    if (done) return;
    done = true;
    if (msg) err(msg);
    Promise.resolve()
      .then(() => remote.close())
      .catch(() => {})
      .then(() => agent.close())
      .catch(() => {})
      .finally(() => process.exit(code));
  };

  // Track the `initialize` request id so we can inspect its result for version negotiation.
  let initId = null;

  agent.onmessage = (m) => {
    if (m && m.method === "initialize") initId = m.id;
    remote.send(m).catch((e) => die(`Forge: cannot reach server (${e?.message || e}).`));
  };

  remote.onmessage = (m) => {
    // Version negotiation: the server advertises forgeMinRuntime in the initialize result.
    if (initId != null && m && m.id === initId && m.result) {
      const min = m.result?._meta?.forgeMinRuntime;
      if (min && cmpSemver(RUNTIME_VERSION, min) < 0) {
        return die(`Forge Runtime is outdated (have ${RUNTIME_VERSION}, need ${min}).\n  Update:  npm i -g @forgeengine/cli@latest`);
      }
    }
    agent.send(m).catch(() => {});
  };

  agent.onclose = () => die(null, 0); // client disconnected — clean exit
  agent.onerror = () => {};
  remote.onclose = () => die("Forge: the server closed the connection.");
  remote.onerror = (e) => die(`Forge: transport error (${e?.message || e}).`);

  try {
    await remote.start();
    await agent.start();
  } catch (e) {
    die(`Forge: failed to start (${e?.message || e}).`);
  }
}

function flagValue(args, name) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
}
