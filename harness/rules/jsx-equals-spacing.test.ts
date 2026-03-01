import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "There should be no space before '='",
  "There should be no space after '='",
  "A space is required before '='",
  "A space is required after '='",
];

describe("jsx-equals-spacing", () => {
  describe("valid", () => {
    it("valid[0]: <App />", async ({ task }) => {
      const code = `<App />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 0)\n\n--- Source code under test ---\n<App />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-equals-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App foo />", async ({ task }) => {
      const code = `<App foo />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 1)\n\n--- Source code under test ---\n<App foo />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-equals-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App foo=\"bar\" />", async ({ task }) => {
      const code = `<App foo="bar" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 2)\n\n--- Source code under test ---\n<App foo=\"bar\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-equals-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App foo={e => bar(e)} />", async ({ task }) => {
      const code = `<App foo={e => bar(e)} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 3)\n\n--- Source code under test ---\n<App foo={e => bar(e)} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-equals-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App {...props} />", async ({ task }) => {
      const code = `<App {...props} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: valid (index 4)\n\n--- Source code under test ---\n<App {...props} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-equals-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App foo = {bar} />", async ({ task }) => {
      const code = `<App foo = {bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-equals-spacing\nType: invalid (index 0)\n\n--- Source code under test ---\n<App foo = {bar} />\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noSpaceBefore): There should be no space before '='\n  [1] (messageId: noSpaceAfter): There should be no space after '='\n\nRule message templates:\n  noSpaceBefore: There should be no space before '='\n  noSpaceAfter: There should be no space after '='\n  needSpaceBefore: A space is required before '='\n  needSpaceAfter: A space is required after '='";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-equals-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("There should be no space before '='");
      expect(matches[1].message).toBe("There should be no space after '='");
    });

  });
});
