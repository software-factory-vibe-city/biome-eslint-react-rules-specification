import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-props-no-spread-multi";
const VALID_COUNT = 2;

const RULE_MESSAGES = [
  "Spreading the same expression multiple times is forbidden",
];

const cases = [
  { code: `
        const a = {};
        <App {...a} />
      `, filename: "test.jsx" },
  { code: `
        const a = {};
        const b = {};
        <App {...a} {...b} />
      `, filename: "test.jsx" },
  { code: `
        const props = {};
        <App {...props} {...props} />
      `, filename: "test.jsx" },
  { code: `
        const props = {};
        <div {...props} a="a" {...props} />
      `, filename: "test.jsx" },
  { code: `
        const props = {};
        <div {...props} {...props} {...props} />
      `, filename: "test.jsx" },
];

describe("jsx-props-no-spread-multi", () => {
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
    it("valid[0]: const a = {}; <App {...a} />", ({ task }) => {
      const code = `
        const a = {};
        <App {...a} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: valid (index 0)\n\n--- Source code under test ---\n\n        const a = {};\n        <App {...a} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: const a = {}; const b = {}; <App {...a} {...b} />", ({ task }) => {
      const code = `
        const a = {};
        const b = {};
        <App {...a} {...b} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: valid (index 1)\n\n--- Source code under test ---\n\n        const a = {};\n        const b = {};\n        <App {...a} {...b} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: const props = {}; <App {...props} {...props} />", ({ task }) => {
      const code = `
        const props = {};
        <App {...props} {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        const props = {};\n        <App {...props} {...props} />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noMultiSpreading): Spreading the same expression multiple times is forbidden\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Spreading the same expression multiple times is forbidden");
    });

    it("invalid[1]: const props = {}; <div {...props} a=\"a\" {...props} />", ({ task }) => {
      const code = `
        const props = {};
        <div {...props} a="a" {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        const props = {};\n        <div {...props} a=\"a\" {...props} />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noMultiSpreading): Spreading the same expression multiple times is forbidden\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Spreading the same expression multiple times is forbidden");
    });

    it("invalid[2]: const props = {}; <div {...props} {...props} {...props} />", ({ task }) => {
      const code = `
        const props = {};
        <div {...props} {...props} {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        const props = {};\n        <div {...props} {...props} {...props} />\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noMultiSpreading): Spreading the same expression multiple times is forbidden\n  [1] (messageId: noMultiSpreading): Spreading the same expression multiple times is forbidden\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Spreading the same expression multiple times is forbidden");
      expect(matches[1].message).toBe("Spreading the same expression multiple times is forbidden");
    });

  });
});
