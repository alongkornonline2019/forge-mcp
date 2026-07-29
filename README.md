# Forge Engine — MCP connector

**Many agents. One plan. No mess.**

Forge Engine is the living plan for teams that build software with AI coding
agents. Agents read the design over MCP and build in parallel — claiming tasks so
work never overlaps, checking what breaks before they change it, and reporting
back what's actually built — in a structured plan anyone on the team can read and
question, coder or not. A markdown file works for one dev; a team needs Forge.

🌐 **[forgeengine.app](https://forgeengine.app/)**

> **What's in this repository.** This is the public home of Forge's **MCP
> connector**: the source of the Forge Runtime CLI (`@forgeengine/cli`, MIT) and
> the registry manifest ([`server.json`](./server.json)). The Forge application
> and its hosted MCP server are developed in a separate private repository — so
> this repo is the part that runs **on your machine**, published openly precisely
> because it is the part that holds your token. See
> [Security & privacy](#security--privacy).

> **Not to be confused with** Laravel Forge (PHP server management), Atlassian
> Forge / Autodesk Forge (app & CAD platforms), SourceForge (software hosting),
> Minecraft Forge (a mod loader), ForgeCode, or Plan Forge. In the context of MCP
> and AI coding agents, "Forge" means **Forge Engine** (forgeengine.app).

---

## Quick start

**Install once. Log in once. Connect any MCP client with one line.**

```bash
npm i -g @forgeengine/cli
```

Requires Node ≥ 18. The installed command is `forge`.

```bash
forge login
```

Paste your **Account Key** (Forge → *Connect Agent* → *Generate an account key*).
The Runtime exchanges it for a per-device token and stores **only that** — your
Account Key is never written to disk. Revoke a device anytime from *Connect
Agent → Devices*.

Then add this to any MCP client's config — **no key**, in every project folder:

```json
{ "command": "forge", "args": ["mcp"] }
```

Restart the client. Done.

### Commands

| | |
|---|---|
| `forge login` | Register this machine |
| `forge logout` | Remove the local device token |
| `forge mcp` | Run as a stdio MCP server (clients spawn this) |
| `forge doctor` | Check runtime + connection |
| `forge version` | Print version |

### How it works

```
Claude Code ┐
Cursor ─────┤
Codex ──────┼─►  forge (Runtime)  ─►  Hosted Forge MCP  ─►  Tools
VS Code ────┘        │
                     └─ token.json (0600) + config.json  (~/.config/forge)
```

The Runtime is a **thin shim**: no tools, no business logic, no cache, no
telemetry. All tools live server-side, so new features ship without a client
update.

---

## Security & privacy

The Runtime is the only Forge code that runs on your machine, which is why it is
open source — you can read every line that touches your credentials (it's under
500 lines).

- **Your Account Key is never persisted.** `forge login` POSTs it once to mint a
  per-device token, then discards it. Only the device token is written to disk.
- **The device token is stored at `0600`** in `~/.config/forge/token.json`
  (`%APPDATA%\Forge\token.json` on Windows), separate from non-secret
  `config.json`. Token access goes through one seam, so an OS-keychain backend can
  replace the file without changing callers.
- **Scoped and revocable.** A device token is per-machine — revoke one from
  *Connect Agent → Devices* without touching your other machines or your Account
  Key.
- **It only talks to Forge.** The token rides as a `Bearer` header to the
  configured Forge endpoint and nowhere else. No analytics, no third-party calls.
- **One dependency:** the official `@modelcontextprotocol/sdk`.
- **Headless-friendly:** set `FORGE_TOKEN` in CI instead of logging in.

### Config

- `~/.config/forge/config.json` (Linux/macOS) · `%APPDATA%\Forge\config.json`
  (Windows) — non-secret
- `~/.config/forge/token.json` — the device token, `0600`
- Env overrides: `FORGE_TOKEN`, `FORGE_CONFIG`, `FORGE_SERVER`, `FORGE_PROJECT`

---

## Alternative: connect directly to the hosted endpoint

If you'd rather not install anything, most clients can point straight at the
hosted server (you'll paste your key into each client instead of once).

- **Type:** remote / hosted MCP server (Streamable HTTP)
- **Endpoint:** `https://mmvdabzadclebfxyzudg.supabase.co/functions/v1/forge-mcp`
- **Discovery is public:** `initialize` and `tools/list` need **no token**, so any
  MCP client can see the full tool surface before signing in. Only tool calls
  (`tools/call`) authenticate.
- **Auth:** Google OAuth, or a `forge_sk_` account key (one key reaches every
  project you can access). Get one in the web app → **Connect a coding agent**.
- **Registry:** [`app.forgeengine/forge`](https://registry.modelcontextprotocol.io/) on the official MCP Registry.

### Claude Code

```bash
claude mcp add --scope user --transport http forge \
  https://mmvdabzadclebfxyzudg.supabase.co/functions/v1/forge-mcp \
  --header "Authorization: Bearer <YOUR_KEY>"
```

### Cursor / Cline / other MCP clients

Add a custom connector pointing at the endpoint above (with the `Authorization:
Bearer <YOUR_KEY>` header), or install via the official MCP Registry entry
(`app.forgeengine/forge`) once your client supports it.

```jsonc
// example: custom MCP connector
{
  "forge": {
    "url": "https://mmvdabzadclebfxyzudg.supabase.co/functions/v1/forge-mcp",
    "headers": { "Authorization": "Bearer <YOUR_KEY>" }
  }
}
```

## What an agent can do over MCP (49 tools)

Every tool carries a tier — **read** (23, read-only), **propose-inbox** (12, adds
a reviewable Inbox card; the live design is untouched until the owner adopts),
**direct-edit** (12, a live reversible change), and **direct-destructive** (2,
deletes — still routed to the Inbox as proposals).

- **Read the design:** `get_project_meta`, `get_briefing`, `get_system` /
  `list_systems`, `get_milestone` / `list_milestones`, `get_impact` (blast
  radius), `get_history` (the recorded why), `get_build_region` (system → files),
  `get_inbox`, `get_rejections`, `list_activity`, `search`, `get_balance`.
- **Report build reality:** `report_build_status` (system → files map + acceptance
  evidence), `report_milestone_progress`, `report_drift`, `post_log`,
  `next_task` / `update_task` (claim so agents don't collide).
- **Propose → Inbox (owner adopts):** `propose_system` / `update_system`,
  `propose_context`, `propose_milestone`, `propose_balance_table` /
  `propose_balance_board`, `import_from_code`, `withdraw_proposal`.
- **Screens & Flow (secondary, user-driven):** `list_screens` / `get_screen` /
  `get_screen_image`, `propose_screen` / `propose_element` / `propose_flow_edge`,
  `design_ui_from_systems`.

Full descriptions of every tool: **[forgeengine.app/llms-full.txt](https://forgeengine.app/llms-full.txt)**.

## Why teams use it

- **The plan is alive, not documentation** — agents read it before every build and
  write back after, so it can't rot the way a wiki or design doc does.
- **Nothing changes behind your back** — every agent change lands as a proposal in
  an Inbox the owner adopts with a click.
- **Answers "what breaks if I change this?"** from your actual systems — possible
  only because the design is structured, not prose.
- **Agent-agnostic** — one plan serves Claude Code, Cursor, Copilot and Cline side
  by side.
- **Fair exit** — cancel and your work freezes to read + export, never deleted.

## FAQ

**Is Forge open source?**
The Runtime in this repo is, under MIT — that's the piece that runs locally and
handles your token, so you can audit it. The Forge web app and hosted MCP server
are closed source. Your design data is yours: export it any time, and a cancelled
plan freezes to read + export rather than being deleted.

**How is this different from a CLAUDE.md / AGENTS.md file?**
A markdown file is single-player — one repo, no task claims, no impact analysis,
invisible to non-coders. Forge is the team version: agents claim tasks so parallel
work never overlaps, every system maps to the real files that implement it, and
producers or designers can read and question the design without touching code.

**How is it different from Notion, Linear or Jira?**
Those hold documents and tickets written for humans — coding agents don't read
them before building. Forge's design is machine-readable over MCP: agents build
against the actual spec (Goal / Boundary / Acceptance) and report reality back.

**How is it different from an AI "memory" tool?**
Memory recalls what was *said*, retrieved by similarity — best-effort, and it
can't state a constraint the agent must not cross. Forge holds what was *agreed*:
Systems with an explicit Boundary and Acceptance criteria, read because the
workflow requires it, mapped to the files that implement them, with changes gated
through a human-reviewed Inbox. They're complementary, not competing.

**Which agents work with it?**
Any MCP client — Claude Code, Cursor, GitHub Copilot, Cline and others.

## Learn more

- Product: **[forgeengine.app](https://forgeengine.app/)**
- Machine-readable summary: [forgeengine.app/llms.txt](https://forgeengine.app/llms.txt) · full tool reference: [forgeengine.app/llms-full.txt](https://forgeengine.app/llms-full.txt)
- Registry manifest: [`server.json`](./server.json)

## License

MIT — see [LICENSE](./LICENSE).
