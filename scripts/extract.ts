import { createRequire } from "node:module";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";

// ---- Exported interfaces ----

export interface ExtractedError {
  messageId?: string;
  message?: string;
  data?: Record<string, string>;
  resolvedMessage: string;
}

export interface ExtractedTestCase {
  code: string;
  originalIndex: number;
  type: "valid" | "invalid";
  errors?: ExtractedError[];
  options?: unknown[];
  settings?: Record<string, unknown>;
  features?: string[];
  output?: string;
  skipReason?: string;
}

export interface ExtractedRule {
  name: string;
  sourceFile: string;
  testFile: string;
  messages: Record<string, string>;
  valid: ExtractedTestCase[];
  invalid: ExtractedTestCase[];
}

// ---- Message template resolution ----

function resolveMessage(
  template: string,
  data?: Record<string, string>
): string {
  if (!data) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    return key in data ? String(data[key]) : `{{${key}}}`;
  });
}

// ---- Normalize raw test cases ----

function normalizeError(
  rawError: any,
  messages: Record<string, string>
): ExtractedError {
  // Error object with messageId
  if (rawError.messageId) {
    const template = messages[rawError.messageId] ?? rawError.messageId;
    return {
      messageId: rawError.messageId,
      data: rawError.data,
      resolvedMessage: resolveMessage(template, rawError.data),
    };
  }
  // Error object with message directly
  if (rawError.message) {
    return {
      message: rawError.message,
      resolvedMessage: rawError.message,
    };
  }
  // String error
  if (typeof rawError === "string") {
    return {
      message: rawError,
      resolvedMessage: rawError,
    };
  }
  // Unknown format
  return {
    resolvedMessage: "[unknown error format]",
  };
}

function normalizeCases(
  rawCases: any[],
  type: "valid" | "invalid",
  messages: Record<string, string>
): ExtractedTestCase[] {
  const result: ExtractedTestCase[] = [];

  for (let i = 0; i < rawCases.length; i++) {
    let raw = rawCases[i];

    // String-only case → normalize to object
    if (typeof raw === "string") {
      raw = { code: raw };
    }

    // Skip non-object entries (shouldn't happen after flat, but defensive)
    if (typeof raw !== "object" || raw === null) {
      continue;
    }

    const testCase: ExtractedTestCase = {
      code: raw.code ?? "",
      originalIndex: i,
      type,
    };

    if (raw.options && raw.options.length > 0) {
      testCase.options = raw.options;
    }
    if (raw.settings && Object.keys(raw.settings).length > 0) {
      testCase.settings = raw.settings;
    }
    if (raw.features) {
      testCase.features = Array.isArray(raw.features)
        ? raw.features
        : [raw.features];
    }
    if (raw.output !== undefined) {
      testCase.output = raw.output;
    }

    // Process errors for invalid cases
    if (type === "invalid" && raw.errors) {
      if (typeof raw.errors === "number") {
        // Error count only — no message info available
        testCase.errors = Array.from({ length: raw.errors }, () => ({
          resolvedMessage: "[error count only — no message specified]",
        }));
      } else if (Array.isArray(raw.errors)) {
        testCase.errors = raw.errors.map((e: any) =>
          normalizeError(e, messages)
        );
      }
    }

    result.push(testCase);
  }

  return result;
}

// ---- Main extraction ----

export function extractAll(eslintReactDir: string): ExtractedRule[] {
  const absDir = resolve(eslintReactDir);
  const cjsRequire = createRequire(join(absDir, "package.json"));

  // Storage for captured ruleTester.run() calls, keyed by test file being loaded
  let currentTestFile = "";
  const capturedByFile = new Map<
    string,
    { runName: string; valid: any[]; invalid: any[] }
  >();

  // ---- Set up mocks ----

  // Mock parsers module — identity for all(), flat to handle conditionals
  const parsersPath = cjsRequire.resolve("./tests/helpers/parsers");
  const mockParsers = {
    all: (tests: any[]) => tests.flat(1),
    disableNewTS: (x: any) => x,
    skipDueToMultiErrorSorting: false,
    BABEL_ESLINT: "babel-eslint",
    "@BABEL_ESLINT": "@babel/eslint-parser",
    TYPESCRIPT_ESLINT: "typescript-eslint-parser",
    "@TYPESCRIPT_ESLINT": "@typescript-eslint/parser",
    babelParserOptions: (test: any, _features: any) => ({}),
  };

  cjsRequire.cache[parsersPath] = {
    id: parsersPath,
    filename: parsersPath,
    loaded: true,
    exports: mockParsers,
    parent: null,
    children: [],
    paths: [],
    path: "",
    isPreloading: false,
    require: cjsRequire,
  } as any;

  // Mock RuleTester module
  const ruleTesterPath = cjsRequire.resolve("./tests/helpers/ruleTester");
  const RULE_DEFINER = Symbol.for("react.RuleTester.RuleDefiner");

  class MockRuleTester {
    [key: symbol]: any;
    constructor(_config?: any) {
      // Provide RULE_DEFINER so getRuleDefiner() helper works
      this[RULE_DEFINER] = {
        defineRule: (_ruleId: string, _rule: any) => {},
      };
    }
    run(
      name: string,
      _rule: any,
      tests: { valid: any[]; invalid: any[] }
    ) {
      capturedByFile.set(currentTestFile, {
        runName: name,
        valid: tests.valid ?? [],
        invalid: tests.invalid ?? [],
      });
    }
  }

  cjsRequire.cache[ruleTesterPath] = {
    id: ruleTesterPath,
    filename: ruleTesterPath,
    loaded: true,
    exports: MockRuleTester,
    parent: null,
    children: [],
    paths: [],
    path: "",
    isPreloading: false,
    require: cjsRequire,
  } as any;

  // Mock getRuleDefiner helper — returns an object with a no-op defineRule
  const getRuleDefinerPath = cjsRequire.resolve(
    "./tests/helpers/getRuleDefiner"
  );
  cjsRequire.cache[getRuleDefinerPath] = {
    id: getRuleDefinerPath,
    filename: getRuleDefinerPath,
    loaded: true,
    exports: (_ruleTester: any) => ({
      defineRule: (_ruleId: string, _rule: any) => {},
    }),
    parent: null,
    children: [],
    paths: [],
    path: "",
    isPreloading: false,
    require: cjsRequire,
  } as any;

  // Mock getESLintCoreRule helper — returns a no-op rule
  const getESLintCoreRulePath = cjsRequire.resolve(
    "./tests/helpers/getESLintCoreRule"
  );
  cjsRequire.cache[getESLintCoreRulePath] = {
    id: getESLintCoreRulePath,
    filename: getESLintCoreRulePath,
    loaded: true,
    exports: (_ruleId: string) => ({
      meta: { messages: {} },
      create: () => ({}),
    }),
    parent: null,
    children: [],
    paths: [],
    path: "",
    isPreloading: false,
    require: cjsRequire,
  } as any;

  // ---- Load test files ----
  const testDir = join(absDir, "tests/lib/rules");
  const testFiles = readdirSync(testDir)
    .filter((f) => f.endsWith(".js"))
    .sort();

  const loadErrors: Array<{ file: string; error: string }> = [];

  for (const file of testFiles) {
    const testPath = join(testDir, file);
    const ruleName = file.replace(".js", "");
    currentTestFile = ruleName;
    try {
      // Clear cache so each file is freshly loaded
      delete cjsRequire.cache[testPath];
      cjsRequire(testPath);
    } catch (e: any) {
      loadErrors.push({ file, error: e.message ?? String(e) });
    }
  }

  if (loadErrors.length > 0) {
    console.error(
      `\nFailed to load ${loadErrors.length} test file(s):`
    );
    for (const { file, error } of loadErrors) {
      console.error(`  ${file}: ${error}`);
    }
  }

  // ---- Load rules for messages ----
  const rulesDir = join(absDir, "lib/rules");
  const ruleFiles = readdirSync(rulesDir)
    .filter((f) => f.endsWith(".js") && f !== "index.js")
    .sort();

  const results: ExtractedRule[] = [];

  for (const file of ruleFiles) {
    const ruleName = file.replace(".js", "");
    const rulePath = join(rulesDir, file);

    // Load rule to get meta.messages
    let messages: Record<string, string> = {};
    try {
      // Clear cache to get fresh module
      delete cjsRequire.cache[rulePath];
      const ruleModule = cjsRequire(rulePath);
      messages = ruleModule.meta?.messages ?? {};
    } catch (e: any) {
      console.error(`Failed to load rule ${file}: ${e.message}`);
    }

    // Match by filename (test file name matches rule file name)
    const captured = capturedByFile.get(ruleName);

    if (!captured) {
      console.warn(`No test data captured for rule: ${ruleName}`);
      continue;
    }

    const valid = normalizeCases(captured.valid, "valid", messages);
    const invalid = normalizeCases(captured.invalid, "invalid", messages);

    results.push({
      name: ruleName,
      sourceFile: `lib/rules/${file}`,
      testFile: `tests/lib/rules/${file}`,
      messages,
      valid,
      invalid,
    });
  }

  console.log(
    `\nExtracted ${results.length} rules, ${capturedByFile.size} test suites captured`
  );
  console.log(
    `Total: ${results.reduce((s, r) => s + r.valid.length, 0)} valid cases, ${results.reduce((s, r) => s + r.invalid.length, 0)} invalid cases`
  );

  return results;
}
