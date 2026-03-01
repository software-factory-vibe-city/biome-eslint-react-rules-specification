import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

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

describe("jsx-boolean-value", () => {
  describe("valid", () => {
    it("valid[2]: <App foo />;", async ({ task }) => {
      const code = `<App foo />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-boolean-value\nType: valid (index 2)\n\n--- Source code under test ---\n<App foo />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  omitBoolean: Value must be omitted for boolean attribute `{{propName}}`\n  setBoolean: Value must be set for boolean attribute `{{propName}}`\n  omitPropAndBoolean: Value must be omitted for `false` attribute: `{{propName}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-boolean-value", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[2]: <App foo={true} />;", async ({ task }) => {
      const code = `<App foo={true} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-boolean-value\nType: invalid (index 2)\n\n--- Source code under test ---\n<App foo={true} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: omitBoolean): Value must be omitted for boolean attribute `foo`\n\nRule message templates:\n  omitBoolean: Value must be omitted for boolean attribute `{{propName}}`\n  setBoolean: Value must be set for boolean attribute `{{propName}}`\n  omitPropAndBoolean: Value must be omitted for `false` attribute: `{{propName}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-boolean-value", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Value must be omitted for boolean attribute `foo`");
    });

    it("invalid[3]: <App foo = {true} />;", async ({ task }) => {
      const code = `<App foo = {true} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-boolean-value\nType: invalid (index 3)\n\n--- Source code under test ---\n<App foo = {true} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: omitBoolean): Value must be omitted for boolean attribute `foo`\n\nRule message templates:\n  omitBoolean: Value must be omitted for boolean attribute `{{propName}}`\n  setBoolean: Value must be set for boolean attribute `{{propName}}`\n  omitPropAndBoolean: Value must be omitted for `false` attribute: `{{propName}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-boolean-value", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Value must be omitted for boolean attribute `foo`");
    });

  });
});
