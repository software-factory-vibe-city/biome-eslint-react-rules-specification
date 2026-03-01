import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not use setState in {{name}}",
  "Do not use setState in componentWillUpdate",
  "Do not use setState in UNSAFE_componentWillUpdate",
];

describe("no-will-update-set-state", () => {
  describe("valid", () => {
    it("valid[0]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ componentWillUpdate: funct...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUpdate: function() {}
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUpdate: function() {}\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ componentWillUpdate: funct...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUpdate: function() {\n            someNonMemberFunction(arg);\n            this.someHandler = this.setState;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ componentWillUpdate: funct...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: valid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUpdate: function() {\n            someClass.onSomeEvent(function(data) {\n              this.setState({\n                data: data\n              });\n            })\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = createReactClass({ componentWillUpdate: funct...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            function handleEvent(data) {
              this.setState({
                data: data
              });
            }
            someClass.onSomeEvent(handleEvent)
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: valid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUpdate: function() {\n            function handleEvent(data) {\n              this.setState({\n                data: data\n              });\n            }\n            someClass.onSomeEvent(handleEvent)\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentWillUpdate: funct...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            this.setState({
              data: data
            });
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUpdate: function() {\n            this.setState({\n              data: data\n            });\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentWillUpdate\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentWillUpdate");
    });

    it("invalid[1]: class Hello extends React.Component { componentWillUpdate...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillUpdate() {
            this.setState({
              data: data
            });
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillUpdate() {\n            this.setState({\n              data: data\n            });\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentWillUpdate\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentWillUpdate");
    });

    it("invalid[6]: var Hello = createReactClass({ componentWillUpdate: funct...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUpdate: function() {
            if (true) {
              this.setState({
                data: data
              });
            }
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUpdate: function() {\n            if (true) {\n              this.setState({\n                data: data\n              });\n            }\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentWillUpdate\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentWillUpdate");
    });

    it("invalid[7]: class Hello extends React.Component { componentWillUpdate...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillUpdate() {
            if (true) {
              this.setState({
                data: data
              });
            }
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-will-update-set-state\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillUpdate() {\n            if (true) {\n              this.setState({\n                data: data\n              });\n            }\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentWillUpdate\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-will-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentWillUpdate");
    });

  });
});
