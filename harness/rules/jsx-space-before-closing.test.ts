import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "A space is forbidden before closing bracket",
  "A space is required before closing bracket",
];

describe("jsx-space-before-closing", () => {
  describe("valid", () => {
    it("valid[0]: <App />", async ({ task }) => {
      const code = `<App />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 0)\n\n--- Source code under test ---\n<App />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App foo />", async ({ task }) => {
      const code = `<App foo />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 1)\n\n--- Source code under test ---\n<App foo />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App foo={bar} />", async ({ task }) => {
      const code = `<App foo={bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 2)\n\n--- Source code under test ---\n<App foo={bar} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App {...props} />", async ({ task }) => {
      const code = `<App {...props} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 3)\n\n--- Source code under test ---\n<App {...props} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App></App>", async ({ task }) => {
      const code = `<App></App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 4)\n\n--- Source code under test ---\n<App></App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App foo={bar} />", async ({ task }) => {
      const code = `
        <App
          foo={bar}
        />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: valid (index 5)\n\n--- Source code under test ---\n\n        <App\n          foo={bar}\n        />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App/>", async ({ task }) => {
      const code = `<App/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: invalid (index 0)\n\n--- Source code under test ---\n<App/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: needSpaceBeforeClose): A space is required before closing bracket\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A space is required before closing bracket");
    });

    it("invalid[1]: <App foo/>", async ({ task }) => {
      const code = `<App foo/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: invalid (index 1)\n\n--- Source code under test ---\n<App foo/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: needSpaceBeforeClose): A space is required before closing bracket\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A space is required before closing bracket");
    });

    it("invalid[2]: <App foo={bar}/>", async ({ task }) => {
      const code = `<App foo={bar}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: invalid (index 2)\n\n--- Source code under test ---\n<App foo={bar}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: needSpaceBeforeClose): A space is required before closing bracket\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A space is required before closing bracket");
    });

    it("invalid[3]: <App {...props}/>", async ({ task }) => {
      const code = `<App {...props}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-space-before-closing\nType: invalid (index 3)\n\n--- Source code under test ---\n<App {...props}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: needSpaceBeforeClose): A space is required before closing bracket\n\nRule message templates:\n  noSpaceBeforeClose: A space is forbidden before closing bracket\n  needSpaceBeforeClose: A space is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-space-before-closing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A space is required before closing bracket");
    });

  });
});
