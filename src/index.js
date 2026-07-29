#!/usr/bin/env node
// Forge Runtime — thin CLI dispatcher (ADR-001). ZERO logic here: route to a command.
// Surface is intentionally tiny: login · logout · mcp · doctor · version.
import { runLogin } from "./commands/login.js";
import { runLogout } from "./commands/logout.js";
import { runMcp } from "./commands/mcp.js";
import { runDoctor } from "./commands/doctor.js";
import { runVersion } from "./commands/version.js";
import { RUNTIME_VERSION } from "./version.js";

const HELP = `forge ${RUNTIME_VERSION} — connect any MCP client to Forge.

Usage:
  forge login            Register this machine (paste your Account Key once)
  forge logout           Remove the local device token
  forge mcp              Run as an MCP server (what your AI client spawns)
  forge doctor           Check runtime + connection
  forge version          Print version

Connect an AI client (once, no key needed):
  { "command": "forge", "args": ["mcp"] }

Docs: https://forgeengine.app`;

const [cmd, ...args] = process.argv.slice(2);

const main = async () => {
  switch (cmd) {
    case "login": return runLogin(args);
    case "logout": return runLogout();
    case "mcp": return runMcp(args);
    case "doctor": return runDoctor();
    case "version":
    case "--version":
    case "-v": return runVersion();
    case undefined:
    case "help":
    case "--help":
    case "-h": return void console.log(HELP);
    default:
      console.error(`Unknown command: ${cmd}\n`);
      console.log(HELP);
      process.exit(1);
  }
};

main().catch((e) => {
  // `forge mcp` handles its own errors on stderr; this is the catch-all for the rest.
  process.stderr.write(`forge: ${e?.message || e}\n`);
  process.exit(1);
});
