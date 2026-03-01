import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-props-no-spreading";
const VALID_COUNT = 3;

const RULE_MESSAGES = [
  "Prop spreading is forbidden",
];

const cases = [
  { code: `
        const {one_prop, two_prop} = props;
        <App one_prop={one_prop} two_prop={two_prop}/>
      `, filename: "test.jsx" },
  { code: `
        const {one_prop, two_prop} = props;
        <div one_prop={one_prop} two_prop={two_prop}></div>
      `, filename: "test.jsx" },
  { code: `
        const newProps = {...props};
        <App one_prop={newProps.one_prop} two_prop={newProps.two_prop} style={{...styles}}/>
      `, filename: "test.jsx" },
  { code: `
        <App {...props}/>
      `, filename: "test.jsx" },
  { code: `
        <div {...props}></div>
      `, filename: "test.jsx" },
  { code: `
        <App {...props} some_other_prop={some_other_prop}/>
      `, filename: "test.jsx" },
  { code: `
        <App>
          <Foo {...{ prop1, prop2, prop3 }} />
        </App>
      `, filename: "test.jsx" },
];

describe("jsx-props-no-spreading", () => {
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
    it("valid[0]: const {one_prop, two_prop} = props; <App one_prop={one_pr...", ({ task }) => {
      const code = `
        const {one_prop, two_prop} = props;
        <App one_prop={one_prop} two_prop={two_prop}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: valid (index 0)\n\n--- Source code under test ---\n\n        const {one_prop, two_prop} = props;\n        <App one_prop={one_prop} two_prop={two_prop}/>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: const {one_prop, two_prop} = props; <div one_prop={one_pr...", ({ task }) => {
      const code = `
        const {one_prop, two_prop} = props;
        <div one_prop={one_prop} two_prop={two_prop}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: valid (index 1)\n\n--- Source code under test ---\n\n        const {one_prop, two_prop} = props;\n        <div one_prop={one_prop} two_prop={two_prop}></div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: const newProps = {...props}; <App one_prop={newProps.one_...", ({ task }) => {
      const code = `
        const newProps = {...props};
        <App one_prop={newProps.one_prop} two_prop={newProps.two_prop} style={{...styles}}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: valid (index 2)\n\n--- Source code under test ---\n\n        const newProps = {...props};\n        <App one_prop={newProps.one_prop} two_prop={newProps.two_prop} style={{...styles}}/>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App {...props}/>", ({ task }) => {
      const code = `
        <App {...props}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        <App {...props}/>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSpreading): Prop spreading is forbidden\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop spreading is forbidden");
    });

    it("invalid[1]: <div {...props}></div>", ({ task }) => {
      const code = `
        <div {...props}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        <div {...props}></div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSpreading): Prop spreading is forbidden\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop spreading is forbidden");
    });

    it("invalid[2]: <App {...props} some_other_prop={some_other_prop}/>", ({ task }) => {
      const code = `
        <App {...props} some_other_prop={some_other_prop}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        <App {...props} some_other_prop={some_other_prop}/>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSpreading): Prop spreading is forbidden\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop spreading is forbidden");
    });

    it("invalid[8]: <App> <Foo {...{ prop1, prop2, prop3 }} /> </App>", ({ task }) => {
      const code = `
        <App>
          <Foo {...{ prop1, prop2, prop3 }} />
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-spreading\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        <App>\n          <Foo {...{ prop1, prop2, prop3 }} />\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noSpreading): Prop spreading is forbidden\n\nRule message templates:\n  noSpreading: Prop spreading is forbidden";
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop spreading is forbidden");
    });

  });
});
