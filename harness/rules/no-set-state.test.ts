import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not use setState",
];

describe("no-set-state", () => {
  describe("valid", () => {
    it("valid[0]: var Hello = function() { this.setState({}) };", async ({ task }) => {
      const code = `
        var Hello = function() {
          this.setState({})
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = function() {\n          this.setState({})\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          },
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {\n            someNonMemberFunction(arg);\n            this.someHandler = this.setState;\n          },\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            this.setState({
              name: this.props.name.toUpperCase()
            });
          },
          render: function() {
            return <div>Hello {this.state.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {\n            this.setState({\n              name: this.props.name.toUpperCase()\n            });\n          },\n          render: function() {\n            return <div>Hello {this.state.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState\n\nRule message templates:\n  noSetState: Do not use setState";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

    it("invalid[1]: var Hello = createReactClass({ someMethod: function() { t...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          someMethod: function() {
            this.setState({
              name: this.props.name.toUpperCase()
            });
          },
          render: function() {
            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          someMethod: function() {\n            this.setState({\n              name: this.props.name.toUpperCase()\n            });\n          },\n          render: function() {\n            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState\n\nRule message templates:\n  noSetState: Do not use setState";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

    it("invalid[2]: class Hello extends React.Component { someMethod() { this...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          someMethod() {
            this.setState({
              name: this.props.name.toUpperCase()
            });
          }
          render() {
            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          someMethod() {\n            this.setState({\n              name: this.props.name.toUpperCase()\n            });\n          }\n          render() {\n            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState\n\nRule message templates:\n  noSetState: Do not use setState";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

    it("invalid[3]: class Hello extends React.Component { someMethod = () => ...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          someMethod = () => {
            this.setState({
              name: this.props.name.toUpperCase()
            });
          }
          render() {
            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          someMethod = () => {\n            this.setState({\n              name: this.props.name.toUpperCase()\n            });\n          }\n          render() {\n            return <div onClick={this.someMethod.bind(this)}>Hello {this.state.name}</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  noSetState: Do not use setState";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

    it("invalid[4]: class Hello extends React.Component { render() { return <...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div onMouseEnter={() => this.setState({dropdownIndex: index})} />;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div onMouseEnter={() => this.setState({dropdownIndex: index})} />;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState\n\nRule message templates:\n  noSetState: Do not use setState";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-set-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

  });
});
