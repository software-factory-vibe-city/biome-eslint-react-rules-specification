import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-boolean-value";
const VALID_COUNT = 1;

const RULE_MESSAGES = [
  "Value must be omitted for boolean attribute `{{propName}}`",
  "Value must be set for boolean attribute `{{propName}}`",
  "Value must be omitted for `false` attribute: `{{propName}}`",
  "Value must be omitted for boolean attribute `foo`",
  "Value must be omitted for boolean attribute `bar`",
  "Value must be set for boolean attribute `foo`",
  "Value must be set for boolean attribute `bar`",
  "Value must be omitted for `false` attribute: `foo`",
  "Value must be omitted for `false` attribute: `bak`",
  "Value must be omitted for `false` attribute: `baz`",
  "Value must be set for boolean attribute `baz`",
];

const cases = [
  { code: `<App foo />;`, filename: "test.jsx" },
  { code: `<App foo={true} />;`, filename: "test.jsx" },
  { code: `<App foo = {true} />;`, filename: "test.jsx" },
];

describe("jsx-boolean-value", () => {
  let results: Diagnostic[][];
  let ruleActive = false;

  beforeAll(async () => {
    results = await batchLint(PROJECT_DIR, cases);

    // Check if the rule is active — at least one invalid case must fire
    const invalidResults = results.slice(VALID_COUNT);
    ruleActive = invalidResults.some(
      (diags) => ruleErrors(diags, RULE_NAME, RULE_MESSAGES).length > 0
    );
  });

  describe("valid", () => {
    it("valid[2]: <App foo />;", ({ task }) => {
      const code = `<App foo />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-boolean-value\nType: valid (index 2)\n\n--- Source code under test ---\n<App foo />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  omitBoolean: Value must be omitted for boolean attribute `{{propName}}`\n  setBoolean: Value must be set for boolean attribute `{{propName}}`\n  omitPropAndBoolean: Value must be omitted for `false` attribute: `{{propName}}`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[2]: <App foo={true} />;", ({ task }) => {
      const code = `<App foo={true} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-boolean-value\nType: invalid (index 2)\n\n--- Source code under test ---\n<App foo={true} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: omitBoolean): Value must be omitted for boolean attribute `foo`\n\nRule message templates:\n  omitBoolean: Value must be omitted for boolean attribute `{{propName}}`\n  setBoolean: Value must be set for boolean attribute `{{propName}}`\n  omitPropAndBoolean: Value must be omitted for `false` attribute: `{{propName}}`";
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Value must be omitted for boolean attribute `foo`");
    });

    it("invalid[3]: <App foo = {true} />;", ({ task }) => {
      const code = `<App foo = {true} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-boolean-value\nType: invalid (index 3)\n\n--- Source code under test ---\n<App foo = {true} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: omitBoolean): Value must be omitted for boolean attribute `foo`\n\nRule message templates:\n  omitBoolean: Value must be omitted for boolean attribute `{{propName}}`\n  setBoolean: Value must be set for boolean attribute `{{propName}}`\n  omitPropAndBoolean: Value must be omitted for `false` attribute: `{{propName}}`";
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Value must be omitted for boolean attribute `foo`");
    });

  });
});
