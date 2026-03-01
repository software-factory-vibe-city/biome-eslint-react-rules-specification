import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Spreading the same expression multiple times is forbidden",
];

describe("jsx-props-no-spread-multi", () => {
  describe("valid", () => {
    it("valid[0]: const a = {}; <App {...a} />", async ({ task }) => {
      const code = `
        const a = {};
        <App {...a} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: valid (index 0)\n\n--- Source code under test ---\n\n        const a = {};\n        <App {...a} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spread-multi", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: const a = {}; const b = {}; <App {...a} {...b} />", async ({ task }) => {
      const code = `
        const a = {};
        const b = {};
        <App {...a} {...b} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: valid (index 1)\n\n--- Source code under test ---\n\n        const a = {};\n        const b = {};\n        <App {...a} {...b} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spread-multi", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: const props = {}; <App {...props} {...props} />", async ({ task }) => {
      const code = `
        const props = {};
        <App {...props} {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        const props = {};\n        <App {...props} {...props} />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noMultiSpreading): Spreading the same expression multiple times is forbidden\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spread-multi", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Spreading the same expression multiple times is forbidden");
    });

    it("invalid[1]: const props = {}; <div {...props} a=\"a\" {...props} />", async ({ task }) => {
      const code = `
        const props = {};
        <div {...props} a="a" {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        const props = {};\n        <div {...props} a=\"a\" {...props} />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noMultiSpreading): Spreading the same expression multiple times is forbidden\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spread-multi", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Spreading the same expression multiple times is forbidden");
    });

    it("invalid[2]: const props = {}; <div {...props} {...props} {...props} />", async ({ task }) => {
      const code = `
        const props = {};
        <div {...props} {...props} {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spread-multi\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        const props = {};\n        <div {...props} {...props} {...props} />\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noMultiSpreading): Spreading the same expression multiple times is forbidden\n  [1] (messageId: noMultiSpreading): Spreading the same expression multiple times is forbidden\n\nRule message templates:\n  noMultiSpreading: Spreading the same expression multiple times is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spread-multi", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Spreading the same expression multiple times is forbidden");
      expect(matches[1].message).toBe("Spreading the same expression multiple times is forbidden");
    });

  });
});
