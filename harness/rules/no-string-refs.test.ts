import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Using this.refs is deprecated.",
  "Using string literals in ref attributes is deprecated.",
];

describe("no-string-refs", () => {
  describe("valid", () => {
    it("valid[0]: var Hello = createReactClass({ componentDidMount: functio...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {
            var component = this.hello;
          },
          render: function() {
            return <div ref={c => this.hello = c}>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-string-refs\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {\n            var component = this.hello;\n          },\n          render: function() {\n            return <div ref={c => this.hello = c}>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  thisRefsDeprecated: Using this.refs is deprecated.\n  stringInRefDeprecated: Using string literals in ref attributes is deprecated.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-string-refs", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div ref={\`hello\`}>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-string-refs\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div ref={`hello`}>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  thisRefsDeprecated: Using this.refs is deprecated.\n  stringInRefDeprecated: Using string literals in ref attributes is deprecated.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-string-refs", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div ref={\`hello\${index}\`}>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-string-refs\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div ref={`hello${index}`}>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  thisRefsDeprecated: Using this.refs is deprecated.\n  stringInRefDeprecated: Using string literals in ref attributes is deprecated.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-string-refs", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

});
