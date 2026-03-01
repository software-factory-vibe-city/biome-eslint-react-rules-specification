import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "`checked` should be used with either `onChange` or `readOnly`.",
  "Use either `checked` or `defaultChecked`, but not both.",
];

describe("checked-requires-onchange-or-readonly", () => {
  describe("valid", () => {
    it("valid[0]: <input type=\"checkbox\" />", async ({ task }) => {
      const code = `<input type="checkbox" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 0)\n\n--- Source code under test ---\n<input type=\"checkbox\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <input type=\"checkbox\" onChange={noop} />", async ({ task }) => {
      const code = `<input type="checkbox" onChange={noop} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 1)\n\n--- Source code under test ---\n<input type=\"checkbox\" onChange={noop} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <input type=\"checkbox\" readOnly />", async ({ task }) => {
      const code = `<input type="checkbox" readOnly />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 2)\n\n--- Source code under test ---\n<input type=\"checkbox\" readOnly />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <input type=\"checkbox\" checked onChange={noop} />", async ({ task }) => {
      const code = `<input type="checkbox" checked onChange={noop} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 3)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked onChange={noop} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <input type=\"checkbox\" checked={true} onChange={noop} />", async ({ task }) => {
      const code = `<input type="checkbox" checked={true} onChange={noop} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 4)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked={true} onChange={noop} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <input type=\"checkbox\" checked={false} onChange={noop} />", async ({ task }) => {
      const code = `<input type="checkbox" checked={false} onChange={noop} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 5)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked={false} onChange={noop} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <input type=\"checkbox\" checked readOnly />", async ({ task }) => {
      const code = `<input type="checkbox" checked readOnly />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 6)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked readOnly />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <input type=\"checkbox\" checked={true} readOnly />", async ({ task }) => {
      const code = `<input type="checkbox" checked={true} readOnly />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 7)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked={true} readOnly />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <input type=\"checkbox\" checked={false} readOnly />", async ({ task }) => {
      const code = `<input type="checkbox" checked={false} readOnly />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 8)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked={false} readOnly />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <input type=\"checkbox\" defaultChecked />", async ({ task }) => {
      const code = `<input type="checkbox" defaultChecked />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 9)\n\n--- Source code under test ---\n<input type=\"checkbox\" defaultChecked />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: React.createElement('input')", async ({ task }) => {
      const code = `React.createElement('input')`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 10)\n\n--- Source code under test ---\nReact.createElement('input')\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement('input', { checked: true, onChange: n...", async ({ task }) => {
      const code = `React.createElement('input', { checked: true, onChange: noop })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement('input', { checked: true, onChange: noop })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: React.createElement('input', { checked: false, onChange: ...", async ({ task }) => {
      const code = `React.createElement('input', { checked: false, onChange: noop })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 12)\n\n--- Source code under test ---\nReact.createElement('input', { checked: false, onChange: noop })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement('input', { checked: true, readOnly: t...", async ({ task }) => {
      const code = `React.createElement('input', { checked: true, readOnly: true })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement('input', { checked: true, readOnly: true })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: React.createElement('input', { checked: true, onChange: n...", async ({ task }) => {
      const code = `React.createElement('input', { checked: true, onChange: noop, readOnly: true })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 14)\n\n--- Source code under test ---\nReact.createElement('input', { checked: true, onChange: noop, readOnly: true })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: React.createElement('input', { checked: foo, onChange: no...", async ({ task }) => {
      const code = `React.createElement('input', { checked: foo, onChange: noop, readOnly: true })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 15)\n\n--- Source code under test ---\nReact.createElement('input', { checked: foo, onChange: noop, readOnly: true })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <span/>", async ({ task }) => {
      const code = `<span/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 21)\n\n--- Source code under test ---\n<span/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: React.createElement('span')", async ({ task }) => {
      const code = `React.createElement('span')`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 22)\n\n--- Source code under test ---\nReact.createElement('span')\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: (()=>{})()", async ({ task }) => {
      const code = `(()=>{})()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: valid (index 23)\n\n--- Source code under test ---\n(()=>{})()\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <input type=\"radio\" checked />", async ({ task }) => {
      const code = `<input type="radio" checked />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: invalid (index 0)\n\n--- Source code under test ---\n<input type=\"radio\" checked />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingProperty): `checked` should be used with either `onChange` or `readOnly`.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`checked` should be used with either `onChange` or `readOnly`.");
    });

    it("invalid[1]: <input type=\"radio\" checked={true} />", async ({ task }) => {
      const code = `<input type="radio" checked={true} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: invalid (index 1)\n\n--- Source code under test ---\n<input type=\"radio\" checked={true} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingProperty): `checked` should be used with either `onChange` or `readOnly`.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`checked` should be used with either `onChange` or `readOnly`.");
    });

    it("invalid[2]: <input type=\"checkbox\" checked />", async ({ task }) => {
      const code = `<input type="checkbox" checked />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: invalid (index 2)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingProperty): `checked` should be used with either `onChange` or `readOnly`.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`checked` should be used with either `onChange` or `readOnly`.");
    });

    it("invalid[3]: <input type=\"checkbox\" checked={true} />", async ({ task }) => {
      const code = `<input type="checkbox" checked={true} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: invalid (index 3)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked={true} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingProperty): `checked` should be used with either `onChange` or `readOnly`.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`checked` should be used with either `onChange` or `readOnly`.");
    });

    it("invalid[4]: <input type=\"checkbox\" checked={condition ? true : false} />", async ({ task }) => {
      const code = `<input type="checkbox" checked={condition ? true : false} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: invalid (index 4)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked={condition ? true : false} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingProperty): `checked` should be used with either `onChange` or `readOnly`.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`checked` should be used with either `onChange` or `readOnly`.");
    });

    it("invalid[5]: <input type=\"checkbox\" checked defaultChecked />", async ({ task }) => {
      const code = `<input type="checkbox" checked defaultChecked />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: invalid (index 5)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked defaultChecked />\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: exclusiveCheckedAttribute): Use either `checked` or `defaultChecked`, but not both.\n  [1] (messageId: missingProperty): `checked` should be used with either `onChange` or `readOnly`.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Use either `checked` or `defaultChecked`, but not both.");
      expect(matches[1].message).toBe("`checked` should be used with either `onChange` or `readOnly`.");
    });

    it("invalid[6]: React.createElement(\"input\", { checked: false })", async ({ task }) => {
      const code = `React.createElement("input", { checked: false })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: invalid (index 6)\n\n--- Source code under test ---\nReact.createElement(\"input\", { checked: false })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingProperty): `checked` should be used with either `onChange` or `readOnly`.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`checked` should be used with either `onChange` or `readOnly`.");
    });

    it("invalid[7]: React.createElement(\"input\", { checked: true, defaultChec...", async ({ task }) => {
      const code = `React.createElement("input", { checked: true, defaultChecked: true })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: checked-requires-onchange-or-readonly\nType: invalid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"input\", { checked: true, defaultChecked: true })\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: exclusiveCheckedAttribute): Use either `checked` or `defaultChecked`, but not both.\n  [1] (messageId: missingProperty): `checked` should be used with either `onChange` or `readOnly`.\n\nRule message templates:\n  missingProperty: `checked` should be used with either `onChange` or `readOnly`.\n  exclusiveCheckedAttribute: Use either `checked` or `defaultChecked`, but not both.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "checked-requires-onchange-or-readonly", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Use either `checked` or `defaultChecked`, but not both.");
      expect(matches[1].message).toBe("`checked` should be used with either `onChange` or `readOnly`.");
    });

  });
});
