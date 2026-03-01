import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Invalid prop value: \"{{text}}\"",
  "Invalid prop value: \"{{text}}\" in {{element}}",
  "Strings not allowed in attributes: \"{{text}}\"",
  "Strings not allowed in attributes: \"{{text}}\" in {{element}}",
  "Strings not allowed in JSX files: \"{{text}}\"",
  "Strings not allowed in JSX files: \"{{text}}\" in {{element}}",
  "Missing JSX expression container around literal string: \"{{text}}\"",
  "Missing JSX expression container around literal string: \"{{text}}\" in {{element}}",
  "Restricted attribute string: \"{{text}}\" in {{attribute}}",
  "Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}",
  "Missing JSX expression container around literal string: \"test\"",
  "Missing JSX expression container around literal string: \"hello\"",
  "Missing JSX expression container around literal string: \"asdjfl\"",
  "Missing JSX expression container around literal string: \"asdjfl\n                test\n                foo\"",
  "Invalid prop value: \"bar=\"test\"\"",
  "Strings not allowed in JSX files: \"'Test'\"",
  "Strings not allowed in JSX files: \"Test\"",
  "Strings not allowed in JSX files: \"`Test`\"",
  "Strings not allowed in JSX files: \"`${baz}`\"",
  "Strings not allowed in JSX files: \"`Test ${baz}`\"",
  "Strings not allowed in JSX files: \"`foo`\"",
  "Strings not allowed in JSX files: \"'bar'\"",
  "Strings not allowed in JSX files: \"`bar`\"",
  "Strings not allowed in JSX files: \"'foo'\"",
  "Strings not allowed in JSX files: \"asdf\"",
  "Strings not allowed in attributes: \"'blank image'\"",
  "Missing JSX expression container around literal string: \"baz bob\"",
  "Strings not allowed in attributes: \"\"foo bar\"\"",
  "Restricted attribute string: \"\"test\"\" in className",
  "Restricted attribute string: \"\"foo\"\" in id",
  "Strings not allowed in attributes: \"\"image.jpg\"\"",
  "Restricted attribute string: \"\"text\"\" in title",
  "Strings not allowed in JSX files: \"test\"",
  "Invalid prop value: \"title=\"hello\"\"",
  "Missing JSX expression container around literal string: \"foo\"",
  "Missing JSX expression container around literal string: \"bar\" in T",
  "Missing JSX expression container around literal string: \"bar\"",
  "Strings not allowed in JSX files: \"'bar'\" in T",
  "Strings not allowed in JSX files: \"'baz'\" in T",
  "Invalid prop value: \"foo1=\"bar\"\"",
  "Invalid prop value: \"foo3=\"bar\"\"",
  "Strings not allowed in attributes: \"\"bar2\"\" in T",
  "Strings not allowed in attributes: \"\"bar3\"\" in T",
  "Missing JSX expression container around literal string: \"foo\" in T",
  "Missing JSX expression container around literal string: \"baz\" in T",
  "Invalid prop value: \"foo2=\"bar2\"\" in T",
  "Strings not allowed in attributes: \"\"bar1\"\"",
  "Missing JSX expression container around literal string: \"bar\" in U",
  "Strings not allowed in JSX files: \"'foo'\" in T",
  "Missing JSX expression container around literal string: \"foo\" in U",
  "Restricted attribute string: \"\"submit\"\" in type of Button",
  "Restricted attribute string: \"\"Enter text\"\" in placeholder of Input",
  "Restricted attribute string: \"\"true\"\" in disabled of Button",
  "Restricted attribute string: \"\"wrapper\"\" in className",
  "Restricted attribute string: \"\"submit-btn\"\" in id of Button",
  "Restricted attribute string: \"\"bar2\"\" in foo2 of T",
];

describe("jsx-no-literals", () => {
  describe("valid", () => {
    it("valid[1]: class Comp2 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp2 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 1)\n\n--- Source code under test ---\n\n        class Comp2 extends Component {\n          render() {\n            return (\n              <div>\n                {'asdjfl'}\n              </div>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: class Comp1 extends Component { render() { return ( <> {'...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <>
                {'asdjfl'}
              </>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 2)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <>\n                {'asdjfl'}\n              </>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: class Comp1 extends Component { render() { return (<div>{...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<div>{'test'}</div>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 3)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<div>{'test'}</div>);\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: class Comp1 extends Component { render() { const bar = (<...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            const bar = (<div>{'hello'}</div>);
            return bar;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 4)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            const bar = (<div>{'hello'}</div>);\n            return bar;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var Hello = createReactClass({ foo: (<div>{'hello'}</div>...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          foo: (<div>{'hello'}</div>),
          render() {
            return this.foo;
          },
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 5)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          foo: (<div>{'hello'}</div>),\n          render() {\n            return this.foo;\n          },\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                {'test'}
                {'foo'}
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 6)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                {'asdjfl'}\n                {'test'}\n                {'foo'}\n              </div>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 7)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n              </div>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: var foo = require('foo');", async ({ task }) => {
      const code = `
        var foo = require('foo');
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 8)\n\n--- Source code under test ---\n\n        var foo = require('foo');\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <Foo bar='test'> {'blarg'} </Foo>", async ({ task }) => {
      const code = `
        <Foo bar='test'>
          {'blarg'}
        </Foo>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 9)\n\n--- Source code under test ---\n\n        <Foo bar='test'>\n          {'blarg'}\n        </Foo>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: <img alt='blank image'></img>", async ({ task }) => {
      const code = `
        <img alt='blank image'></img>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 26)\n\n--- Source code under test ---\n\n        <img alt='blank image'></img>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[49]: import { T } from 'foo'; <T>{'foo'}</T>", async ({ task }) => {
      const code = `
        import { T } from 'foo';
        <T>{'foo'}</T>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 49)\n\n--- Source code under test ---\n\n        import { T } from 'foo';\n        <T>{'foo'}</T>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: class Comp1 extends Component { render() { return (<div>t...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<div>test</div>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<div>test</div>);\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"test\"\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

    it("invalid[1]: class Comp1 extends Component { render() { return (<>test...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<>test</>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<>test</>);\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"test\"\n\nFeatures: fragment\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

    it("invalid[2]: class Comp1 extends Component { render() { const foo = (<...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            const foo = (<div>test</div>);
            return foo;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            const foo = (<div>test</div>);\n            return foo;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"test\"\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

    it("invalid[3]: class Comp1 extends Component { render() { const varObjec...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            const varObjectTest = { testKey : (<div>test</div>) };
            return varObjectTest.testKey;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            const varObjectTest = { testKey : (<div>test</div>) };\n            return varObjectTest.testKey;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"test\"\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

    it("invalid[4]: var Hello = createReactClass({ foo: (<div>hello</div>), r...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          foo: (<div>hello</div>),
          render() {
            return this.foo;
          },
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          foo: (<div>hello</div>),\n          render() {\n            return this.foo;\n          },\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"hello\"\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"hello\"");
    });

    it("invalid[5]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                asdjfl\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"asdjfl\"\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"asdjfl\"");
    });

    it("invalid[6]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
                test
                foo
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                asdjfl\n                test\n                foo\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"asdjfl\n                test\n                foo\"\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"asdjfl\n                test\n                foo\"");
    });

    it("invalid[7]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                test
                {'foo'}
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                {'asdjfl'}\n                test\n                {'foo'}\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"test\"\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-literals", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

  });
});
