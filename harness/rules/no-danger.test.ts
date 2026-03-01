import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-danger";
const VALID_COUNT = 3;

const RULE_MESSAGES = [
  "Dangerous property '{{name}}' found",
  "Dangerous property 'dangerouslySetInnerHTML' found",
];

const cases = [
  { code: `<App />;`, filename: "test.jsx" },
  { code: `<App dangerouslySetInnerHTML={{ __html: "" }} />;`, filename: "test.jsx" },
  { code: `<div className="bar"></div>;`, filename: "test.jsx" },
  { code: `<div dangerouslySetInnerHTML={{ __html: "" }}></div>;`, filename: "test.jsx" },
];

describe("no-danger", () => {
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
    it("valid[0]: <App />;", ({ task }) => {
      const code = `<App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger\nType: valid (index 0)\n\n--- Source code under test ---\n<App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerousProp: Dangerous property '{{name}}' found";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App dangerouslySetInnerHTML={{ __html: \"\" }} />;", ({ task }) => {
      const code = `<App dangerouslySetInnerHTML={{ __html: "" }} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger\nType: valid (index 1)\n\n--- Source code under test ---\n<App dangerouslySetInnerHTML={{ __html: \"\" }} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerousProp: Dangerous property '{{name}}' found";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <div className=\"bar\"></div>;", ({ task }) => {
      const code = `<div className="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger\nType: valid (index 2)\n\n--- Source code under test ---\n<div className=\"bar\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerousProp: Dangerous property '{{name}}' found";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div dangerouslySetInnerHTML={{ __html: \"\" }}></div>;", ({ task }) => {
      const code = `<div dangerouslySetInnerHTML={{ __html: "" }}></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger\nType: invalid (index 0)\n\n--- Source code under test ---\n<div dangerouslySetInnerHTML={{ __html: \"\" }}></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerousProp): Dangerous property 'dangerouslySetInnerHTML' found\n\nRule message templates:\n  dangerousProp: Dangerous property '{{name}}' found";
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Dangerous property 'dangerouslySetInnerHTML' found");
    });

  });
});
