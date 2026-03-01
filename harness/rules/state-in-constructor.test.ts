import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "state-in-constructor";
const VALID_COUNT = 9;

const RULE_MESSAGES = [
  "State initialization should be in a constructor",
  "State initialization should be in a class property",
];

const cases = [
  { code: `
        class Foo extends React.Component {
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.baz = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        const Foo = () => <div>Foo</div>
      `, filename: "test.jsx" },
  { code: `
        function Foo () {
          return <div>Foo</div>
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            if (foobar) {
              this.state = { bar: 0 }
            }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            foobar = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          state = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          state = { bar: 0 }
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.baz = { bar: 0 }
          }
          state = { baz: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          state = { baz: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `, filename: "test.jsx" },
];

describe("state-in-constructor", () => {
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
    it("valid[0]: class Foo extends React.Component { render() { return <di...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: class Foo extends React.Component { constructor(props) { ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 2)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor(props) {\n            super(props)\n            this.state = { bar: 0 }\n          }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: class Foo extends React.Component { constructor(props) { ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 4)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor(props) {\n            super(props)\n            this.state = { bar: 0 }\n          }\n          baz = { bar: 0 }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class Foo extends React.Component { constructor(props) { ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.baz = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor(props) {\n            super(props)\n            this.baz = { bar: 0 }\n          }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: class Foo extends React.Component { baz = { bar: 0 } rend...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 7)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          baz = { bar: 0 }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const Foo = () => <div>Foo</div>", ({ task }) => {
      const code = `
        const Foo = () => <div>Foo</div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 9)\n\n--- Source code under test ---\n\n        const Foo = () => <div>Foo</div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: function Foo () { return <div>Foo</div> }", ({ task }) => {
      const code = `
        function Foo () {
          return <div>Foo</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 11)\n\n--- Source code under test ---\n\n        function Foo () {\n          return <div>Foo</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: class Foo extends React.Component { constructor(props) { ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            if (foobar) {
              this.state = { bar: 0 }
            }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 16)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor(props) {\n            super(props)\n            if (foobar) {\n              this.state = { bar: 0 }\n            }\n          }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: class Foo extends React.Component { constructor(props) { ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            foobar = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: valid (index 17)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor(props) {\n            super(props)\n            foobar = { bar: 0 }\n          }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[2]: class Foo extends React.Component { state = { bar: 0 } re...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          state = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          state = { bar: 0 }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stateInitConstructor): State initialization should be in a constructor\n\nFeatures: class fields\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("State initialization should be in a constructor");
    });

    it("invalid[3]: class Foo extends React.Component { state = { bar: 0 } ba...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          state = { bar: 0 }
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          state = { bar: 0 }\n          baz = { bar: 0 }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stateInitConstructor): State initialization should be in a constructor\n\nFeatures: class fields\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("State initialization should be in a constructor");
    });

    it("invalid[4]: class Foo extends React.Component { constructor(props) { ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.baz = { bar: 0 }
          }
          state = { baz: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor(props) {\n            super(props)\n            this.baz = { bar: 0 }\n          }\n          state = { baz: 0 }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stateInitConstructor): State initialization should be in a constructor\n\nFeatures: class fields\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("State initialization should be in a constructor");
    });

    it("invalid[5]: class Foo extends React.Component { constructor(props) { ...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          state = { baz: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: state-in-constructor\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor(props) {\n            super(props)\n            this.state = { bar: 0 }\n          }\n          state = { baz: 0 }\n          render() {\n            return <div>Foo</div>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stateInitConstructor): State initialization should be in a constructor\n\nFeatures: class fields\n\nRule message templates:\n  stateInitConstructor: State initialization should be in a constructor\n  stateInitClassProp: State initialization should be in a class property";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("State initialization should be in a constructor");
    });

  });
});
