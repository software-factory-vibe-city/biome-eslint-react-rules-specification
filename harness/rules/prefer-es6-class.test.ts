import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "prefer-es6-class";
const VALID_COUNT = 3;

const RULE_MESSAGES = [
  "Component should use es6 class instead of createClass",
  "Component should use createClass instead of es6 class",
];

const cases = [
  { code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.displayName = 'Hello'
      `, filename: "test.jsx" },
  { code: `
        export default class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.displayName = 'Hello'
      `, filename: "test.jsx" },
  { code: `
        var Hello = "foo";
        module.exports = {};
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
];

describe("prefer-es6-class", () => {
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
    it("valid[0]: class Hello extends React.Component { render() { return <...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.displayName = 'Hello'
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-es6-class\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n        Hello.displayName = 'Hello'\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  shouldUseES6Class: Component should use es6 class instead of createClass\n  shouldUseCreateClass: Component should use createClass instead of es6 class";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: export default class Hello extends React.Component { rend...", ({ task }) => {
      const code = `
        export default class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.displayName = 'Hello'
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-es6-class\nType: valid (index 1)\n\n--- Source code under test ---\n\n        export default class Hello extends React.Component {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n        Hello.displayName = 'Hello'\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  shouldUseES6Class: Component should use es6 class instead of createClass\n  shouldUseCreateClass: Component should use createClass instead of es6 class";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = \"foo\"; module.exports = {};", ({ task }) => {
      const code = `
        var Hello = "foo";
        module.exports = {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-es6-class\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = \"foo\";\n        module.exports = {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  shouldUseES6Class: Component should use es6 class instead of createClass\n  shouldUseCreateClass: Component should use createClass instead of es6 class";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ displayName: 'Hello', rend...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-es6-class\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          displayName: 'Hello',\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: shouldUseES6Class): Component should use es6 class instead of createClass\n\nRule message templates:\n  shouldUseES6Class: Component should use es6 class instead of createClass\n  shouldUseCreateClass: Component should use createClass instead of es6 class";
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should use es6 class instead of createClass");
    });

  });
});
