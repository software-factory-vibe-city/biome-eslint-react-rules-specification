import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "No duplicate props allowed",
];

describe("jsx-no-duplicate-props", () => {
  describe("valid", () => {
    it("valid[0]: <App />;", async ({ task }) => {
      const code = `<App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 0)\n\n--- Source code under test ---\n<App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App {...this.props} />;", async ({ task }) => {
      const code = `<App {...this.props} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 1)\n\n--- Source code under test ---\n<App {...this.props} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App a b c />;", async ({ task }) => {
      const code = `<App a b c />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 2)\n\n--- Source code under test ---\n<App a b c />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App a b c A />;", async ({ task }) => {
      const code = `<App a b c A />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 3)\n\n--- Source code under test ---\n<App a b c A />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App {...this.props} a b c />;", async ({ task }) => {
      const code = `<App {...this.props} a b c />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 4)\n\n--- Source code under test ---\n<App {...this.props} a b c />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App c {...this.props} a b />;", async ({ task }) => {
      const code = `<App c {...this.props} a b />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 5)\n\n--- Source code under test ---\n<App c {...this.props} a b />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App a=\"c\" b=\"b\" c=\"a\" />;", async ({ task }) => {
      const code = `<App a="c" b="b" c="a" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 6)\n\n--- Source code under test ---\n<App a=\"c\" b=\"b\" c=\"a\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <App {...this.props} a=\"c\" b=\"b\" c=\"a\" />;", async ({ task }) => {
      const code = `<App {...this.props} a="c" b="b" c="a" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 7)\n\n--- Source code under test ---\n<App {...this.props} a=\"c\" b=\"b\" c=\"a\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <App c=\"a\" {...this.props} a=\"c\" b=\"b\" />;", async ({ task }) => {
      const code = `<App c="a" {...this.props} a="c" b="b" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 8)\n\n--- Source code under test ---\n<App c=\"a\" {...this.props} a=\"c\" b=\"b\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <App A a />;", async ({ task }) => {
      const code = `<App A a />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 9)\n\n--- Source code under test ---\n<App A a />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <App A b a />;", async ({ task }) => {
      const code = `<App A b a />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 10)\n\n--- Source code under test ---\n<App A b a />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <App A=\"a\" b=\"b\" B=\"B\" />;", async ({ task }) => {
      const code = `<App A="a" b="b" B="B" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: valid (index 11)\n\n--- Source code under test ---\n<App A=\"a\" b=\"b\" B=\"B\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App a a />;", async ({ task }) => {
      const code = `<App a a />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: invalid (index 0)\n\n--- Source code under test ---\n<App a a />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDuplicateProps): No duplicate props allowed\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("No duplicate props allowed");
    });

    it("invalid[1]: <App A b c A />;", async ({ task }) => {
      const code = `<App A b c A />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: invalid (index 1)\n\n--- Source code under test ---\n<App A b c A />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDuplicateProps): No duplicate props allowed\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("No duplicate props allowed");
    });

    it("invalid[2]: <App a=\"a\" b=\"b\" a=\"a\" />;", async ({ task }) => {
      const code = `<App a="a" b="b" a="a" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-duplicate-props\nType: invalid (index 2)\n\n--- Source code under test ---\n<App a=\"a\" b=\"b\" a=\"a\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDuplicateProps): No duplicate props allowed\n\nRule message templates:\n  noDuplicateProps: No duplicate props allowed";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-duplicate-props", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("No duplicate props allowed");
    });

  });
});
