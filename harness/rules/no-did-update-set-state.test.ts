import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-did-update-set-state";
const VALID_COUNT = 5;

const RULE_MESSAGES = [
  "Do not use setState in {{name}}",
  "Do not use setState in componentDidUpdate",
];

const cases = [
  { code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidUpdate: function() {}
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someHandler = this.setState;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            someClass.onSomeEvent(function(data) {
              this.setState({
                data: data
              });
            })
          }
        });
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
      var Hello = createReactClass({
        componentDidUpdate: function() {
          this.setState({
            data: data
          });
        }
      });
    `, filename: "test.jsx" },
  { code: `
      class Hello extends React.Component {
        componentDidUpdate() {
          this.setState({
            data: data
          });
        }
      }
    `, filename: "test.jsx" },
  { code: `
      class Hello extends React.Component {
        componentDidUpdate = () => {
          this.setState({
            data: data
          });
        }
      }
    `, filename: "test.jsx" },
  { code: `
      var Hello = createReactClass({
        componentDidUpdate: function() {
          if (true) {
            this.setState({
              data: data
            });
          }
        }
      });
    `, filename: "test.jsx" },
  { code: `
      class Hello extends React.Component {
        componentDidUpdate() {
          if (true) {
            this.setState({
              data: data
            });
          }
        }
      }
    `, filename: "test.jsx" },
];

describe("no-did-update-set-state", () => {
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
    it("valid[0]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {}
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {}\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
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
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-did-update-set-state\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {\n            someNonMemberFunction(arg);\n            this.someHandler = this.setState;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSetState: Do not use setState in {{name}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
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
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

    it("invalid[1]: class Hello extends React.Component { componentDidUpdate(...", ({ task }) => {
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
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

    it("invalid[2]: class Hello extends React.Component { componentDidUpdate ...", ({ task }) => {
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
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

    it("invalid[7]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
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
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

    it("invalid[8]: class Hello extends React.Component { componentDidUpdate(...", ({ task }) => {
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
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use setState in componentDidUpdate");
    });

  });
});
