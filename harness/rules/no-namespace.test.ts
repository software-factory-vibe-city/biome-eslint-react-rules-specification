import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "React component {{name}} must not be in a namespace, as React does not support them",
  "React component ns:testcomponent must not be in a namespace, as React does not support them",
  "React component ns:testComponent must not be in a namespace, as React does not support them",
  "React component ns:test_component must not be in a namespace, as React does not support them",
  "React component ns:TestComponent must not be in a namespace, as React does not support them",
  "React component Ns:testcomponent must not be in a namespace, as React does not support them",
  "React component Ns:testComponent must not be in a namespace, as React does not support them",
  "React component Ns:test_component must not be in a namespace, as React does not support them",
  "React component Ns:TestComponent must not be in a namespace, as React does not support them",
];

describe("no-namespace", () => {
  describe("valid", () => {
    it("valid[0]: <testcomponent />", async ({ task }) => {
      const code = `<testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 0)\n\n--- Source code under test ---\n<testcomponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: React.createElement(\"testcomponent\")", async ({ task }) => {
      const code = `React.createElement("testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 1)\n\n--- Source code under test ---\nReact.createElement(\"testcomponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <testComponent />", async ({ task }) => {
      const code = `<testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 2)\n\n--- Source code under test ---\n<testComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: React.createElement(\"testComponent\")", async ({ task }) => {
      const code = `React.createElement("testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"testComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <test_component />", async ({ task }) => {
      const code = `<test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 4)\n\n--- Source code under test ---\n<test_component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"test_component\")", async ({ task }) => {
      const code = `React.createElement("test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"test_component\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <TestComponent />", async ({ task }) => {
      const code = `<TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 6)\n\n--- Source code under test ---\n<TestComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: React.createElement(\"TestComponent\")", async ({ task }) => {
      const code = `React.createElement("TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"TestComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <object.testcomponent />", async ({ task }) => {
      const code = `<object.testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 8)\n\n--- Source code under test ---\n<object.testcomponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: React.createElement(\"object.testcomponent\")", async ({ task }) => {
      const code = `React.createElement("object.testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 9)\n\n--- Source code under test ---\nReact.createElement(\"object.testcomponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <object.testComponent />", async ({ task }) => {
      const code = `<object.testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 10)\n\n--- Source code under test ---\n<object.testComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"object.testComponent\")", async ({ task }) => {
      const code = `React.createElement("object.testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"object.testComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <object.test_component />", async ({ task }) => {
      const code = `<object.test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 12)\n\n--- Source code under test ---\n<object.test_component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(\"object.test_component\")", async ({ task }) => {
      const code = `React.createElement("object.test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"object.test_component\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <object.TestComponent />", async ({ task }) => {
      const code = `<object.TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 14)\n\n--- Source code under test ---\n<object.TestComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: React.createElement(\"object.TestComponent\")", async ({ task }) => {
      const code = `React.createElement("object.TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"object.TestComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <Object.testcomponent />", async ({ task }) => {
      const code = `<Object.testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 16)\n\n--- Source code under test ---\n<Object.testcomponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: React.createElement(\"Object.testcomponent\")", async ({ task }) => {
      const code = `React.createElement("Object.testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 17)\n\n--- Source code under test ---\nReact.createElement(\"Object.testcomponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <Object.testComponent />", async ({ task }) => {
      const code = `<Object.testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 18)\n\n--- Source code under test ---\n<Object.testComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: React.createElement(\"Object.testComponent\")", async ({ task }) => {
      const code = `React.createElement("Object.testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 19)\n\n--- Source code under test ---\nReact.createElement(\"Object.testComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <Object.test_component />", async ({ task }) => {
      const code = `<Object.test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 20)\n\n--- Source code under test ---\n<Object.test_component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: React.createElement(\"Object.test_component\")", async ({ task }) => {
      const code = `React.createElement("Object.test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 21)\n\n--- Source code under test ---\nReact.createElement(\"Object.test_component\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: <Object.TestComponent />", async ({ task }) => {
      const code = `<Object.TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 22)\n\n--- Source code under test ---\n<Object.TestComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: React.createElement(\"Object.TestComponent\")", async ({ task }) => {
      const code = `React.createElement("Object.TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 23)\n\n--- Source code under test ---\nReact.createElement(\"Object.TestComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: React.createElement(null)", async ({ task }) => {
      const code = `React.createElement(null)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 24)\n\n--- Source code under test ---\nReact.createElement(null)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.createElement(true)", async ({ task }) => {
      const code = `React.createElement(true)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 25)\n\n--- Source code under test ---\nReact.createElement(true)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: React.createElement({})", async ({ task }) => {
      const code = `React.createElement({})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 26)\n\n--- Source code under test ---\nReact.createElement({})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <ns:testcomponent />", async ({ task }) => {
      const code = `<ns:testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 0)\n\n--- Source code under test ---\n<ns:testcomponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:testcomponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:testcomponent must not be in a namespace, as React does not support them");
    });

    it("invalid[1]: React.createElement(\"ns:testcomponent\")", async ({ task }) => {
      const code = `React.createElement("ns:testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 1)\n\n--- Source code under test ---\nReact.createElement(\"ns:testcomponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:testcomponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:testcomponent must not be in a namespace, as React does not support them");
    });

    it("invalid[2]: <ns:testComponent />", async ({ task }) => {
      const code = `<ns:testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 2)\n\n--- Source code under test ---\n<ns:testComponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:testComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:testComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[3]: React.createElement(\"ns:testComponent\")", async ({ task }) => {
      const code = `React.createElement("ns:testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"ns:testComponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:testComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:testComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[4]: <ns:test_component />", async ({ task }) => {
      const code = `<ns:test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 4)\n\n--- Source code under test ---\n<ns:test_component />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:test_component must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:test_component must not be in a namespace, as React does not support them");
    });

    it("invalid[5]: React.createElement(\"ns:test_component\")", async ({ task }) => {
      const code = `React.createElement("ns:test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"ns:test_component\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:test_component must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:test_component must not be in a namespace, as React does not support them");
    });

    it("invalid[6]: <ns:TestComponent />", async ({ task }) => {
      const code = `<ns:TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 6)\n\n--- Source code under test ---\n<ns:TestComponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:TestComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:TestComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[7]: React.createElement(\"ns:TestComponent\")", async ({ task }) => {
      const code = `React.createElement("ns:TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"ns:TestComponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:TestComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:TestComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[8]: <Ns:testcomponent />", async ({ task }) => {
      const code = `<Ns:testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 8)\n\n--- Source code under test ---\n<Ns:testcomponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:testcomponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:testcomponent must not be in a namespace, as React does not support them");
    });

    it("invalid[9]: React.createElement(\"Ns:testcomponent\")", async ({ task }) => {
      const code = `React.createElement("Ns:testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 9)\n\n--- Source code under test ---\nReact.createElement(\"Ns:testcomponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:testcomponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:testcomponent must not be in a namespace, as React does not support them");
    });

    it("invalid[10]: <Ns:testComponent />", async ({ task }) => {
      const code = `<Ns:testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 10)\n\n--- Source code under test ---\n<Ns:testComponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:testComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:testComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[11]: React.createElement(\"Ns:testComponent\")", async ({ task }) => {
      const code = `React.createElement("Ns:testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"Ns:testComponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:testComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:testComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[12]: <Ns:test_component />", async ({ task }) => {
      const code = `<Ns:test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 12)\n\n--- Source code under test ---\n<Ns:test_component />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:test_component must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:test_component must not be in a namespace, as React does not support them");
    });

    it("invalid[13]: React.createElement(\"Ns:test_component\")", async ({ task }) => {
      const code = `React.createElement("Ns:test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"Ns:test_component\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:test_component must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:test_component must not be in a namespace, as React does not support them");
    });

    it("invalid[14]: <Ns:TestComponent />", async ({ task }) => {
      const code = `<Ns:TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 14)\n\n--- Source code under test ---\n<Ns:TestComponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:TestComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:TestComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[15]: React.createElement(\"Ns:TestComponent\")", async ({ task }) => {
      const code = `React.createElement("Ns:TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"Ns:TestComponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:TestComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-namespace", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:TestComponent must not be in a namespace, as React does not support them");
    });

  });
});
