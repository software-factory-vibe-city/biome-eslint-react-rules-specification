import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not use isMounted",
];

describe("no-is-mounted", () => {
  describe("valid", () => {
    it("valid[0]: var Hello = function() { };", async ({ task }) => {
      const code = `
        var Hello = function() {
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = function() {\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-is-mounted", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-is-mounted\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noIsMounted: Do not use isMounted";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-is-mounted", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-is-mounted", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: class Hello extends React.Component { notIsMounted() {} r...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-is-mounted", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentDidUpdate: functi...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-is-mounted", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use isMounted");
    });

    it("invalid[1]: var Hello = createReactClass({ someMethod: function() { i...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-is-mounted", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use isMounted");
    });

    it("invalid[2]: class Hello extends React.Component { someMethod() { if (...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-is-mounted", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use isMounted");
    });

  });
});
