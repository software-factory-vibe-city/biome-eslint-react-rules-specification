import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Dangerous property '{{name}}' found",
  "Dangerous property 'dangerouslySetInnerHTML' found",
];

describe("no-danger", () => {
  describe("valid", () => {
    it("valid[0]: <App />;", async ({ task }) => {
      const code = `<App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger\nType: valid (index 0)\n\n--- Source code under test ---\n<App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerousProp: Dangerous property '{{name}}' found";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App dangerouslySetInnerHTML={{ __html: \"\" }} />;", async ({ task }) => {
      const code = `<App dangerouslySetInnerHTML={{ __html: "" }} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger\nType: valid (index 1)\n\n--- Source code under test ---\n<App dangerouslySetInnerHTML={{ __html: \"\" }} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerousProp: Dangerous property '{{name}}' found";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <div className=\"bar\"></div>;", async ({ task }) => {
      const code = `<div className="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger\nType: valid (index 2)\n\n--- Source code under test ---\n<div className=\"bar\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerousProp: Dangerous property '{{name}}' found";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div dangerouslySetInnerHTML={{ __html: \"\" }}></div>;", async ({ task }) => {
      const code = `<div dangerouslySetInnerHTML={{ __html: "" }}></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger\nType: invalid (index 0)\n\n--- Source code under test ---\n<div dangerouslySetInnerHTML={{ __html: \"\" }}></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerousProp): Dangerous property 'dangerouslySetInnerHTML' found\n\nRule message templates:\n  dangerousProp: Dangerous property '{{name}}' found";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Dangerous property 'dangerouslySetInnerHTML' found");
    });

  });
});
