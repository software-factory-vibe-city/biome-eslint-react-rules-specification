import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not depend on the return value from {{node}}.render",
  "Do not depend on the return value from ReactDOM.render",
  "Do not depend on the return value from React.render",
];

describe("no-render-return-value", () => {
  describe("valid", () => {
    it("valid[0]: ReactDOM.render(<div />, document.body);", async ({ task }) => {
      const code = `ReactDOM.render(<div />, document.body);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: valid (index 0)\n\n--- Source code under test ---\nReactDOM.render(<div />, document.body);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: let node; ReactDOM.render(<div ref={ref => node = ref}/>,...", async ({ task }) => {
      const code = `
        let node;
        ReactDOM.render(<div ref={ref => node = ref}/>, document.body);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: valid (index 1)\n\n--- Source code under test ---\n\n        let node;\n        ReactDOM.render(<div ref={ref => node = ref}/>, document.body);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: var foo = render(<div />, root)", async ({ task }) => {
      const code = `var foo = render(<div />, root)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: valid (index 6)\n\n--- Source code under test ---\nvar foo = render(<div />, root)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var foo = ReactDom.renderder(<div />, root)", async ({ task }) => {
      const code = `var foo = ReactDom.renderder(<div />, root)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: valid (index 7)\n\n--- Source code under test ---\nvar foo = ReactDom.renderder(<div />, root)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = ReactDOM.render(<div />, document.body);", async ({ task }) => {
      const code = `var Hello = ReactDOM.render(<div />, document.body);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 0)\n\n--- Source code under test ---\nvar Hello = ReactDOM.render(<div />, document.body);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[1]: var o = { inst: ReactDOM.render(<div />, document.body) };", async ({ task }) => {
      const code = `
        var o = {
          inst: ReactDOM.render(<div />, document.body)
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var o = {\n          inst: ReactDOM.render(<div />, document.body)\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[2]: function render () { return ReactDOM.render(<div />, docu...", async ({ task }) => {
      const code = `
        function render () {
          return ReactDOM.render(<div />, document.body)
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        function render () {\n          return ReactDOM.render(<div />, document.body)\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[3]: var render = (a, b) => ReactDOM.render(a, b)", async ({ task }) => {
      const code = `var render = (a, b) => ReactDOM.render(a, b)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 3)\n\n--- Source code under test ---\nvar render = (a, b) => ReactDOM.render(a, b)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[4]: this.o = ReactDOM.render(<div />, document.body);", async ({ task }) => {
      const code = `this.o = ReactDOM.render(<div />, document.body);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 4)\n\n--- Source code under test ---\nthis.o = ReactDOM.render(<div />, document.body);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

    it("invalid[5]: var v; v = ReactDOM.render(<div />, document.body);", async ({ task }) => {
      const code = `var v; v = ReactDOM.render(<div />, document.body);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-render-return-value\nType: invalid (index 5)\n\n--- Source code under test ---\nvar v; v = ReactDOM.render(<div />, document.body);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReturnValue): Do not depend on the return value from ReactDOM.render\n\nRule message templates:\n  noReturnValue: Do not depend on the return value from {{node}}.render";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-render-return-value", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not depend on the return value from ReactDOM.render");
    });

  });
});
