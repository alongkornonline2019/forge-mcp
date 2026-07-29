# The Forge Runtime as a stdio MCP server, in a container.
#
# Exists for directory listing checks (Glama and friends) that verify a server
# starts and answers introspection. Running Forge for real does not need Docker —
# `npm i -g @forgeengine/cli` is the supported path, see README.md.
#
# NO CREDENTIALS ARE BAKED IN, and none are needed to pass: the hosted Forge MCP
# serves `initialize` and `tools/list` to anyone and authenticates only
# `tools/call`. The Runtime mirrors that — signed out, it starts, reports the mode
# on stderr, and proxies discovery. Do NOT "helpfully" add a token here; a token
# that is PRESENT is validated, so a placeholder would turn working public
# discovery into an authentication error.
FROM node:20-alpine

WORKDIR /app

# Dependencies first so a source edit doesn't re-resolve them. No lockfile here on
# purpose: the public connector repo mirrors src + package.json only, and the one
# dependency is the official MCP SDK.
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY src ./src

# stdio transport: the client owns this process's stdin/stdout, and every
# diagnostic goes to stderr so the JSON-RPC stream stays clean.
ENTRYPOINT ["node", "src/index.js", "mcp"]
