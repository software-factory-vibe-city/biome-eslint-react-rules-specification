import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-set-state";
const VALID_COUNT = 3;

const RULE_MESSAGES = [
  "Do not use setState",
];

const cases = [
  { code: `
        var Hello = function() {
          this.setState({})
        };
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          },
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render() {
            return <div onMouseEnter={() => this.setState({dropdownIndex: index})} />;
          }
        };
      `, filename: "test.jsx" },
];

describe("no-set-state", () => {
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
    it("valid[0]: var Hello = function() { this.setState({}) };", ({ task }) => {
      const code = `
        var Hello = function() {
          this.setState({})
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = function() {\n          this.setState({})\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
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
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

    it("invalid[1]: var Hello = createReactClass({ someMethod: function() { t...", ({ task }) => {
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
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

    it("invalid[2]: class Hello extends React.Component { someMethod() { this...", ({ task }) => {
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
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

    it("invalid[3]: class Hello extends React.Component { someMethod = () => ...", ({ task }) => {
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
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

    it("invalid[4]: class Hello extends React.Component { render() { return <...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div onMouseEnter={() => this.setState({dropdownIndex: index})} />;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-set-state\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div onMouseEnter={() => this.setState({dropdownIndex: index})} />;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSetState): Do not use setState\n\nRule message templates:\n  noSetState: Do not use setState";
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState");
    });

  });
});
