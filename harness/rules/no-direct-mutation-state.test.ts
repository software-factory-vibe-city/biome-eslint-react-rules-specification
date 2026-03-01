import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not mutate state directly. Use setState().",
];

describe("no-direct-mutation-state", () => {
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
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { var o...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            var obj = {state: {}};
            obj.state.name = "foo";
            return <div>Hello {obj.state.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            var obj = {state: {}};\n            obj.state.name = \"foo\";\n            return <div>Hello {obj.state.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = \"foo\"; module.exports = {};", async ({ task }) => {
      const code = `
        var Hello = "foo";
        module.exports = {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = \"foo\";\n        module.exports = {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: class Hello { getFoo() { this.state.foo = 'bar' return th...", async ({ task }) => {
      const code = `
        class Hello {
          getFoo() {
            this.state.foo = 'bar'
            return this.state.foo;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 3)\n\n--- Source code under test ---\n\n        class Hello {\n          getFoo() {\n            this.state.foo = 'bar'\n            return this.state.foo;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: class Hello extends React.Component { constructor() { thi...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          constructor() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 4)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          constructor() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class Hello extends React.Component { constructor() { thi...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          constructor() {
            this.state.foo = 1;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          constructor() {\n            this.state.foo = 1;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: class OneComponent extends Component { constructor() { su...", async ({ task }) => {
      const code = `
        class OneComponent extends Component {
          constructor() {
            super();
            class AnotherComponent extends Component {
              constructor() {
                super();
              }
            }
            this.state = {};
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 6)\n\n--- Source code under test ---\n\n        class OneComponent extends Component {\n          constructor() {\n            super();\n            class AnotherComponent extends Component {\n              constructor() {\n                super();\n              }\n            }\n            this.state = {};\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ render: function() { this....", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            this.state.foo = "bar"
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            this.state.foo = \"bar\"\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[1]: var Hello = createReactClass({ render: function() { this....", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            this.state.foo++;
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            this.state.foo++;\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[2]: var Hello = createReactClass({ render: function() { this....", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name= "bar"
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            this.state.person.name= \"bar\"\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[3]: var Hello = createReactClass({ render: function() { this....", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name.first = "bar"
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            this.state.person.name.first = \"bar\"\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[4]: var Hello = createReactClass({ render: function() { this....", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name.first = "bar"
            this.state.person.name.last = "baz"
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            this.state.person.name.first = \"bar\"\n            this.state.person.name.last = \"baz\"\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: Do not mutate state directly. Use setState().\n  [1]: Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
      expect(matches[1].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[5]: class Hello extends React.Component { constructor() { som...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          constructor() {
            someFn()
          }
          someFn() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          constructor() {\n            someFn()\n          }\n          someFn() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[6]: class Hello extends React.Component { constructor(props) ...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          constructor(props) {
            super(props)
            doSomethingAsync(() => {
              this.state = "bad";
            });
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          constructor(props) {\n            super(props)\n            doSomethingAsync(() => {\n              this.state = \"bad\";\n            });\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[7]: class Hello extends React.Component { componentWillMount(...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillMount() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillMount() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[8]: class Hello extends React.Component { componentDidMount()...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentDidMount() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentDidMount() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[9]: class Hello extends React.Component { componentWillReceiv...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillReceiveProps() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillReceiveProps() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[10]: class Hello extends React.Component { shouldComponentUpda...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          shouldComponentUpdate() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          shouldComponentUpdate() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[11]: class Hello extends React.Component { componentWillUpdate...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillUpdate() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillUpdate() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[12]: class Hello extends React.Component { componentDidUpdate(...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentDidUpdate() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentDidUpdate() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[13]: class Hello extends React.Component { componentWillUnmoun...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillUnmount() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillUnmount() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-direct-mutation-state", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

  });
});
