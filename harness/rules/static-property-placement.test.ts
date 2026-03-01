import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "static-property-placement";
const VALID_COUNT = 16;

const RULE_MESSAGES = [
  "'{{name}}' should be declared as a static class property.",
  "'{{name}}' should be declared as a static getter class function.",
  "'{{name}}' should be declared outside the class body.",
  "'childContextTypes' should be declared as a static class property.",
  "'contextTypes' should be declared as a static class property.",
  "'contextType' should be declared as a static class property.",
  "'displayName' should be declared as a static class property.",
  "'defaultProps' should be declared as a static class property.",
  "'propTypes' should be declared as a static class property.",
  "'childContextTypes' should be declared outside the class body.",
  "'contextTypes' should be declared outside the class body.",
  "'contextType' should be declared outside the class body.",
  "'displayName' should be declared outside the class body.",
  "'defaultProps' should be declared outside the class body.",
  "'propTypes' should be declared outside the class body.",
  "'childContextTypes' should be declared as a static getter class function.",
  "'contextTypes' should be declared as a static getter class function.",
  "'contextType' should be declared as a static getter class function.",
  "'displayName' should be declared as a static getter class function.",
  "'defaultProps' should be declared as a static getter class function.",
  "'propTypes' should be declared as a static getter class function.",
];

const cases = [
  { code: `
        const MyComponent = () => {
            return <div>Hello</div>;
        };

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `, filename: "test.jsx" },
  { code: `
        const MyComponent = () => (<div>Hello</div>);

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `, filename: "test.jsx" },
  { code: `
        export function MyComponent () {
            return <div>Hello</div>;
        };

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `, filename: "test.jsx" },
  { code: `
        class Foo {
          static get propTypes() {}
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static randomlyNamed = {
            name: 'random'
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.randomlyNamed = {
          name: 'random'
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static contextTypes = {
            something: PropTypes.bool
          };
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static contextType = MyContext;
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static displayName = "Hello";
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static defaultProps = {
            something: 'Bob'
          };
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static propTypes = {
            something: PropTypes.bool
          };
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };

          static contextTypes = {
            something: PropTypes.bool
          };

          static contextType = MyContext;

          static displayName = "Hello";

          static defaultProps = {
            something: 'Bob'
          };

          static propTypes = {
            something: PropTypes.bool
          };
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static displayName = "Hello";
        }

        const OtherComponent = () => (<div>Hello</div>);

        OtherComponent.defaultProps = {
          name: 'Bob'
        }

        OtherComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static displayName = "Hello";
        }

        class OtherComponent extends React.Component {
          static defaultProps = {
            name: 'Bob'
          }

          static propTypes = {
            name: PropTypes.string.isRequired
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextType = MyContext;

        MyComponent.displayName = "Hello";

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextType() {
            return MyContext;
          }

          static get displayName() {
            return "Hello";
          }

          static get defaultProps() {
            return {
              something: PropTypes.bool
            };
          }

          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `, filename: "test.jsx" },
];

describe("static-property-placement", () => {
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
    it("valid[2]: const MyComponent = () => { return <div>Hello</div>; }; M...", ({ task }) => {
      const code = `
        const MyComponent = () => {
            return <div>Hello</div>;
        };

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 2)\n\n--- Source code under test ---\n\n        const MyComponent = () => {\n            return <div>Hello</div>;\n        };\n\n        MyComponent.childContextTypes = {\n          something: PropTypes.bool\n        };\n\n        MyComponent.contextTypes = {\n          something: PropTypes.bool\n        };\n\n        MyComponent.defaultProps = {\n          something: 'Bob'\n        };\n\n        MyComponent.displayName = 'Hello';\n\n        MyComponent.propTypes = {\n          something: PropTypes.bool\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: const MyComponent = () => (<div>Hello</div>); MyComponent...", ({ task }) => {
      const code = `
        const MyComponent = () => (<div>Hello</div>);

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 3)\n\n--- Source code under test ---\n\n        const MyComponent = () => (<div>Hello</div>);\n\n        MyComponent.childContextTypes = {\n          something: PropTypes.bool\n        };\n\n        MyComponent.contextTypes = {\n          something: PropTypes.bool\n        };\n\n        MyComponent.defaultProps = {\n          something: 'Bob'\n        };\n\n        MyComponent.displayName = 'Hello';\n\n        MyComponent.propTypes = {\n          something: PropTypes.bool\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: export function MyComponent () { return <div>Hello</div>;...", ({ task }) => {
      const code = `
        export function MyComponent () {
            return <div>Hello</div>;
        };

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 4)\n\n--- Source code under test ---\n\n        export function MyComponent () {\n            return <div>Hello</div>;\n        };\n\n        MyComponent.childContextTypes = {\n          something: PropTypes.bool\n        };\n\n        MyComponent.contextTypes = {\n          something: PropTypes.bool\n        };\n\n        MyComponent.defaultProps = {\n          something: 'Bob'\n        };\n\n        MyComponent.displayName = 'Hello';\n\n        MyComponent.propTypes = {\n          something: PropTypes.bool\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class Foo { static get propTypes() {} }", ({ task }) => {
      const code = `
        class Foo {
          static get propTypes() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class Foo {\n          static get propTypes() {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: class MyComponent extends React.Component { render() { re...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 7)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          render() {\n            return null;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: class MyComponent extends React.Component { static random...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static randomlyNamed = {
            name: 'random'
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 8)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static randomlyNamed = {\n            name: 'random'\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: class MyComponent extends React.Component { render() { re...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.randomlyNamed = {
          name: 'random'
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 11)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          render() {\n            return null;\n          }\n        }\n\n        MyComponent.randomlyNamed = {\n          name: 'random'\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: class MyComponent extends React.Component { static childC...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 12)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static childContextTypes = {\n            something: PropTypes.bool\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: class MyComponent extends React.Component { static contex...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static contextTypes = {
            something: PropTypes.bool
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 18)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static contextTypes = {\n            something: PropTypes.bool\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: class MyComponent extends React.Component { static contex...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static contextType = MyContext;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 24)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static contextType = MyContext;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: class MyComponent extends React.Component { static displa...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static displayName = "Hello";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 30)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static displayName = \"Hello\";\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: class MyComponent extends React.Component { static defaul...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static defaultProps = {
            something: 'Bob'
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 36)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static defaultProps = {\n            something: 'Bob'\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[42]: class MyComponent extends React.Component { static propTy...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static propTypes = {
            something: PropTypes.bool
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 42)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static propTypes = {\n            something: PropTypes.bool\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[48]: class MyComponent extends React.Component { static childC...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };

          static contextTypes = {
            something: PropTypes.bool
          };

          static contextType = MyContext;

          static displayName = "Hello";

          static defaultProps = {
            something: 'Bob'
          };

          static propTypes = {
            something: PropTypes.bool
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 48)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static childContextTypes = {\n            something: PropTypes.bool\n          };\n\n          static contextTypes = {\n            something: PropTypes.bool\n          };\n\n          static contextType = MyContext;\n\n          static displayName = \"Hello\";\n\n          static defaultProps = {\n            something: 'Bob'\n          };\n\n          static propTypes = {\n            something: PropTypes.bool\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[56]: class MyComponent extends React.Component { static childC...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static displayName = "Hello";
        }

        const OtherComponent = () => (<div>Hello</div>);

        OtherComponent.defaultProps = {
          name: 'Bob'
        }

        OtherComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 56)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static childContextTypes = {\n            name: PropTypes.string.isRequired\n          }\n\n          static contextTypes = {\n            name: PropTypes.string.isRequired\n          }\n\n          static displayName = \"Hello\";\n        }\n\n        const OtherComponent = () => (<div>Hello</div>);\n\n        OtherComponent.defaultProps = {\n          name: 'Bob'\n        }\n\n        OtherComponent.propTypes = {\n          name: PropTypes.string.isRequired\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[57]: class MyComponent extends React.Component { static childC...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static displayName = "Hello";
        }

        class OtherComponent extends React.Component {
          static defaultProps = {
            name: 'Bob'
          }

          static propTypes = {
            name: PropTypes.string.isRequired
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: valid (index 57)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static childContextTypes = {\n            name: PropTypes.string.isRequired\n          }\n\n          static contextTypes = {\n            name: PropTypes.string.isRequired\n          }\n\n          static displayName = \"Hello\";\n        }\n\n        class OtherComponent extends React.Component {\n          static defaultProps = {\n            name: 'Bob'\n          }\n\n          static propTypes = {\n            name: PropTypes.string.isRequired\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: class MyComponent extends React.Component { render() { re...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextType = MyContext;

        MyComponent.displayName = "Hello";

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          render() {\n            return null;\n          }\n        }\n\n        MyComponent.childContextTypes = {\n          name: PropTypes.string.isRequired\n        }\n\n        MyComponent.contextTypes = {\n          name: PropTypes.string.isRequired\n        }\n\n        MyComponent.contextType = MyContext;\n\n        MyComponent.displayName = \"Hello\";\n\n        MyComponent.defaultProps = {\n          name: 'Bob'\n        }\n\n        MyComponent.propTypes = {\n          name: PropTypes.string.isRequired\n        }\n      \n\nThis code is INVALID — the rule should produce 6 diagnostic(s):\n  [0] (messageId: notStaticClassProp): 'childContextTypes' should be declared as a static class property.\n  [1] (messageId: notStaticClassProp): 'contextTypes' should be declared as a static class property.\n  [2] (messageId: notStaticClassProp): 'contextType' should be declared as a static class property.\n  [3] (messageId: notStaticClassProp): 'displayName' should be declared as a static class property.\n  [4] (messageId: notStaticClassProp): 'defaultProps' should be declared as a static class property.\n  [5] (messageId: notStaticClassProp): 'propTypes' should be declared as a static class property.\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(6);
      expect(matches[0].message).toBe("'childContextTypes' should be declared as a static class property.");
      expect(matches[1].message).toBe("'contextTypes' should be declared as a static class property.");
      expect(matches[2].message).toBe("'contextType' should be declared as a static class property.");
      expect(matches[3].message).toBe("'displayName' should be declared as a static class property.");
      expect(matches[4].message).toBe("'defaultProps' should be declared as a static class property.");
      expect(matches[5].message).toBe("'propTypes' should be declared as a static class property.");
    });

    it("invalid[2]: class MyComponent extends React.Component { static get ch...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextType() {
            return MyContext;
          }

          static get displayName() {
            return "Hello";
          }

          static get defaultProps() {
            return {
              something: PropTypes.bool
            };
          }

          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: static-property-placement\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static get childContextTypes() {\n            return {\n              something: PropTypes.bool\n            };\n          }\n\n          static get contextTypes() {\n            return {\n              something: PropTypes.bool\n            };\n          }\n\n          static get contextType() {\n            return MyContext;\n          }\n\n          static get displayName() {\n            return \"Hello\";\n          }\n\n          static get defaultProps() {\n            return {\n              something: PropTypes.bool\n            };\n          }\n\n          static get propTypes() {\n            return {\n              something: PropTypes.bool\n            };\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 6 diagnostic(s):\n  [0] (messageId: notStaticClassProp): 'childContextTypes' should be declared as a static class property.\n  [1] (messageId: notStaticClassProp): 'contextTypes' should be declared as a static class property.\n  [2] (messageId: notStaticClassProp): 'contextType' should be declared as a static class property.\n  [3] (messageId: notStaticClassProp): 'displayName' should be declared as a static class property.\n  [4] (messageId: notStaticClassProp): 'defaultProps' should be declared as a static class property.\n  [5] (messageId: notStaticClassProp): 'propTypes' should be declared as a static class property.\n\nRule message templates:\n  notStaticClassProp: '{{name}}' should be declared as a static class property.\n  notGetterClassFunc: '{{name}}' should be declared as a static getter class function.\n  declareOutsideClass: '{{name}}' should be declared outside the class body.";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(6);
      expect(matches[0].message).toBe("'childContextTypes' should be declared as a static class property.");
      expect(matches[1].message).toBe("'contextTypes' should be declared as a static class property.");
      expect(matches[2].message).toBe("'contextType' should be declared as a static class property.");
      expect(matches[3].message).toBe("'displayName' should be declared as a static class property.");
      expect(matches[4].message).toBe("'defaultProps' should be declared as a static class property.");
      expect(matches[5].message).toBe("'propTypes' should be declared as a static class property.");
    });

  });
});
