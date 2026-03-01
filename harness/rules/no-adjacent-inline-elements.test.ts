import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-adjacent-inline-elements";
const VALID_COUNT = 14;

const RULE_MESSAGES = [
  "Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.",
];

const cases = [
  { code: `<div />;`, filename: "test.jsx" },
  { code: `<div><div></div><div></div></div>;`, filename: "test.jsx" },
  { code: `<div><p></p><div></div></div>;`, filename: "test.jsx" },
  { code: `<div><p></p><a></a></div>;`, filename: "test.jsx" },
  { code: `<div><a></a>&nbsp;<a></a></div>;`, filename: "test.jsx" },
  { code: `<div><a></a>&nbsp;some text &nbsp; <a></a></div>;`, filename: "test.jsx" },
  { code: `<div><a></a>&nbsp;some text <a></a></div>;`, filename: "test.jsx" },
  { code: `<div><a></a> <a></a></div>;`, filename: "test.jsx" },
  { code: `<div><ul><li><a></a></li><li><a></a></li></ul></div>;`, filename: "test.jsx" },
  { code: `<div><a></a> some text <a></a></div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", null, "some text");`, filename: "test.jsx" },
  { code: `React.createElement("div", undefined, [React.createElement("a"), " some text ", React.createElement("a")]);`, filename: "test.jsx" },
  { code: `React.createElement("div", undefined, [React.createElement("a"), " ", React.createElement("a")]);`, filename: "test.jsx" },
  { code: `React.createElement(a, b);`, filename: "test.jsx" },
  { code: `<div><a></a><a></a></div>;`, filename: "test.jsx" },
  { code: `<div><a></a><span></span></div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", undefined, [React.createElement("a"), React.createElement("span")]);`, filename: "test.jsx" },
];

describe("no-adjacent-inline-elements", () => {
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
    it("valid[0]: <div />;", ({ task }) => {
      const code = `<div />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 0)\n\n--- Source code under test ---\n<div />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <div><div></div><div></div></div>;", ({ task }) => {
      const code = `<div><div></div><div></div></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 1)\n\n--- Source code under test ---\n<div><div></div><div></div></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <div><p></p><div></div></div>;", ({ task }) => {
      const code = `<div><p></p><div></div></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 2)\n\n--- Source code under test ---\n<div><p></p><div></div></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <div><p></p><a></a></div>;", ({ task }) => {
      const code = `<div><p></p><a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 3)\n\n--- Source code under test ---\n<div><p></p><a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <div><a></a>&nbsp;<a></a></div>;", ({ task }) => {
      const code = `<div><a></a>&nbsp;<a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 4)\n\n--- Source code under test ---\n<div><a></a>&nbsp;<a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: no-ts-old\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <div><a></a>&nbsp;some text &nbsp; <a></a></div>;", ({ task }) => {
      const code = `<div><a></a>&nbsp;some text &nbsp; <a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 5)\n\n--- Source code under test ---\n<div><a></a>&nbsp;some text &nbsp; <a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <div><a></a>&nbsp;some text <a></a></div>;", ({ task }) => {
      const code = `<div><a></a>&nbsp;some text <a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 6)\n\n--- Source code under test ---\n<div><a></a>&nbsp;some text <a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <div><a></a> <a></a></div>;", ({ task }) => {
      const code = `<div><a></a> <a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 7)\n\n--- Source code under test ---\n<div><a></a> <a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <div><ul><li><a></a></li><li><a></a></li></ul></div>;", ({ task }) => {
      const code = `<div><ul><li><a></a></li><li><a></a></li></ul></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 8)\n\n--- Source code under test ---\n<div><ul><li><a></a></li><li><a></a></li></ul></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <div><a></a> some text <a></a></div>;", ({ task }) => {
      const code = `<div><a></a> some text <a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 9)\n\n--- Source code under test ---\n<div><a></a> some text <a></a></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: React.createElement(\"div\", null, \"some text\");", ({ task }) => {
      const code = `React.createElement("div", null, "some text");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 10)\n\n--- Source code under test ---\nReact.createElement(\"div\", null, \"some text\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"div\", undefined, [React.createElemen...", ({ task }) => {
      const code = `React.createElement("div", undefined, [React.createElement("a"), " some text ", React.createElement("a")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, [React.createElement(\"a\"), \" some text \", React.createElement(\"a\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: React.createElement(\"div\", undefined, [React.createElemen...", ({ task }) => {
      const code = `React.createElement("div", undefined, [React.createElement("a"), " ", React.createElement("a")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 12)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, [React.createElement(\"a\"), \" \", React.createElement(\"a\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(a, b);", ({ task }) => {
      const code = `React.createElement(a, b);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(a, b);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div><a></a><a></a></div>;", ({ task }) => {
      const code = `<div><a></a><a></a></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: invalid (index 0)\n\n--- Source code under test ---\n<div><a></a><a></a></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: inlineElement): Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.");
    });

    it("invalid[1]: <div><a></a><span></span></div>;", ({ task }) => {
      const code = `<div><a></a><span></span></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: invalid (index 1)\n\n--- Source code under test ---\n<div><a></a><span></span></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: inlineElement): Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.");
    });

    it("invalid[2]: React.createElement(\"div\", undefined, [React.createElemen...", ({ task }) => {
      const code = `React.createElement("div", undefined, [React.createElement("a"), React.createElement("span")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-adjacent-inline-elements\nType: invalid (index 2)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, [React.createElement(\"a\"), React.createElement(\"span\")]);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: inlineElement): Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.\n\nRule message templates:\n  inlineElement: Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Child elements which render as inline HTML elements should be separated by a space or wrapped in block level elements.");
    });

  });
});
