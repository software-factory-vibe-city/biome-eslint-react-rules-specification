import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "prefer-stateless-function";
const VALID_COUNT = 20;

const RULE_MESSAGES = [
  "Component should be written as a pure function",
];

const cases = [
  { code: `
        const Foo = function(props) {
          return <div>{props.foo}</div>;
        };
      `, filename: "test.jsx" },
  { code: `const Foo = ({foo}) => <div>{foo}</div>;`, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return false;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          changeState() {
            this.setState({foo: "clicked"});
          }
          render() {
            return <div onClick={this.changeState.bind(this)}>{this.state.foo || "bar"}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          doStuff() {
            this.refs.foo.style.backgroundColor = "red";
          }
          render() {
            return <div ref="foo" onClick={this.doStuff}>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          doStuff() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor() {
            doSpecialStuffs();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor() {
            foo;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor(props)

          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.bar}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            let {props:{foo}, bar} = this;
            return <div>{foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            return <div>{this[bar]}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            return <div>{this['bar']}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        export default (Component) => (
          class Test extends React.Component {
            componentDidMount() {}
            render() {
              return <Component />;
            }
          }
        );
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
        Foo.childContextTypes = {
          color: PropTypes.string
        };
      `, filename: "test.jsx" },
  { code: `
        @foo
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        @foo("bar")
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        @foo
        @bar()
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        /**
         * @param a.
         */
        function Comp() {
          return <a></a>
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            return <div>{this['props'].foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>foo</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          static get displayName() {
            return 'Foo';
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          static displayName = 'Foo';
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          static get propTypes() {
            return {
              name: PropTypes.string
            };
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          static propTypes = {
            name: PropTypes.string
          };
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor() {
            super();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            let {props:{foo}, context:{bar}} = this;
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        var Foo = createReactClass({
          render: function() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            return true ? <div /> : null;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          static defaultProps = {
            foo: true
          }
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          static get defaultProps() {
            return {
              foo: true
            };
          }
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
        Foo.defaultProps = {
          foo: true
        };
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          static contextTypes = {
            foo: PropTypes.boolean
          }
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          static get contextTypes() {
            return {
              foo: PropTypes.boolean
            };
          }
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
        Foo.contextTypes = {
          foo: PropTypes.boolean
        };
      `, filename: "test.jsx" },
];

describe("prefer-stateless-function", () => {
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
    it("valid[0]: const Foo = function(props) { return <div>{props.foo}</di...", ({ task }) => {
      const code = `
        const Foo = function(props) {
          return <div>{props.foo}</div>;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 0)\n\n--- Source code under test ---\n\n        const Foo = function(props) {\n          return <div>{props.foo}</div>;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: const Foo = ({foo}) => <div>{foo}</div>;", ({ task }) => {
      const code = `const Foo = ({foo}) => <div>{foo}</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 1)\n\n--- Source code under test ---\nconst Foo = ({foo}) => <div>{foo}</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class Foo extends React.Component { shouldComponentUpdate...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return false;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          shouldComponentUpdate() {\n            return false;\n          }\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: class Foo extends React.Component { changeState() { this....", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          changeState() {
            this.setState({foo: "clicked"});
          }
          render() {
            return <div onClick={this.changeState.bind(this)}>{this.state.foo || "bar"}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 6)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          changeState() {\n            this.setState({foo: \"clicked\"});\n          }\n          render() {\n            return <div onClick={this.changeState.bind(this)}>{this.state.foo || \"bar\"}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: class Foo extends React.Component { doStuff() { this.refs...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          doStuff() {
            this.refs.foo.style.backgroundColor = "red";
          }
          render() {
            return <div ref="foo" onClick={this.doStuff}>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 7)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          doStuff() {\n            this.refs.foo.style.backgroundColor = \"red\";\n          }\n          render() {\n            return <div ref=\"foo\" onClick={this.doStuff}>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: class Foo extends React.Component { doStuff() {} render()...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          doStuff() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 8)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          doStuff() {}\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: class Foo extends React.Component { constructor() {} rend...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor() {}
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 9)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor() {}\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: class Foo extends React.Component { constructor() { doSpe...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor() {
            doSpecialStuffs();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 10)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor() {\n            doSpecialStuffs();\n          }\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: class Foo extends React.Component { constructor() { foo; ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor() {
            foo;
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 11)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor() {\n            foo;\n          }\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: class Foo extends React.Component { constructor(props) re...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor(props)

          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 12)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor(props)\n\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: no-default, no-babel\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: class Foo extends React.Component { render() { return <di...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            return <div>{this.bar}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 13)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            return <div>{this.bar}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: class Foo extends React.Component { render() { let {props...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            let {props:{foo}, bar} = this;
            return <div>{foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 14)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            let {props:{foo}, bar} = this;\n            return <div>{foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: class Foo extends React.Component { render() { return <di...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            return <div>{this[bar]}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 15)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            return <div>{this[bar]}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: class Foo extends React.Component { render() { return <di...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            return <div>{this['bar']}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 16)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            return <div>{this['bar']}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: export default (Component) => ( class Test extends React....", ({ task }) => {
      const code = `
        export default (Component) => (
          class Test extends React.Component {
            componentDidMount() {}
            render() {
              return <Component />;
            }
          }
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 20)\n\n--- Source code under test ---\n\n        export default (Component) => (\n          class Test extends React.Component {\n            componentDidMount() {}\n            render() {\n              return <Component />;\n            }\n          }\n        );\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: class Foo extends React.Component { render() { return <di...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
        Foo.childContextTypes = {
          color: PropTypes.string
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 21)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            return <div>{this.props.children}</div>;\n          }\n        }\n        Foo.childContextTypes = {\n          color: PropTypes.string\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: @foo class Foo extends React.Component { render() { retur...", ({ task }) => {
      const code = `
        @foo
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 22)\n\n--- Source code under test ---\n\n        @foo\n        class Foo extends React.Component {\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: decorators\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: @foo(\"bar\") class Foo extends React.Component { render() ...", ({ task }) => {
      const code = `
        @foo("bar")
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 23)\n\n--- Source code under test ---\n\n        @foo(\"bar\")\n        class Foo extends React.Component {\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: decorators\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: @foo @bar() class Foo extends React.Component { render() ...", ({ task }) => {
      const code = `
        @foo
        @bar()
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 24)\n\n--- Source code under test ---\n\n        @foo\n        @bar()\n        class Foo extends React.Component {\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: decorators\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: /** * @param a. */ function Comp() { return <a></a> }", ({ task }) => {
      const code = `
        /**
         * @param a.
         */
        function Comp() {
          return <a></a>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: valid (index 29)\n\n--- Source code under test ---\n\n        /**\n         * @param a.\n         */\n        function Comp() {\n          return <a></a>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: class Foo extends React.Component { render() { return <di...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[1]: class Foo extends React.Component { render() { return <di...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            return <div>{this['props'].foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            return <div>{this['props'].foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[2]: class Foo extends React.PureComponent { render() { return...", ({ task }) => {
      const code = `
        class Foo extends React.PureComponent {
          render() {
            return <div>foo</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Foo extends React.PureComponent {\n          render() {\n            return <div>foo</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[3]: class Foo extends React.PureComponent { render() { return...", ({ task }) => {
      const code = `
        class Foo extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Foo extends React.PureComponent {\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[4]: class Foo extends React.Component { static get displayNam...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          static get displayName() {
            return 'Foo';
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          static get displayName() {\n            return 'Foo';\n          }\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[5]: class Foo extends React.Component { static displayName = ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          static displayName = 'Foo';
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          static displayName = 'Foo';\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nFeatures: class fields\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[6]: class Foo extends React.Component { static get propTypes(...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          static get propTypes() {
            return {
              name: PropTypes.string
            };
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          static get propTypes() {\n            return {\n              name: PropTypes.string\n            };\n          }\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[7]: class Foo extends React.Component { static propTypes = { ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          static propTypes = {
            name: PropTypes.string
          };
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          static propTypes = {\n            name: PropTypes.string\n          };\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nFeatures: class fields\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[9]: class Foo extends React.Component { constructor() { super...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor() {
            super();
          }
          render() {
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor() {\n            super();\n          }\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[10]: class Foo extends React.Component { render() { let {props...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            let {props:{foo}, context:{bar}} = this;
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            let {props:{foo}, context:{bar}} = this;\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[11]: class Foo extends React.Component { render() { if (!this....", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            if (!this.props.foo) {\n              return null;\n            }\n            return <div>{this.props.foo}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[12]: var Foo = createReactClass({ render: function() { if (!th...", ({ task }) => {
      const code = `
        var Foo = createReactClass({
          render: function() {
            if (!this.props.foo) {
              return null;
            }
            return <div>{this.props.foo}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        var Foo = createReactClass({\n          render: function() {\n            if (!this.props.foo) {\n              return null;\n            }\n            return <div>{this.props.foo}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[13]: class Foo extends React.Component { render() { return tru...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            return true ? <div /> : null;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            return true ? <div /> : null;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[14]: class Foo extends React.Component { static defaultProps =...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          static defaultProps = {
            foo: true
          }
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          static defaultProps = {\n            foo: true\n          }\n          render() {\n            const { foo } = this.props;\n            return foo ? <div /> : null;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nFeatures: class fields\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[15]: class Foo extends React.Component { static get defaultPro...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          static get defaultProps() {
            return {
              foo: true
            };
          }
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          static get defaultProps() {\n            return {\n              foo: true\n            };\n          }\n          render() {\n            const { foo } = this.props;\n            return foo ? <div /> : null;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[16]: class Foo extends React.Component { render() { const { fo...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            const { foo } = this.props;
            return foo ? <div /> : null;
          }
        }
        Foo.defaultProps = {
          foo: true
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            const { foo } = this.props;\n            return foo ? <div /> : null;\n          }\n        }\n        Foo.defaultProps = {\n          foo: true\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[17]: class Foo extends React.Component { static contextTypes =...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          static contextTypes = {
            foo: PropTypes.boolean
          }
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 17)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          static contextTypes = {\n            foo: PropTypes.boolean\n          }\n          render() {\n            const { foo } = this.context;\n            return foo ? <div /> : null;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nFeatures: class fields\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[18]: class Foo extends React.Component { static get contextTyp...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          static get contextTypes() {
            return {
              foo: PropTypes.boolean
            };
          }
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          static get contextTypes() {\n            return {\n              foo: PropTypes.boolean\n            };\n          }\n          render() {\n            const { foo } = this.context;\n            return foo ? <div /> : null;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

    it("invalid[19]: class Foo extends React.Component { render() { const { fo...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            const { foo } = this.context;
            return foo ? <div /> : null;
          }
        }
        Foo.contextTypes = {
          foo: PropTypes.boolean
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-stateless-function\nType: invalid (index 19)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            const { foo } = this.context;\n            return foo ? <div /> : null;\n          }\n        }\n        Foo.contextTypes = {\n          foo: PropTypes.boolean\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: componentShouldBePure): Component should be written as a pure function\n\nRule message templates:\n  componentShouldBePure: Component should be written as a pure function";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component should be written as a pure function");
    });

  });
});
