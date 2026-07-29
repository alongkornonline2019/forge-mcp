import { RUNTIME_VERSION, MCP_PROTOCOL } from "../version.js";

export async function runVersion() {
  console.log(`forge ${RUNTIME_VERSION} (MCP ${MCP_PROTOCOL})`);
}
