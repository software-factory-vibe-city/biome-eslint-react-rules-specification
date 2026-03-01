import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-render-return-value";
const VALID_COUNT = 4;

const RULE_MESSAGES = [
  "Do not depend on the return value from {{node}}.render",
  "Do not depend on the return value from ReactDOM.render",
  "Do not depend on the return value from React.render",
];

const cases = [
  { code: `ReactDOM.render(<div />, document.body);`, filename: "test.jsx" },
  { code: `
        let node;
        ReactDOM.render(<div ref={ref => node = ref}/>, document.body);
      `, filename: "test.jsx" },
  { code: `var foo = render(<div />, root)`, filename: "test.jsx" },
  { code: `var foo = ReactDom.renderder(<div />, root)`, filename: "test.jsx" },
  { code: `var Hello = ReactDOM.render(<div />, document.body);`, filename: "test.jsx" },
  { code: `
        var o = {
          inst: ReactDOM.render(<div />, document.body)
        };
      `, filename: "test.jsx" },
  { code: `
        function render () {
          return ReactDOM.render(<div />, document.body)
        }
      `, filename: "test.jsx" },
  { code: `var render = (a, b) => ReactDOM.render(a, b)`, filename: "test.jsx" },
  { code: `this.o = ReactDOM.render(<div />, document.body);`, filename: "test.jsx" },
  { code: `var v; v = ReactDOM.render(<div />, document.body);`, filename: "test.jsx" },
];

describe("no-render-return-value", () => {
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
    it("valid[0]: ReactDOM.render(<div />, document.body);", ({ task }) => {
      const code = `ReactDOM.render(<div />, document.body);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: valid (index 0)\n\n--- Source code under test ---\nReactDOM.render(<div />, document.body);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: let node; ReactDOM.render(<div ref={ref => node = ref}/>,...", ({ task }) => {
      const code = `
        let node;
        ReactDOM.render(<div ref={ref => node = ref}/>, document.body);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: valid (index 1)\n\n--- Source code under test ---\n\n        let node;\n        ReactDOM.render(<div ref={ref => node = ref}/>, document.body);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: var foo = render(<div />, root)", ({ task }) => {
      const code = `var foo = render(<div />, root)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: valid (index 6)\n\n--- Source code under test ---\nvar foo = render(<div />, root)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var foo = ReactDom.renderder(<div />, root)", ({ task }) => {
      const code = `var foo = ReactDom.renderder(<div />, root)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: valid (index 7)\n\n--- Source code under test ---\nvar foo = ReactDom.renderder(<div />, root)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = ReactDOM.render(<div />, document.body);", ({ task }) => {
      const code = `var Hello = ReactDOM.render(<div />, document.body);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 0)\n\n--- Source code under test ---\nvar Hello = ReactDOM.render(<div />, document.body);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[1]: var o = { inst: ReactDOM.render(<div />, document.body) };", ({ task }) => {
      const code = `
        var o = {
          inst: ReactDOM.render(<div />, document.body)
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var o = {\n          inst: ReactDOM.render(<div />, document.body)\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[2]: function render () { return ReactDOM.render(<div />, docu...", ({ task }) => {
      const code = `
        function render () {
          return ReactDOM.render(<div />, document.body)
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        function render () {\n          return ReactDOM.render(<div />, document.body)\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[3]: var render = (a, b) => ReactDOM.render(a, b)", ({ task }) => {
      const code = `var render = (a, b) => ReactDOM.render(a, b)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 3)\n\n--- Source code under test ---\nvar render = (a, b) => ReactDOM.render(a, b)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[4]: this.o = ReactDOM.render(<div />, document.body);", ({ task }) => {
      const code = `this.o = ReactDOM.render(<div />, document.body);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 4)\n\n--- Source code under test ---\nthis.o = ReactDOM.render(<div />, document.body);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[5]: var v; v = ReactDOM.render(<div />, document.body);", ({ task }) => {
      const code = `var v; v = ReactDOM.render(<div />, document.body);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 5)\n\n--- Source code under test ---\nvar v; v = ReactDOM.render(<div />, document.body);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

  });
});
