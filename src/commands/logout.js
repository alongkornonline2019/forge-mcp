// `forge logout` — remove the local Device Token. This does NOT revoke it server-side
// (so you can revoke a LOST machine you can't reach, from the Devices page). Same model
// as `gh auth logout`.
import { clearToken, paths } from "../config.js";

export async function runLogout() {
  clearToken();
  console.log(`Logged out — local token removed (${paths().token}).`);
  console.log("To kill it server-side, revoke this device in Forge → Connect Agent → Devices.");
}
