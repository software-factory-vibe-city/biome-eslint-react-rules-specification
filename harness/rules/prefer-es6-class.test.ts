import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Component should use es6 class instead of createClass",
  "Component should use createClass instead of es6 class",
];

describe("prefer-es6-class", () => {
  describe("valid", () => {
    it("valid[0]: class Hello extends React.Component { render() { return <...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-es6-class", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: export default class Hello extends React.Component { rend...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-es6-class", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = \"foo\"; module.exports = {};", async ({ task }) => {
      const code = `
        var Hello = "foo";
        module.exports = {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-es6-class\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = \"foo\";\n        module.exports = {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  shouldUseES6Class: Component should use es6 class instead of createClass\n  shouldUseCreateClass: Component should use createClass instead of es6 class";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-es6-class", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ displayName: 'Hello', rend...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-es6-class", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should use es6 class instead of createClass");
    });

  });
});
