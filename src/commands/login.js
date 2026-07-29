// `forge login` — register THIS machine. Paste the Account Key once; we exchange it for
// a per-device token and store only that (Invariant 3: the Account Key never hits disk).
// Feels like `gh auth login` / `vercel login`.
//
// Not in `forge mcp`, so normal stdout is fine here.
import os from "node:os";
import readline from "node:readline";
import { spawn } from "node:child_process";
import { getConfig, writeConfig, getToken, setToken, serverUrl, DASHBOARD_URL, paths } from "../config.js";
import { mintDeviceToken } from "../api.js";

export async function runLogin(args) {
  const force = args.includes("--force");
  const directToken = flagValue(args, "--token"); // headless: store a device token directly
  const server = flagValue(args, "--server") || serverUrl();

  if (getToken() && !force && !directToken) {
    console.log("Already logged in on this machine. Use --force to re-register.");
    return;
  }

  let deviceToken, email;

  if (directToken) {
    deviceToken = directToken.trim();
  } else {
    const open = await ask(`Open ${DASHBOARD_URL} to copy your Account Key? [Y/n] `);
    if (!/^n/i.test(open.trim())) {
      openBrowser(DASHBOARD_URL);
      console.log("→ In Forge: Connect Agent → Generate an account key → Copy.");
    }
    const accountKey = await readSecret("Paste your Account Key: ");
    if (!accountKey.startsWith("forge_sk_")) {
      console.error("That doesn't look like a Forge Account Key (forge_sk_…).");
      process.exit(1);
    }
    try {
      const res = await mintDeviceToken({ server, accountKey, label: os.hostname() });
      deviceToken = res.device_token;
      email = res.member_email;
    } catch (e) {
      console.error(`✖ ${e.message}`);
      process.exit(1);
    }
    // accountKey goes out of scope here — never written anywhere.
  }

  setToken(deviceToken);
  writeConfig({ ...getConfig(), server, deviceName: os.hostname(), ...(email ? { email } : {}) });

  console.log(`\n✔ Device registered: "${os.hostname()}" — connected.`);
  console.log(`  Token stored at ${paths().token} (0600).`);
  console.log(`\nAdd this to any MCP client, once (no key needed):`);
  console.log(`  { "command": "forge", "args": ["mcp"] }`);
}

// --- tiny prompt helpers ----------------------------------------------------
function ask(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(q, (a) => { rl.close(); resolve(a); }));
}

// Read a secret from the terminal WITHOUT echoing it (only `*`). Reads raw bytes so
// PASTE works reliably (a pasted key arrives as one chunk of printable chars); handles
// Backspace/Delete, Enter, and Ctrl-C. Uses charCodeAt so there are no control chars in
// this source. Falls back to a plain line read when stdin isn't a TTY (piped/CI).
function readSecret(prompt) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(prompt);
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      const rl = readline.createInterface({ input: stdin });
      rl.question("", (a) => { rl.close(); resolve(a.trim()); });
      return;
    }
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let buf = "";
    const onData = (chunk) => {
      for (const ch of chunk) {
        const code = ch.charCodeAt(0);
        if (ch === "\r" || ch === "\n") {            // Enter → submit
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          stdout.write("\n");
          return resolve(buf.trim());
        }
        if (code === 3) {                            // Ctrl-C
          stdin.setRawMode(false);
          stdout.write("\n");
          process.exit(130);
        }
        if (code === 127 || code === 8) {            // Backspace / Delete
          if (buf) { buf = buf.slice(0, -1); stdout.write("\b \b"); }
          continue;
        }
        if (code < 32) continue;                     // ignore other control / escape bytes
        buf += ch;
        stdout.write("*");
      }
    };
    stdin.on("data", onData);
  });
}

function openBrowser(url) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
    /* user can open it manually */
  }
}
function flagValue(args, name) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
}
