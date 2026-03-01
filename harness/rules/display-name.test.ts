import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "display-name";
const VALID_COUNT = 45;

const RULE_MESSAGES = [
  "Component definition is missing display name",
  "Context definition is missing display name",
];

const cases = [
  { code: `
        class Hello {
          render() {
            return 'Hello World';
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Greetings {
          static text = 'Hello World';
          render() {
            return Hello.text;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello {
          method;
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        export default class Hello {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello;
        Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        module.exports = createReactClass({
          "displayName": "Hello",
          "render": function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        export default class {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        export const Hello = React.memo(function Hello() {
          return <p />;
        })
      `, filename: "test.jsx" },
  { code: `
        var Hello = function() {
          return <div>Hello {this.props.name}</div>;
        }
      `, filename: "test.jsx" },
  { code: `
        function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = () => {
          return <div>Hello {this.props.name}</div>;
        }
      `, filename: "test.jsx" },
  { code: `
        module.exports = function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{this._renderHello()}</div>;
          },
          _renderHello: function() {
            return <span>Hello {this.props.name}</span>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        const Mixin = {
          Button() {
            return (
              <button />
            );
          }
        };
      `, filename: "test.jsx" },
  { code: `
        var obj = {
          pouf: function() {
            return any
          }
        };
      `, filename: "test.jsx" },
  { code: `
        export default {
          renderHello() {
            let {name} = this.props;
            return <div>{name}</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        import React, {Component} from "react";
        function someDecorator(ComposedComponent) {
          return class MyDecorator extends Component {
            render() {return <ComposedComponent {...this.props} />;}
          };
        }
        module.exports = someDecorator;
      `, filename: "test.jsx" },
  { code: `
        import React, {createElement} from "react";
        const SomeComponent = (props) => {
          const {foo, bar} = props;
          return someComponentFactory({
            onClick: () => foo(bar("x"))
          });
        };
      `, filename: "test.jsx" },
  { code: `
        const element = (
          <Media query={query} render={() => {
            renderWasCalled = true
            return <div/>
          }}/>
        )
      `, filename: "test.jsx" },
  { code: `
        const element = (
          <Media query={query} render={function() {
            renderWasCalled = true
            return <div/>
          }}/>
        )
      `, filename: "test.jsx" },
  { code: `
        module.exports = {
          createElement: tagName => document.createElement(tagName)
        };
      `, filename: "test.jsx" },
  { code: `
        const { createElement } = document;
        createElement("a");
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'
        import { string } from 'prop-types'

        function Component({ world }) {
          return <div>Hello {world}</div>
        }

        Component.propTypes = {
          world: string,
        }

        export default React.memo(Component)
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'

        const ComponentWithMemo = React.memo(function Component({ world }) {
          return <div>Hello {world}</div>
        })
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';

        const Hello = React.memo(function Hello() {
          return;
        });
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(function ComponentLike({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
        })
      `, filename: "test.jsx" },
  { code: `
        function F() {
          let items = [];
          let testData = [
            {a: "test1", displayName: "test2"}, {a: "test1", displayName: "test2"}];
          for (let item of testData) {
              items.push({a: item.a, b: item.displayName});
          }
          return <div>{items}</div>;
        }
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
        const renderer = a => function Component(listItem) {
          return <div>{a} {listItem}</div>;
        };
      `, filename: "test.jsx" },
  { code: `
        const Comp = React.forwardRef((props, ref) => <main />);
        Comp.displayName = 'MyCompName';
      `, filename: "test.jsx" },
  { code: `
        const Comp = React.forwardRef((props, ref) => <main data-as="yes" />) as SomeComponent;
        Comp.displayName = 'MyCompNameAs';
      `, filename: "test.tsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
        const f = (a) => () => {
          if (a) {
            return null;
          }
          return 1;
        };
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
        export const demo = (a) => (b) => {
          if (a == null) return null;
          return b;
        }
      `, filename: "test.jsx" },
  { code: `
        let demo = null;
        demo = (a) => {
          if (a == null) return null;
          return f(a);
        };`, filename: "test.jsx" },
  { code: `
        obj._property = (a) => {
          if (a == null) return null;
          return f(a);
        };
      `, filename: "test.jsx" },
  { code: `
        _variable = (a) => {
          if (a == null) return null;
          return f(a);
        };
      `, filename: "test.jsx" },
  { code: `
        demo = () => () => null;
      `, filename: "test.jsx" },
  { code: `
        demo = {
          property: () => () => null
        }
      `, filename: "test.jsx" },
  { code: `
        demo = function() {return function() {return null;};};
      `, filename: "test.jsx" },
  { code: `
        demo = {
          property: function() {return function() {return null;};}
        }
      `, filename: "test.jsx" },
  { code: `
        function MyComponent(props) {
          return <b>{props.name}</b>;
        }

        const MemoizedMyComponent = React.memo(
          MyComponent,
          (prevProps, nextProps) => prevProps.name === nextProps.name
        )
      `, filename: "test.jsx" },
  { code: `
        module.exports = () => {
          return <div>Hello {props.name}</div>;
        }
      `, filename: "test.jsx" },
  { code: `
        module.exports = function() {
          return <div>Hello {props.name}</div>;
        }
      `, filename: "test.jsx" },
  { code: `
        module.exports = createReactClass({
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        function Hof() {
          return function () {
            return <div />
          }
        }
      `, filename: "test.jsx" },
  { code: `
        import React, { createElement } from "react";
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'

        const ComponentWithMemo = React.memo(({ world }) => {
          return <div>Hello {world}</div>
        })
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'

        const ComponentWithMemo = React.memo(function() {
          return <div>Hello {world}</div>
        })
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(({ world }, ref) => {
          return <div ref={ref}>Hello {world}</div>
        })
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(function({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
        })
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        const { createElement } = React;
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        const createElement = React.createElement;
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
        const renderer = a => listItem => (
          <div>{a} {listItem}</div>
        );
      `, filename: "test.jsx" },
];

describe("display-name", () => {
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
    it("valid[3]: class Hello { render() { return 'Hello World'; } }", ({ task }) => {
      const code = `
        class Hello {
          render() {
            return 'Hello World';
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 3)\n\n--- Source code under test ---\n\n        class Hello {\n          render() {\n            return 'Hello World';\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: class Hello extends Greetings { static text = 'Hello Worl...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class Hello { method; }", ({ task }) => {
      const code = `
        class Hello {
          method;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class Hello {\n          method;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 8)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: class Hello extends React.Component { render() { return <...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 9)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: export default class Hello { render() { return <div>Hello...", ({ task }) => {
      const code = `
        export default class Hello {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 10)\n\n--- Source code under test ---\n\n        export default class Hello {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: var Hello; Hello = createReactClass({ render: function() ...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: module.exports = createReactClass({ \"displayName\": \"Hello...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: export default class { render() { return <div>Hello {this...", ({ task }) => {
      const code = `
        export default class {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 14)\n\n--- Source code under test ---\n\n        export default class {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: export const Hello = React.memo(function Hello() { return...", ({ task }) => {
      const code = `
        export const Hello = React.memo(function Hello() {
          return <p />;
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 15)\n\n--- Source code under test ---\n\n        export const Hello = React.memo(function Hello() {\n          return <p />;\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: var Hello = function() { return <div>Hello {this.props.na...", ({ task }) => {
      const code = `
        var Hello = function() {
          return <div>Hello {this.props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 16)\n\n--- Source code under test ---\n\n        var Hello = function() {\n          return <div>Hello {this.props.name}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: function Hello() { return <div>Hello {this.props.name}</d...", ({ task }) => {
      const code = `
        function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 17)\n\n--- Source code under test ---\n\n        function Hello() {\n          return <div>Hello {this.props.name}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: var Hello = () => { return <div>Hello {this.props.name}</...", ({ task }) => {
      const code = `
        var Hello = () => {
          return <div>Hello {this.props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 18)\n\n--- Source code under test ---\n\n        var Hello = () => {\n          return <div>Hello {this.props.name}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: module.exports = function Hello() { return <div>Hello {th...", ({ task }) => {
      const code = `
        module.exports = function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 19)\n\n--- Source code under test ---\n\n        module.exports = function Hello() {\n          return <div>Hello {this.props.name}</div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: const Mixin = { Button() { return ( <button /> ); } };", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: var obj = { pouf: function() { return any } };", ({ task }) => {
      const code = `
        var obj = {
          pouf: function() {
            return any
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 28)\n\n--- Source code under test ---\n\n        var obj = {\n          pouf: function() {\n            return any\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: export default { renderHello() { let {name} = this.props;...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: import React, {Component} from \"react\"; function someDeco...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: import React, {createElement} from \"react\"; const SomeCom...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: const element = ( <Media query={query} render={() => { re...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: const element = ( <Media query={query} render={function()...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: module.exports = { createElement: tagName => document.cre...", ({ task }) => {
      const code = `
        module.exports = {
          createElement: tagName => document.createElement(tagName)
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 35)\n\n--- Source code under test ---\n\n        module.exports = {\n          createElement: tagName => document.createElement(tagName)\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: const { createElement } = document; createElement(\"a\");", ({ task }) => {
      const code = `
        const { createElement } = document;
        createElement("a");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 36)\n\n--- Source code under test ---\n\n        const { createElement } = document;\n        createElement(\"a\");\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[37]: import React from 'react' import { string } from 'prop-ty...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: import React from 'react' const ComponentWithMemo = React...", ({ task }) => {
      const code = `
        import React from 'react'

        const ComponentWithMemo = React.memo(function Component({ world }) {
          return <div>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 38)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ComponentWithMemo = React.memo(function Component({ world }) {\n          return <div>Hello {world}</div>\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[39]: import React from 'react'; const Hello = React.memo(funct...", ({ task }) => {
      const code = `
        import React from 'react';

        const Hello = React.memo(function Hello() {
          return;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 39)\n\n--- Source code under test ---\n\n        import React from 'react';\n\n        const Hello = React.memo(function Hello() {\n          return;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[40]: import React from 'react' const ForwardRefComponentLike =...", ({ task }) => {
      const code = `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(function ComponentLike({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 40)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ForwardRefComponentLike = React.forwardRef(function ComponentLike({ world }, ref) {\n          return <div ref={ref}>Hello {world}</div>\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[41]: function F() { let items = []; let testData = [ {a: \"test...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[43]: const x = { title: \"URL\", dataIndex: \"url\", key: \"url\", r...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[44]: const renderer = a => function Component(listItem) { retu...", ({ task }) => {
      const code = `
        const renderer = a => function Component(listItem) {
          return <div>{a} {listItem}</div>;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 44)\n\n--- Source code under test ---\n\n        const renderer = a => function Component(listItem) {\n          return <div>{a} {listItem}</div>;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[45]: const Comp = React.forwardRef((props, ref) => <main />); ...", ({ task }) => {
      const code = `
        const Comp = React.forwardRef((props, ref) => <main />);
        Comp.displayName = 'MyCompName';
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 45)\n\n--- Source code under test ---\n\n        const Comp = React.forwardRef((props, ref) => <main />);\n        Comp.displayName = 'MyCompName';\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[46]: const Comp = React.forwardRef((props, ref) => <main data-...", ({ task }) => {
      const code = `
        const Comp = React.forwardRef((props, ref) => <main data-as="yes" />) as SomeComponent;
        Comp.displayName = 'MyCompNameAs';
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 46)\n\n--- Source code under test ---\n\n        const Comp = React.forwardRef((props, ref) => <main data-as=\"yes\" />) as SomeComponent;\n        Comp.displayName = 'MyCompNameAs';\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[47]: function Test() { const data = [ { name: 'Bob', }, ]; con...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[48]: const f = (a) => () => { if (a) { return null; } return 1...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[49]: class Test { render() { const data = [ { name: 'Bob', }, ...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[50]: export const demo = (a) => (b) => { if (a == null) return...", ({ task }) => {
      const code = `
        export const demo = (a) => (b) => {
          if (a == null) return null;
          return b;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 50)\n\n--- Source code under test ---\n\n        export const demo = (a) => (b) => {\n          if (a == null) return null;\n          return b;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[51]: let demo = null; demo = (a) => { if (a == null) return nu...", ({ task }) => {
      const code = `
        let demo = null;
        demo = (a) => {
          if (a == null) return null;
          return f(a);
        };`;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 51)\n\n--- Source code under test ---\n\n        let demo = null;\n        demo = (a) => {\n          if (a == null) return null;\n          return f(a);\n        };\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[52]: obj._property = (a) => { if (a == null) return null; retu...", ({ task }) => {
      const code = `
        obj._property = (a) => {
          if (a == null) return null;
          return f(a);
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 52)\n\n--- Source code under test ---\n\n        obj._property = (a) => {\n          if (a == null) return null;\n          return f(a);\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[53]: _variable = (a) => { if (a == null) return null; return f...", ({ task }) => {
      const code = `
        _variable = (a) => {
          if (a == null) return null;
          return f(a);
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 53)\n\n--- Source code under test ---\n\n        _variable = (a) => {\n          if (a == null) return null;\n          return f(a);\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[54]: demo = () => () => null;", ({ task }) => {
      const code = `
        demo = () => () => null;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 54)\n\n--- Source code under test ---\n\n        demo = () => () => null;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[55]: demo = { property: () => () => null }", ({ task }) => {
      const code = `
        demo = {
          property: () => () => null
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 55)\n\n--- Source code under test ---\n\n        demo = {\n          property: () => () => null\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[56]: demo = function() {return function() {return null;};};", ({ task }) => {
      const code = `
        demo = function() {return function() {return null;};};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 56)\n\n--- Source code under test ---\n\n        demo = function() {return function() {return null;};};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[57]: demo = { property: function() {return function() {return ...", ({ task }) => {
      const code = `
        demo = {
          property: function() {return function() {return null;};}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: valid (index 57)\n\n--- Source code under test ---\n\n        demo = {\n          property: function() {return function() {return null;};}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[58]: function MyComponent(props) { return <b>{props.name}</b>;...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[5]: module.exports = () => { return <div>Hello {props.name}</...", ({ task }) => {
      const code = `
        module.exports = () => {
          return <div>Hello {props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        module.exports = () => {\n          return <div>Hello {props.name}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[6]: module.exports = function() { return <div>Hello {props.na...", ({ task }) => {
      const code = `
        module.exports = function() {
          return <div>Hello {props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        module.exports = function() {\n          return <div>Hello {props.name}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[7]: module.exports = createReactClass({ render() { return <di...", ({ task }) => {
      const code = `
        module.exports = createReactClass({
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        module.exports = createReactClass({\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[12]: function Hof() { return function () { return <div /> } }", ({ task }) => {
      const code = `
        function Hof() {
          return function () {
            return <div />
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        function Hof() {\n          return function () {\n            return <div />\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[13]: import React, { createElement } from \"react\"; export defa...", ({ task }) => {
      const code = `
        import React, { createElement } from "react";
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        import React, { createElement } from \"react\";\n        export default (props) => {\n          return createElement(\"div\", {}, \"hello\");\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[14]: import React from 'react' const ComponentWithMemo = React...", ({ task }) => {
      const code = `
        import React from 'react'

        const ComponentWithMemo = React.memo(({ world }) => {
          return <div>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ComponentWithMemo = React.memo(({ world }) => {\n          return <div>Hello {world}</div>\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[15]: import React from 'react' const ComponentWithMemo = React...", ({ task }) => {
      const code = `
        import React from 'react'

        const ComponentWithMemo = React.memo(function() {
          return <div>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ComponentWithMemo = React.memo(function() {\n          return <div>Hello {world}</div>\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[16]: import React from 'react' const ForwardRefComponentLike =...", ({ task }) => {
      const code = `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(({ world }, ref) => {
          return <div ref={ref}>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ForwardRefComponentLike = React.forwardRef(({ world }, ref) => {\n          return <div ref={ref}>Hello {world}</div>\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[52], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[17]: import React from 'react' const ForwardRefComponentLike =...", ({ task }) => {
      const code = `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(function({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 17)\n\n--- Source code under test ---\n\n        import React from 'react'\n\n        const ForwardRefComponentLike = React.forwardRef(function({ world }, ref) {\n          return <div ref={ref}>Hello {world}</div>\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[53], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[21]: import React from \"react\"; const { createElement } = Reac...", ({ task }) => {
      const code = `
        import React from "react";
        const { createElement } = React;
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 21)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        const { createElement } = React;\n        export default (props) => {\n          return createElement(\"div\", {}, \"hello\");\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[54], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[22]: import React from \"react\"; const createElement = React.cr...", ({ task }) => {
      const code = `
        import React from "react";
        const createElement = React.createElement;
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 22)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        const createElement = React.createElement;\n        export default (props) => {\n          return createElement(\"div\", {}, \"hello\");\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noDisplayName): Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[55], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[23]: module.exports = function () { function a () {} const b =...", ({ task }) => {
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
      const matches = ruleErrors(results[56], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[24]: module.exports = () => { function a () {} const b = funct...", ({ task }) => {
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
      const matches = ruleErrors(results[57], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[25]: export default class extends React.Component { render() {...", ({ task }) => {
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
      const matches = ruleErrors(results[58], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

    it("invalid[26]: export default class extends React.PureComponent { render...", ({ task }) => {
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
      const matches = ruleErrors(results[59], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Component definition is missing display name");
      expect(matches[1].message).toBe("Component definition is missing display name");
    });

    it("invalid[27]: const renderer = a => listItem => ( <div>{a} {listItem}</...", ({ task }) => {
      const code = `
        const renderer = a => listItem => (
          <div>{a} {listItem}</div>
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: display-name\nType: invalid (index 27)\n\n--- Source code under test ---\n\n        const renderer = a => listItem => (\n          <div>{a} {listItem}</div>\n        );\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Component definition is missing display name\n\nRule message templates:\n  noDisplayName: Component definition is missing display name\n  noContextDisplayName: Context definition is missing display name";
      const matches = ruleErrors(results[60], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component definition is missing display name");
    });

  });
});
