// Transport adapter (ADR-001 §forge mcp). The `forge mcp` proxy talks to the hosted
// Forge MCP through this seam — NOT directly to a concrete transport — so a future
// `NativeTransport` (or a different protocol) drops in without touching the CLI
// (Invariant 5 "replaceable"). We do NOT depend on `mcp-remote`; v1 wraps the official
// MCP SDK's Streamable HTTP client transport.
//
// interface Transport { start(); send(msg); close(); set onmessage/onclose/onerror }
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export class RemoteTransport {
  constructor({ url, token }) {
    // The Device Token rides as a Bearer header on every request to the hosted server.
    this.inner = new StreamableHTTPClientTransport(new URL(url), {
      requestInit: { headers: { Authorization: `Bearer ${token}` } },
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
