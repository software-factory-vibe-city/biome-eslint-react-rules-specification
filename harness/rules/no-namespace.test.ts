import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-namespace";
const VALID_COUNT = 27;

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

const cases = [
  { code: `<testcomponent />`, filename: "test.jsx" },
  { code: `React.createElement("testcomponent")`, filename: "test.jsx" },
  { code: `<testComponent />`, filename: "test.jsx" },
  { code: `React.createElement("testComponent")`, filename: "test.jsx" },
  { code: `<test_component />`, filename: "test.jsx" },
  { code: `React.createElement("test_component")`, filename: "test.jsx" },
  { code: `<TestComponent />`, filename: "test.jsx" },
  { code: `React.createElement("TestComponent")`, filename: "test.jsx" },
  { code: `<object.testcomponent />`, filename: "test.jsx" },
  { code: `React.createElement("object.testcomponent")`, filename: "test.jsx" },
  { code: `<object.testComponent />`, filename: "test.jsx" },
  { code: `React.createElement("object.testComponent")`, filename: "test.jsx" },
  { code: `<object.test_component />`, filename: "test.jsx" },
  { code: `React.createElement("object.test_component")`, filename: "test.jsx" },
  { code: `<object.TestComponent />`, filename: "test.jsx" },
  { code: `React.createElement("object.TestComponent")`, filename: "test.jsx" },
  { code: `<Object.testcomponent />`, filename: "test.jsx" },
  { code: `React.createElement("Object.testcomponent")`, filename: "test.jsx" },
  { code: `<Object.testComponent />`, filename: "test.jsx" },
  { code: `React.createElement("Object.testComponent")`, filename: "test.jsx" },
  { code: `<Object.test_component />`, filename: "test.jsx" },
  { code: `React.createElement("Object.test_component")`, filename: "test.jsx" },
  { code: `<Object.TestComponent />`, filename: "test.jsx" },
  { code: `React.createElement("Object.TestComponent")`, filename: "test.jsx" },
  { code: `React.createElement(null)`, filename: "test.jsx" },
  { code: `React.createElement(true)`, filename: "test.jsx" },
  { code: `React.createElement({})`, filename: "test.jsx" },
  { code: `<ns:testcomponent />`, filename: "test.jsx" },
  { code: `React.createElement("ns:testcomponent")`, filename: "test.jsx" },
  { code: `<ns:testComponent />`, filename: "test.jsx" },
  { code: `React.createElement("ns:testComponent")`, filename: "test.jsx" },
  { code: `<ns:test_component />`, filename: "test.jsx" },
  { code: `React.createElement("ns:test_component")`, filename: "test.jsx" },
  { code: `<ns:TestComponent />`, filename: "test.jsx" },
  { code: `React.createElement("ns:TestComponent")`, filename: "test.jsx" },
  { code: `<Ns:testcomponent />`, filename: "test.jsx" },
  { code: `React.createElement("Ns:testcomponent")`, filename: "test.jsx" },
  { code: `<Ns:testComponent />`, filename: "test.jsx" },
  { code: `React.createElement("Ns:testComponent")`, filename: "test.jsx" },
  { code: `<Ns:test_component />`, filename: "test.jsx" },
  { code: `React.createElement("Ns:test_component")`, filename: "test.jsx" },
  { code: `<Ns:TestComponent />`, filename: "test.jsx" },
  { code: `React.createElement("Ns:TestComponent")`, filename: "test.jsx" },
];

describe("no-namespace", () => {
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
    it("valid[0]: <testcomponent />", ({ task }) => {
      const code = `<testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 0)\n\n--- Source code under test ---\n<testcomponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: React.createElement(\"testcomponent\")", ({ task }) => {
      const code = `React.createElement("testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 1)\n\n--- Source code under test ---\nReact.createElement(\"testcomponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <testComponent />", ({ task }) => {
      const code = `<testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 2)\n\n--- Source code under test ---\n<testComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: React.createElement(\"testComponent\")", ({ task }) => {
      const code = `React.createElement("testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"testComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <test_component />", ({ task }) => {
      const code = `<test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 4)\n\n--- Source code under test ---\n<test_component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"test_component\")", ({ task }) => {
      const code = `React.createElement("test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"test_component\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <TestComponent />", ({ task }) => {
      const code = `<TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 6)\n\n--- Source code under test ---\n<TestComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: React.createElement(\"TestComponent\")", ({ task }) => {
      const code = `React.createElement("TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"TestComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <object.testcomponent />", ({ task }) => {
      const code = `<object.testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 8)\n\n--- Source code under test ---\n<object.testcomponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: React.createElement(\"object.testcomponent\")", ({ task }) => {
      const code = `React.createElement("object.testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 9)\n\n--- Source code under test ---\nReact.createElement(\"object.testcomponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <object.testComponent />", ({ task }) => {
      const code = `<object.testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 10)\n\n--- Source code under test ---\n<object.testComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"object.testComponent\")", ({ task }) => {
      const code = `React.createElement("object.testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"object.testComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <object.test_component />", ({ task }) => {
      const code = `<object.test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 12)\n\n--- Source code under test ---\n<object.test_component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(\"object.test_component\")", ({ task }) => {
      const code = `React.createElement("object.test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"object.test_component\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <object.TestComponent />", ({ task }) => {
      const code = `<object.TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 14)\n\n--- Source code under test ---\n<object.TestComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: React.createElement(\"object.TestComponent\")", ({ task }) => {
      const code = `React.createElement("object.TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"object.TestComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <Object.testcomponent />", ({ task }) => {
      const code = `<Object.testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 16)\n\n--- Source code under test ---\n<Object.testcomponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: React.createElement(\"Object.testcomponent\")", ({ task }) => {
      const code = `React.createElement("Object.testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 17)\n\n--- Source code under test ---\nReact.createElement(\"Object.testcomponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <Object.testComponent />", ({ task }) => {
      const code = `<Object.testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 18)\n\n--- Source code under test ---\n<Object.testComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: React.createElement(\"Object.testComponent\")", ({ task }) => {
      const code = `React.createElement("Object.testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 19)\n\n--- Source code under test ---\nReact.createElement(\"Object.testComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <Object.test_component />", ({ task }) => {
      const code = `<Object.test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 20)\n\n--- Source code under test ---\n<Object.test_component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: React.createElement(\"Object.test_component\")", ({ task }) => {
      const code = `React.createElement("Object.test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 21)\n\n--- Source code under test ---\nReact.createElement(\"Object.test_component\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: <Object.TestComponent />", ({ task }) => {
      const code = `<Object.TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 22)\n\n--- Source code under test ---\n<Object.TestComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: React.createElement(\"Object.TestComponent\")", ({ task }) => {
      const code = `React.createElement("Object.TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 23)\n\n--- Source code under test ---\nReact.createElement(\"Object.TestComponent\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: React.createElement(null)", ({ task }) => {
      const code = `React.createElement(null)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 24)\n\n--- Source code under test ---\nReact.createElement(null)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.createElement(true)", ({ task }) => {
      const code = `React.createElement(true)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 25)\n\n--- Source code under test ---\nReact.createElement(true)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: React.createElement({})", ({ task }) => {
      const code = `React.createElement({})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: valid (index 26)\n\n--- Source code under test ---\nReact.createElement({})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <ns:testcomponent />", ({ task }) => {
      const code = `<ns:testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 0)\n\n--- Source code under test ---\n<ns:testcomponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:testcomponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:testcomponent must not be in a namespace, as React does not support them");
    });

    it("invalid[1]: React.createElement(\"ns:testcomponent\")", ({ task }) => {
      const code = `React.createElement("ns:testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 1)\n\n--- Source code under test ---\nReact.createElement(\"ns:testcomponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:testcomponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:testcomponent must not be in a namespace, as React does not support them");
    });

    it("invalid[2]: <ns:testComponent />", ({ task }) => {
      const code = `<ns:testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 2)\n\n--- Source code under test ---\n<ns:testComponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:testComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:testComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[3]: React.createElement(\"ns:testComponent\")", ({ task }) => {
      const code = `React.createElement("ns:testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"ns:testComponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:testComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:testComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[4]: <ns:test_component />", ({ task }) => {
      const code = `<ns:test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 4)\n\n--- Source code under test ---\n<ns:test_component />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:test_component must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:test_component must not be in a namespace, as React does not support them");
    });

    it("invalid[5]: React.createElement(\"ns:test_component\")", ({ task }) => {
      const code = `React.createElement("ns:test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"ns:test_component\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:test_component must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:test_component must not be in a namespace, as React does not support them");
    });

    it("invalid[6]: <ns:TestComponent />", ({ task }) => {
      const code = `<ns:TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 6)\n\n--- Source code under test ---\n<ns:TestComponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:TestComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:TestComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[7]: React.createElement(\"ns:TestComponent\")", ({ task }) => {
      const code = `React.createElement("ns:TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"ns:TestComponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component ns:TestComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component ns:TestComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[8]: <Ns:testcomponent />", ({ task }) => {
      const code = `<Ns:testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 8)\n\n--- Source code under test ---\n<Ns:testcomponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:testcomponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:testcomponent must not be in a namespace, as React does not support them");
    });

    it("invalid[9]: React.createElement(\"Ns:testcomponent\")", ({ task }) => {
      const code = `React.createElement("Ns:testcomponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 9)\n\n--- Source code under test ---\nReact.createElement(\"Ns:testcomponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:testcomponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:testcomponent must not be in a namespace, as React does not support them");
    });

    it("invalid[10]: <Ns:testComponent />", ({ task }) => {
      const code = `<Ns:testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 10)\n\n--- Source code under test ---\n<Ns:testComponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:testComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:testComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[11]: React.createElement(\"Ns:testComponent\")", ({ task }) => {
      const code = `React.createElement("Ns:testComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"Ns:testComponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:testComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:testComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[12]: <Ns:test_component />", ({ task }) => {
      const code = `<Ns:test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 12)\n\n--- Source code under test ---\n<Ns:test_component />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:test_component must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:test_component must not be in a namespace, as React does not support them");
    });

    it("invalid[13]: React.createElement(\"Ns:test_component\")", ({ task }) => {
      const code = `React.createElement("Ns:test_component")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"Ns:test_component\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:test_component must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:test_component must not be in a namespace, as React does not support them");
    });

    it("invalid[14]: <Ns:TestComponent />", ({ task }) => {
      const code = `<Ns:TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 14)\n\n--- Source code under test ---\n<Ns:TestComponent />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:TestComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:TestComponent must not be in a namespace, as React does not support them");
    });

    it("invalid[15]: React.createElement(\"Ns:TestComponent\")", ({ task }) => {
      const code = `React.createElement("Ns:TestComponent")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-namespace\nType: invalid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"Ns:TestComponent\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: React component Ns:TestComponent must not be in a namespace, as React does not support them\n\nFeatures: jsx namespace\n\nRule message templates:\n  noNamespace: React component {{name}} must not be in a namespace, as React does not support them";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React component Ns:TestComponent must not be in a namespace, as React does not support them");
    });

  });
});
