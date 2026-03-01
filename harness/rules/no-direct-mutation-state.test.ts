import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-direct-mutation-state";
const VALID_COUNT = 7;

const RULE_MESSAGES = [
  "Do not mutate state directly. Use setState().",
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
          render: function() {
            var obj = {state: {}};
            obj.state.name = "foo";
            return <div>Hello {obj.state.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = "foo";
        module.exports = {};
      `, filename: "test.jsx" },
  { code: `
        class Hello {
          getFoo() {
            this.state.foo = 'bar'
            return this.state.foo;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          constructor() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          constructor() {
            this.state.foo = 1;
          }
        }
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            this.state.foo = "bar"
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            this.state.foo++;
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name= "bar"
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name.first = "bar"
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            this.state.person.name.first = "bar"
            this.state.person.name.last = "baz"
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          constructor() {
            someFn()
          }
          someFn() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          constructor(props) {
            super(props)
            doSomethingAsync(() => {
              this.state = "bad";
            });
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          componentWillMount() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          componentDidMount() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          componentWillReceiveProps() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          shouldComponentUpdate() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          componentWillUpdate() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          componentDidUpdate() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          componentWillUnmount() {
            this.state.foo = "bar"
          }
        }
      `, filename: "test.jsx" },
];

describe("no-direct-mutation-state", () => {
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
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { var o...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = \"foo\"; module.exports = {};", ({ task }) => {
      const code = `
        var Hello = "foo";
        module.exports = {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = \"foo\";\n        module.exports = {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: class Hello { getFoo() { this.state.foo = 'bar' return th...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: class Hello extends React.Component { constructor() { thi...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          constructor() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 4)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          constructor() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class Hello extends React.Component { constructor() { thi...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          constructor() {
            this.state.foo = 1;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          constructor() {\n            this.state.foo = 1;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: class OneComponent extends Component { constructor() { su...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ render: function() { this....", ({ task }) => {
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
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[1]: var Hello = createReactClass({ render: function() { this....", ({ task }) => {
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
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[2]: var Hello = createReactClass({ render: function() { this....", ({ task }) => {
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
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[3]: var Hello = createReactClass({ render: function() { this....", ({ task }) => {
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
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[4]: var Hello = createReactClass({ render: function() { this....", ({ task }) => {
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
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
      expect(matches[1].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[5]: class Hello extends React.Component { constructor() { som...", ({ task }) => {
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
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[6]: class Hello extends React.Component { constructor(props) ...", ({ task }) => {
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
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[7]: class Hello extends React.Component { componentWillMount(...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillMount() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillMount() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[8]: class Hello extends React.Component { componentDidMount()...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentDidMount() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentDidMount() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[9]: class Hello extends React.Component { componentWillReceiv...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillReceiveProps() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillReceiveProps() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[10]: class Hello extends React.Component { shouldComponentUpda...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          shouldComponentUpdate() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          shouldComponentUpdate() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[11]: class Hello extends React.Component { componentWillUpdate...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillUpdate() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillUpdate() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[12]: class Hello extends React.Component { componentDidUpdate(...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentDidUpdate() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentDidUpdate() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

    it("invalid[13]: class Hello extends React.Component { componentWillUnmoun...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          componentWillUnmount() {
            this.state.foo = "bar"
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-direct-mutation-state\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          componentWillUnmount() {\n            this.state.foo = \"bar\"\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDirectMutation): Do not mutate state directly. Use setState().\n\nRule message templates:\n  noDirectMutation: Do not mutate state directly. Use setState().";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not mutate state directly. Use setState().");
    });

  });
});
