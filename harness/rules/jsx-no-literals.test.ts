import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-no-literals";
const VALID_COUNT = 11;

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

const cases = [
  { code: `
        class Comp2 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
              </div>
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            return (
              <>
                {'asdjfl'}
              </>
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            return (<div>{'test'}</div>);
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            const bar = (<div>{'hello'}</div>);
            return bar;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          foo: (<div>{'hello'}</div>),
          render() {
            return this.foo;
          },
        });
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
              </div>
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        var foo = require('foo');
      `, filename: "test.jsx" },
  { code: `
        <Foo bar='test'>
          {'blarg'}
        </Foo>
      `, filename: "test.jsx" },
  { code: `
        <img alt='blank image'></img>
      `, filename: "test.jsx" },
  { code: `
        import { T } from 'foo';
        <T>{'foo'}</T>
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            return (<div>test</div>);
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            return (<>test</>);
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            const foo = (<div>test</div>);
            return foo;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            const varObjectTest = { testKey : (<div>test</div>) };
            return varObjectTest.testKey;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          foo: (<div>hello</div>),
          render() {
            return this.foo;
          },
        });
      `, filename: "test.jsx" },
  { code: `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
              </div>
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
  { code: `
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
      `, filename: "test.jsx" },
];

describe("jsx-no-literals", () => {
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
    it("valid[1]: class Comp2 extends Component { render() { return ( <div>...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: class Comp1 extends Component { render() { return ( <> {'...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: class Comp1 extends Component { render() { return (<div>{...", ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<div>{'test'}</div>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 3)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<div>{'test'}</div>);\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: class Comp1 extends Component { render() { const bar = (<...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var Hello = createReactClass({ foo: (<div>{'hello'}</div>...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: class Comp1 extends Component { render() { return ( <div>...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: class Comp1 extends Component { render() { return ( <div>...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: var foo = require('foo');", ({ task }) => {
      const code = `
        var foo = require('foo');
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 8)\n\n--- Source code under test ---\n\n        var foo = require('foo');\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <Foo bar='test'> {'blarg'} </Foo>", ({ task }) => {
      const code = `
        <Foo bar='test'>
          {'blarg'}
        </Foo>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 9)\n\n--- Source code under test ---\n\n        <Foo bar='test'>\n          {'blarg'}\n        </Foo>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: <img alt='blank image'></img>", ({ task }) => {
      const code = `
        <img alt='blank image'></img>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 26)\n\n--- Source code under test ---\n\n        <img alt='blank image'></img>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[49]: import { T } from 'foo'; <T>{'foo'}</T>", ({ task }) => {
      const code = `
        import { T } from 'foo';
        <T>{'foo'}</T>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: valid (index 49)\n\n--- Source code under test ---\n\n        import { T } from 'foo';\n        <T>{'foo'}</T>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: class Comp1 extends Component { render() { return (<div>t...", ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<div>test</div>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<div>test</div>);\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"test\"\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

    it("invalid[1]: class Comp1 extends Component { render() { return (<>test...", ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<>test</>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-literals\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<>test</>);\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: literalNotInJSXExpression): Missing JSX expression container around literal string: \"test\"\n\nFeatures: fragment\n\nRule message templates:\n  invalidPropValue: Invalid prop value: \"{{text}}\"\n  invalidPropValueInElement: Invalid prop value: \"{{text}}\" in {{element}}\n  noStringsInAttributes: Strings not allowed in attributes: \"{{text}}\"\n  noStringsInAttributesInElement: Strings not allowed in attributes: \"{{text}}\" in {{element}}\n  noStringsInJSX: Strings not allowed in JSX files: \"{{text}}\"\n  noStringsInJSXInElement: Strings not allowed in JSX files: \"{{text}}\" in {{element}}\n  literalNotInJSXExpression: Missing JSX expression container around literal string: \"{{text}}\"\n  literalNotInJSXExpressionInElement: Missing JSX expression container around literal string: \"{{text}}\" in {{element}}\n  restrictedAttributeString: Restricted attribute string: \"{{text}}\" in {{attribute}}\n  restrictedAttributeStringInElement: Restricted attribute string: \"{{text}}\" in {{attribute}} of {{element}}";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

    it("invalid[2]: class Comp1 extends Component { render() { const foo = (<...", ({ task }) => {
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
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

    it("invalid[3]: class Comp1 extends Component { render() { const varObjec...", ({ task }) => {
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
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

    it("invalid[4]: var Hello = createReactClass({ foo: (<div>hello</div>), r...", ({ task }) => {
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
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"hello\"");
    });

    it("invalid[5]: class Comp1 extends Component { render() { return ( <div>...", ({ task }) => {
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
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"asdjfl\"");
    });

    it("invalid[6]: class Comp1 extends Component { render() { return ( <div>...", ({ task }) => {
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
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"asdjfl\n                test\n                foo\"");
    });

    it("invalid[7]: class Comp1 extends Component { render() { return ( <div>...", ({ task }) => {
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
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing JSX expression container around literal string: \"test\"");
    });

  });
});
