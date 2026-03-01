import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Your render method should have a return statement",
];

describe("require-render-return", () => {
  describe("valid", () => {
    it("valid[0]: class Hello extends React.Component { render() { return <...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: class Hello extends React.Component { render = () => { re...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render = () => {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 1)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render = () => {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: class Hello extends React.Component { render = () => ( <d...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render = () => (
            <div>Hello {this.props.name}</div>
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 2)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render = () => (\n            <div>Hello {this.props.name}</div>\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields, no-ts-old\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ displayName: 'Hello', rend...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: function Hello() { return <div></div>; }", async ({ task }) => {
      const code = `
        function Hello() {
          return <div></div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 4)\n\n--- Source code under test ---\n\n        function Hello() {\n          return <div></div>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var Hello = () => ( <div></div> );", async ({ task }) => {
      const code = `
        var Hello = () => (
          <div></div>
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 5)\n\n--- Source code under test ---\n\n        var Hello = () => (\n          <div></div>\n        );\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: var Hello = createReactClass({ render: function() { switc...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var Hello = createReactClass({ render: function() { if (t...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: class Hello { render() {} }", async ({ task }) => {
      const code = `
        class Hello {
          render() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 8)\n\n--- Source code under test ---\n\n        class Hello {\n          render() {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: class Hello extends React.Component {}", async ({ task }) => {
      const code = `class Hello extends React.Component {}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 9)\n\n--- Source code under test ---\nclass Hello extends React.Component {}\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: var Hello = createReactClass({});", async ({ task }) => {
      const code = `var Hello = createReactClass({});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 10)\n\n--- Source code under test ---\nvar Hello = createReactClass({});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: var render = require('./render'); var Hello = createReact...", async ({ task }) => {
      const code = `
        var render = require('./render');
        var Hello = createReactClass({
          render
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 11)\n\n--- Source code under test ---\n\n        var render = require('./render');\n        var Hello = createReactClass({\n          render\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: class Foo extends Component { render }", async ({ task }) => {
      const code = `
        class Foo extends Component {
          render
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: valid (index 12)\n\n--- Source code under test ---\n\n        class Foo extends Component {\n          render\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ displayName: 'Hello', rend...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {}
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          displayName: 'Hello',\n          render: function() {}\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noRenderReturn): Your render method should have a return statement\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Your render method should have a return statement");
    });

    it("invalid[1]: class Hello extends React.Component { render() {} }", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {}\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noRenderReturn): Your render method should have a return statement\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Your render method should have a return statement");
    });

    it("invalid[2]: class Hello extends React.Component { render() { const na...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Your render method should have a return statement");
    });

    it("invalid[3]: class Hello extends React.Component { render = () => { <d...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render = () => {
            <div>Hello {this.props.name}</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-render-return\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render = () => {\n            <div>Hello {this.props.name}</div>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noRenderReturn): Your render method should have a return statement\n\nFeatures: class fields\n\nRule message templates:\n  noRenderReturn: Your render method should have a return statement";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-render-return", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Your render method should have a return statement");
    });

  });
});
