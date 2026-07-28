// Wrapper because the platform supervisor passes --host which Next.js 16 rejects.
// We strip --host and its value, then forward the rest (including --port).
import { spawn } from "node:child_process";
const args = process.argv.slice(2).filter((a, i, arr) => {
  if (a === "--host") return false;
  if (arr[i - 1] === "--host") return false;
  return true;
});
const child = spawn("node_modules/.bin/next", ["dev", ...args], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
