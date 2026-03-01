import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not use setState in {{name}}",
  "Do not use setState in componentDidUpdate",
];

describe("no-did-update-set-state", () => {
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
      task.meta.explanation = "Rule: no-did-update-set-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {}
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {}\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {\n            someNonMemberFunction(arg);\n            this.someHandler = this.setState;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: valid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {\n            someClass.onSomeEvent(function(data) {\n              this.setState({\n                data: data\n              });\n            })\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {
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
      task.meta.explanation = "Rule: no-did-update-set-state\nType: valid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {\n            function handleEvent(data) {\n              this.setState({\n                data: data\n              });\n            }\n            someClass.onSomeEvent(handleEvent)\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
      const code = `
      var Hello = createReactClass({
        componentDidUpdate: function() {
          this.setState({
            data: data
          });
        }
      });
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: invalid (index 0)\n\n--- Source code under test ---\n\n      var Hello = createReactClass({\n        componentDidUpdate: function() {\n          this.setState({\n            data: data\n          });\n        }\n      });\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidUpdate\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

    it("invalid[1]: class Hello extends React.Component { componentDidUpdate(...", async ({ task }) => {
      const code = `
      class Hello extends React.Component {
        componentDidUpdate() {
          this.setState({
            data: data
          });
        }
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: invalid (index 1)\n\n--- Source code under test ---\n\n      class Hello extends React.Component {\n        componentDidUpdate() {\n          this.setState({\n            data: data\n          });\n        }\n      }\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidUpdate\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

    it("invalid[2]: class Hello extends React.Component { componentDidUpdate ...", async ({ task }) => {
      const code = `
      class Hello extends React.Component {
        componentDidUpdate = () => {
          this.setState({
            data: data
          });
        }
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: invalid (index 2)\n\n--- Source code under test ---\n\n      class Hello extends React.Component {\n        componentDidUpdate = () => {\n          this.setState({\n            data: data\n          });\n        }\n      }\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidUpdate\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

    it("invalid[7]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
      const code = `
      var Hello = createReactClass({
        componentDidUpdate: function() {
          if (true) {
            this.setState({
              data: data
            });
          }
        }
      });
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: invalid (index 7)\n\n--- Source code under test ---\n\n      var Hello = createReactClass({\n        componentDidUpdate: function() {\n          if (true) {\n            this.setState({\n              data: data\n            });\n          }\n        }\n      });\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidUpdate\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

    it("invalid[8]: class Hello extends React.Component { componentDidUpdate(...", async ({ task }) => {
      const code = `
      class Hello extends React.Component {
        componentDidUpdate() {
          if (true) {
            this.setState({
              data: data
            });
          }
        }
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: invalid (index 8)\n\n--- Source code under test ---\n\n      class Hello extends React.Component {\n        componentDidUpdate() {\n          if (true) {\n            this.setState({\n              data: data\n            });\n          }\n        }\n      }\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidUpdate\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-update-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

  });
});
