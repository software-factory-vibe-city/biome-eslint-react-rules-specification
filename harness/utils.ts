import { execFile } from "node:child_process";
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { basename, join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Resolve the biome binary path once, avoiding `npx` overhead on every call.
 * Falls back to `npx biome` if the binary can't be found directly.
 */
let _biomeBin: { cmd: string; args: string[] } | undefined;
function getBiomeBin(projectDir: string): { cmd: string; args: string[] } {
  if (_biomeBin) return _biomeBin;

  const candidates = [
    join(projectDir, "node_modules", ".bin", "biome"),
    join(projectDir, "node_modules", "@biomejs", "biome", "bin", "biome"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      _biomeBin = { cmd: candidate, args: [] };
      return _biomeBin;
    }
  }

  _biomeBin = { cmd: "npx", args: ["biome"] };
  return _biomeBin;
}

export interface Diagnostic {
  message: string;
  severity: string;
  file?: string;
  rule?: string;
  location?: { line: number; column: number };
}

const FIXTURES_DIR = "__test_fixtures__";

export interface BatchInput {
  code: string;
  filename: string;
}

/**
 * Lint multiple code snippets in a single biome invocation.
 * Writes all files with unique names, runs biome once, returns
 * per-file diagnostics in the same order as the input.
 */
export async function batchLint(
  projectDir: string,
  cases: BatchInput[]
): Promise<Diagnostic[][]> {
  if (cases.length === 0) return [];

  const fixturesDir = join(projectDir, FIXTURES_DIR);
  mkdirSync(fixturesDir, { recursive: true });

  // Write all fixture files with unique names
  const filePaths: string[] = [];
  for (let i = 0; i < cases.length; i++) {
    const ext = cases[i].filename.endsWith(".tsx") ? ".tsx" : ".jsx";
    const uniqueName = `case_${i}${ext}`;
    const filePath = join(fixturesDir, uniqueName);
    writeFileSync(filePath, cases[i].code, "utf-8");
    filePaths.push(filePath);
  }

  try {
    const biome = getBiomeBin(projectDir);
    const { stdout } = await execFileAsync(
      biome.cmd,
      [...biome.args, "lint", "--reporter=json", ...filePaths],
      {
        cwd: projectDir,
        timeout: 60_000,
        maxBuffer: 50 * 1024 * 1024,
      }
    ).catch((error: any) => {
      if (error.stdout) {
        return { stdout: error.stdout as string, stderr: error.stderr as string };
      }
      throw error;
    });

    const allDiags = parseBiomeDiagnostics(stdout);

    // Map diagnostics back to each input by filename
    const fileMap = new Map<string, number>();
    for (let i = 0; i < filePaths.length; i++) {
      fileMap.set(basename(filePaths[i]), i);
    }

    const results: Diagnostic[][] = filePaths.map(() => []);
    for (const diag of allDiags) {
      if (diag.file) {
        const name = basename(diag.file);
        const idx = fileMap.get(name);
        if (idx !== undefined) {
          results[idx].push(diag);
        }
      }
    }

    return results;
  } finally {
    for (const fp of filePaths) {
      try { unlinkSync(fp); } catch {}
    }
  }
}

/**
 * Lint a single code snippet. Spawns one biome process per call —
 * prefer batchLint() when testing multiple snippets.
 */
export async function lint(
  projectDir: string,
  code: string,
  filename: string = "test.jsx"
): Promise<Diagnostic[]> {
  const results = await batchLint(projectDir, [{ code, filename }]);
  return results[0] ?? [];
}

/**
 * Parse biome's JSON reporter output into Diagnostic[].
 * The exact format needs empirical discovery — this handles the known format.
 */
function parseBiomeDiagnostics(stdout: string): Diagnostic[] {
  if (!stdout.trim()) return [];

  let parsed: any;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    // If JSON parsing fails, try to extract diagnostics from text
    console.error("Failed to parse biome JSON output:", stdout.slice(0, 500));
    return [];
  }

  const diagnostics: Diagnostic[] = [];

  // biome --reporter=json outputs an object with a "diagnostics" array
  const items = Array.isArray(parsed)
    ? parsed
    : parsed.diagnostics ?? [];

  for (const item of items) {
    const diag: Diagnostic = {
      message: extractMessage(item),
      severity: item.severity ?? "error",
    };

    // Extract rule name from category (e.g. "lint/plugin/rule-name")
    if (item.category) {
      diag.rule = item.category;
    }

    // Extract file path
    if (item.location?.path?.file) {
      diag.file = item.location.path.file;
    }

    // Extract location
    if (item.location?.span) {
      diag.location = {
        line: item.location.span.start?.line ?? 0,
        column: item.location.span.start?.column ?? 0,
      };
    }

    diagnostics.push(diag);
  }

  return diagnostics;
}

function extractMessage(item: any): string {
  // biome diagnostics have a "description" field which may be a string
  // or a structured message
  if (typeof item.description === "string") {
    return item.description;
  }
  if (typeof item.message === "string") {
    return item.message;
  }
  // Structured message — try to concatenate text elements
  if (Array.isArray(item.message)) {
    return item.message
      .map((part: any) =>
        typeof part === "string"
          ? part
          : part.content ?? part.text ?? ""
      )
      .join("");
  }
  if (Array.isArray(item.description)) {
    return item.description
      .map((part: any) =>
        typeof part === "string"
          ? part
          : part.content ?? part.text ?? ""
      )
      .join("");
  }
  return String(item.description ?? item.message ?? "");
}

/**
 * Filter diagnostics to only those from a specific rule.
 * Tries rule identifier first (biome category), falls back to message matching.
 */
export function ruleErrors(
  diagnostics: Diagnostic[],
  ruleName: string,
  ruleMessages: string[]
): Diagnostic[] {
  // First try matching by rule category
  const byRule = diagnostics.filter((d) => {
    if (!d.rule) return false;
    // biome categories look like "lint/plugin/rule-name" or similar
    return d.rule.includes(ruleName);
  });

  if (byRule.length > 0) {
    return byRule;
  }

  // Fallback: match by message content
  return diagnostics.filter((d) =>
    ruleMessages.some((msg) => d.message.includes(msg))
  );
}
