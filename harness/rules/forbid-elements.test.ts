import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "<{{element}}> is forbidden",
  "<{{element}}> is forbidden, {{message}}",
  "<button> is forbidden",
  "<Modal> is forbidden",
  "<dotted.component> is forbidden",
  "<dotted.Component> is forbidden, that ain't cool",
  "<button> is forbidden, use <Button> instead",
  "<input> is forbidden",
  "<button> is forbidden, use <Button2> instead",
  "<_comp> is forbidden",
];

describe("forbid-elements", () => {
  describe("valid", () => {
    it("valid[0]: <button />", async ({ task }) => {
      const code = `<button />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-elements\nType: valid (index 0)\n\n--- Source code under test ---\n<button />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenElement: <{{element}}> is forbidden\n  forbiddenElement_message: <{{element}}> is forbidden, {{message}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement()", async ({ task }) => {
      const code = `React.createElement()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-elements\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement()\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenElement: <{{element}}> is forbidden\n  forbiddenElement_message: <{{element}}> is forbidden, {{message}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

});
