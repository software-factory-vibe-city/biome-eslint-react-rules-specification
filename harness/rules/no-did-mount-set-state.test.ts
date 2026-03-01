import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not use setState in {{name}}",
  "Do not use setState in componentDidMount",
];

describe("no-did-mount-set-state", () => {
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
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ componentDidMount: functio...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {}
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {}\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ componentDidMount: functio...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {\n            someNonMemberFunction(arg);\n            this.someHandler = this.setState;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ componentDidMount: functio...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: valid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {\n            someClass.onSomeEvent(function(data) {\n              this.setState({\n                data: data\n              });\n            })\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = createReactClass({ componentDidMount: functio...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {
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
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: valid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {\n            function handleEvent(data) {\n              this.setState({\n                data: data\n              });\n            }\n            someClass.onSomeEvent(handleEvent)\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentDidMount: functio...", async ({ task }) => {
      const code = `
      var Hello = createReactClass({
        componentDidMount: function() {
          this.setState({
            data: data
          });
        }
      });
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: invalid (index 0)\n\n--- Source code under test ---\n\n      var Hello = createReactClass({\n        componentDidMount: function() {\n          this.setState({\n            data: data\n          });\n        }\n      });\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidMount\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidMount");
    });

    it("invalid[1]: class Hello extends React.Component { componentDidMount()...", async ({ task }) => {
      const code = `
      class Hello extends React.Component {
        componentDidMount() {
          this.setState({
            data: data
          });
        }
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: invalid (index 1)\n\n--- Source code under test ---\n\n      class Hello extends React.Component {\n        componentDidMount() {\n          this.setState({\n            data: data\n          });\n        }\n      }\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidMount\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidMount");
    });

    it("invalid[2]: class Hello extends React.Component { componentDidMount =...", async ({ task }) => {
      const code = `
      class Hello extends React.Component {
        componentDidMount = () => {
          this.setState({
            data: data
          });
        }
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: invalid (index 2)\n\n--- Source code under test ---\n\n      class Hello extends React.Component {\n        componentDidMount = () => {\n          this.setState({\n            data: data\n          });\n        }\n      }\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidMount\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidMount");
    });

    it("invalid[7]: var Hello = createReactClass({ componentDidMount: functio...", async ({ task }) => {
      const code = `
      var Hello = createReactClass({
        componentDidMount: function() {
          if (true) {
            this.setState({
              data: data
            });
          }
        }
      });
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: invalid (index 7)\n\n--- Source code under test ---\n\n      var Hello = createReactClass({\n        componentDidMount: function() {\n          if (true) {\n            this.setState({\n              data: data\n            });\n          }\n        }\n      });\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidMount\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidMount");
    });

    it("invalid[8]: class Hello extends React.Component { componentDidMount()...", async ({ task }) => {
      const code = `
      class Hello extends React.Component {
        componentDidMount() {
          if (true) {
            this.setState({
              data: data
            });
          }
        }
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-mount-set-state\nType: invalid (index 8)\n\n--- Source code under test ---\n\n      class Hello extends React.Component {\n        componentDidMount() {\n          if (true) {\n            this.setState({\n              data: data\n            });\n          }\n        }\n      }\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState in componentDidMount\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-did-mount-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidMount");
    });

  });
});
