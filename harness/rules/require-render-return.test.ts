import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "require-render-return";
const VALID_COUNT = 13;

const RULE_MESSAGES = [
  "Your render method should have a return statement",
];

const cases = [
  { code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render = () => {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render = () => (
            <div>Hello {this.props.name}</div>
          )
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {
            return <div></div>
          }
        });
      `, filename: "test.jsx" },
  { code: `
        function Hello() {
          return <div></div>;
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = () => (
          <div></div>
        );
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            switch (this.props.name) {
              case 'Foo':
                return <div>Hello Foo</div>;
              default:
                return <div>Hello {this.props.name}</div>;
            }
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            if (this.props.name === 'Foo') {
              return <div>Hello Foo</div>;
            } else {
              return <div>Hello {this.props.name}</div>;
            }
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello {
          render() {}
        }
      `, filename: "test.jsx" },
  { code: `class Hello extends React.Component {}`, filename: "test.jsx" },
  { code: `var Hello = createReactClass({});`, filename: "test.jsx" },
  { code: `
        var render = require('./render');
        var Hello = createReactClass({
          render
        });
      `, filename: "test.jsx" },
  { code: `
        class Foo extends Component {
          render
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {}
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render() {}
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render() {
            const names = this.props.names.map(function(name) {
              return <div>{name}</div>
            });
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render = () => {
            <div>Hello {this.props.name}</div>
          }
        }
      `, filename: "test.jsx" },
];

describe("require-render-return", () => {
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
    it("valid[0]: class Hello extends React.Component { render() { return <...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: class Hello extends React.Component { render = () => { re...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render = () => {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 1)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render = () => {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: class Hello extends React.Component { render = () => ( <d...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render = () => (
            <div>Hello {this.props.name}</div>
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 2)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render = () => (\n            <div>Hello {this.props.name}</div>\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ displayName: 'Hello', rend...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {
            return <div></div>
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          displayName: 'Hello',\n          render: function() {\n            return <div></div>\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: function Hello() { return <div></div>; }", ({ task }) => {
      const code = `
        function Hello() {
          return <div></div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 4)\n\n--- Source code under test ---\n\n        function Hello() {\n          return <div></div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var Hello = () => ( <div></div> );", ({ task }) => {
      const code = `
        var Hello = () => (
          <div></div>
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 5)\n\n--- Source code under test ---\n\n        var Hello = () => (\n          <div></div>\n        );\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: var Hello = createReactClass({ render: function() { switc...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            switch (this.props.name) {
              case 'Foo':
                return <div>Hello Foo</div>;
              default:
                return <div>Hello {this.props.name}</div>;
            }
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 6)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            switch (this.props.name) {\n              case 'Foo':\n                return <div>Hello Foo</div>;\n              default:\n                return <div>Hello {this.props.name}</div>;\n            }\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var Hello = createReactClass({ render: function() { if (t...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            if (this.props.name === 'Foo') {
              return <div>Hello Foo</div>;
            } else {
              return <div>Hello {this.props.name}</div>;
            }
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 7)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            if (this.props.name === 'Foo') {\n              return <div>Hello Foo</div>;\n            } else {\n              return <div>Hello {this.props.name}</div>;\n            }\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: class Hello { render() {} }", ({ task }) => {
      const code = `
        class Hello {
          render() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 8)\n\n--- Source code under test ---\n\n        class Hello {\n          render() {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: class Hello extends React.Component {}", ({ task }) => {
      const code = `class Hello extends React.Component {}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 9)\n\n--- Source code under test ---\nclass Hello extends React.Component {}\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: var Hello = createReactClass({});", ({ task }) => {
      const code = `var Hello = createReactClass({});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 10)\n\n--- Source code under test ---\nvar Hello = createReactClass({});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: var render = require('./render'); var Hello = createReact...", ({ task }) => {
      const code = `
        var render = require('./render');
        var Hello = createReactClass({
          render
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 11)\n\n--- Source code under test ---\n\n        var render = require('./render');\n        var Hello = createReactClass({\n          render\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: class Foo extends Component { render }", ({ task }) => {
      const code = `
        class Foo extends Component {
          render
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 12)\n\n--- Source code under test ---\n\n        class Foo extends Component {\n          render\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ displayName: 'Hello', rend...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {}
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          displayName: 'Hello',\n          render: function() {}\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noRenderReturn): Your render method should have a return statement\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Your render method should have a return statement");
    });

    it("invalid[1]: class Hello extends React.Component { render() {} }", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {}\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noRenderReturn): Your render method should have a return statement\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Your render method should have a return statement");
    });

    it("invalid[2]: class Hello extends React.Component { render() { const na...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            const names = this.props.names.map(function(name) {
              return <div>{name}</div>
            });
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            const names = this.props.names.map(function(name) {\n              return <div>{name}</div>\n            });\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noRenderReturn): Your render method should have a return statement\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Your render method should have a return statement");
    });

    it("invalid[3]: class Hello extends React.Component { render = () => { <d...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render = () => {
            <div>Hello {this.props.name}</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render = () => {\n            <div>Hello {this.props.name}</div>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noRenderReturn): Your render method should have a return statement\n\nFeatures: class fields\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Your render method should have a return statement");
    });

  });
});
