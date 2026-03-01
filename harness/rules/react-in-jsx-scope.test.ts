import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "react-in-jsx-scope";
const VALID_COUNT = 9;

const RULE_MESSAGES = [
  "'{{name}}' must be in scope when using JSX",
  "'React' must be in scope when using JSX",
  "'Foo' must be in scope when using JSX",
];

const cases = [
  { code: `var React, App; <App />;`, filename: "test.jsx" },
  { code: `var React; <img />;`, filename: "test.jsx" },
  { code: `var React; <>fragment</>;`, filename: "test.jsx" },
  { code: `var React; <x-gif />;`, filename: "test.jsx" },
  { code: `var React, App, a=1; <App attr={a} />;`, filename: "test.jsx" },
  { code: `var React, App, a=1; function elem() { return <App attr={a} />; }`, filename: "test.jsx" },
  { code: `/** @jsx Foo */ var Foo, App; <App />;`, filename: "test.jsx" },
  { code: `/** @jsx Foo.Bar */ var Foo, App; <App />;`, filename: "test.jsx" },
  { code: `
        import React from 'react/addons';
        const Button = createReactClass({
          render() {
            return (
              <button {...this.props}>{this.props.children}</button>
            )
          }
        });
        export default Button;
      `, filename: "test.jsx" },
  { code: `var App, a = <App />;`, filename: "test.jsx" },
  { code: `var a = <App />;`, filename: "test.jsx" },
  { code: `var a = <img />;`, filename: "test.jsx" },
  { code: `var a = <>fragment</>;`, filename: "test.jsx" },
  { code: `/** @jsx React.DOM */ var a = <img />;`, filename: "test.jsx" },
  { code: `/** @jsx Foo.bar */ var React, a = <img />;`, filename: "test.jsx" },
];

describe("react-in-jsx-scope", () => {
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
    it("valid[0]: var React, App; <App />;", ({ task }) => {
      const code = `var React, App; <App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 0)\n\n--- Source code under test ---\nvar React, App; <App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var React; <img />;", ({ task }) => {
      const code = `var React; <img />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 1)\n\n--- Source code under test ---\nvar React; <img />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var React; <>fragment</>;", ({ task }) => {
      const code = `var React; <>fragment</>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 2)\n\n--- Source code under test ---\nvar React; <>fragment</>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var React; <x-gif />;", ({ task }) => {
      const code = `var React; <x-gif />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 3)\n\n--- Source code under test ---\nvar React; <x-gif />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var React, App, a=1; <App attr={a} />;", ({ task }) => {
      const code = `var React, App, a=1; <App attr={a} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 4)\n\n--- Source code under test ---\nvar React, App, a=1; <App attr={a} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var React, App, a=1; function elem() { return <App attr={...", ({ task }) => {
      const code = `var React, App, a=1; function elem() { return <App attr={a} />; }`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 5)\n\n--- Source code under test ---\nvar React, App, a=1; function elem() { return <App attr={a} />; }\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: /** @jsx Foo */ var Foo, App; <App />;", ({ task }) => {
      const code = `/** @jsx Foo */ var Foo, App; <App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 6)\n\n--- Source code under test ---\n/** @jsx Foo */ var Foo, App; <App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: /** @jsx Foo.Bar */ var Foo, App; <App />;", ({ task }) => {
      const code = `/** @jsx Foo.Bar */ var Foo, App; <App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 7)\n\n--- Source code under test ---\n/** @jsx Foo.Bar */ var Foo, App; <App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: import React from 'react/addons'; const Button = createRe...", ({ task }) => {
      const code = `
        import React from 'react/addons';
        const Button = createReactClass({
          render() {
            return (
              <button {...this.props}>{this.props.children}</button>
            )
          }
        });
        export default Button;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: valid (index 8)\n\n--- Source code under test ---\n\n        import React from 'react/addons';\n        const Button = createReactClass({\n          render() {\n            return (\n              <button {...this.props}>{this.props.children}</button>\n            )\n          }\n        });\n        export default Button;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var App, a = <App />;", ({ task }) => {
      const code = `var App, a = <App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: invalid (index 0)\n\n--- Source code under test ---\nvar App, a = <App />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notInScope): 'React' must be in scope when using JSX\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("'React' must be in scope when using JSX");
    });

    it("invalid[1]: var a = <App />;", ({ task }) => {
      const code = `var a = <App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: invalid (index 1)\n\n--- Source code under test ---\nvar a = <App />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notInScope): 'React' must be in scope when using JSX\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("'React' must be in scope when using JSX");
    });

    it("invalid[2]: var a = <img />;", ({ task }) => {
      const code = `var a = <img />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: invalid (index 2)\n\n--- Source code under test ---\nvar a = <img />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notInScope): 'React' must be in scope when using JSX\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("'React' must be in scope when using JSX");
    });

    it("invalid[3]: var a = <>fragment</>;", ({ task }) => {
      const code = `var a = <>fragment</>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: invalid (index 3)\n\n--- Source code under test ---\nvar a = <>fragment</>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notInScope): 'React' must be in scope when using JSX\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("'React' must be in scope when using JSX");
    });

    it("invalid[4]: /** @jsx React.DOM */ var a = <img />;", ({ task }) => {
      const code = `/** @jsx React.DOM */ var a = <img />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: invalid (index 4)\n\n--- Source code under test ---\n/** @jsx React.DOM */ var a = <img />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notInScope): 'React' must be in scope when using JSX\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("'React' must be in scope when using JSX");
    });

    it("invalid[5]: /** @jsx Foo.bar */ var React, a = <img />;", ({ task }) => {
      const code = `/** @jsx Foo.bar */ var React, a = <img />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: react-in-jsx-scope\nType: invalid (index 5)\n\n--- Source code under test ---\n/** @jsx Foo.bar */ var React, a = <img />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notInScope): 'Foo' must be in scope when using JSX\n\nRule message templates:\n  notInScope: '{{name}}' must be in scope when using JSX";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("'Foo' must be in scope when using JSX");
    });

  });
});
