# Forge Engine — MCP connector

**The living design doc your AI coding agents read from — and write back to.**

Your agent doesn't have a drift problem. Your *plan* does — it lives in your head
and a doc no agent ever reads. Forge makes the plan machine-readable: structured
Systems (Goal / Boundary / Acceptance) + milestones that agents read over MCP
*before* they build, then propose changes back to — non-destructively. Design and
build stay in sync, and your team stays aligned while agents work in parallel.

🌐 **[forgeengine.app](https://forgeengine.app/)**

> This repository is the public home of Forge's **MCP connector** — its registry
> manifest ([`server.json`](./server.json)) and connection docs. The Forge
> application itself is developed in a separate private repository.

---

## Connect a coding agent (MCP)

Forge exposes your project's design to AI clients over the **Model Context
Protocol**. An agent can read your Systems, milestones, and vision, then
**propose** changes back to your Inbox — non-destructively, for you to adopt.

- **Type:** remote / hosted MCP server (Streamable HTTP)
- **Endpoint:** `https://mmvdabzadclebfxyzudg.supabase.co/functions/v1/forge-mcp`
- **Auth:** Google OAuth, or a `forge_sk_` account key
- **Get a key:** in the web app → **Connect a coding agent**
- **Registry:** [`app.forgeengine/forge`](https://registry.modelcontextprotocol.io/) on the official MCP Registry

### Claude Code / Cursor / Cline

Add it as a custom connector pointing at the endpoint above, or install via the
official MCP registry entry (`app.forgeengine/forge`) once your client supports it.

```jsonc
// example: custom MCP connector
{
  "forge": {
    "url": "https://mmvdabzadclebfxyzudg.supabase.co/functions/v1/forge-mcp"
  }
}
```

## What the agent can do

- **Read** the design: systems (Goal / Boundary / Acceptance), milestones,
  screens, project vision, and the owner's Inbox.
- **Propose** changes: new/updated systems, milestone progress, and screen/flow
  design — all land in the owner's Inbox to adopt in the web app.
- **Report** build status: map each system to the real code that implements it,
  so "what was designed" and "what was built" never fall out of sync.

## Learn more

- Product: **[forgeengine.app](https://forgeengine.app/)**
- Registry manifest: [`server.json`](./server.json)
