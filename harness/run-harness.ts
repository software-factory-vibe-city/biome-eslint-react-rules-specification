import { execFileSync } from "node:child_process";
import { resolve, join } from "node:path";

const projectDir = process.argv[2];

if (!projectDir) {
  console.error("Usage: npm test <project-dir>");
  process.exit(1);
}

execFileSync("npx", ["vitest", "run"], {
  cwd: import.meta.dirname,
  stdio: "inherit",
  env: {
    ...process.env,
    PROJECT_DIR: resolve(projectDir),
    HARNESS_REPORT_PATH: join(import.meta.dirname, "harness-report.json"),
  },
});
