import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  extractAll,
  type ExtractedRule,
  type ExtractedTestCase,
} from "./extract.ts";

// ---- Interfaces ----

interface ParsedTestCase {
  type: "valid" | "invalid";
  originalIndex: number;
  code: string;
  errorCount: number;
  messages: string[];
}

interface Discrepancy {
  type:
    | "missing_test"
    | "extra_test"
    | "code_mismatch"
    | "message_mismatch"
    | "error_count_mismatch"
    | "skip_accounting";
  testType: "valid" | "invalid";
  originalIndex: number;
  detail: string;
  original?: string;
  generated?: string;
}

interface SkippedCase {
  originalIndex: number;
  type: "valid" | "invalid";
  reason: string;
  code: string;
}

interface RuleReport {
  status: "clean" | "discrepancy";
  original: { valid: number; invalid: number };
  generated: { valid: number; invalid: number };
  skipped: SkippedCase[];
  discrepancies: Discrepancy[];
}

interface VerificationReport {
  summary: {
    rulesChecked: number;
    rulesClean: number;
    rulesWithDiscrepancies: number;
    rulesMissingTestFile: number;
    totalOriginalTests: number;
    totalGenerated: number;
    totalSkipped: number;
    totalDiscrepancies: number;
  };
  rules: Record<string, RuleReport>;
}

// ---- Duplicated helpers from generate-tests.ts ----

const SKIP_FEATURES = new Set(["flow"]);

function shouldSkip(testCase: ExtractedTestCase): string | null {
  if (testCase.features) {
    for (const f of testCase.features) {
      if (SKIP_FEATURES.has(f)) {
        return `feature: ${f}`;
      }
    }
  }
  if (testCase.options && testCase.options.length > 0) {
    return "has options";
  }
  if (testCase.settings && Object.keys(testCase.settings).length > 0) {
    return "has settings";
  }
  return null;
}

function escapeTemplateLiteral(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

// ---- Test file parser ----

function parseTestFile(filePath: string): ParsedTestCase[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const results: ParsedTestCase[] = [];

  // Regex to match the it("valid[N]: ..." or it("invalid[N]: ..." line
  const itPattern = /^\s*it\("(valid|invalid)\[(\d+)\]:/;

  // Regex to match `const code = \`...\`;` on a single line
  const codeStartPattern = /^\s*const code = `(.*)`;\s*$/;
  // Regex to match `const code = \`` (multiline start)
  const codeMultilineStartPattern = /^\s*const code = `(.*)$/;

  // Regex to match `expect(matches).toHaveLength(N);`
  const haveLengthPattern = /expect\(matches\)\.toHaveLength\((\d+)\)/;

  // Regex to match `expect(matches[N].message).toBe(...);`
  const messageBePattern =
    /expect\(matches\[\d+\]\.message\)\.toBe\((.*)\);/;

  let i = 0;
  while (i < lines.length) {
    const itMatch = lines[i].match(itPattern);
    if (!itMatch) {
      i++;
      continue;
    }

    const type = itMatch[1] as "valid" | "invalid";
    const originalIndex = parseInt(itMatch[2], 10);

    // Find the code assignment
    let code = "";
    i++;
    while (i < lines.length) {
      // Check for single-line code
      const singleMatch = lines[i].match(codeStartPattern);
      if (singleMatch) {
        code = singleMatch[1];
        i++;
        break;
      }

      // Check for multiline code start
      const multiMatch = lines[i].match(codeMultilineStartPattern);
      if (multiMatch) {
        const codeLines: string[] = [multiMatch[1]];
        i++;

        // Accumulate lines until we find the closing backtick
        while (i < lines.length) {
          const line = lines[i];
          // Check if this line ends the template literal
          // Look for a backtick that is NOT escaped (preceded by odd number of backslashes)
          const closingIndex = findUnescapedBacktick(line);
          if (closingIndex !== -1) {
            codeLines.push(line.substring(0, closingIndex));
            i++;
            break;
          }
          codeLines.push(line);
          i++;
        }
        code = codeLines.join("\n");
        break;
      }

      i++;
      // Safety: don't go past the next it() block
      if (lines[i] && itPattern.test(lines[i])) break;
    }

    // Find errorCount and messages within this test block
    let errorCount = 0;
    const messages: string[] = [];

    // Scan forward for toHaveLength and toBe within this test's scope
    const blockStart = i;
    while (i < lines.length) {
      const line = lines[i];

      // Stop at the end of the it block (closing `});`)
      if (/^\s*\}\);/.test(line) && i > blockStart) {
        i++;
        break;
      }

      const lengthMatch = line.match(haveLengthPattern);
      if (lengthMatch) {
        errorCount = parseInt(lengthMatch[1], 10);
      }

      const msgMatch = line.match(messageBePattern);
      if (msgMatch) {
        try {
          messages.push(JSON.parse(msgMatch[1]));
        } catch {
          // If JSON.parse fails, store raw
          messages.push(msgMatch[1]);
        }
      }

      i++;
    }

    results.push({ type, originalIndex, code, errorCount, messages });
  }

  return results;
}

/**
 * Find the index of the first unescaped backtick in a line.
 * An unescaped backtick has an even number (including zero) of preceding backslashes.
 */
function findUnescapedBacktick(line: string): number {
  for (let j = 0; j < line.length; j++) {
    if (line[j] === "`") {
      // Count preceding backslashes
      let backslashes = 0;
      let k = j - 1;
      while (k >= 0 && line[k] === "\\") {
        backslashes++;
        k--;
      }
      if (backslashes % 2 === 0) {
        return j;
      }
    }
  }
  return -1;
}

// ---- Diffing logic ----

function diffRule(
  rule: ExtractedRule,
  parsed: ParsedTestCase[]
): RuleReport {
  const discrepancies: Discrepancy[] = [];
  const skipped: SkippedCase[] = [];

  // Build lookup map from parsed data
  const parsedMap = new Map<string, ParsedTestCase>();
  for (const p of parsed) {
    parsedMap.set(`${p.type}:${p.originalIndex}`, p);
  }

  const allCases: ExtractedTestCase[] = [
    ...rule.valid,
    ...rule.invalid,
  ];

  let generatedValid = 0;
  let generatedInvalid = 0;

  for (const tc of allCases) {
    const key = `${tc.type}:${tc.originalIndex}`;
    const skipReason = shouldSkip(tc);

    if (skipReason) {
      skipped.push({
        originalIndex: tc.originalIndex,
        type: tc.type,
        reason: skipReason,
        code: tc.code.length > 100 ? tc.code.slice(0, 100) + "..." : tc.code,
      });

      // Verify no harness test exists for a skipped case
      if (parsedMap.has(key)) {
        discrepancies.push({
          type: "skip_accounting",
          testType: tc.type,
          originalIndex: tc.originalIndex,
          detail: `Test exists in harness but should have been skipped (${skipReason})`,
        });
      }
      continue;
    }

    // Should be included — check if it exists in parsed
    const parsedCase = parsedMap.get(key);
    if (!parsedCase) {
      discrepancies.push({
        type: "missing_test",
        testType: tc.type,
        originalIndex: tc.originalIndex,
        detail: "No skip reason and no corresponding harness test",
      });
      continue;
    }

    if (tc.type === "valid") generatedValid++;
    else generatedInvalid++;

    // Compare code
    const escapedOriginal = escapeTemplateLiteral(tc.code);
    if (escapedOriginal !== parsedCase.code) {
      discrepancies.push({
        type: "code_mismatch",
        testType: tc.type,
        originalIndex: tc.originalIndex,
        detail: "Code string differs between original and generated",
        original: escapedOriginal.length > 200
          ? escapedOriginal.slice(0, 200) + "..."
          : escapedOriginal,
        generated: parsedCase.code.length > 200
          ? parsedCase.code.slice(0, 200) + "..."
          : parsedCase.code,
      });
    }

    // Compare error count (invalid cases only)
    if (tc.type === "invalid") {
      const expectedErrors = tc.errors?.length ?? 0;
      if (expectedErrors !== parsedCase.errorCount) {
        discrepancies.push({
          type: "error_count_mismatch",
          testType: tc.type,
          originalIndex: tc.originalIndex,
          detail: `Expected ${expectedErrors} errors, harness expects ${parsedCase.errorCount}`,
          original: String(expectedErrors),
          generated: String(parsedCase.errorCount),
        });
      }

      // Compare messages
      // Filter out resolved messages that start with "[" (same logic as generator)
      const expectedMessages = (tc.errors ?? [])
        .filter(
          (e) => e.resolvedMessage && !e.resolvedMessage.startsWith("[")
        )
        .map((e) => e.resolvedMessage);

      if (expectedMessages.length !== parsedCase.messages.length) {
        discrepancies.push({
          type: "message_mismatch",
          testType: tc.type,
          originalIndex: tc.originalIndex,
          detail: `Expected ${expectedMessages.length} message assertions, found ${parsedCase.messages.length}`,
          original: JSON.stringify(expectedMessages),
          generated: JSON.stringify(parsedCase.messages),
        });
      } else {
        for (let j = 0; j < expectedMessages.length; j++) {
          if (expectedMessages[j] !== parsedCase.messages[j]) {
            discrepancies.push({
              type: "message_mismatch",
              testType: tc.type,
              originalIndex: tc.originalIndex,
              detail: `Message[${j}] differs`,
              original: expectedMessages[j],
              generated: parsedCase.messages[j],
            });
          }
        }
      }
    }
  }

  // Check for extra tests in the harness that don't correspond to any original
  for (const p of parsed) {
    const sourceArray = p.type === "valid" ? rule.valid : rule.invalid;
    if (p.originalIndex < 0 || p.originalIndex >= sourceArray.length) {
      discrepancies.push({
        type: "extra_test",
        testType: p.type,
        originalIndex: p.originalIndex,
        detail: `Harness test has originalIndex ${p.originalIndex} but source array only has ${sourceArray.length} items`,
      });
    }
  }

  return {
    status: discrepancies.length === 0 ? "clean" : "discrepancy",
    original: { valid: rule.valid.length, invalid: rule.invalid.length },
    generated: { valid: generatedValid, invalid: generatedInvalid },
    skipped,
    discrepancies,
  };
}

// ---- Main ----

function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let eslintReactDir: string | undefined;
  let outputFile: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--output" && i + 1 < args.length) {
      outputFile = args[i + 1];
      i++;
    } else if (!eslintReactDir) {
      eslintReactDir = args[i];
    }
  }

  if (!eslintReactDir) {
    console.error(
      "Usage: npx tsx scripts/verify-tests.ts /path/to/eslint-plugin-react [--output <file>]"
    );
    process.exit(1);
  }

  const absEslintDir = resolve(eslintReactDir);
  console.error(`Reading from: ${absEslintDir}`);

  // Step 1: Extract canonical data
  const rules = extractAll(absEslintDir);

  // Step 2: Enumerate generated test files
  const harnessDir = resolve(
    import.meta.dirname ?? ".",
    "..",
    "harness",
    "rules"
  );

  let harnessFiles: Set<string>;
  try {
    harnessFiles = new Set(
      readdirSync(harnessDir)
        .filter((f) => f.endsWith(".test.ts"))
        .map((f) => f.replace(".test.ts", ""))
    );
  } catch {
    console.error(`Could not read harness directory: ${harnessDir}`);
    process.exit(1);
  }

  // Step 3: Diff each rule
  const ruleReports: Record<string, RuleReport> = {};
  let totalDiscrepancies = 0;
  let rulesClean = 0;
  let rulesWithDiscrepancies = 0;
  let rulesMissingTestFile = 0;
  let totalOriginalTests = 0;
  let totalGenerated = 0;
  let totalSkipped = 0;

  for (const rule of rules) {
    totalOriginalTests += rule.valid.length + rule.invalid.length;

    const hasIncludable = [...rule.valid, ...rule.invalid].some(
      (c) => !shouldSkip(c)
    );

    if (!harnessFiles.has(rule.name)) {
      if (hasIncludable) {
        // Missing file for a rule that has includable cases
        rulesMissingTestFile++;
        ruleReports[rule.name] = {
          status: "discrepancy",
          original: {
            valid: rule.valid.length,
            invalid: rule.invalid.length,
          },
          generated: { valid: 0, invalid: 0 },
          skipped: [],
          discrepancies: [
            {
              type: "missing_test",
              testType: "valid",
              originalIndex: -1,
              detail: `No harness test file found for rule with ${rule.valid.length + rule.invalid.length} original cases`,
            },
          ],
        };
        totalDiscrepancies++;
        rulesWithDiscrepancies++;
      }
      // If all cases are skippable, not having a file is expected — skip silently
      continue;
    }

    // Remove from set to track unmatched harness files later
    harnessFiles.delete(rule.name);

    const testFilePath = join(harnessDir, `${rule.name}.test.ts`);
    const parsed = parseTestFile(testFilePath);
    const report = diffRule(rule, parsed);

    ruleReports[rule.name] = report;
    totalDiscrepancies += report.discrepancies.length;
    totalGenerated += report.generated.valid + report.generated.invalid;
    totalSkipped += report.skipped.length;

    if (report.status === "clean") {
      rulesClean++;
    } else {
      rulesWithDiscrepancies++;
    }
  }

  // Build report
  const report: VerificationReport = {
    summary: {
      rulesChecked: rules.length,
      rulesClean,
      rulesWithDiscrepancies,
      rulesMissingTestFile,
      totalOriginalTests,
      totalGenerated,
      totalSkipped,
      totalDiscrepancies,
    },
    rules: ruleReports,
  };

  // Output JSON to stdout
  const json = JSON.stringify(report, null, 2);
  process.stdout.write(json + "\n");

  // Optionally write to file
  if (outputFile) {
    writeFileSync(resolve(outputFile), json + "\n", "utf-8");
    console.error(`Report written to: ${resolve(outputFile)}`);
  }

  // Print human-readable summary to stderr
  console.error("");
  console.error("Verification complete:");
  console.error(`  ${rules.length} rules checked`);
  console.error(`  ${rulesClean} clean`);
  console.error(
    `  ${rulesWithDiscrepancies} with discrepancies (${totalDiscrepancies} total issues)`
  );
  console.error(`  ${rulesMissingTestFile} missing test files`);

  if (rulesWithDiscrepancies > 0) {
    console.error("");
    console.error("Rules with issues:");
    for (const [name, r] of Object.entries(ruleReports)) {
      if (r.status === "discrepancy") {
        const counts = new Map<string, number>();
        for (const d of r.discrepancies) {
          counts.set(d.type, (counts.get(d.type) ?? 0) + 1);
        }
        const breakdown = [...counts.entries()]
          .map(([t, c]) => `${c} ${t}`)
          .join(", ");
        console.error(
          `  ${name}: ${r.discrepancies.length} discrepancies (${breakdown})`
        );
      }
    }
  }

  // Exit code
  process.exit(totalDiscrepancies > 0 ? 1 : 0);
}

main();
