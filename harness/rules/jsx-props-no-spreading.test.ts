import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Prop spreading is forbidden",
];

describe("jsx-props-no-spreading", () => {
  describe("valid", () => {
    it("valid[0]: const {one_prop, two_prop} = props; <App one_prop={one_pr...", async ({ task }) => {
      const code = `
        const {one_prop, two_prop} = props;
        <App one_prop={one_prop} two_prop={two_prop}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: valid (index 0)\n\n--- Source code under test ---\n\n        const {one_prop, two_prop} = props;\n        <App one_prop={one_prop} two_prop={two_prop}/>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spreading", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: const {one_prop, two_prop} = props; <div one_prop={one_pr...", async ({ task }) => {
      const code = `
        const {one_prop, two_prop} = props;
        <div one_prop={one_prop} two_prop={two_prop}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: valid (index 1)\n\n--- Source code under test ---\n\n        const {one_prop, two_prop} = props;\n        <div one_prop={one_prop} two_prop={two_prop}></div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spreading", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: const newProps = {...props}; <App one_prop={newProps.one_...", async ({ task }) => {
      const code = `
        const newProps = {...props};
        <App one_prop={newProps.one_prop} two_prop={newProps.two_prop} style={{...styles}}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: valid (index 2)\n\n--- Source code under test ---\n\n        const newProps = {...props};\n        <App one_prop={newProps.one_prop} two_prop={newProps.two_prop} style={{...styles}}/>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spreading", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App {...props}/>", async ({ task }) => {
      const code = `
        <App {...props}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        <App {...props}/>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSpreading): Prop spreading is forbidden\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spreading", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop spreading is forbidden");
    });

    it("invalid[1]: <div {...props}></div>", async ({ task }) => {
      const code = `
        <div {...props}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        <div {...props}></div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSpreading): Prop spreading is forbidden\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spreading", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop spreading is forbidden");
    });

    it("invalid[2]: <App {...props} some_other_prop={some_other_prop}/>", async ({ task }) => {
      const code = `
        <App {...props} some_other_prop={some_other_prop}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        <App {...props} some_other_prop={some_other_prop}/>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSpreading): Prop spreading is forbidden\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spreading", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop spreading is forbidden");
    });

    it("invalid[8]: <App> <Foo {...{ prop1, prop2, prop3 }} /> </App>", async ({ task }) => {
      const code = `
        <App>
          <Foo {...{ prop1, prop2, prop3 }} />
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        <App>\n          <Foo {...{ prop1, prop2, prop3 }} />\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSpreading): Prop spreading is forbidden\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-spreading", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop spreading is forbidden");
    });

  });
});
