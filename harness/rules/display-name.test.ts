import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Component definition is missing display name",
  "Context definition is missing display name",
];

describe("display-name", () => {
  describe("valid", () => {
    it("valid[3]: class Hello { render() { return 'Hello World'; } }", async ({ task }) => {
      const code = `
        class Hello {
          render() {
            return 'Hello World';
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 3)\n\n--- Source code under test ---\n\n        class Hello {\n          render() {\n            return 'Hello World';\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: class Hello extends Greetings { static text = 'Hello Worl...", async ({ task }) => {
      const code = `
        class Hello extends Greetings {
          static text = 'Hello World';
          render() {
            return Hello.text;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 4)\n\n--- Source code under test ---\n\n        class Hello extends Greetings {\n          static text = 'Hello World';\n          render() {\n            return Hello.text;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class Hello { method; }", async ({ task }) => {
      const code = `
        class Hello {
          method;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class Hello {\n          method;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 8)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: class Hello extends React.Component { render() { return <...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 9)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: export default class Hello { render() { return <div>Hello...", async ({ task }) => {
      const code = `
        export default class Hello {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 10)\n\n--- Source code under test ---\n\n        export default class Hello {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: var Hello; Hello = createReactClass({ render: function() ...", async ({ task }) => {
      const code = `
        var Hello;
        Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 11)\n\n--- Source code under test ---\n\n        var Hello;\n        Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: module.exports = createReactClass({ \"displayName\": \"Hello...", async ({ task }) => {
      const code = `
        module.exports = createReactClass({
          "displayName": "Hello",
          "render": function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 12)\n\n--- Source code under test ---\n\n        module.exports = createReactClass({\n          \"displayName\": \"Hello\",\n          \"render\": function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: export default class { render() { return <div>Hello {this...", async ({ task }) => {
      const code = `
        export default class {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 14)\n\n--- Source code under test ---\n\n        export default class {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: export const Hello = React.memo(function Hello() { return...", async ({ task }) => {
      const code = `
        export const Hello = React.memo(function Hello() {
          return <p />;
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 15)\n\n--- Source code under test ---\n\n        export const Hello = React.memo(function Hello() {\n          return <p />;\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: var Hello = function() { return <div>Hello {this.props.na...", async ({ task }) => {
      const code = `
        var Hello = function() {
          return <div>Hello {this.props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 16)\n\n--- Source code under test ---\n\n        var Hello = function() {\n          return <div>Hello {this.props.name}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: function Hello() { return <div>Hello {this.props.name}</d...", async ({ task }) => {
      const code = `
        function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 17)\n\n--- Source code under test ---\n\n        function Hello() {\n          return <div>Hello {this.props.name}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: var Hello = () => { return <div>Hello {this.props.name}</...", async ({ task }) => {
      const code = `
        var Hello = () => {
          return <div>Hello {this.props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 18)\n\n--- Source code under test ---\n\n        var Hello = () => {\n          return <div>Hello {this.props.name}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: module.exports = function Hello() { return <div>Hello {th...", async ({ task }) => {
      const code = `
        module.exports = function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 19)\n\n--- Source code under test ---\n\n        module.exports = function Hello() {\n          return <div>Hello {this.props.name}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>{this._renderHello()}</div>;
          },
          _renderHello: function() {
            return <span>Hello {this.props.name}</span>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 24)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>{this._renderHello()}</div>;\n          },\n          _renderHello: function() {\n            return <span>Hello {this.props.name}</span>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: const Mixin = { Button() { return ( <button /> ); } };", async ({ task }) => {
      const code = `
        const Mixin = {
          Button() {
            return (
              <button />
            );
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 26)\n\n--- Source code under test ---\n\n        const Mixin = {\n          Button() {\n            return (\n              <button />\n            );\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: var obj = { pouf: function() { return any } };", async ({ task }) => {
      const code = `
        var obj = {
          pouf: function() {
            return any
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 28)\n\n--- Source code under test ---\n\n        var obj = {\n          pouf: function() {\n            return any\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: export default { renderHello() { let {name} = this.props;...", async ({ task }) => {
      const code = `
        export default {
          renderHello() {
            let {name} = this.props;
            return <div>{name}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 29)\n\n--- Source code under test ---\n\n        export default {\n          renderHello() {\n            let {name} = this.props;\n            return <div>{name}</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: import React, {Component} from \"react\"; function someDeco...", async ({ task }) => {
      const code = `
        import React, {Component} from "react";
        function someDecorator(ComposedComponent) {
          return class MyDecorator extends Component {
            render() {return <ComposedComponent {...this.props} />;}
          };
        }
        module.exports = someDecorator;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 31)\n\n--- Source code under test ---\n\n        import React, {Component} from \"react\";\n        function someDecorator(ComposedComponent) {\n          return class MyDecorator extends Component {\n            render() {return <ComposedComponent {...this.props} />;}\n          };\n        }\n        module.exports = someDecorator;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: import React, {createElement} from \"react\"; const SomeCom...", async ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        const SomeComponent = (props) => {
          const {foo, bar} = props;
          return someComponentFactory({
            onClick: () => foo(bar("x"))
          });
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 32)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        const SomeComponent = (props) => {\n          const {foo, bar} = props;\n          return someComponentFactory({\n            onClick: () => foo(bar(\"x\"))\n          });\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: const element = ( <Media query={query} render={() => { re...", async ({ task }) => {
      const code = `
        const element = (
          <Media query={query} render={() => {
            renderWasCalled = true
            return <div/>
          }}/>
        )
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 33)\n\n--- Source code under test ---\n\n        const element = (\n          <Media query={query} render={() => {\n            renderWasCalled = true\n            return <div/>\n          }}/>\n        )\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: const element = ( <Media query={query} render={function()...", async ({ task }) => {
      const code = `
        const element = (
          <Media query={query} render={function() {
            renderWasCalled = true
            return <div/>
          }}/>
        )
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 34)\n\n--- Source code under test ---\n\n        const element = (\n          <Media query={query} render={function() {\n            renderWasCalled = true\n            return <div/>\n          }}/>\n        )\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: module.exports = { createElement: tagName => document.cre...", async ({ task }) => {
      const code = `
        module.exports = {
          createElement: tagName => document.createElement(tagName)
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 35)\n\n--- Source code under test ---\n\n        module.exports = {\n          createElement: tagName => document.createElement(tagName)\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: const { createElement } = document; createElement(\"a\");", async ({ task }) => {
      const code = `
        const { createElement } = document;
        createElement("a");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 36)\n\n--- Source code under test ---\n\n        const { createElement } = document;\n        createElement(\"a\");\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[37]: import React from 'react' import { string } from 'prop-ty...", async ({ task }) => {
      const code = `
        import React from 'react'
        import { string } from 'prop-types'

        function Component({ world }) {
          return <div>Hello {world}</div>
        }

        Component.propTypes = {
          world: string,
        }

        export default React.memo(Component)
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 37)\n\n--- Source code under test ---\n\n        import React from 'react'\n        import { string } from 'prop-types'\n\n        function Component({ world }) {\n          return <div>Hello {world}</div>\n        }\n\n        Component.propTypes = {\n          world: string,\n        }\n\n        export default React.memo(Component)\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: import React from 'react' const ComponentWithMemo = React...", async ({ task }) => {
      const code = `
        import React from 'react'

        const ComponentWithMemo = React.memo(function Component({ world }) {
          return <div>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 38)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ComponentWithMemo = React.memo(function Component({ world }) {\n          return <div>Hello {world}</div>\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[39]: import React from 'react'; const Hello = React.memo(funct...", async ({ task }) => {
      const code = `
        import React from 'react';

        const Hello = React.memo(function Hello() {
          return;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 39)\n\n--- Source code under test ---\n\n        import React from 'react';\n\n        const Hello = React.memo(function Hello() {\n          return;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[40]: import React from 'react' const ForwardRefComponentLike =...", async ({ task }) => {
      const code = `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(function ComponentLike({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 40)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ForwardRefComponentLike = React.forwardRef(function ComponentLike({ world }, ref) {\n          return <div ref={ref}>Hello {world}</div>\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[41]: function F() { let items = []; let testData = [ {a: \"test...", async ({ task }) => {
      const code = `
        function F() {
          let items = [];
          let testData = [
            {a: "test1", displayName: "test2"}, {a: "test1", displayName: "test2"}];
          for (let item of testData) {
              items.push({a: item.a, b: item.displayName});
          }
          return <div>{items}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 41)\n\n--- Source code under test ---\n\n        function F() {\n          let items = [];\n          let testData = [\n            {a: \"test1\", displayName: \"test2\"}, {a: \"test1\", displayName: \"test2\"}];\n          for (let item of testData) {\n              items.push({a: item.a, b: item.displayName});\n          }\n          return <div>{items}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[43]: const x = { title: \"URL\", dataIndex: \"url\", key: \"url\", r...", async ({ task }) => {
      const code = `
        const x = {
          title: "URL",
          dataIndex: "url",
          key: "url",
          render: url => (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <p>lol</p>
            </a>
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 43)\n\n--- Source code under test ---\n\n        const x = {\n          title: \"URL\",\n          dataIndex: \"url\",\n          key: \"url\",\n          render: url => (\n            <a href={url} target=\"_blank\" rel=\"noopener noreferrer\">\n              <p>lol</p>\n            </a>\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[44]: const renderer = a => function Component(listItem) { retu...", async ({ task }) => {
      const code = `
        const renderer = a => function Component(listItem) {
          return <div>{a} {listItem}</div>;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 44)\n\n--- Source code under test ---\n\n        const renderer = a => function Component(listItem) {\n          return <div>{a} {listItem}</div>;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[45]: const Comp = React.forwardRef((props, ref) => <main />); ...", async ({ task }) => {
      const code = `
        const Comp = React.forwardRef((props, ref) => <main />);
        Comp.displayName = 'MyCompName';
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 45)\n\n--- Source code under test ---\n\n        const Comp = React.forwardRef((props, ref) => <main />);\n        Comp.displayName = 'MyCompName';\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[46]: const Comp = React.forwardRef((props, ref) => <main data-...", async ({ task }) => {
      const code = `
        const Comp = React.forwardRef((props, ref) => <main data-as="yes" />) as SomeComponent;
        Comp.displayName = 'MyCompNameAs';
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 46)\n\n--- Source code under test ---\n\n        const Comp = React.forwardRef((props, ref) => <main data-as=\"yes\" />) as SomeComponent;\n        Comp.displayName = 'MyCompNameAs';\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[47]: function Test() { const data = [ { name: 'Bob', }, ]; con...", async ({ task }) => {
      const code = `
        function Test() {
          const data = [
            {
              name: 'Bob',
            },
          ];

          const columns = [
            {
              Header: 'Name',
              accessor: 'name',
              Cell: ({ value }) => <div>{value}</div>,
            },
          ];

          return <ReactTable columns={columns} data={data} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 47)\n\n--- Source code under test ---\n\n        function Test() {\n          const data = [\n            {\n              name: 'Bob',\n            },\n          ];\n\n          const columns = [\n            {\n              Header: 'Name',\n              accessor: 'name',\n              Cell: ({ value }) => <div>{value}</div>,\n            },\n          ];\n\n          return <ReactTable columns={columns} data={data} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[48]: const f = (a) => () => { if (a) { return null; } return 1...", async ({ task }) => {
      const code = `
        const f = (a) => () => {
          if (a) {
            return null;
          }
          return 1;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 48)\n\n--- Source code under test ---\n\n        const f = (a) => () => {\n          if (a) {\n            return null;\n          }\n          return 1;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[49]: class Test { render() { const data = [ { name: 'Bob', }, ...", async ({ task }) => {
      const code = `
        class Test {
          render() {
            const data = [
              {
                name: 'Bob',
              },
            ];

            const columns = [
              {
                Header: 'Name',
                accessor: 'name',
                Cell: ({ value }) => <div>{value}</div>,
              },
            ];

            return <ReactTable columns={columns} data={data} />;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 49)\n\n--- Source code under test ---\n\n        class Test {\n          render() {\n            const data = [\n              {\n                name: 'Bob',\n              },\n            ];\n\n            const columns = [\n              {\n                Header: 'Name',\n                accessor: 'name',\n                Cell: ({ value }) => <div>{value}</div>,\n              },\n            ];\n\n            return <ReactTable columns={columns} data={data} />;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[50]: export const demo = (a) => (b) => { if (a == null) return...", async ({ task }) => {
      const code = `
        export const demo = (a) => (b) => {
          if (a == null) return null;
          return b;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 50)\n\n--- Source code under test ---\n\n        export const demo = (a) => (b) => {\n          if (a == null) return null;\n          return b;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[51]: let demo = null; demo = (a) => { if (a == null) return nu...", async ({ task }) => {
      const code = `
        let demo = null;
        demo = (a) => {
          if (a == null) return null;
          return f(a);
        };`;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 51)\n\n--- Source code under test ---\n\n        let demo = null;\n        demo = (a) => {\n          if (a == null) return null;\n          return f(a);\n        };\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[52]: obj._property = (a) => { if (a == null) return null; retu...", async ({ task }) => {
      const code = `
        obj._property = (a) => {
          if (a == null) return null;
          return f(a);
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 52)\n\n--- Source code under test ---\n\n        obj._property = (a) => {\n          if (a == null) return null;\n          return f(a);\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[53]: _variable = (a) => { if (a == null) return null; return f...", async ({ task }) => {
      const code = `
        _variable = (a) => {
          if (a == null) return null;
          return f(a);
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 53)\n\n--- Source code under test ---\n\n        _variable = (a) => {\n          if (a == null) return null;\n          return f(a);\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[54]: demo = () => () => null;", async ({ task }) => {
      const code = `
        demo = () => () => null;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 54)\n\n--- Source code under test ---\n\n        demo = () => () => null;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[55]: demo = { property: () => () => null }", async ({ task }) => {
      const code = `
        demo = {
          property: () => () => null
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 55)\n\n--- Source code under test ---\n\n        demo = {\n          property: () => () => null\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[56]: demo = function() {return function() {return null;};};", async ({ task }) => {
      const code = `
        demo = function() {return function() {return null;};};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 56)\n\n--- Source code under test ---\n\n        demo = function() {return function() {return null;};};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[57]: demo = { property: function() {return function() {return ...", async ({ task }) => {
      const code = `
        demo = {
          property: function() {return function() {return null;};}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 57)\n\n--- Source code under test ---\n\n        demo = {\n          property: function() {return function() {return null;};}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[58]: function MyComponent(props) { return <b>{props.name}</b>;...", async ({ task }) => {
      const code = `
        function MyComponent(props) {
          return <b>{props.name}</b>;
        }

        const MemoizedMyComponent = React.memo(
          MyComponent,
          (prevProps, nextProps) => prevProps.name === nextProps.name
        )
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 58)\n\n--- Source code under test ---\n\n        function MyComponent(props) {\n          return <b>{props.name}</b>;\n        }\n\n        const MemoizedMyComponent = React.memo(\n          MyComponent,\n          (prevProps, nextProps) => prevProps.name === nextProps.name\n        )\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[5]: module.exports = () => { return <div>Hello {props.name}</...", async ({ task }) => {
      const code = `
        module.exports = () => {
          return <div>Hello {props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        module.exports = () => {\n          return <div>Hello {props.name}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[6]: module.exports = function() { return <div>Hello {props.na...", async ({ task }) => {
      const code = `
        module.exports = function() {
          return <div>Hello {props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        module.exports = function() {\n          return <div>Hello {props.name}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[7]: module.exports = createReactClass({ render() { return <di...", async ({ task }) => {
      const code = `
        module.exports = createReactClass({
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        module.exports = createReactClass({\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[12]: function Hof() { return function () { return <div /> } }", async ({ task }) => {
      const code = `
        function Hof() {
          return function () {
            return <div />
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        function Hof() {\n          return function () {\n            return <div />\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[13]: import React, { createElement } from \"react\"; export defa...", async ({ task }) => {
      const code = `
        import React, { createElement } from "react";
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        import React, { createElement } from \"react\";\n        export default (props) => {\n          return createElement(\"div\", {}, \"hello\");\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[14]: import React from 'react' const ComponentWithMemo = React...", async ({ task }) => {
      const code = `
        import React from 'react'

        const ComponentWithMemo = React.memo(({ world }) => {
          return <div>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ComponentWithMemo = React.memo(({ world }) => {\n          return <div>Hello {world}</div>\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[15]: import React from 'react' const ComponentWithMemo = React...", async ({ task }) => {
      const code = `
        import React from 'react'

        const ComponentWithMemo = React.memo(function() {
          return <div>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ComponentWithMemo = React.memo(function() {\n          return <div>Hello {world}</div>\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[16]: import React from 'react' const ForwardRefComponentLike =...", async ({ task }) => {
      const code = `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(({ world }, ref) => {
          return <div ref={ref}>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ForwardRefComponentLike = React.forwardRef(({ world }, ref) => {\n          return <div ref={ref}>Hello {world}</div>\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[17]: import React from 'react' const ForwardRefComponentLike =...", async ({ task }) => {
      const code = `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(function({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 17)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ForwardRefComponentLike = React.forwardRef(function({ world }, ref) {\n          return <div ref={ref}>Hello {world}</div>\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[21]: import React from \"react\"; const { createElement } = Reac...", async ({ task }) => {
      const code = `
        import React from "react";
        const { createElement } = React;
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 21)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        const { createElement } = React;\n        export default (props) => {\n          return createElement(\"div\", {}, \"hello\");\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[22]: import React from \"react\"; const createElement = React.cr...", async ({ task }) => {
      const code = `
        import React from "react";
        const createElement = React.createElement;
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 22)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        const createElement = React.createElement;\n        export default (props) => {\n          return createElement(\"div\", {}, \"hello\");\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[23]: module.exports = function () { function a () {} const b =...", async ({ task }) => {
      const code = `
        module.exports = function () {
          function a () {}
          const b = function b () {}
          const c = function () {}
          const d = () => {}
          const obj = {
            a: function a () {},
            b: function b () {},
            c () {},
            d: () => {},
          }
          return React.createElement("div", {}, "text content");
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 23)\n\n--- Source code under test ---\n\n        module.exports = function () {\n          function a () {}\n          const b = function b () {}\n          const c = function () {}\n          const d = () => {}\n          const obj = {\n            a: function a () {},\n            b: function b () {},\n            c () {},\n            d: () => {},\n          }\n          return React.createElement(\"div\", {}, \"text content\");\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[24]: module.exports = () => { function a () {} const b = funct...", async ({ task }) => {
      const code = `
        module.exports = () => {
          function a () {}
          const b = function b () {}
          const c = function () {}
          const d = () => {}
          const obj = {
            a: function a () {},
            b: function b () {},
            c () {},
            d: () => {},
          }

          return React.createElement("div", {}, "text content");
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        module.exports = () => {\n          function a () {}\n          const b = function b () {}\n          const c = function () {}\n          const d = () => {}\n          const obj = {\n            a: function a () {},\n            b: function b () {},\n            c () {},\n            d: () => {},\n          }\n\n          return React.createElement(\"div\", {}, \"text content\");\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[25]: export default class extends React.Component { render() {...", async ({ task }) => {
      const code = `
        export default class extends React.Component {
          render() {
            function a () {}
            const b = function b () {}
            const c = function () {}
            const d = () => {}
            const obj = {
              a: function a () {},
              b: function b () {},
              c () {},
              d: () => {},
            }
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        export default class extends React.Component {\n          render() {\n            function a () {}\n            const b = function b () {}\n            const c = function () {}\n            const d = () => {}\n            const obj = {\n              a: function a () {},\n              b: function b () {},\n              c () {},\n              d: () => {},\n            }\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[26]: export default class extends React.PureComponent { render...", async ({ task }) => {
      const code = `
        export default class extends React.PureComponent {
          render() {
            return <Card />;
          }
        }

        const Card = (() => {
          return React.memo(({ }) => (
            <div />
          ));
        })();
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        export default class extends React.PureComponent {\n          render() {\n            return <Card />;\n          }\n        }\n\n        const Card = (() => {\n          return React.memo(({ }) => (\n            <div />\n          ));\n        })();\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n  [1] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Component definition is missing display name");
      expect(matches[1].message).toBe("Component definition is missing display name");
    });

    it("invalid[27]: const renderer = a => listItem => ( <div>{a} {listItem}</...", async ({ task }) => {
      const code = `
        const renderer = a => listItem => (
          <div>{a} {listItem}</div>
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 27)\n\n--- Source code under test ---\n\n        const renderer = a => listItem => (\n          <div>{a} {listItem}</div>\n        );\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "display-name", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

  });
});
