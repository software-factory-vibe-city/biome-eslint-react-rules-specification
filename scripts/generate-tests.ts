import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { extractAll, type ExtractedRule, type ExtractedTestCase } from "./extract.ts";

// ---- Configuration ----

/** Rules deemed feasible to implement as Biome GritQL plugins. */
const ALLOWED_RULES = new Set([
  "async-server-action",
  "button-has-type",
  "checked-requires-onchange-or-readonly",
  "destructuring-assignment",
  "display-name",
  "forbid-component-props",
  "forbid-foreign-prop-types",
  "forbid-prop-types",
  "forward-ref-uses-ref",
  "hook-use-state",
  "iframe-missing-sandbox",
  "jsx-boolean-value",
  "jsx-child-element-spacing",
  "jsx-curly-brace-presence",
  "jsx-curly-spacing",
  "jsx-equals-spacing",
  "jsx-handler-names",
  "jsx-key",
  "jsx-newline",
  "jsx-no-bind",
  "jsx-no-comment-textnodes",
  "jsx-no-constructed-context-values",
  "jsx-no-duplicate-props",
  "jsx-no-leaked-render",
  "jsx-no-literals",
  "jsx-no-script-url",
  "jsx-no-target-blank",
  "jsx-no-useless-fragment",
  "jsx-pascal-case",
  "jsx-props-no-multi-spaces",
  "jsx-props-no-spread-multi",
  "jsx-props-no-spreading",
  "jsx-space-before-closing",
  "jsx-wrap-multilines",
  "no-access-state-in-setstate",
  "no-adjacent-inline-elements",
  "no-array-index-key",
  "no-arrow-function-lifecycle",
  "no-children-prop",
  "no-danger",
  "no-danger-with-children",
  "no-deprecated",
  "no-did-mount-set-state",
  "no-did-update-set-state",
  "no-direct-mutation-state",
  "no-find-dom-node",
  "no-invalid-html-attribute",
  "no-is-mounted",
  "no-multi-comp",
  "no-namespace",
  "no-object-type-as-default-prop",
  "no-redundant-should-component-update",
  "no-render-return-value",
  "no-set-state",
  "no-this-in-sfc",
  "no-typos",
  "no-unescaped-entities",
  "no-unknown-property",
  "no-unstable-nested-components",
  "no-will-update-set-state",
  "prefer-es6-class",
  "prefer-read-only-props",
  "prefer-stateless-function",
  "react-in-jsx-scope",
  "require-optimization",
  "require-render-return",
  "self-closing-comp",
  "state-in-constructor",
  "static-property-placement",
  "style-prop-object",
  "void-dom-elements-no-children",
]);

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

  lines.push(`import { describe, it, expect, beforeAll } from "vitest";`);
  lines.push(`import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";`);
  lines.push(``);
  lines.push(
    `const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();`
  );
  lines.push(``);

  lines.push(`const RULE_NAME = ${JSON.stringify(rule.name)};`);
  lines.push(`const VALID_COUNT = ${validCases.length};`);
  lines.push(``);

  // RULE_MESSAGES array
  lines.push(`const RULE_MESSAGES = [`);
  for (const msg of allMessages) {
    lines.push(`  ${JSON.stringify(msg)},`);
  }
  lines.push(`];`);
  lines.push(``);

  // Emit all cases as data arrays
  const allCases = [...validCases, ...invalidCases];

  lines.push(`const cases = [`);
  for (const testCase of allCases) {
    const filename = getFilename(testCase);
    const escapedCode = escapeTemplateLiteral(testCase.code);
    lines.push(`  { code: \`${escapedCode}\`, filename: ${JSON.stringify(filename)} },`);
  }
  lines.push(`];`);
  lines.push(``);

  lines.push(`describe(${JSON.stringify(rule.name)}, () => {`);
  lines.push(`  let results: Diagnostic[][];`);
  lines.push(`  let ruleActive = false;`);
  lines.push(``);
  lines.push(`  beforeAll(async () => {`);
  lines.push(`    results = await batchLint(PROJECT_DIR, cases);`);
  lines.push(``);
  lines.push(`    // Check if the rule is active — at least one invalid case must fire`);
  lines.push(`    const invalidResults = results.slice(VALID_COUNT);`);
  lines.push(`    ruleActive = invalidResults.some(`);
  lines.push(`      (diags) => ruleErrors(diags, RULE_NAME, RULE_MESSAGES).length > 0`);
  lines.push(`    );`);
  lines.push(`  });`);
  lines.push(``);

  // Valid cases — indices [0, validCases.length)
  if (validCases.length > 0) {
    lines.push(`  describe("valid", () => {`);
    for (let ci = 0; ci < validCases.length; ci++) {
      const testCase = validCases[ci];
      const testName = escapeTestName(
        `valid[${testCase.originalIndex}]: ${truncate(testCase.code, 60)}`
      );
      const escapedCode = escapeTemplateLiteral(testCase.code);

      lines.push(
        `    it("${testName}", ({ task }) => {`
      );
      lines.push(`      const code = \`${escapedCode}\`;`);
      lines.push(`      task.meta.source = code;`);
      lines.push(
        `      task.meta.explanation = ${JSON.stringify(buildExplanation(rule, testCase))};`
      );
      lines.push(`      expect(ruleActive, \`Rule "\${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?\`).toBe(true);`);
      lines.push(
        `      const matches = ruleErrors(results[${ci}], RULE_NAME, RULE_MESSAGES);`
      );
      lines.push(`      expect(matches).toHaveLength(0);`);
      lines.push(`    });`);
      lines.push(``);
    }
    lines.push(`  });`);
    lines.push(``);
  }

  // Invalid cases — indices [validCases.length, allCases.length)
  if (invalidCases.length > 0) {
    const offset = validCases.length;
    lines.push(`  describe("invalid", () => {`);
    for (let ci = 0; ci < invalidCases.length; ci++) {
      const testCase = invalidCases[ci];
      const errors = testCase.errors ?? [];
      const testName = escapeTestName(
        `invalid[${testCase.originalIndex}]: ${truncate(testCase.code, 60)}`
      );
      const escapedCode = escapeTemplateLiteral(testCase.code);

      lines.push(
        `    it("${testName}", ({ task }) => {`
      );
      lines.push(`      const code = \`${escapedCode}\`;`);
      lines.push(`      task.meta.source = code;`);
      lines.push(
        `      task.meta.explanation = ${JSON.stringify(buildExplanation(rule, testCase))};`
      );
      lines.push(
        `      const matches = ruleErrors(results[${offset + ci}], RULE_NAME, RULE_MESSAGES);`
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

  let totalSkippedRules = 0;

  for (const rule of rules) {
    // Only generate tests for rules deemed feasible
    if (!ALLOWED_RULES.has(rule.name)) {
      totalSkippedRules++;
      continue;
    }

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
    `Skipped cases: ${totalSkippedValid} valid, ${totalSkippedInvalid} invalid`
  );
  console.log(
    `Skipped rules (not in allowlist): ${totalSkippedRules}`
  );
}

main();
