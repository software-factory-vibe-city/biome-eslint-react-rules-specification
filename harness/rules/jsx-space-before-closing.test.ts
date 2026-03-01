import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-space-before-closing";
const VALID_COUNT = 6;

const RULE_MESSAGES = [
  "A space is forbidden before closing bracket",
  "A space is required before closing bracket",
];

const cases = [
  { code: `<App />`, filename: "test.jsx" },
  { code: `<App foo />`, filename: "test.jsx" },
  { code: `<App foo={bar} />`, filename: "test.jsx" },
  { code: `<App {...props} />`, filename: "test.jsx" },
  { code: `<App></App>`, filename: "test.jsx" },
  { code: `
        <App
          foo={bar}
        />
      `, filename: "test.jsx" },
  { code: `<App/>`, filename: "test.jsx" },
  { code: `<App foo/>`, filename: "test.jsx" },
  { code: `<App foo={bar}/>`, filename: "test.jsx" },
  { code: `<App {...props}/>`, filename: "test.jsx" },
];

describe("jsx-space-before-closing", () => {
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
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 0)\n\n--- Source code under test ---\n<App />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App foo />", ({ task }) => {
      const code = `<App foo />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 1)\n\n--- Source code under test ---\n<App foo />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App foo={bar} />", ({ task }) => {
      const code = `<App foo={bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 2)\n\n--- Source code under test ---\n<App foo={bar} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App {...props} />", ({ task }) => {
      const code = `<App {...props} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 3)\n\n--- Source code under test ---\n<App {...props} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App></App>", ({ task }) => {
      const code = `<App></App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 4)\n\n--- Source code under test ---\n<App></App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App foo={bar} />", ({ task }) => {
      const code = `
        <App
          foo={bar}
        />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 5)\n\n--- Source code under test ---\n\n        <App\n          foo={bar}\n        />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App/>", ({ task }) => {
      const code = `<App/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: invalid (index 0)\n\n--- Source code under test ---\n<App/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: needSpaceBeforeClose): A space is required before closing bracket\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A space is required before closing bracket");
    });

    it("invalid[1]: <App foo/>", ({ task }) => {
      const code = `<App foo/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: invalid (index 1)\n\n--- Source code under test ---\n<App foo/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: needSpaceBeforeClose): A space is required before closing bracket\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A space is required before closing bracket");
    });

    it("invalid[2]: <App foo={bar}/>", ({ task }) => {
      const code = `<App foo={bar}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: invalid (index 2)\n\n--- Source code under test ---\n<App foo={bar}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: needSpaceBeforeClose): A space is required before closing bracket\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A space is required before closing bracket");
    });

    it("invalid[3]: <App {...props}/>", ({ task }) => {
      const code = `<App {...props}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: invalid (index 3)\n\n--- Source code under test ---\n<App {...props}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: needSpaceBeforeClose): A space is required before closing bracket\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A space is required before closing bracket");
    });

  });
});
