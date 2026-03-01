import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.",
];

describe("no-adjacent-inline-elements", () => {
  describe("valid", () => {
    it("valid[0]: <div />;", async ({ task }) => {
      const code = `<div />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 0)\n\n--- Source code under test ---\n<div />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <div><div></div><div></div></div>;", async ({ task }) => {
      const code = `<div><div></div><div></div></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 1)\n\n--- Source code under test ---\n<div><div></div><div></div></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <div><p></p><div></div></div>;", async ({ task }) => {
      const code = `<div><p></p><div></div></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 2)\n\n--- Source code under test ---\n<div><p></p><div></div></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <div><p></p><a></a></div>;", async ({ task }) => {
      const code = `<div><p></p><a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 3)\n\n--- Source code under test ---\n<div><p></p><a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <div><a></a>&nbsp;<a></a></div>;", async ({ task }) => {
      const code = `<div><a></a>&nbsp;<a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 4)\n\n--- Source code under test ---\n<div><a></a>&nbsp;<a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: no-ts-old\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <div><a></a>&nbsp;some text &nbsp; <a></a></div>;", async ({ task }) => {
      const code = `<div><a></a>&nbsp;some text &nbsp; <a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 5)\n\n--- Source code under test ---\n<div><a></a>&nbsp;some text &nbsp; <a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <div><a></a>&nbsp;some text <a></a></div>;", async ({ task }) => {
      const code = `<div><a></a>&nbsp;some text <a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 6)\n\n--- Source code under test ---\n<div><a></a>&nbsp;some text <a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <div><a></a> <a></a></div>;", async ({ task }) => {
      const code = `<div><a></a> <a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 7)\n\n--- Source code under test ---\n<div><a></a> <a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <div><ul><li><a></a></li><li><a></a></li></ul></div>;", async ({ task }) => {
      const code = `<div><ul><li><a></a></li><li><a></a></li></ul></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 8)\n\n--- Source code under test ---\n<div><ul><li><a></a></li><li><a></a></li></ul></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <div><a></a> some text <a></a></div>;", async ({ task }) => {
      const code = `<div><a></a> some text <a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 9)\n\n--- Source code under test ---\n<div><a></a> some text <a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: React.createElement(\"div\", null, \"some text\");", async ({ task }) => {
      const code = `React.createElement("div", null, "some text");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 10)\n\n--- Source code under test ---\nReact.createElement(\"div\", null, \"some text\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"div\", undefined, [React.createElemen...", async ({ task }) => {
      const code = `React.createElement("div", undefined, [React.createElement("a"), " some text ", React.createElement("a")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, [React.createElement(\"a\"), \" some text \", React.createElement(\"a\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: React.createElement(\"div\", undefined, [React.createElemen...", async ({ task }) => {
      const code = `React.createElement("div", undefined, [React.createElement("a"), " ", React.createElement("a")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 12)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, [React.createElement(\"a\"), \" \", React.createElement(\"a\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(a, b);", async ({ task }) => {
      const code = `React.createElement(a, b);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(a, b);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div><a></a><a></a></div>;", async ({ task }) => {
      const code = `<div><a></a><a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: invalid (index 0)\n\n--- Source code under test ---\n<div><a></a><a></a></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: inlineElement): Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.");
    });

    it("invalid[1]: <div><a></a><span></span></div>;", async ({ task }) => {
      const code = `<div><a></a><span></span></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: invalid (index 1)\n\n--- Source code under test ---\n<div><a></a><span></span></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: inlineElement): Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.");
    });

    it("invalid[2]: React.createElement(\"div\", undefined, [React.createElemen...", async ({ task }) => {
      const code = `React.createElement("div", undefined, [React.createElement("a"), React.createElement("span")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: invalid (index 2)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, [React.createElement(\"a\"), React.createElement(\"span\")]);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: inlineElement): Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-adjacent-inline-elements", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.");
    });

  });
});
