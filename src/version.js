// Runtime + protocol version. RUNTIME_VERSION is the single source of truth for
// `forge version` and the version-negotiation handshake (ADR-001 §Version negotiation).
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

export const RUNTIME_VERSION = pkg.version;
// The MCP protocol revision this Runtime speaks (forwarded transparently to the client).
export const MCP_PROTOCOL = "2025-06-18";

// Tiny semver compare: -1 | 0 | 1. Good enough for X.Y.Z (ignores pre-release tags).
export function cmpSemver(a, b) {
  const pa = String(a).split(".").map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return 1;
    if ((pa[i] || 0) < (pb[i] || 0)) return -1;
  }
  return 0;
}
