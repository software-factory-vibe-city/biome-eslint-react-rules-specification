import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

describe("example", () => {
  it("has a package.json", ({ task }) => {
    const pkgPath = join(PROJECT_DIR, "package.json");
    const source = readFileSync(pkgPath, "utf-8");

    task.meta.source = source;
    task.meta.filePath = pkgPath;

    const pkg = JSON.parse(source);
    expect(pkg.name).toBeDefined();
  });
});
