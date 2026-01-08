import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";

const CLIENT_PORT = Number(process.env.CLIENT_PORT ?? 7000);
const SERVER_PORT = Number(process.env.SERVER_PORT ?? 6277);
const HOST = process.env.HOST ?? "0.0.0.0";
const TOKEN = process.env.MCP_PROXY_AUTH_TOKEN ?? randomBytes(32).toString("hex");
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ?? `http://localhost:${CLIENT_PORT},http://127.0.0.1:${CLIENT_PORT}`;
const isWindows = (process.platform === "win32");
const extraArgs = process.argv.slice(2); 

const env = {
  ...process.env,
  HOST,                              // bind on all interfaces inside the container
  CLIENT_PORT: String(CLIENT_PORT),  // Inspector UI
  SERVER_PORT: String(SERVER_PORT),  // Inspector proxy
  MCP_AUTO_OPEN_ENABLED: "false",    
  MCP_PROXY_AUTH_TOKEN: TOKEN,
  ALLOWED_ORIGINS,
};

const command = "npx";
const args = ["-y", "@modelcontextprotocol/inspector", "--config", "mcp.json", ...extraArgs];

const child = spawn(command, args, {
  stdio: "inherit",
  env,
  shell: isWindows, // use shell on Windows to find npx.cmd
});

const url = `http://localhost:${CLIENT_PORT}` + `/?MCP_PROXY_AUTH_TOKEN=${encodeURIComponent(TOKEN)}`; //   `&MCP_PROXY_PORT=${SERVER_PORT}` + `&MCP_PROXY_FULL_ADDRESS=ws://localhost:${SERVER_PORT}`;

if (process.env.MCP_OPEN === "1") {
  const opener = ((isWindows) ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open");
  const args =  ((isWindows) ? ["/c", "start", "", url] : [url]);
  spawn(opener, args, { stdio: "ignore", detached: true }).unref();
}

child.on("exit", (code) => process.exit(code ?? 0));
