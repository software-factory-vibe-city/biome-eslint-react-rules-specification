import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Stateless functional components should not use `this`",
];

describe("no-this-in-sfc", () => {
  describe("valid", () => {
    it("valid[0]: function Foo(props) { const { foo } = props; return <div ...", async ({ task }) => {
      const code = `
        function Foo(props) {
          const { foo } = props;
          return <div bar={foo} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 0)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          const { foo } = props;\n          return <div bar={foo} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: function Foo({ foo }) { return <div bar={foo} />; }", async ({ task }) => {
      const code = `
        function Foo({ foo }) {
          return <div bar={foo} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 1)\n\n--- Source code under test ---\n\n        function Foo({ foo }) {\n          return <div bar={foo} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: class Foo extends React.Component { render() { const { fo...", async ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            const { foo } = this.props;
            return <div bar={foo} />;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 2)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            const { foo } = this.props;\n            return <div bar={foo} />;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: const Foo = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        const Foo = createReactClass({
          render: function() {
            return <div>{this.props.foo}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 3)\n\n--- Source code under test ---\n\n        const Foo = createReactClass({\n          render: function() {\n            return <div>{this.props.foo}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: function foo(bar) { this.bar = bar; this.props = 'baz'; t...", async ({ task }) => {
      const code = `
        function foo(bar) {
          this.bar = bar;
          this.props = 'baz';
          this.getFoo = function() {
            return this.bar + this.props;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 5)\n\n--- Source code under test ---\n\n        function foo(bar) {\n          this.bar = bar;\n          this.props = 'baz';\n          this.getFoo = function() {\n            return this.bar + this.props;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: function Foo(props) { return props.foo ? <span>{props.bar...", async ({ task }) => {
      const code = `
        function Foo(props) {
          return props.foo ? <span>{props.bar}</span> : null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 6)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          return props.foo ? <span>{props.bar}</span> : null;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: function Foo(props) { if (props.foo) { return <div>{props...", async ({ task }) => {
      const code = `
        function Foo(props) {
          if (props.foo) {
            return <div>{props.bar}</div>;
          }
          return null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 7)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          if (props.foo) {\n            return <div>{props.bar}</div>;\n          }\n          return null;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: function Foo(props) { if (props.foo) { something(); } ret...", async ({ task }) => {
      const code = `
        function Foo(props) {
          if (props.foo) {
            something();
          }
          return null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 8)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          if (props.foo) {\n            something();\n          }\n          return null;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const Foo = (props) => <span>{props.foo}</span>", async ({ task }) => {
      const code = `const Foo = (props) => <span>{props.foo}</span>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 9)\n\n--- Source code under test ---\nconst Foo = (props) => <span>{props.foo}</span>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: const Foo = ({ foo }) => <span>{foo}</span>", async ({ task }) => {
      const code = `const Foo = ({ foo }) => <span>{foo}</span>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 10)\n\n--- Source code under test ---\nconst Foo = ({ foo }) => <span>{foo}</span>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: const Foo = (props) => props.foo ? <span>{props.bar}</spa...", async ({ task }) => {
      const code = `const Foo = (props) => props.foo ? <span>{props.bar}</span> : null;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 11)\n\n--- Source code under test ---\nconst Foo = (props) => props.foo ? <span>{props.bar}</span> : null;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: const Foo = ({ foo, bar }) => foo ? <span>{bar}</span> : ...", async ({ task }) => {
      const code = `const Foo = ({ foo, bar }) => foo ? <span>{bar}</span> : null;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 12)\n\n--- Source code under test ---\nconst Foo = ({ foo, bar }) => foo ? <span>{bar}</span> : null;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: class Foo { bar() { () => { this.something(); return null...", async ({ task }) => {
      const code = `
        class Foo {
          bar() {
            () => {
              this.something();
              return null;
            };
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 13)\n\n--- Source code under test ---\n\n        class Foo {\n          bar() {\n            () => {\n              this.something();\n              return null;\n            };\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: class Foo { bar = () => { this.something(); return null; ...", async ({ task }) => {
      const code = `
        class Foo {
          bar = () => {
            this.something();
            return null;
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 14)\n\n--- Source code under test ---\n\n        class Foo {\n          bar = () => {\n            this.something();\n            return null;\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: export const Example = ({ prop }) => { return { handleCli...", async ({ task }) => {
      const code = `
        export const Example = ({ prop }) => {
          return {
            handleClick: () => {},
            renderNode() {
              return <div onClick={this.handleClick} />;
            },
          };
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 15)\n\n--- Source code under test ---\n\n        export const Example = ({ prop }) => {\n          return {\n            handleClick: () => {},\n            renderNode() {\n              return <div onClick={this.handleClick} />;\n            },\n          };\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: export const prepareLogin = new ValidatedMethod({ name: \"...", async ({ task }) => {
      const code = `
        export const prepareLogin = new ValidatedMethod({
          name: "user.prepare",
          validate: new SimpleSchema({
          }).validator(),
          run({ remember }) {
              if (Meteor.isServer) {
                  const connectionId = this.connection.id; // react/no-this-in-sfc
                  return Methods.prepareLogin(connectionId, remember);
              }
              return null;
          },
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 16)\n\n--- Source code under test ---\n\n        export const prepareLogin = new ValidatedMethod({\n          name: \"user.prepare\",\n          validate: new SimpleSchema({\n          }).validator(),\n          run({ remember }) {\n              if (Meteor.isServer) {\n                  const connectionId = this.connection.id; // react/no-this-in-sfc\n                  return Methods.prepareLogin(connectionId, remember);\n              }\n              return null;\n          },\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: obj.notAComponent = function () { return this.a || null; };", async ({ task }) => {
      const code = `
        obj.notAComponent = function () {
          return this.a || null;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 17)\n\n--- Source code under test ---\n\n        obj.notAComponent = function () {\n          return this.a || null;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: $.fn.getValueAsStringWeak = function (): string | null { ...", async ({ task }) => {
      const code = `
        $.fn.getValueAsStringWeak = function (): string | null {
          const val = this.length === 1 ? this.val() : null;

          return typeof val === 'string' ? val : null;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: valid (index 18)\n\n--- Source code under test ---\n\n        $.fn.getValueAsStringWeak = function (): string | null {\n          const val = this.length === 1 ? this.val() : null;\n\n          return typeof val === 'string' ? val : null;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: function Foo(props) { const { foo } = this.props; return ...", async ({ task }) => {
      const code = `
        function Foo(props) {
          const { foo } = this.props;
          return <div>{foo}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          const { foo } = this.props;\n          return <div>{foo}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[1]: function Foo(props) { return <div>{this.props.foo}</div>; }", async ({ task }) => {
      const code = `
        function Foo(props) {
          return <div>{this.props.foo}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          return <div>{this.props.foo}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[2]: function Foo(props) { return <div>{this.state.foo}</div>; }", async ({ task }) => {
      const code = `
        function Foo(props) {
          return <div>{this.state.foo}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          return <div>{this.state.foo}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[3]: function Foo(props) { const { foo } = this.state; return ...", async ({ task }) => {
      const code = `
        function Foo(props) {
          const { foo } = this.state;
          return <div>{foo}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          const { foo } = this.state;\n          return <div>{foo}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[4]: function Foo(props) { return props.foo ? <div>{this.props...", async ({ task }) => {
      const code = `
        function Foo(props) {
          return props.foo ? <div>{this.props.bar}</div> : null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          return props.foo ? <div>{this.props.bar}</div> : null;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[5]: function Foo(props) { if (props.foo) { return <div>{this....", async ({ task }) => {
      const code = `
        function Foo(props) {
          if (props.foo) {
            return <div>{this.props.bar}</div>;
          }
          return null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          if (props.foo) {\n            return <div>{this.props.bar}</div>;\n          }\n          return null;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[6]: function Foo(props) { if (this.props.foo) { something(); ...", async ({ task }) => {
      const code = `
        function Foo(props) {
          if (this.props.foo) {
            something();
          }
          return null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          if (this.props.foo) {\n            something();\n          }\n          return null;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[7]: const Foo = (props) => <span>{this.props.foo}</span>", async ({ task }) => {
      const code = `const Foo = (props) => <span>{this.props.foo}</span>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 7)\n\n--- Source code under test ---\nconst Foo = (props) => <span>{this.props.foo}</span>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[8]: const Foo = (props) => this.props.foo ? <span>{props.bar}...", async ({ task }) => {
      const code = `const Foo = (props) => this.props.foo ? <span>{props.bar}</span> : null;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 8)\n\n--- Source code under test ---\nconst Foo = (props) => this.props.foo ? <span>{props.bar}</span> : null;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
    });

    it("invalid[9]: function Foo(props) { function onClick(bar) { this.props....", async ({ task }) => {
      const code = `
        function Foo(props) {
          function onClick(bar) {
            this.props.onClick();
          }
          return <div onClick={onClick}>{this.props.foo}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-this-in-sfc\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        function Foo(props) {\n          function onClick(bar) {\n            this.props.onClick();\n          }\n          return <div onClick={onClick}>{this.props.foo}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noThisInSFC): Stateless functional components should not use `this`\n  [1] (messageId: noThisInSFC): Stateless functional components should not use `this`\n\nRule message templates:\n  noThisInSFC: Stateless functional components should not use `this`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-this-in-sfc", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Stateless functional components should not use `this`");
      expect(matches[1].message).toBe("Stateless functional components should not use `this`");
    });

  });
});
