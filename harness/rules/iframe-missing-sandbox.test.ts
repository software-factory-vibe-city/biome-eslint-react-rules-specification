import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "An iframe element is missing a sandbox attribute",
  "An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"",
  "An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid",
];

describe("iframe-missing-sandbox", () => {
  describe("valid", () => {
    it("valid[0]: <div sandbox=\"__unknown__\" />;", async ({ task }) => {
      const code = `<div sandbox="__unknown__" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 0)\n\n--- Source code under test ---\n<div sandbox=\"__unknown__\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <iframe sandbox=\"\" />;", async ({ task }) => {
      const code = `<iframe sandbox="" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 1)\n\n--- Source code under test ---\n<iframe sandbox=\"\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <iframe sandbox={\"\"} />", async ({ task }) => {
      const code = `<iframe sandbox={""} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 2)\n\n--- Source code under test ---\n<iframe sandbox={\"\"} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: React.createElement(\"iframe\", { sandbox: \"\" });", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "" });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"\" });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <iframe src=\"foo.htm\" sandbox></iframe>", async ({ task }) => {
      const code = `<iframe src="foo.htm" sandbox></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 4)\n\n--- Source code under test ---\n<iframe src=\"foo.htm\" sandbox></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"iframe\", { src: \"foo.htm\", sandbox: ...", async ({ task }) => {
      const code = `React.createElement("iframe", { src: "foo.htm", sandbox: true })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { src: \"foo.htm\", sandbox: true })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <iframe src=\"foo.htm\" sandbox sandbox></iframe>", async ({ task }) => {
      const code = `<iframe src="foo.htm" sandbox sandbox></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 6)\n\n--- Source code under test ---\n<iframe src=\"foo.htm\" sandbox sandbox></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <iframe sandbox=\"allow-forms\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-forms"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 7)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-forms\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <iframe sandbox=\"allow-modals\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-modals"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 8)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-modals\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <iframe sandbox=\"allow-orientation-lock\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-orientation-lock"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 9)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-orientation-lock\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <iframe sandbox=\"allow-pointer-lock\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-pointer-lock"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 10)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-pointer-lock\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <iframe sandbox=\"allow-popups\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-popups"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 11)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-popups\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <iframe sandbox=\"allow-popups-to-escape-sandbox\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-popups-to-escape-sandbox"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 12)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-popups-to-escape-sandbox\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <iframe sandbox=\"allow-presentation\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-presentation"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 13)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-presentation\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <iframe sandbox=\"allow-same-origin\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-same-origin"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 14)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-same-origin\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <iframe sandbox=\"allow-scripts\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-scripts"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 15)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-scripts\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <iframe sandbox=\"allow-top-navigation\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-top-navigation"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 16)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-top-navigation\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <iframe sandbox=\"allow-top-navigation-by-user-activation\"...", async ({ task }) => {
      const code = `<iframe sandbox="allow-top-navigation-by-user-activation"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 17)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-top-navigation-by-user-activation\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <iframe sandbox=\"allow-forms allow-modals\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="allow-forms allow-modals"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 18)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-forms allow-modals\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <iframe sandbox=\"allow-popups allow-popups-to-escape-sand...", async ({ task }) => {
      const code = `<iframe sandbox="allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 19)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation\"></iframe>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: React.createElement(\"iframe\", { sandbox: \"allow-forms\" })", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-forms" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 20)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-forms\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: React.createElement(\"iframe\", { sandbox: \"allow-modals\" })", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-modals" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 21)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-modals\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: React.createElement(\"iframe\", { sandbox: \"allow-orientati...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-orientation-lock" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 22)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-orientation-lock\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: React.createElement(\"iframe\", { sandbox: \"allow-pointer-l...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-pointer-lock" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 23)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-pointer-lock\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: React.createElement(\"iframe\", { sandbox: \"allow-popups\" })", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-popups" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 24)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-popups\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.createElement(\"iframe\", { sandbox: \"allow-popups-to...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-popups-to-escape-sandbox" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 25)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-popups-to-escape-sandbox\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: React.createElement(\"iframe\", { sandbox: \"allow-presentat...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-presentation" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 26)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-presentation\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: React.createElement(\"iframe\", { sandbox: \"allow-same-orig...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-same-origin" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 27)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-same-origin\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: React.createElement(\"iframe\", { sandbox: \"allow-scripts\" })", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-scripts" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 28)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-scripts\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: React.createElement(\"iframe\", { sandbox: \"allow-top-navig...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-top-navigation" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 29)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-top-navigation\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: React.createElement(\"iframe\", { sandbox: \"allow-top-navig...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-top-navigation-by-user-activation" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 30)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-top-navigation-by-user-activation\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: React.createElement(\"iframe\", { sandbox: \"allow-forms all...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-forms allow-modals" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 31)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-forms allow-modals\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: React.createElement(\"iframe\", { sandbox: \"allow-popups al...", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: valid (index 32)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <iframe></iframe>;", async ({ task }) => {
      const code = `<iframe></iframe>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 0)\n\n--- Source code under test ---\n<iframe></iframe>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[1]: <iframe/>;", async ({ task }) => {
      const code = `<iframe/>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 1)\n\n--- Source code under test ---\n<iframe/>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[2]: React.createElement(\"iframe\");", async ({ task }) => {
      const code = `React.createElement("iframe");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 2)\n\n--- Source code under test ---\nReact.createElement(\"iframe\");\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[3]: React.createElement(\"iframe\", {});", async ({ task }) => {
      const code = `React.createElement("iframe", {});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", {});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[4]: React.createElement(\"iframe\", null);", async ({ task }) => {
      const code = `React.createElement("iframe", null);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 4)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", null);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: attributeMissing): An iframe element is missing a sandbox attribute\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element is missing a sandbox attribute");
    });

    it("invalid[5]: <iframe sandbox=\"__unknown__\"></iframe>", async ({ task }) => {
      const code = `<iframe sandbox="__unknown__"></iframe>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 5)\n\n--- Source code under test ---\n<iframe sandbox=\"__unknown__\"></iframe>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[6]: React.createElement(\"iframe\", { sandbox: \"__unknown__\" })", async ({ task }) => {
      const code = `React.createElement("iframe", { sandbox: "__unknown__" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 6)\n\n--- Source code under test ---\nReact.createElement(\"iframe\", { sandbox: \"__unknown__\" })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[7]: <iframe sandbox=\"allow-popups __unknown__\"/>", async ({ task }) => {
      const code = `<iframe sandbox="allow-popups __unknown__"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 7)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-popups __unknown__\"/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[8]: <iframe sandbox=\"__unknown__ allow-popups\"/>", async ({ task }) => {
      const code = `<iframe sandbox="__unknown__ allow-popups"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 8)\n\n--- Source code under test ---\n<iframe sandbox=\"__unknown__ allow-popups\"/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[9]: <iframe sandbox=\" allow-forms __unknown__ allow-popups __...", async ({ task }) => {
      const code = `<iframe sandbox=" allow-forms __unknown__ allow-popups __unknown__  "/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 9)\n\n--- Source code under test ---\n<iframe sandbox=\" allow-forms __unknown__ allow-popups __unknown__  \"/>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  [1] (messageId: invalidValue): An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
      expect(matches[1].message).toBe("An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"");
    });

    it("invalid[10]: <iframe sandbox=\"allow-scripts allow-same-origin\"></iframe>;", async ({ task }) => {
      const code = `<iframe sandbox="allow-scripts allow-same-origin"></iframe>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 10)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-scripts allow-same-origin\"></iframe>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidCombination): An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid");
    });

    it("invalid[11]: <iframe sandbox=\"allow-same-origin allow-scripts\"/>;", async ({ task }) => {
      const code = `<iframe sandbox="allow-same-origin allow-scripts"/>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: iframe-missing-sandbox\nType: invalid (index 11)\n\n--- Source code under test ---\n<iframe sandbox=\"allow-same-origin allow-scripts\"/>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidCombination): An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid\n\nRule message templates:\n  attributeMissing: An iframe element is missing a sandbox attribute\n  invalidValue: An iframe element defines a sandbox attribute with invalid value \"{{ value }}\"\n  invalidCombination: An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "iframe-missing-sandbox", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An iframe element defines a sandbox attribute with both allow-scripts and allow-same-origin which is invalid");
    });

  });
});
