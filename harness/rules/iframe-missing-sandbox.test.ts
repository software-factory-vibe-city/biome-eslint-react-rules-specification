import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "iframe-missing-sandbox";
const VALID_COUNT = 33;

const RULE_MESSAGES = [
  "An iframe element is missing a sandbox attribute",
  "An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"",
  "An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid",
];

const cases = [
  { code: `<div sandbox="__unknown__" />;`, filename: "test.jsx" },
  { code: `<iframe sandbox="" />;`, filename: "test.jsx" },
  { code: `<iframe sandbox={""} />`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "" });`, filename: "test.jsx" },
  { code: `<iframe src="foo.htm" sandbox></iframe>`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { src: "foo.htm", sandbox: true })`, filename: "test.jsx" },
  { code: `<iframe src="foo.htm" sandbox sandbox></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-forms"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-modals"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-orientation-lock"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-pointer-lock"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-popups"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-popups-to-escape-sandbox"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-presentation"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-same-origin"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-scripts"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-top-navigation"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-top-navigation-by-user-activation"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-forms allow-modals"></iframe>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation"></iframe>`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-forms" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-modals" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-orientation-lock" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-pointer-lock" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-popups" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-popups-to-escape-sandbox" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-presentation" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-same-origin" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-scripts" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-top-navigation" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-top-navigation-by-user-activation" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-forms allow-modals" })`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation" })`, filename: "test.jsx" },
  { code: `<iframe></iframe>;`, filename: "test.jsx" },
  { code: `<iframe/>;`, filename: "test.jsx" },
  { code: `React.createElement("iframe");`, filename: "test.jsx" },
  { code: `React.createElement("iframe", {});`, filename: "test.jsx" },
  { code: `React.createElement("iframe", null);`, filename: "test.jsx" },
  { code: `<iframe sandbox="__unknown__"></iframe>`, filename: "test.jsx" },
  { code: `React.createElement("iframe", { sandbox: "__unknown__" })`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-popups __unknown__"/>`, filename: "test.jsx" },
  { code: `<iframe sandbox="__unknown__ allow-popups"/>`, filename: "test.jsx" },
  { code: `<iframe sandbox=" allow-forms __unknown__ allow-popups __unknown__  "/>`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-scripts allow-same-origin"></iframe>;`, filename: "test.jsx" },
  { code: `<iframe sandbox="allow-same-origin allow-scripts"/>;`, filename: "test.jsx" },
];

describe("iframe-missing-sandbox", () => {
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
    it("valid[0]: <div sandbox=\"__unknown__\" />;", ({ task }) => {
      const code = `<div sandbox="__unknown__" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 0)\n\n--- Source code under test ---\n<div sandbox=\"__unknown__\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <iframe sandbox=\"\" />;", ({ task }) => {
      const code = `<iframe sandbox="" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 1)\n\n--- Source code under test ---\n<iframe sandbox=\"\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <iframe sandbox={\"\"} />", ({ task }) => {
      const code = `<iframe sandbox={""} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 2)\n\n--- Source code under test ---\n<iframe sandbox={\"\"} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: React.createElement(\"iframe\", { sandbox: \"\" });", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "" });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"\" });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <iframe src=\"foo.htm\" sandbox></iframe>", ({ task }) => {
      const code = `<iframe src="foo.htm" sandbox></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 4)\n\n--- Source code under test ---\n<iframe src=\"foo.htm\" sandbox></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"iframe\", { src: \"foo.htm\", sandbox: ...", ({ task }) => {
      const code = `React.createElement("iframe", { src: "foo.htm", sandbox: true })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { src: \"foo.htm\", sandbox: true })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <iframe src=\"foo.htm\" sandbox sandbox></iframe>", ({ task }) => {
      const code = `<iframe src="foo.htm" sandbox sandbox></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 6)\n\n--- Source code under test ---\n<iframe src=\"foo.htm\" sandbox sandbox></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <iframe sandbox=\"allow-forms\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-forms"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 7)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-forms\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <iframe sandbox=\"allow-modals\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-modals"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 8)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-modals\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <iframe sandbox=\"allow-orientation-lock\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-orientation-lock"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 9)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-orientation-lock\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <iframe sandbox=\"allow-pointer-lock\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-pointer-lock"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 10)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-pointer-lock\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <iframe sandbox=\"allow-popups\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-popups"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 11)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-popups\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <iframe sandbox=\"allow-popups-to-escape-sandbox\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-popups-to-escape-sandbox"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 12)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-popups-to-escape-sandbox\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <iframe sandbox=\"allow-presentation\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-presentation"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 13)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-presentation\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <iframe sandbox=\"allow-same-origin\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-same-origin"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 14)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-same-origin\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <iframe sandbox=\"allow-scripts\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-scripts"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 15)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-scripts\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <iframe sandbox=\"allow-top-navigation\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-top-navigation"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 16)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-top-navigation\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <iframe sandbox=\"allow-top-navigation-by-user-activation\"...", ({ task }) => {
      const code = `<iframe sandbox="allow-top-navigation-by-user-activation"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 17)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-top-navigation-by-user-activation\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <iframe sandbox=\"allow-forms allow-modals\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="allow-forms allow-modals"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 18)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-forms allow-modals\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <iframe sandbox=\"allow-popups allow-popups-to-escape-sand...", ({ task }) => {
      const code = `<iframe sandbox="allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 19)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: React.createElement(\"iframe\", { sandbox: \"allow-forms\" })", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-forms" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 20)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-forms\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: React.createElement(\"iframe\", { sandbox: \"allow-modals\" })", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-modals" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 21)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-modals\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: React.createElement(\"iframe\", { sandbox: \"allow-orientati...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-orientation-lock" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 22)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-orientation-lock\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: React.createElement(\"iframe\", { sandbox: \"allow-pointer-l...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-pointer-lock" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 23)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-pointer-lock\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: React.createElement(\"iframe\", { sandbox: \"allow-popups\" })", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-popups" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 24)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-popups\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.createElement(\"iframe\", { sandbox: \"allow-popups-to...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-popups-to-escape-sandbox" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 25)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-popups-to-escape-sandbox\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: React.createElement(\"iframe\", { sandbox: \"allow-presentat...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-presentation" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 26)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-presentation\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: React.createElement(\"iframe\", { sandbox: \"allow-same-orig...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-same-origin" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 27)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-same-origin\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: React.createElement(\"iframe\", { sandbox: \"allow-scripts\" })", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-scripts" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 28)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-scripts\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: React.createElement(\"iframe\", { sandbox: \"allow-top-navig...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-top-navigation" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 29)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-top-navigation\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: React.createElement(\"iframe\", { sandbox: \"allow-top-navig...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-top-navigation-by-user-activation" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 30)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-top-navigation-by-user-activation\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: React.createElement(\"iframe\", { sandbox: \"allow-forms all...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-forms allow-modals" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 31)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-forms allow-modals\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: React.createElement(\"iframe\", { sandbox: \"allow-popups al...", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 32)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <iframe></iframe>;", ({ task }) => {
      const code = `<iframe></iframe>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 0)\n\n--- Source code under test ---\n<iframe></iframe>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[1]: <iframe/>;", ({ task }) => {
      const code = `<iframe/>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 1)\n\n--- Source code under test ---\n<iframe/>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[2]: React.createElement(\"iframe\");", ({ task }) => {
      const code = `React.createElement("iframe");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 2)\n\n--- Source code under test ---\nReact.createElement(\"iframe\");\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[3]: React.createElement(\"iframe\", {});", ({ task }) => {
      const code = `React.createElement("iframe", {});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", {});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[4]: React.createElement(\"iframe\", null);", ({ task }) => {
      const code = `React.createElement("iframe", null);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 4)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", null);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[5]: <iframe sandbox=\"__unknown__\"></iframe>", ({ task }) => {
      const code = `<iframe sandbox="__unknown__"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 5)\n\n--- Source code under test ---\n<iframe sandbox=\"__unknown__\"></iframe>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[6]: React.createElement(\"iframe\", { sandbox: \"__unknown__\" })", ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "__unknown__" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 6)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"__unknown__\" })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[7]: <iframe sandbox=\"allow-popups __unknown__\"/>", ({ task }) => {
      const code = `<iframe sandbox="allow-popups __unknown__"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 7)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-popups __unknown__\"/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[8]: <iframe sandbox=\"__unknown__ allow-popups\"/>", ({ task }) => {
      const code = `<iframe sandbox="__unknown__ allow-popups"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 8)\n\n--- Source code under test ---\n<iframe sandbox=\"__unknown__ allow-popups\"/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[9]: <iframe sandbox=\" allow-forms __unknown__ allow-popups __...", ({ task }) => {
      const code = `<iframe sandbox=" allow-forms __unknown__ allow-popups __unknown__  "/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 9)\n\n--- Source code under test ---\n<iframe sandbox=\" allow-forms __unknown__ allow-popups __unknown__  \"/>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  [1] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
      expect(matches[1].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[10]: <iframe sandbox=\"allow-scripts allow-same-origin\"></iframe>;", ({ task }) => {
      const code = `<iframe sandbox="allow-scripts allow-same-origin"></iframe>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 10)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-scripts allow-same-origin\"></iframe>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidCombination): An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid");
    });

    it("invalid[11]: <iframe sandbox=\"allow-same-origin allow-scripts\"/>;", ({ task }) => {
      const code = `<iframe sandbox="allow-same-origin allow-scripts"/>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 11)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-same-origin allow-scripts\"/>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidCombination): An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid");
    });

  });
});
