// Config + token storage (ADR-001 §Config & token). Two plain files under one dir:
//   config.json  — non-secret metadata (safe to read/back up/move machine)
//   token.json   — the Device Token, chmod 0600
//
// Token access goes through get/set/clearToken — the "TokenStore" seam. v1 is the
// 0600 file; a KeychainTokenStore can drop in here later (Invariant 5 "replaceable")
// with zero change to callers. No native dependency in v1 — works on headless Linux
// (Docker/WSL/CI) where an OS keychain doesn't exist.
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

// Hosted Forge MCP endpoint (overridable via config.server / --server / FORGE_SERVER).
export const DEFAULT_SERVER = "https://mmvdabzadclebfxyzudg.supabase.co/functions/v1/forge-mcp";
export const DASHBOARD_URL = "https://forgeengine.app";

function baseDir() {
  if (process.env.FORGE_CONFIG) return process.env.FORGE_CONFIG;
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "Forge");
  }
  return path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config"), "forge");
}
const configPath = () => path.join(baseDir(), "config.json");
const tokenPath = () => path.join(baseDir(), "token.json");
const ensureDir = () => fs.mkdirSync(baseDir(), { recursive: true });

export function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath(), "utf8"));
  } catch {
    return {};
  }
}
export function writeConfig(obj) {
  ensureDir();
  fs.writeFileSync(configPath(), JSON.stringify({ version: 1, ...obj }, null, 2));
}

// --- TokenStore (file impl) -------------------------------------------------
export function getToken() {
  if (process.env.FORGE_TOKEN) return process.env.FORGE_TOKEN; // CI/headless override
  try {
    return JSON.parse(fs.readFileSync(tokenPath(), "utf8")).token || null;
  } catch {
    return null;
  }
}
export function setToken(token) {
  ensureDir();
  fs.writeFileSync(tokenPath(), JSON.stringify({ token }, null, 2), { mode: 0o600 });
  try {
    fs.chmodSync(tokenPath(), 0o600); // enforce even if the file pre-existed with looser perms
  } catch {
    /* best effort (e.g. Windows) */
  }
}
export function clearToken() {
  try {
    fs.rmSync(tokenPath());
  } catch {
    /* already gone */
  }
}

export function paths() {
  return { dir: baseDir(), config: configPath(), token: tokenPath() };
}
export function serverUrl() {
  return process.env.FORGE_SERVER || getConfig().server || DEFAULT_SERVER;
}
