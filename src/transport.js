// Transport adapter (ADR-001 §forge mcp). The `forge mcp` proxy talks to the hosted
// Forge MCP through this seam — NOT directly to a concrete transport — so a future
// `NativeTransport` (or a different protocol) drops in without touching the CLI
// (Invariant 5 "replaceable"). We do NOT depend on `mcp-remote`; v1 wraps the official
// MCP SDK's Streamable HTTP client transport.
//
// interface Transport { start(); send(msg); close(); set onmessage/onclose/onerror }
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

/**
 * The Authorization header for a request to the hosted server — or NO header at all
 * when there is no token.
 *
 * The distinction matters and is not cosmetic. The hosted server treats discovery
 * (`initialize`, `tools/list`) as public and only authenticates `tools/call`, but it
 * VALIDATES an Authorization header whenever one is present. So sending
 * `Bearer undefined` for a signed-out user turns a working public discovery into a
 * hard "invalid or revoked key" — the exact opposite of what omitting it does.
 * Signed out must mean silent, not malformed.
 */
export function authHeaders(token) {
  const t = typeof token === "string" ? token.trim() : "";
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export class RemoteTransport {
  constructor({ url, token }) {
    // The Device Token rides as a Bearer header on every request to the hosted server.
    this.inner = new StreamableHTTPClientTransport(new URL(url), {
      requestInit: { headers: authHeaders(token) },
    });
  }
  set onmessage(fn) {
    this.inner.onmessage = fn;
  }
  set onclose(fn) {
    this.inner.onclose = fn;
  }
  set onerror(fn) {
    this.inner.onerror = fn;
  }
  start() {
    return this.inner.start();
  }
  send(msg) {
    return this.inner.send(msg);
  }
  close() {
    return this.inner.close();
  }
}
