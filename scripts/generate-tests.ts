import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { extractAll, type ExtractedRule, type ExtractedTestCase } from "./extract.ts";

// ---- Configuration ----

const INCLUDE_FEATURES = new Set([
  "ts",
  "types",
  "decorators",
  "class fields",
  "optional chaining",
  "nullish coalescing",
  "fragment",
]);

const SKIP_FEATURES = new Set(["flow"]);

// ---- Skip logic ----

function shouldSkip(testCase: ExtractedTestCase): string | null {
  // Skip if features includes 'flow'
  if (testCase.features) {
    for (const f of testCase.features) {
      if (SKIP_FEATURES.has(f)) {
        return `feature: ${f}`;
      }
    }
  }

  // Skip if options is non-empty
  if (testCase.options && testCase.options.length > 0) {
    return "has options";
  }

  // Skip if settings is non-empty
  if (testCase.settings && Object.keys(testCase.settings).length > 0) {
    return "has settings";
  }

  return null;
}

// ---- Code generation helpers ----

function escapeTemplateLiteral(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

function truncate(str: string, maxLen: number): string {
  // Collapse whitespace for display
  const collapsed = str.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLen) return collapsed;
  return collapsed.slice(0, maxLen - 3) + "...";
}

function escapeTestName(str: string): string {
  // Escape characters that break test name strings
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function hasTypeScriptFeatures(testCase: ExtractedTestCase): boolean {
  if (!testCase.features) return false;
  return testCase.features.some(
    (f) => f === "ts" || f === "types"
  );
}

function getFilename(testCase: ExtractedTestCase): string {
  return hasTypeScriptFeatures(testCase) ? "test.tsx" : "test.jsx";
}

/**
 * Build a rich explanation string that gives the agent full context about
 * the original eslint-plugin-react test case. The agent never sees the
 * original test files, so this is the only source of truth it gets.
 */
function buildExplanation(
  rule: ExtractedRule,
  testCase: ExtractedTestCase
): string {
  const parts: string[] = [];

  parts.push(`Rule: ${rule.name}`);
  parts.push(`Type: ${testCase.type} (index ${testCase.originalIndex})`);
  parts.push(``);
  parts.push(`--- Source code under test ---`);
  parts.push(testCase.code);
  parts.push(``);

  if (testCase.type === "valid") {
    parts.push(
      `This code is VALID — the rule should produce NO diagnostics for it.`
    );
  } else {
    const errors = testCase.errors ?? [];
    parts.push(
      `This code is INVALID — the rule should produce ${errors.length} diagnostic(s):`
    );
    for (let i = 0; i < errors.length; i++) {
      const err = errors[i];
      const idInfo = err.messageId ? ` (messageId: ${err.messageId})` : "";
      parts.push(`  [${i}]${idInfo}: ${err.resolvedMessage}`);
    }
  }

  if (testCase.features && testCase.features.length > 0) {
    parts.push(``);
    parts.push(`Features: ${testCase.features.join(", ")}`);
  }

  // Include the rule's full message map so the agent knows what messages exist
  const messageEntries = Object.entries(rule.messages);
  if (messageEntries.length > 0) {
    parts.push(``);
    parts.push(`Rule message templates:`);
    for (const [id, template] of messageEntries) {
      parts.push(`  ${id}: ${template}`);
    }
  }

  return parts.join("\n");
}

// ---- Generate a single test file ----

function generateTestFile(rule: ExtractedRule): string {
  const validCases = rule.valid.filter((c) => !shouldSkip(c));
  const invalidCases = rule.invalid.filter((c) => !shouldSkip(c));

  // Collect all unique resolved messages for RULE_MESSAGES
  const allMessages = new Set<string>();
  for (const [, template] of Object.entries(rule.messages)) {
    allMessages.add(template);
  }
  // Also include resolved messages from invalid cases
  for (const c of rule.invalid) {
    if (c.errors) {
      for (const e of c.errors) {
        if (e.resolvedMessage && !e.resolvedMessage.startsWith("[")) {
          allMessages.add(e.resolvedMessage);
        }
      }
    }
  }

  const lines: string[] = [];

  lines.push(`import { describe, it, expect } from "vitest";`);
  lines.push(`import { lint, ruleErrors } from "../utils.ts";`);
  lines.push(``);
  lines.push(
    `const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();`
  );
  lines.push(``);

  // RULE_MESSAGES array
  lines.push(`const RULE_MESSAGES = [`);
  for (const msg of allMessages) {
    lines.push(`  ${JSON.stringify(msg)},`);
  }
  lines.push(`];`);
  lines.push(``);

  lines.push(`describe(${JSON.stringify(rule.name)}, () => {`);

  // Valid cases
  if (validCases.length > 0) {
    lines.push(`  describe("valid", () => {`);
    for (const testCase of validCases) {
      const testName = escapeTestName(
        `valid[${testCase.originalIndex}]: ${truncate(testCase.code, 60)}`
      );
      const filename = getFilename(testCase);
      const escapedCode = escapeTemplateLiteral(testCase.code);

      lines.push(
        `    it("${testName}", async ({ task }) => {`
      );
      lines.push(`      const code = \`${escapedCode}\`;`);
      lines.push(`      task.meta.source = code;`);
      lines.push(
        `      task.meta.explanation = ${JSON.stringify(buildExplanation(rule, testCase))};`
      );
      lines.push(
        `      const diags = await lint(PROJECT_DIR, code, ${JSON.stringify(filename)});`
      );
      lines.push(
        `      const matches = ruleErrors(diags, ${JSON.stringify(rule.name)}, RULE_MESSAGES);`
      );
      lines.push(`      expect(matches).toHaveLength(0);`);
      lines.push(`    });`);
      lines.push(``);
    }
    lines.push(`  });`);
    lines.push(``);
  }

  // Invalid cases
  if (invalidCases.length > 0) {
    lines.push(`  describe("invalid", () => {`);
    for (const testCase of invalidCases) {
      const errors = testCase.errors ?? [];
      const testName = escapeTestName(
        `invalid[${testCase.originalIndex}]: ${truncate(testCase.code, 60)}`
      );
      const filename = getFilename(testCase);
      const escapedCode = escapeTemplateLiteral(testCase.code);

      lines.push(
        `    it("${testName}", async ({ task }) => {`
      );
      lines.push(`      const code = \`${escapedCode}\`;`);
      lines.push(`      task.meta.source = code;`);
      lines.push(
        `      task.meta.explanation = ${JSON.stringify(buildExplanation(rule, testCase))};`
      );
      lines.push(
        `      const diags = await lint(PROJECT_DIR, code, ${JSON.stringify(filename)});`
      );
      lines.push(
        `      const matches = ruleErrors(diags, ${JSON.stringify(rule.name)}, RULE_MESSAGES);`
      );
      lines.push(`      expect(matches).toHaveLength(${errors.length});`);

      // Check each error's message
      for (let i = 0; i < errors.length; i++) {
        const err = errors[i];
        if (
          err.resolvedMessage &&
          !err.resolvedMessage.startsWith("[")
        ) {
          lines.push(
            `      expect(matches[${i}].message).toBe(${JSON.stringify(err.resolvedMessage)});`
          );
        }
      }

      lines.push(`    });`);
      lines.push(``);
    }
    lines.push(`  });`);
  }

  lines.push(`});`);
  lines.push(``);

  return lines.join("\n");
}

// ---- Main ----

function main() {
  const eslintReactDir = process.argv[2];
  if (!eslintReactDir) {
    console.error(
      "Usage: npx tsx generate-tests.ts /path/to/eslint-plugin-react"
    );
    process.exit(1);
  }

  const absEslintDir = resolve(eslintReactDir);
  console.log(`Reading from: ${absEslintDir}`);

  const rules = extractAll(absEslintDir);

  // Output directory
  const outputDir = resolve(
    import.meta.dirname ?? ".",
    "..",
    "harness",
    "rules"
  );
  mkdirSync(outputDir, { recursive: true });

  let totalGenerated = 0;
  let totalSkippedValid = 0;
  let totalSkippedInvalid = 0;
  let totalValidCases = 0;
  let totalInvalidCases = 0;

  for (const rule of rules) {
    const validIncluded = rule.valid.filter((c) => !shouldSkip(c));
    const invalidIncluded = rule.invalid.filter((c) => !shouldSkip(c));
    const validSkipped = rule.valid.length - validIncluded.length;
    const invalidSkipped = rule.invalid.length - invalidIncluded.length;

    totalSkippedValid += validSkipped;
    totalSkippedInvalid += invalidSkipped;
    totalValidCases += validIncluded.length;
    totalInvalidCases += invalidIncluded.length;

    // Skip rules with no includable test cases
    if (validIncluded.length === 0 && invalidIncluded.length === 0) {
      console.log(
        `  Skipping ${rule.name}: all cases filtered out (${validSkipped} valid, ${invalidSkipped} invalid skipped)`
      );
      continue;
    }

    const content = generateTestFile(rule);
    const filePath = join(outputDir, `${rule.name}.test.ts`);
    writeFileSync(filePath, content, "utf-8");
    totalGenerated++;

    if (validSkipped > 0 || invalidSkipped > 0) {
      console.log(
        `  ${rule.name}: ${validIncluded.length}+${invalidIncluded.length} cases (${validSkipped}+${invalidSkipped} skipped)`
      );
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Generated: ${totalGenerated} test files in ${outputDir}`);
  console.log(
    `Test cases: ${totalValidCases} valid, ${totalInvalidCases} invalid`
  );
  console.log(
    `Skipped: ${totalSkippedValid} valid, ${totalSkippedInvalid} invalid`
  );
}

main();
