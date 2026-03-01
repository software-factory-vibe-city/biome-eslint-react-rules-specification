import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-no-duplicate-props";
const VALID_COUNT = 12;

const RULE_MESSAGES = [
  "No duplicate props allowed",
];

const cases = [
  { code: `<App />;`, filename: "test.jsx" },
  { code: `<App {...this.props} />;`, filename: "test.jsx" },
  { code: `<App a b c />;`, filename: "test.jsx" },
  { code: `<App a b c A />;`, filename: "test.jsx" },
  { code: `<App {...this.props} a b c />;`, filename: "test.jsx" },
  { code: `<App c {...this.props} a b />;`, filename: "test.jsx" },
  { code: `<App a="c" b="b" c="a" />;`, filename: "test.jsx" },
  { code: `<App {...this.props} a="c" b="b" c="a" />;`, filename: "test.jsx" },
  { code: `<App c="a" {...this.props} a="c" b="b" />;`, filename: "test.jsx" },
  { code: `<App A a />;`, filename: "test.jsx" },
  { code: `<App A b a />;`, filename: "test.jsx" },
  { code: `<App A="a" b="b" B="B" />;`, filename: "test.jsx" },
  { code: `<App a a />;`, filename: "test.jsx" },
  { code: `<App A b c A />;`, filename: "test.jsx" },
  { code: `<App a="a" b="b" a="a" />;`, filename: "test.jsx" },
];

describe("jsx-no-duplicate-props", () => {
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
    it("valid[0]: <App />;", ({ task }) => {
      const code = `<App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 0)\n\n--- Source code under test ---\n<App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App {...this.props} />;", ({ task }) => {
      const code = `<App {...this.props} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 1)\n\n--- Source code under test ---\n<App {...this.props} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App a b c />;", ({ task }) => {
      const code = `<App a b c />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 2)\n\n--- Source code under test ---\n<App a b c />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App a b c A />;", ({ task }) => {
      const code = `<App a b c A />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 3)\n\n--- Source code under test ---\n<App a b c A />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App {...this.props} a b c />;", ({ task }) => {
      const code = `<App {...this.props} a b c />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 4)\n\n--- Source code under test ---\n<App {...this.props} a b c />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App c {...this.props} a b />;", ({ task }) => {
      const code = `<App c {...this.props} a b />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 5)\n\n--- Source code under test ---\n<App c {...this.props} a b />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App a=\"c\" b=\"b\" c=\"a\" />;", ({ task }) => {
      const code = `<App a="c" b="b" c="a" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 6)\n\n--- Source code under test ---\n<App a=\"c\" b=\"b\" c=\"a\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <App {...this.props} a=\"c\" b=\"b\" c=\"a\" />;", ({ task }) => {
      const code = `<App {...this.props} a="c" b="b" c="a" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 7)\n\n--- Source code under test ---\n<App {...this.props} a=\"c\" b=\"b\" c=\"a\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <App c=\"a\" {...this.props} a=\"c\" b=\"b\" />;", ({ task }) => {
      const code = `<App c="a" {...this.props} a="c" b="b" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 8)\n\n--- Source code under test ---\n<App c=\"a\" {...this.props} a=\"c\" b=\"b\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <App A a />;", ({ task }) => {
      const code = `<App A a />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 9)\n\n--- Source code under test ---\n<App A a />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <App A b a />;", ({ task }) => {
      const code = `<App A b a />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 10)\n\n--- Source code under test ---\n<App A b a />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <App A=\"a\" b=\"b\" B=\"B\" />;", ({ task }) => {
      const code = `<App A="a" b="b" B="B" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 11)\n\n--- Source code under test ---\n<App A=\"a\" b=\"b\" B=\"B\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App a a />;", ({ task }) => {
      const code = `<App a a />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: invalid (index 0)\n\n--- Source code under test ---\n<App a a />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDuplicateProps): No duplicate props allowed\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("No duplicate props allowed");
    });

    it("invalid[1]: <App A b c A />;", ({ task }) => {
      const code = `<App A b c A />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: invalid (index 1)\n\n--- Source code under test ---\n<App A b c A />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDuplicateProps): No duplicate props allowed\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("No duplicate props allowed");
    });

    it("invalid[2]: <App a=\"a\" b=\"b\" a=\"a\" />;", ({ task }) => {
      const code = `<App a="a" b="b" a="a" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: invalid (index 2)\n\n--- Source code under test ---\n<App a=\"a\" b=\"b\" a=\"a\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDuplicateProps): No duplicate props allowed\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("No duplicate props allowed");
    });

  });
});
