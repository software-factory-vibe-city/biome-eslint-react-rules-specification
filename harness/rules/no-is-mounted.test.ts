import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-is-mounted";
const VALID_COUNT = 4;

const RULE_MESSAGES = [
  "Do not use isMounted",
];

const cases = [
  { code: `
        var Hello = function() {
        };
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someFunc = this.isMounted;
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          notIsMounted() {}
          render() {
            this.notIsMounted();
            return <div>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            if (!this.isMounted()) {
              return;
            }
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          someMethod: function() {
            if (!this.isMounted()) {
              return;
            }
          },
          render: function() {
            return <div onClick={this.someMethod.bind(this)}>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          someMethod() {
            if (!this.isMounted()) {
              return;
            }
          }
          render() {
            return <div onClick={this.someMethod.bind(this)}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
];

describe("no-is-mounted", () => {
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
    it("valid[0]: var Hello = function() { };", ({ task }) => {
      const code = `
        var Hello = function() {
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = function() {\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            someNonMemberFunction(arg);
            this.someFunc = this.isMounted;
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {\n            someNonMemberFunction(arg);\n            this.someFunc = this.isMounted;\n          },\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: class Hello extends React.Component { notIsMounted() {} r...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          notIsMounted() {}
          render() {
            this.notIsMounted();
            return <div>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: valid (index 3)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          notIsMounted() {}\n          render() {\n            this.notIsMounted();\n            return <div>Hello</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {
            if (!this.isMounted()) {
              return;
            }
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {\n            if (!this.isMounted()) {\n              return;\n            }\n          },\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noIsMounted): Do not use isMounted\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use isMounted");
    });

    it("invalid[1]: var Hello = createReactClass({ someMethod: function() { i...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          someMethod: function() {
            if (!this.isMounted()) {
              return;
            }
          },
          render: function() {
            return <div onClick={this.someMethod.bind(this)}>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          someMethod: function() {\n            if (!this.isMounted()) {\n              return;\n            }\n          },\n          render: function() {\n            return <div onClick={this.someMethod.bind(this)}>Hello</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noIsMounted): Do not use isMounted\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use isMounted");
    });

    it("invalid[2]: class Hello extends React.Component { someMethod() { if (...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          someMethod() {
            if (!this.isMounted()) {
              return;
            }
          }
          render() {
            return <div onClick={this.someMethod.bind(this)}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          someMethod() {\n            if (!this.isMounted()) {\n              return;\n            }\n          }\n          render() {\n            return <div onClick={this.someMethod.bind(this)}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noIsMounted): Do not use isMounted\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use isMounted");
    });

  });
});
