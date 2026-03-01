import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-no-bind";
const VALID_COUNT = 21;

const RULE_MESSAGES = [
  "JSX props should not use .bind()",
  "JSX props should not use arrow functions",
  "JSX props should not use ::",
  "JSX props should not use functions",
];

const cases = [
  { code: `<div onClick={this._handleClick}></div>`, filename: "test.jsx" },
  { code: `<Foo onClick={this._handleClick} />`, filename: "test.jsx" },
  { code: `<div meaningOfLife={42}></div>`, filename: "test.jsx" },
  { code: `<div onClick={getHandler()}></div>`, filename: "test.jsx" },
  { code: `
        var DocumentRow = Backbone.View.extend({
          tagName: "li",
          render: function() {
            this.onTap.bind(this);
          }
        });
      `, filename: "test.jsx" },
  { code: `
        const foo = {
          render: function() {
            this.onTap.bind(this);
            return true;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        const foo = {
          render() {
            this.onTap.bind(this);
            return true;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          render() {
            const click = this.onTap.bind(this);
            return <div onClick={onClick}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          render() {
            foo.onClick = this.onTap.bind(this);
            return <div onClick={onClick}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          render() {
            return (<div>{
              this.props.list.map(this.wrap.bind(this, "span"))
            }</div>);
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          render() {
            const click = () => true;
            return <div onClick={onClick}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          render() {
            return (<div>{
              this.props.list.map(item => <item hello="true"/>)
            }</div>);
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          render() {
            const click = this.bar::baz
            return <div onClick={onClick}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          render() {
            return (<div>{
              this.props.list.map(this.bar::baz)
            }</div>);
          }
        };
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            return (<div>{
              this.props.list.map(this.wrap.bind(this, "span"))
            }</div>);
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            const click = this.bar::baz
            return <div onClick={onClick}>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            const click = () => true
            return <div onClick={onClick}>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const onClick = this.doSomething.bind(this, "no")
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            return (<div>{
              this.props.list.map(this.wrap.bind(this, "span"))
            }</div>);
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          render() {
            let click;
            return <div onClick={onClick}>Hello</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        function click() { return true; }
        class Hello23 extends React.Component {
          renderDiv() {
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `<div onClick={this._handleClick.bind(this)}></div>`, filename: "test.jsx" },
  { code: `<div onClick={someGlobalFunction.bind(this)}></div>`, filename: "test.jsx" },
  { code: `<div onClick={window.lol.bind(this)}></div>`, filename: "test.jsx" },
  { code: `<div ref={this._refCallback.bind(this)}></div>`, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            const click = this.someMethod.bind(this);
            return <div onClick={click}>Hello {this.state.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          render() {
            const click = this.someMethod.bind(this);
            return <div onClick={click}>Hello {this.state.name}</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv() {
            const click = this.doSomething.bind(this, "no")
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = this.doSomething.bind(this, "no")
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = this.doSomething.bind(this, "no")
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={onClick.bind(this)}>Hello</div>
          )
        };
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={this.doSomething.bind(this, "hey")} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            const doThing = this.doSomething.bind(this, "hey")
            return <div onClick={doThing} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = () => true
            const renderStuff = () => {
              const click = this.doSomething.bind(this, "hey")
              return <div onClick={click} />
            }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? onClick.bind(this) : onClick.bind(this)}>Hello</div>
          )
        };
      `, filename: "test.jsx" },
  { code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? onClick.bind(this) : handleClick()}>Hello</div>
          )
        };
      `, filename: "test.jsx" },
  { code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? handleClick() : this.onClick.bind(this)}>Hello</div>
          )
        };
      `, filename: "test.jsx" },
  { code: `
        const foo = {
          render: ({onClick}) => (
            <div onClick={returningBoolean.bind(this) ? handleClick() : onClick()}>Hello</div>
          )
        };
      `, filename: "test.jsx" },
  { code: `<div onClick={() => alert("1337")}></div>`, filename: "test.jsx" },
  { code: `<div onClick={async () => alert("1337")}></div>`, filename: "test.jsx" },
  { code: `<div onClick={() => 42}></div>`, filename: "test.jsx" },
  { code: `<div onClick={param => { first(); second(); }}></div>`, filename: "test.jsx" },
  { code: `<div ref={c => this._input = c}></div>`, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = () => true
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = () => true
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = async () => true
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={() => true} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={async () => true} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            const doThing = () => true
            return <div onClick={doThing} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            const doThing = async () => true
            return <div onClick={doThing} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = ::this.onChange
            const renderStuff = () => {
              const click = () => true
              return <div onClick={click} />
            }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `<div onClick={function () { alert("1337") }}></div>`, filename: "test.jsx" },
  { code: `<div onClick={function * () { alert("1337") }}></div>`, filename: "test.jsx" },
  { code: `<div onClick={async function () { alert("1337") }}></div>`, filename: "test.jsx" },
  { code: `<div ref={function (c) { this._input = c }}></div>`, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = function () { return true }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = function * () { return true }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = function () { return true }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = async function () { return true }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={function () { return true }} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={function * () { return true }} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={async function () { return true }} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            const doThing = function () { return true }
            return <div onClick={doThing} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            const doThing = async function () { return true }
            return <div onClick={doThing} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          render: function() {
            const doThing = function * () { return true }
            return <div onClick={doThing} />
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = ::this.onChange
            const renderStuff = () => {
              const click = function () { return true }
              return <div onClick={click} />
            }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `<div foo={::this.onChange} />`, filename: "test.jsx" },
  { code: `<div foo={foo.bar::baz} />`, filename: "test.jsx" },
  { code: `<div foo={foo::bar} />`, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv() {
            const click = ::this.onChange
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv() {
            const click = this.bar::baz
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = this.bar::baz
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = true
            const renderStuff = () => {
              const click = this.bar::baz
              return <div onClick={click} />
            }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello23 extends React.Component {
          renderDiv() {
            function click() { return true; }
            return <div onClick={click}>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
];

describe("jsx-no-bind", () => {
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
    it("valid[0]: <div onClick={this._handleClick}></div>", ({ task }) => {
      const code = `<div onClick={this._handleClick}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 0)\n\n--- Source code under test ---\n<div onClick={this._handleClick}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <Foo onClick={this._handleClick} />", ({ task }) => {
      const code = `<Foo onClick={this._handleClick} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 2)\n\n--- Source code under test ---\n<Foo onClick={this._handleClick} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <div meaningOfLife={42}></div>", ({ task }) => {
      const code = `<div meaningOfLife={42}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 4)\n\n--- Source code under test ---\n<div meaningOfLife={42}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <div onClick={getHandler()}></div>", ({ task }) => {
      const code = `<div onClick={getHandler()}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 5)\n\n--- Source code under test ---\n<div onClick={getHandler()}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: var DocumentRow = Backbone.View.extend({ tagName: \"li\", r...", ({ task }) => {
      const code = `
        var DocumentRow = Backbone.View.extend({
          tagName: "li",
          render: function() {
            this.onTap.bind(this);
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 16)\n\n--- Source code under test ---\n\n        var DocumentRow = Backbone.View.extend({\n          tagName: \"li\",\n          render: function() {\n            this.onTap.bind(this);\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: const foo = { render: function() { this.onTap.bind(this);...", ({ task }) => {
      const code = `
        const foo = {
          render: function() {
            this.onTap.bind(this);
            return true;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 17)\n\n--- Source code under test ---\n\n        const foo = {\n          render: function() {\n            this.onTap.bind(this);\n            return true;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: const foo = { render() { this.onTap.bind(this); return tr...", ({ task }) => {
      const code = `
        const foo = {
          render() {
            this.onTap.bind(this);
            return true;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 18)\n\n--- Source code under test ---\n\n        const foo = {\n          render() {\n            this.onTap.bind(this);\n            return true;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: class Hello extends Component { render() { const click = ...", ({ task }) => {
      const code = `
        class Hello extends Component {
          render() {
            const click = this.onTap.bind(this);
            return <div onClick={onClick}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 19)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          render() {\n            const click = this.onTap.bind(this);\n            return <div onClick={onClick}>Hello</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: class Hello extends Component { render() { foo.onClick = ...", ({ task }) => {
      const code = `
        class Hello extends Component {
          render() {
            foo.onClick = this.onTap.bind(this);
            return <div onClick={onClick}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 20)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          render() {\n            foo.onClick = this.onTap.bind(this);\n            return <div onClick={onClick}>Hello</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: class Hello extends Component { render() { return (<div>{...", ({ task }) => {
      const code = `
        class Hello extends Component {
          render() {
            return (<div>{
              this.props.list.map(this.wrap.bind(this, "span"))
            }</div>);
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 21)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          render() {\n            return (<div>{\n              this.props.list.map(this.wrap.bind(this, \"span\"))\n            }</div>);\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: class Hello extends Component { render() { const click = ...", ({ task }) => {
      const code = `
        class Hello extends Component {
          render() {
            const click = () => true;
            return <div onClick={onClick}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 22)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          render() {\n            const click = () => true;\n            return <div onClick={onClick}>Hello</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: class Hello extends Component { render() { return (<div>{...", ({ task }) => {
      const code = `
        class Hello extends Component {
          render() {
            return (<div>{
              this.props.list.map(item => <item hello="true"/>)
            }</div>);
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 23)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          render() {\n            return (<div>{\n              this.props.list.map(item => <item hello=\"true\"/>)\n            }</div>);\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: class Hello extends Component { render() { const click = ...", ({ task }) => {
      const code = `
        class Hello extends Component {
          render() {
            const click = this.bar::baz
            return <div onClick={onClick}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 24)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          render() {\n            const click = this.bar::baz\n            return <div onClick={onClick}>Hello</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: class Hello extends Component { render() { return (<div>{...", ({ task }) => {
      const code = `
        class Hello extends Component {
          render() {
            return (<div>{
              this.props.list.map(this.bar::baz)
            }</div>);
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 25)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          render() {\n            return (<div>{\n              this.props.list.map(this.bar::baz)\n            }</div>);\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: var Hello = React.createClass({ render: function() { retu...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            return (<div>{
              this.props.list.map(this.wrap.bind(this, "span"))
            }</div>);
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 26)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            return (<div>{\n              this.props.list.map(this.wrap.bind(this, \"span\"))\n            }</div>);\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: var Hello = React.createClass({ render: function() { cons...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            const click = this.bar::baz
            return <div onClick={onClick}>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 27)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            const click = this.bar::baz\n            return <div onClick={onClick}>Hello</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: var Hello = React.createClass({ render: function() { cons...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            const click = () => true
            return <div onClick={onClick}>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 28)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            const click = () => true\n            return <div onClick={onClick}>Hello</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const onClick = this.doSomething.bind(this, "no")
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 29)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const onClick = this.doSomething.bind(this, \"no\")\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: class Hello23 extends React.Component { renderDiv = async...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            return (<div>{
              this.props.list.map(this.wrap.bind(this, "span"))
            }</div>);
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 30)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = async () => {\n            return (<div>{\n              this.props.list.map(this.wrap.bind(this, \"span\"))\n            }</div>);\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: class Hello extends Component { render() { let click; ret...", ({ task }) => {
      const code = `
        class Hello extends Component {
          render() {
            let click;
            return <div onClick={onClick}>Hello</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 31)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          render() {\n            let click;\n            return <div onClick={onClick}>Hello</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: function click() { return true; } class Hello23 extends R...", ({ task }) => {
      const code = `
        function click() { return true; }
        class Hello23 extends React.Component {
          renderDiv() {
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 36)\n\n--- Source code under test ---\n\n        function click() { return true; }\n        class Hello23 extends React.Component {\n          renderDiv() {\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div onClick={this._handleClick.bind(this)}></div>", ({ task }) => {
      const code = `<div onClick={this._handleClick.bind(this)}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 0)\n\n--- Source code under test ---\n<div onClick={this._handleClick.bind(this)}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[1]: <div onClick={someGlobalFunction.bind(this)}></div>", ({ task }) => {
      const code = `<div onClick={someGlobalFunction.bind(this)}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 1)\n\n--- Source code under test ---\n<div onClick={someGlobalFunction.bind(this)}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[2]: <div onClick={window.lol.bind(this)}></div>", ({ task }) => {
      const code = `<div onClick={window.lol.bind(this)}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 2)\n\n--- Source code under test ---\n<div onClick={window.lol.bind(this)}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[3]: <div ref={this._refCallback.bind(this)}></div>", ({ task }) => {
      const code = `<div ref={this._refCallback.bind(this)}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 3)\n\n--- Source code under test ---\n<div ref={this._refCallback.bind(this)}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[4]: var Hello = createReactClass({ render: function() { const...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            const click = this.someMethod.bind(this);
            return <div onClick={click}>Hello {this.state.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            const click = this.someMethod.bind(this);\n            return <div onClick={click}>Hello {this.state.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[5]: class Hello23 extends React.Component { render() { const ...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          render() {
            const click = this.someMethod.bind(this);
            return <div onClick={click}>Hello {this.state.name}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          render() {\n            const click = this.someMethod.bind(this);\n            return <div onClick={click}>Hello {this.state.name}</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[6]: class Hello23 extends React.Component { renderDiv() { con...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv() {
            const click = this.doSomething.bind(this, "no")
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv() {\n            const click = this.doSomething.bind(this, \"no\")\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[7]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = this.doSomething.bind(this, "no")
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const click = this.doSomething.bind(this, \"no\")\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[8]: class Hello23 extends React.Component { renderDiv = async...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = this.doSomething.bind(this, "no")
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = async () => {\n            const click = this.doSomething.bind(this, \"no\")\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[9]: const foo = { render: ({onClick}) => ( <div onClick={onCl...", ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={onClick.bind(this)}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={onClick.bind(this)}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[10]: var Hello = React.createClass({ render: function() { retu...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={this.doSomething.bind(this, "hey")} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={this.doSomething.bind(this, \"hey\")} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[11]: var Hello = React.createClass({ render: function() { cons...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            const doThing = this.doSomething.bind(this, "hey")
            return <div onClick={doThing} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            const doThing = this.doSomething.bind(this, \"hey\")\n            return <div onClick={doThing} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[12]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = () => true
            const renderStuff = () => {
              const click = this.doSomething.bind(this, "hey")
              return <div onClick={click} />
            }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const click = () => true\n            const renderStuff = () => {\n              const click = this.doSomething.bind(this, \"hey\")\n              return <div onClick={click} />\n            }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n  [1] (messageId: arrowFunc): JSX props should not use arrow functions\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
      expect(matches[1].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[13]: const foo = { render: ({onClick}) => ( <div onClick={(ret...", ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? onClick.bind(this) : onClick.bind(this)}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={(returningBoolean()) ? onClick.bind(this) : onClick.bind(this)}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[14]: const foo = { render: ({onClick}) => ( <div onClick={(ret...", ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? onClick.bind(this) : handleClick()}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={(returningBoolean()) ? onClick.bind(this) : handleClick()}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[15]: const foo = { render: ({onClick}) => ( <div onClick={(ret...", ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? handleClick() : this.onClick.bind(this)}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={(returningBoolean()) ? handleClick() : this.onClick.bind(this)}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[16]: const foo = { render: ({onClick}) => ( <div onClick={retu...", ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={returningBoolean.bind(this) ? handleClick() : onClick()}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={returningBoolean.bind(this) ? handleClick() : onClick()}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[17]: <div onClick={() => alert(\"1337\")}></div>", ({ task }) => {
      const code = `<div onClick={() => alert("1337")}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 17)\n\n--- Source code under test ---\n<div onClick={() => alert(\"1337\")}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[18]: <div onClick={async () => alert(\"1337\")}></div>", ({ task }) => {
      const code = `<div onClick={async () => alert("1337")}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 18)\n\n--- Source code under test ---\n<div onClick={async () => alert(\"1337\")}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[19]: <div onClick={() => 42}></div>", ({ task }) => {
      const code = `<div onClick={() => 42}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 19)\n\n--- Source code under test ---\n<div onClick={() => 42}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[20]: <div onClick={param => { first(); second(); }}></div>", ({ task }) => {
      const code = `<div onClick={param => { first(); second(); }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 20)\n\n--- Source code under test ---\n<div onClick={param => { first(); second(); }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[21]: <div ref={c => this._input = c}></div>", ({ task }) => {
      const code = `<div ref={c => this._input = c}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 21)\n\n--- Source code under test ---\n<div ref={c => this._input = c}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[22]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = () => true
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 22)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const click = () => true\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[23]: class Hello23 extends React.Component { renderDiv = async...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = () => true
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 23)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = async () => {\n            const click = () => true\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[24]: class Hello23 extends React.Component { renderDiv = async...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = async () => true
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = async () => {\n            const click = async () => true\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[25]: var Hello = React.createClass({ render: function() { retu...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={() => true} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={() => true} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[26]: var Hello = React.createClass({ render: function() { retu...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={async () => true} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={async () => true} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[27]: var Hello = React.createClass({ render: function() { cons...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            const doThing = () => true
            return <div onClick={doThing} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 27)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            const doThing = () => true\n            return <div onClick={doThing} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[28]: var Hello = React.createClass({ render: function() { cons...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            const doThing = async () => true
            return <div onClick={doThing} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 28)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            const doThing = async () => true\n            return <div onClick={doThing} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[29]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = ::this.onChange
            const renderStuff = () => {
              const click = () => true
              return <div onClick={click} />
            }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 29)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const click = ::this.onChange\n            const renderStuff = () => {\n              const click = () => true\n              return <div onClick={click} />\n            }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n  [1] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
      expect(matches[1].message).toBe("JSX props should not use ::");
    });

    it("invalid[30]: <div onClick={function () { alert(\"1337\") }}></div>", ({ task }) => {
      const code = `<div onClick={function () { alert("1337") }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 30)\n\n--- Source code under test ---\n<div onClick={function () { alert(\"1337\") }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[31]: <div onClick={function * () { alert(\"1337\") }}></div>", ({ task }) => {
      const code = `<div onClick={function * () { alert("1337") }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 31)\n\n--- Source code under test ---\n<div onClick={function * () { alert(\"1337\") }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[52], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[32]: <div onClick={async function () { alert(\"1337\") }}></div>", ({ task }) => {
      const code = `<div onClick={async function () { alert("1337") }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 32)\n\n--- Source code under test ---\n<div onClick={async function () { alert(\"1337\") }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[53], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[33]: <div ref={function (c) { this._input = c }}></div>", ({ task }) => {
      const code = `<div ref={function (c) { this._input = c }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 33)\n\n--- Source code under test ---\n<div ref={function (c) { this._input = c }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[54], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[34]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = function () { return true }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 34)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const click = function () { return true }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[55], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[35]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = function * () { return true }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 35)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const click = function * () { return true }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[56], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[36]: class Hello23 extends React.Component { renderDiv = async...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = function () { return true }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 36)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = async () => {\n            const click = function () { return true }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[57], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[37]: class Hello23 extends React.Component { renderDiv = async...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = async function () { return true }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 37)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = async () => {\n            const click = async function () { return true }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[58], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[38]: var Hello = React.createClass({ render: function() { retu...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={function () { return true }} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 38)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={function () { return true }} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[59], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[39]: var Hello = React.createClass({ render: function() { retu...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={function * () { return true }} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 39)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={function * () { return true }} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[60], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[40]: var Hello = React.createClass({ render: function() { retu...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={async function () { return true }} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 40)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={async function () { return true }} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[61], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[41]: var Hello = React.createClass({ render: function() { cons...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            const doThing = function () { return true }
            return <div onClick={doThing} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 41)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            const doThing = function () { return true }\n            return <div onClick={doThing} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[62], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[42]: var Hello = React.createClass({ render: function() { cons...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            const doThing = async function () { return true }
            return <div onClick={doThing} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 42)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            const doThing = async function () { return true }\n            return <div onClick={doThing} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[63], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[43]: var Hello = React.createClass({ render: function() { cons...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
            const doThing = function * () { return true }
            return <div onClick={doThing} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 43)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n            const doThing = function * () { return true }\n            return <div onClick={doThing} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[64], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[44]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = ::this.onChange
            const renderStuff = () => {
              const click = function () { return true }
              return <div onClick={click} />
            }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 44)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const click = ::this.onChange\n            const renderStuff = () => {\n              const click = function () { return true }\n              return <div onClick={click} />\n            }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n  [1] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[65], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("JSX props should not use functions");
      expect(matches[1].message).toBe("JSX props should not use ::");
    });

    it("invalid[45]: <div foo={::this.onChange} />", ({ task }) => {
      const code = `<div foo={::this.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 45)\n\n--- Source code under test ---\n<div foo={::this.onChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[66], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[46]: <div foo={foo.bar::baz} />", ({ task }) => {
      const code = `<div foo={foo.bar::baz} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 46)\n\n--- Source code under test ---\n<div foo={foo.bar::baz} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[67], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[47]: <div foo={foo::bar} />", ({ task }) => {
      const code = `<div foo={foo::bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 47)\n\n--- Source code under test ---\n<div foo={foo::bar} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[68], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[48]: class Hello23 extends React.Component { renderDiv() { con...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv() {
            const click = ::this.onChange
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 48)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv() {\n            const click = ::this.onChange\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[69], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[49]: class Hello23 extends React.Component { renderDiv() { con...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv() {
            const click = this.bar::baz
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 49)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv() {\n            const click = this.bar::baz\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[70], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[50]: class Hello23 extends React.Component { renderDiv = async...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = async () => {
            const click = this.bar::baz
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 50)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = async () => {\n            const click = this.bar::baz\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[71], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[51]: class Hello23 extends React.Component { renderDiv = () =>...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv = () => {
            const click = true
            const renderStuff = () => {
              const click = this.bar::baz
              return <div onClick={click} />
            }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 51)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv = () => {\n            const click = true\n            const renderStuff = () => {\n              const click = this.bar::baz\n              return <div onClick={click} />\n            }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[72], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[52]: class Hello23 extends React.Component { renderDiv() { fun...", ({ task }) => {
      const code = `
        class Hello23 extends React.Component {
          renderDiv() {
            function click() { return true; }
            return <div onClick={click}>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 52)\n\n--- Source code under test ---\n\n        class Hello23 extends React.Component {\n          renderDiv() {\n            function click() { return true; }\n            return <div onClick={click}>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const matches = ruleErrors(results[73], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

  });
});
