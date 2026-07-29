# Forge Engine — MCP connector

[![npm](https://img.shields.io/npm/v/@forgeengine/cli?logo=npm&label=%40forgeengine%2Fcli)](https://www.npmjs.com/package/@forgeengine/cli)
[![license](https://img.shields.io/npm/l/@forgeengine/cli)](./LICENSE)
[![node](https://img.shields.io/node/v/@forgeengine/cli)](https://nodejs.org/)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-app.forgeengine%2Fforge-blue)](https://registry.modelcontextprotocol.io/)

**Many agents. One plan. No mess.**

Forge Engine is the living plan for teams that build software with AI coding
agents. Agents read the design over MCP and build in parallel — claiming tasks so
work never overlaps, checking what breaks before they change it, and reporting
back what's actually built — in a structured plan anyone on the team can read and
question, coder or not. A markdown file works for one dev; a team needs Forge.

🌐 **[forgeengine.app](https://forgeengine.app/)**

> **See a real design in 10 seconds, without installing anything.** A Forge
> project can publish one public link that serves its whole design as plain
> text — paste it into an AI chat and the assistant answers over the real thing.
> See [Read a design with zero setup](#read-a-design-with-zero-setup).

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

## The problem this solves

Coding agents are fast and they are amnesiac. Every session starts blank, so the
same context gets re-pasted; a decision made three sessions ago is forgotten and
quietly undone; an autonomous run reaches into a working system nobody was
watching. Add a second agent — or a second person driving one — and the failures
compound: two agents rewrite the same module, a spec everybody believed was
current turns out to describe something that shipped differently, and nobody can
say which parts of the plan are actually built.

None of that is fixed by writing a better document. A document has no way to
know whether it was read, no way to say "this system is off-limits", and no way
to notice that the code walked away from it. **Forge makes the plan a thing
agents transact with**: they read it before building, claim what they take, and
report what they changed — and every one of those steps leaves evidence a human
can check.

---

## What the loop actually gives you

**Agents start informed instead of blank.** One call returns the working
context for the task at hand: what this system is for, what it must not touch,
what "done" means for it, and who else is currently working where. That replaces
the preamble you retype every session — and unlike a pasted preamble, it is the
same context every agent gets, so two agents cannot be working from two
different versions of the truth.

**Parallel work stops colliding.** Tasks are claimed, and a claim is visible to
every other agent and person on the project. An agent that reaches for occupied
work is told so, by name, before it starts — not after both branches exist.

**Nothing lands behind your back.** Anything an agent wants to change about the
design arrives as a reviewable proposal. The live plan is untouched until a human
adopts it — and deletes go through the same gate. This is a deliberate
asymmetry: agents can propose freely because they can't apply anything, which
makes it safe to let them propose freely.

**"What breaks if I change this?" is answerable.** Because systems carry an
explicit boundary and map to the files that implement them, a change can be
scoped before an autonomous run starts rather than explained after it. Prose
documentation cannot do this at all.

**"Done" has to be earned.** A system reported as implemented is only recorded as
*verified* when its acceptance criteria are each backed by a named test — and as
*guaranteed* only when those tests were actually run and passed. Anything less is
stored as a **claim**, labelled as one, with the unbacked criteria named back to
the agent that reported it. Proof also **expires**, so "it was green once" cannot
masquerade as "it is green now". Most tooling takes an agent's word for it; this
is the part that decides whether a green dashboard means anything.

**Drift is caught from both directions.** The code can walk away from the design
(files that a system claimed to live in are gone), and — the half almost nobody
covers — the **design can move underneath working code**: someone edits a spec
after it was built and signed off, and the badge keeps claiming agreement with a
document it has never seen. Forge flags both, and it flags them to the agent
about to open the file, not only to a human who thinks to go looking.

**The "why" survives the people.** Decisions, rejections and the history behind a
system are recorded where the next agent reads them. When a proposal is declined,
the next agent finds out *that* it was declined and can bring its work back in
line, instead of cheerfully re-proposing it a week later.

**Non-coders are first-class.** Producers, designers and founders read the same
plan the agents read and ask "can we add this?" without touching a repo. Nobody
maintains a second, human-facing copy that immediately starts drifting from the
first.

**It gets more useful the longer you run it.** Day one, it's a place to write the
plan. By month three it's the recorded reasons behind every system, the proposals
you turned down, and the map from each part of the design to the code that
implements it — the context a new teammate or a fresh agent session would
otherwise have to be told, and usually isn't. That's yours: export it whenever
you like, and if you ever stop paying, the project freezes to read + export
rather than being deleted.

---

## Read a design with zero setup

MCP is the full loop, and it costs a setup. There is also a read-only lane that
costs nothing at all: a project owner can publish **one link**, and anyone — a
person or an AI chat — can read the design through it.

- Paste it into an AI chat and the assistant answers over the **real** design:
  the overview, every system's Goal / Boundary / Acceptance, and the milestone
  plan. No account, no key, no install.
- It is compiled **live** on every read and stamped with the revision it came
  from, so a share can never quietly serve last month's plan.
- **Read-only, on purpose.** An assistant reading a share cannot change anything;
  proposals still come back only through the authenticated loop and its review
  gate. A share is a way in, not a second door.
- Opt-in per project and revocable at any time. It carries no keys, no member
  identities, and no inbox or activity history.

Confirmed working when pasted into **Gemini, Claude and Grok**. **ChatGPT is a
known exception** — it does not open links of this kind, running a web search
instead and reporting that the page needs a login, though the page is public and
every other assistant reads it. The app offers a one-click copy of the document
for pasting into ChatGPT directly.

---

## Quick start

**Install once. Log in once. Connect any MCP client with one line.**

Published on npm as
**[`@forgeengine/cli`](https://www.npmjs.com/package/@forgeengine/cli)** (MIT,
Node ≥ 18). The installed command is `forge`.

```bash
npm i -g @forgeengine/cli
```

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

### Prefer not to install globally? Use `npx`

Same package, nothing added to your PATH — npm fetches and caches it on first
use:

```bash
npx -y @forgeengine/cli login
```

```json
{ "command": "npx", "args": ["-y", "@forgeengine/cli", "mcp"] }
```

Log in once either way — the device token lives in your config directory, not in
the package, so a global install and `npx` share the same session. The honest
trade-off: `npx` adds a little start-up time each time your client spawns the
server, and it wants network access the first time. A global install is snappier;
`npx` is tidier. Both are the same code.

### Upgrading

```bash
npm i -g @forgeengine/cli@latest    # or: npx -y @forgeengine/cli@latest mcp
```

New **tools** never require an upgrade — they live server-side and appear on
their own. Upgrade for changes to the local runtime itself. `forge doctor` tells
you which version you're on and whether it can reach Forge.

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

If you'd rather run no local process at all, most clients can point straight at
the hosted server. The cost is that your key goes into each client's config
instead of being exchanged once for a per-device token.

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

---

## What an agent can do over MCP (54 tools)

Every tool is tiered, and the tier is part of the contract rather than a
convention: **read** tools cannot write; **propose** tools add a reviewable card
and leave the live design untouched; **direct** tools make a live, reversible
change; and **deletes are routed to review as well** — an agent has no path to
destroy anything on its own.

- **Read the design:** project meta and briefing, systems (Goal / Boundary /
  Acceptance), milestones and next task, blast radius, recorded history,
  system → file map, the inbox, rejections, activity, search, balance data.
- **Report build reality:** build status with the system → files map and
  acceptance evidence, milestone progress, drift, build logs, and task
  claim/release so agents don't collide.
- **Propose → reviewed by the owner:** new or updated systems, design notes,
  milestones, balance tables and boards, importing an existing codebase, and
  withdrawing a proposal.
- **Screens & flow (secondary, user-driven):** screens, elements and flow edges,
  including generating a UI layout from the systems.

Full descriptions of every tool: **[forgeengine.app/llms-full.txt](https://forgeengine.app/llms-full.txt)** —
GET-fetchable, so you can hand that URL to an assistant directly.

---

## FAQ

**Is Forge open source?**
The Runtime in this repo is, under MIT — that's the piece that runs locally and
handles your token, so you can audit it. The Forge web app and hosted MCP server
are closed source. Your design data is yours: export it any time, and a cancelled
plan freezes to read + export rather than being deleted.

**Can I look at a real design before signing up?**
Yes — see [Read a design with zero setup](#read-a-design-with-zero-setup). A
published share link serves a whole project's design as text to anyone, including
an AI chat, with no account.

**How is this different from a CLAUDE.md / AGENTS.md file?**
A markdown file is single-player — one repo, no task claims, no impact analysis,
no record of what was actually built, invisible to non-coders. Forge is the team
version: agents claim tasks so parallel work never overlaps, every system maps to
the real files that implement it, "done" has to be backed by evidence, and
producers or designers can read and question the design without touching code.

**How is it different from Notion, Linear or Jira?**
Those hold documents and tickets written for humans — coding agents don't read
them before building, and nothing in them notices when the code stops matching.
Forge's design is machine-readable over MCP: agents build against the actual spec
and report reality back, and the plan flags it when the two diverge.

**How is it different from an AI "memory" tool?**
Memory recalls what was *said*, retrieved by similarity — best-effort, and it
can't state a constraint the agent must not cross. Forge holds what was *agreed*:
Systems with an explicit Boundary and Acceptance criteria, read because the
workflow requires it, mapped to the files that implement them, with changes gated
through a human-reviewed Inbox. They're complementary, not competing.

**Does it work if only some of my team uses agents?**
Yes — that's the normal case. The plan is the same object for both: agents
transact with it over MCP, people read and edit it in the web app, and the review
queue is where the two meet.

**Which agents work with it?**
Any MCP client — Claude Code, Cursor, GitHub Copilot, Cline and others.

**What does it cost?**
Open free beta, no credit card. Paid plans are flat per-team, and you bring your
own AI key so model usage is billed to you at cost rather than marked up.

---

## Learn more

- Product: **[forgeengine.app](https://forgeengine.app/)**
- Machine-readable summary: [forgeengine.app/llms.txt](https://forgeengine.app/llms.txt) · full tool reference: [forgeengine.app/llms-full.txt](https://forgeengine.app/llms-full.txt)
- Registry manifest: [`server.json`](./server.json)

## License

MIT — see [LICENSE](./LICENSE).
