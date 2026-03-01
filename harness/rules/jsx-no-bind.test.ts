import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "JSX props should not use .bind()",
  "JSX props should not use arrow functions",
  "JSX props should not use ::",
  "JSX props should not use functions",
];

describe("jsx-no-bind", () => {
  describe("valid", () => {
    it("valid[0]: <div onClick={this._handleClick}></div>", async ({ task }) => {
      const code = `<div onClick={this._handleClick}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 0)\n\n--- Source code under test ---\n<div onClick={this._handleClick}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <Foo onClick={this._handleClick} />", async ({ task }) => {
      const code = `<Foo onClick={this._handleClick} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 2)\n\n--- Source code under test ---\n<Foo onClick={this._handleClick} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <div meaningOfLife={42}></div>", async ({ task }) => {
      const code = `<div meaningOfLife={42}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 4)\n\n--- Source code under test ---\n<div meaningOfLife={42}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <div onClick={getHandler()}></div>", async ({ task }) => {
      const code = `<div onClick={getHandler()}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: valid (index 5)\n\n--- Source code under test ---\n<div onClick={getHandler()}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: var DocumentRow = Backbone.View.extend({ tagName: \"li\", r...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: const foo = { render: function() { this.onTap.bind(this);...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: const foo = { render() { this.onTap.bind(this); return tr...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: class Hello extends Component { render() { const click = ...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: class Hello extends Component { render() { foo.onClick = ...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: class Hello extends Component { render() { return (<div>{...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: class Hello extends Component { render() { const click = ...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: class Hello extends Component { render() { return (<div>{...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: class Hello extends Component { render() { const click = ...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: class Hello extends Component { render() { return (<div>{...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: var Hello = React.createClass({ render: function() { retu...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: var Hello = React.createClass({ render: function() { cons...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: var Hello = React.createClass({ render: function() { cons...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: class Hello23 extends React.Component { renderDiv = async...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: class Hello extends Component { render() { let click; ret...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: function click() { return true; } class Hello23 extends R...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div onClick={this._handleClick.bind(this)}></div>", async ({ task }) => {
      const code = `<div onClick={this._handleClick.bind(this)}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 0)\n\n--- Source code under test ---\n<div onClick={this._handleClick.bind(this)}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[1]: <div onClick={someGlobalFunction.bind(this)}></div>", async ({ task }) => {
      const code = `<div onClick={someGlobalFunction.bind(this)}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 1)\n\n--- Source code under test ---\n<div onClick={someGlobalFunction.bind(this)}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[2]: <div onClick={window.lol.bind(this)}></div>", async ({ task }) => {
      const code = `<div onClick={window.lol.bind(this)}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 2)\n\n--- Source code under test ---\n<div onClick={window.lol.bind(this)}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[3]: <div ref={this._refCallback.bind(this)}></div>", async ({ task }) => {
      const code = `<div ref={this._refCallback.bind(this)}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 3)\n\n--- Source code under test ---\n<div ref={this._refCallback.bind(this)}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[4]: var Hello = createReactClass({ render: function() { const...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[5]: class Hello23 extends React.Component { render() { const ...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[6]: class Hello23 extends React.Component { renderDiv() { con...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[7]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[8]: class Hello23 extends React.Component { renderDiv = async...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[9]: const foo = { render: ({onClick}) => ( <div onClick={onCl...", async ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={onClick.bind(this)}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={onClick.bind(this)}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[10]: var Hello = React.createClass({ render: function() { retu...", async ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={this.doSomething.bind(this, "hey")} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={this.doSomething.bind(this, \"hey\")} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[11]: var Hello = React.createClass({ render: function() { cons...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[12]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
      expect(matches[1].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[13]: const foo = { render: ({onClick}) => ( <div onClick={(ret...", async ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? onClick.bind(this) : onClick.bind(this)}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={(returningBoolean()) ? onClick.bind(this) : onClick.bind(this)}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[14]: const foo = { render: ({onClick}) => ( <div onClick={(ret...", async ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? onClick.bind(this) : handleClick()}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={(returningBoolean()) ? onClick.bind(this) : handleClick()}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[15]: const foo = { render: ({onClick}) => ( <div onClick={(ret...", async ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={(returningBoolean()) ? handleClick() : this.onClick.bind(this)}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={(returningBoolean()) ? handleClick() : this.onClick.bind(this)}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[16]: const foo = { render: ({onClick}) => ( <div onClick={retu...", async ({ task }) => {
      const code = `
        const foo = {
          render: ({onClick}) => (
            <div onClick={returningBoolean.bind(this) ? handleClick() : onClick()}>Hello</div>
          )
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        const foo = {\n          render: ({onClick}) => (\n            <div onClick={returningBoolean.bind(this) ? handleClick() : onClick()}>Hello</div>\n          )\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindCall): JSX props should not use .bind()\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use .bind()");
    });

    it("invalid[17]: <div onClick={() => alert(\"1337\")}></div>", async ({ task }) => {
      const code = `<div onClick={() => alert("1337")}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 17)\n\n--- Source code under test ---\n<div onClick={() => alert(\"1337\")}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[18]: <div onClick={async () => alert(\"1337\")}></div>", async ({ task }) => {
      const code = `<div onClick={async () => alert("1337")}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 18)\n\n--- Source code under test ---\n<div onClick={async () => alert(\"1337\")}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[19]: <div onClick={() => 42}></div>", async ({ task }) => {
      const code = `<div onClick={() => 42}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 19)\n\n--- Source code under test ---\n<div onClick={() => 42}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[20]: <div onClick={param => { first(); second(); }}></div>", async ({ task }) => {
      const code = `<div onClick={param => { first(); second(); }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 20)\n\n--- Source code under test ---\n<div onClick={param => { first(); second(); }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[21]: <div ref={c => this._input = c}></div>", async ({ task }) => {
      const code = `<div ref={c => this._input = c}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 21)\n\n--- Source code under test ---\n<div ref={c => this._input = c}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[22]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[23]: class Hello23 extends React.Component { renderDiv = async...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[24]: class Hello23 extends React.Component { renderDiv = async...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[25]: var Hello = React.createClass({ render: function() { retu...", async ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={() => true} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={() => true} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[26]: var Hello = React.createClass({ render: function() { retu...", async ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={async () => true} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={async () => true} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: arrowFunc): JSX props should not use arrow functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[27]: var Hello = React.createClass({ render: function() { cons...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[28]: var Hello = React.createClass({ render: function() { cons...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
    });

    it("invalid[29]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("JSX props should not use arrow functions");
      expect(matches[1].message).toBe("JSX props should not use ::");
    });

    it("invalid[30]: <div onClick={function () { alert(\"1337\") }}></div>", async ({ task }) => {
      const code = `<div onClick={function () { alert("1337") }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 30)\n\n--- Source code under test ---\n<div onClick={function () { alert(\"1337\") }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[31]: <div onClick={function * () { alert(\"1337\") }}></div>", async ({ task }) => {
      const code = `<div onClick={function * () { alert("1337") }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 31)\n\n--- Source code under test ---\n<div onClick={function * () { alert(\"1337\") }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[32]: <div onClick={async function () { alert(\"1337\") }}></div>", async ({ task }) => {
      const code = `<div onClick={async function () { alert("1337") }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 32)\n\n--- Source code under test ---\n<div onClick={async function () { alert(\"1337\") }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[33]: <div ref={function (c) { this._input = c }}></div>", async ({ task }) => {
      const code = `<div ref={function (c) { this._input = c }}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 33)\n\n--- Source code under test ---\n<div ref={function (c) { this._input = c }}></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[34]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[35]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[36]: class Hello23 extends React.Component { renderDiv = async...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[37]: class Hello23 extends React.Component { renderDiv = async...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[38]: var Hello = React.createClass({ render: function() { retu...", async ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={function () { return true }} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 38)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={function () { return true }} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[39]: var Hello = React.createClass({ render: function() { retu...", async ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={function * () { return true }} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 39)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={function * () { return true }} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[40]: var Hello = React.createClass({ render: function() { retu...", async ({ task }) => {
      const code = `
        var Hello = React.createClass({
          render: function() {
          return <div onClick={async function () { return true }} />
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 40)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          render: function() {\n          return <div onClick={async function () { return true }} />\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: func): JSX props should not use functions\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[41]: var Hello = React.createClass({ render: function() { cons...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[42]: var Hello = React.createClass({ render: function() { cons...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[43]: var Hello = React.createClass({ render: function() { cons...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

    it("invalid[44]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("JSX props should not use functions");
      expect(matches[1].message).toBe("JSX props should not use ::");
    });

    it("invalid[45]: <div foo={::this.onChange} />", async ({ task }) => {
      const code = `<div foo={::this.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 45)\n\n--- Source code under test ---\n<div foo={::this.onChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[46]: <div foo={foo.bar::baz} />", async ({ task }) => {
      const code = `<div foo={foo.bar::baz} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 46)\n\n--- Source code under test ---\n<div foo={foo.bar::baz} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[47]: <div foo={foo::bar} />", async ({ task }) => {
      const code = `<div foo={foo::bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-bind\nType: invalid (index 47)\n\n--- Source code under test ---\n<div foo={foo::bar} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: bindExpression): JSX props should not use ::\n\nFeatures: bind operator\n\nRule message templates:\n  bindCall: JSX props should not use .bind()\n  arrowFunc: JSX props should not use arrow functions\n  bindExpression: JSX props should not use ::\n  func: JSX props should not use functions";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[48]: class Hello23 extends React.Component { renderDiv() { con...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[49]: class Hello23 extends React.Component { renderDiv() { con...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[50]: class Hello23 extends React.Component { renderDiv = async...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[51]: class Hello23 extends React.Component { renderDiv = () =>...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use ::");
    });

    it("invalid[52]: class Hello23 extends React.Component { renderDiv() { fun...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-bind", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX props should not use functions");
    });

  });
});
