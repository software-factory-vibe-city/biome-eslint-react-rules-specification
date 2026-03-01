import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-equals-spacing";
const VALID_COUNT = 5;

const RULE_MESSAGES = [
  "There should be no space before '='",
  "There should be no space after '='",
  "A space is required before '='",
  "A space is required after '='",
];

const cases = [
  { code: `<App />`, filename: "test.jsx" },
  { code: `<App foo />`, filename: "test.jsx" },
  { code: `<App foo="bar" />`, filename: "test.jsx" },
  { code: `<App foo={e => bar(e)} />`, filename: "test.jsx" },
  { code: `<App {...props} />`, filename: "test.jsx" },
  { code: `<App foo = {bar} />`, filename: "test.jsx" },
];

describe("jsx-equals-spacing", () => {
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
    it("valid[0]: <App />", ({ task }) => {
      const code = `<App />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 0)\n\n--- Source code under test ---\n<App />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App foo />", ({ task }) => {
      const code = `<App foo />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 1)\n\n--- Source code under test ---\n<App foo />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App foo=\"bar\" />", ({ task }) => {
      const code = `<App foo="bar" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 2)\n\n--- Source code under test ---\n<App foo=\"bar\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App foo={e => bar(e)} />", ({ task }) => {
      const code = `<App foo={e => bar(e)} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 3)\n\n--- Source code under test ---\n<App foo={e => bar(e)} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App {...props} />", ({ task }) => {
      const code = `<App {...props} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 4)\n\n--- Source code under test ---\n<App {...props} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App foo = {bar} />", ({ task }) => {
      const code = `<App foo = {bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: invalid (index 0)\n\n--- Source code under test ---\n<App foo = {bar} />\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noSpaceBefore): There should be no space before '='\n  [1] (messageId: noSpaceAfter): There should be no space after '='\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("There should be no space before '='");
      expect(matches[1].message).toBe("There should be no space after '='");
    });

  });
});
