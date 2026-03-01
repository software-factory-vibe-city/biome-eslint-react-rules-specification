import { execFile } from "node:child_process";
import { mkdirSync, writeFileSync, unlinkSync, rmSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export interface Diagnostic {
  message: string;
  severity: string;
  file?: string;
  rule?: string;
  location?: { line: number; column: number };
}

const FIXTURES_DIR = "__test_fixtures__";

/**
 * Write code to a temp file in projectDir, run biome lint --reporter=json,
 * parse output, clean up temp file.
 */
export async function lint(
  projectDir: string,
  code: string,
  filename: string = "test.jsx"
): Promise<Diagnostic[]> {
  const fixturesDir = join(projectDir, FIXTURES_DIR);
  const filePath = join(fixturesDir, filename);

  // Ensure fixtures directory exists
  mkdirSync(fixturesDir, { recursive: true });

  // Write temp file
  writeFileSync(filePath, code, "utf-8");

  try {
    // Run biome lint with JSON reporter
    // biome lint exits non-zero when it finds lint errors, so we need to
    // handle that as a normal case
    const { stdout } = await execFileAsync(
      "npx",
      ["biome", "lint", "--reporter=json", filePath],
      {
        cwd: projectDir,
        timeout: 30_000,
        maxBuffer: 10 * 1024 * 1024,
      }
    ).catch((error: any) => {
      // biome exits with non-zero on lint errors — that's expected
      if (error.stdout) {
        return { stdout: error.stdout as string, stderr: error.stderr as string };
      }
      throw error;
    });

    return parseBiomeDiagnostics(stdout);
  } finally {
    // Clean up temp file
    try {
      unlinkSync(filePath);
    } catch {
      // Ignore cleanup errors
    }
  }
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
