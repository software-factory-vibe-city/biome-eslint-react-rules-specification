import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Empty components are self-closing",
];

describe("self-closing-comp", () => {
  describe("valid", () => {
    it("valid[0]: var HelloJohn = <Hello name=\"John\" />;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 0)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var HelloJohn = <Hello.Compound name=\"John\" />;", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 1)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Profile = <Hello name=\"John\"><img src=\"picture.png\" /...", async ({ task }) => {
      const code = `var Profile = <Hello name="John"><img src="picture.png" /></Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 2)\n\n--- Source code under test ---\nvar Profile = <Hello name=\"John\"><img src=\"picture.png\" /></Hello>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Profile = <Hello.Compound name=\"John\"><img src=\"pictu...", async ({ task }) => {
      const code = `var Profile = <Hello.Compound name="John"><img src="picture.png" /></Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 3)\n\n--- Source code under test ---\nvar Profile = <Hello.Compound name=\"John\"><img src=\"picture.png\" /></Hello.Compound>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <Hello> <Hello name=\"John\" /> </Hello>", async ({ task }) => {
      const code = `
        <Hello>
          <Hello name="John" />
        </Hello>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 4)\n\n--- Source code under test ---\n\n        <Hello>\n          <Hello name=\"John\" />\n        </Hello>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <Hello.Compound> <Hello.Compound name=\"John\" /> </Hello.C...", async ({ task }) => {
      const code = `
        <Hello.Compound>
          <Hello.Compound name="John" />
        </Hello.Compound>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 5)\n\n--- Source code under test ---\n\n        <Hello.Compound>\n          <Hello.Compound name=\"John\" />\n        </Hello.Compound>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: var HelloJohn = <Hello name=\"John\"> </Hello>;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John"> </Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 6)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\"> </Hello>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var HelloJohn = <Hello.Compound name=\"John\"> </Hello.Comp...", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John"> </Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 7)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\"> </Hello.Compound>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: var HelloJohn = <Hello name=\"John\"> </Hello>;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John">        </Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 8)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\">        </Hello>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: var HelloJohn = <Hello.Compound name=\"John\"> </Hello.Comp...", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John">        </Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 9)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\">        </Hello.Compound>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: var HelloJohn = <div>&nbsp;</div>;", async ({ task }) => {
      const code = `var HelloJohn = <div>&nbsp;</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 10)\n\n--- Source code under test ---\nvar HelloJohn = <div>&nbsp;</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: var HelloJohn = <div>{' '}</div>;", async ({ task }) => {
      const code = `var HelloJohn = <div>{' '}</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 11)\n\n--- Source code under test ---\nvar HelloJohn = <div>{' '}</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: var HelloJohn = <Hello name=\"John\">&nbsp;</Hello>;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John">&nbsp;</Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 12)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\">&nbsp;</Hello>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: var HelloJohn = <Hello.Compound name=\"John\">&nbsp;</Hello...", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John">&nbsp;</Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 13)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\">&nbsp;</Hello.Compound>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: var HelloJohn = <Hello name=\"John\" />;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 14)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: var HelloJohn = <Hello.Compound name=\"John\" />;", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 15)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: var Profile = <Hello name=\"John\"><img src=\"picture.png\" /...", async ({ task }) => {
      const code = `var Profile = <Hello name="John"><img src="picture.png" /></Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 16)\n\n--- Source code under test ---\nvar Profile = <Hello name=\"John\"><img src=\"picture.png\" /></Hello>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: var Profile = <Hello.Compound name=\"John\"><img src=\"pictu...", async ({ task }) => {
      const code = `var Profile = <Hello.Compound name="John"><img src="picture.png" /></Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 17)\n\n--- Source code under test ---\nvar Profile = <Hello.Compound name=\"John\"><img src=\"picture.png\" /></Hello.Compound>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <Hello> <Hello name=\"John\" /> </Hello>", async ({ task }) => {
      const code = `
        <Hello>
          <Hello name="John" />
        </Hello>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 18)\n\n--- Source code under test ---\n\n        <Hello>\n          <Hello name=\"John\" />\n        </Hello>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <Hello.Compound> <Hello.Compound name=\"John\" /> </Hello.C...", async ({ task }) => {
      const code = `
        <Hello.Compound>
          <Hello.Compound name="John" />
        </Hello.Compound>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 19)\n\n--- Source code under test ---\n\n        <Hello.Compound>\n          <Hello.Compound name=\"John\" />\n        </Hello.Compound>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: var HelloJohn = <div> </div>;", async ({ task }) => {
      const code = `var HelloJohn = <div> </div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 20)\n\n--- Source code under test ---\nvar HelloJohn = <div> </div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: var HelloJohn = <div> </div>;", async ({ task }) => {
      const code = `var HelloJohn = <div>        </div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 21)\n\n--- Source code under test ---\nvar HelloJohn = <div>        </div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: var HelloJohn = <div>&nbsp;</div>;", async ({ task }) => {
      const code = `var HelloJohn = <div>&nbsp;</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 22)\n\n--- Source code under test ---\nvar HelloJohn = <div>&nbsp;</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: var HelloJohn = <div>{' '}</div>;", async ({ task }) => {
      const code = `var HelloJohn = <div>{' '}</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 23)\n\n--- Source code under test ---\nvar HelloJohn = <div>{' '}</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: var HelloJohn = <Hello name=\"John\">&nbsp;</Hello>;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John">&nbsp;</Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 24)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\">&nbsp;</Hello>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: var HelloJohn = <Hello.Compound name=\"John\">&nbsp;</Hello...", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John">&nbsp;</Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: valid (index 25)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\">&nbsp;</Hello.Compound>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var contentContainer = <div className=\"content\"></div>;", async ({ task }) => {
      const code = `var contentContainer = <div className="content"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 0)\n\n--- Source code under test ---\nvar contentContainer = <div className=\"content\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[1]: var contentContainer = <div className=\"content\"></div>;", async ({ task }) => {
      const code = `var contentContainer = <div className="content"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 1)\n\n--- Source code under test ---\nvar contentContainer = <div className=\"content\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[2]: var HelloJohn = <Hello name=\"John\"></Hello>;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John"></Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 2)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\"></Hello>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[3]: var CompoundHelloJohn = <Hello.Compound name=\"John\"></Hel...", async ({ task }) => {
      const code = `var CompoundHelloJohn = <Hello.Compound name="John"></Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 3)\n\n--- Source code under test ---\nvar CompoundHelloJohn = <Hello.Compound name=\"John\"></Hello.Compound>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[4]: var HelloJohn = <Hello name=\"John\"> </Hello>;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John">
</Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 4)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\">\n</Hello>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[5]: var HelloJohn = <Hello.Compound name=\"John\"> </Hello.Comp...", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John">
</Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 5)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\">\n</Hello.Compound>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[6]: var HelloJohn = <Hello name=\"John\"></Hello>;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John"></Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 6)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\"></Hello>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[7]: var HelloJohn = <Hello.Compound name=\"John\"></Hello.Compo...", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John"></Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 7)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\"></Hello.Compound>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[8]: var HelloJohn = <Hello name=\"John\"> </Hello>;", async ({ task }) => {
      const code = `var HelloJohn = <Hello name="John">
</Hello>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 8)\n\n--- Source code under test ---\nvar HelloJohn = <Hello name=\"John\">\n</Hello>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

    it("invalid[9]: var HelloJohn = <Hello.Compound name=\"John\"> </Hello.Comp...", async ({ task }) => {
      const code = `var HelloJohn = <Hello.Compound name="John">
</Hello.Compound>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: self-closing-comp\nType: invalid (index 9)\n\n--- Source code under test ---\nvar HelloJohn = <Hello.Compound name=\"John\">\n</Hello.Compound>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notSelfClosing): Empty components are self-closing\n\nRule message templates:\n  notSelfClosing: Empty components are self-closing";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "self-closing-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Empty components are self-closing");
    });

  });
});
