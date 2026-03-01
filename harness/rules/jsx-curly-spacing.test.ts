import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-curly-spacing";
const VALID_COUNT = 15;

const RULE_MESSAGES = [
  "There should be no newline after '{{token}}'",
  "There should be no newline before '{{token}}'",
  "There should be no space after '{{token}}'",
  "There should be no space before '{{token}}'",
  "A space is required after '{{token}}'",
  "A space is required before '{{token}}'",
  "There should be no space after '{'",
  "There should be no space before '}'",
  "There should be no newline after '{'",
  "There should be no newline before '}'",
  "A space is required after '{'",
  "A space is required before '}'",
];

const cases = [
  { code: `<App foo={bar} />;`, filename: "test.jsx" },
  { code: `<App foo={bar}>{bar}</App>;`, filename: "test.jsx" },
  { code: `<App foo={bar}>{ bar }</App>;`, filename: "test.jsx" },
  { code: `
        <App foo={
        bar
        }>
        {bar}
        </App>;
      `, filename: "test.jsx" },
  { code: `<App foo={{ bar: true, baz: true }}>{{ bar: true, baz: true }}</App>;`, filename: "test.jsx" },
  { code: `<App foo={{ bar: true, baz: true }}>{ { bar: true, baz: true } }</App>;`, filename: "test.jsx" },
  { code: `
        <App foo={
        { bar: true, baz: true }
        } />;
      `, filename: "test.jsx" },
  { code: `
        <App foo={
        { bar: true, baz: true }
        }>
        {{ bar: true, baz: true }}
        </App>;
      `, filename: "test.jsx" },
  { code: `<App>{ foo /* comment 1 */ }</App>`, filename: "test.jsx" },
  { code: `<App>{ /* comment 1 */ foo }</App>`, filename: "test.jsx" },
  { code: `<App {...bar} />;`, filename: "test.jsx" },
  { code: `<App foo={bar} {...baz} />;`, filename: "test.jsx" },
  { code: `<App>{bar} {baz}</App>;`, filename: "test.jsx" },
  { code: `<>{bar} {baz}</>;`, filename: "test.jsx" },
  { code: `<div onLayout={() => { /* dummy callback to fix android bug with component measuring */ }} />`, filename: "test.jsx" },
  { code: `<App foo={ bar }>{bar}</App>;`, filename: "test.jsx" },
  { code: `<App foo={ bar }>{ bar }</App>;`, filename: "test.jsx" },
  { code: `<App foo={ { bar: true, baz: true } }>{{ bar: true, baz: true }}</App>;`, filename: "test.jsx" },
  { code: `<App foo={ { bar: true, baz: true } }>{ { bar: true, baz: true } }</App>;`, filename: "test.jsx" },
  { code: `<App foo={ foo /* comment 16 */ } />`, filename: "test.jsx" },
  { code: `<App foo={ /* comment 18 */ foo } />`, filename: "test.jsx" },
];

describe("jsx-curly-spacing", () => {
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
    it("valid[0]: <App foo={bar} />;", ({ task }) => {
      const code = `<App foo={bar} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 0)\n\n--- Source code under test ---\n<App foo={bar} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App foo={bar}>{bar}</App>;", ({ task }) => {
      const code = `<App foo={bar}>{bar}</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 1)\n\n--- Source code under test ---\n<App foo={bar}>{bar}</App>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App foo={bar}>{ bar }</App>;", ({ task }) => {
      const code = `<App foo={bar}>{ bar }</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 2)\n\n--- Source code under test ---\n<App foo={bar}>{ bar }</App>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App foo={ bar }> {bar} </App>;", ({ task }) => {
      const code = `
        <App foo={
        bar
        }>
        {bar}
        </App>;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 3)\n\n--- Source code under test ---\n\n        <App foo={\n        bar\n        }>\n        {bar}\n        </App>;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App foo={{ bar: true, baz: true }}>{{ bar: true, baz: tr...", ({ task }) => {
      const code = `<App foo={{ bar: true, baz: true }}>{{ bar: true, baz: true }}</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 4)\n\n--- Source code under test ---\n<App foo={{ bar: true, baz: true }}>{{ bar: true, baz: true }}</App>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App foo={{ bar: true, baz: true }}>{ { bar: true, baz: t...", ({ task }) => {
      const code = `<App foo={{ bar: true, baz: true }}>{ { bar: true, baz: true } }</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 5)\n\n--- Source code under test ---\n<App foo={{ bar: true, baz: true }}>{ { bar: true, baz: true } }</App>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App foo={ { bar: true, baz: true } } />;", ({ task }) => {
      const code = `
        <App foo={
        { bar: true, baz: true }
        } />;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 6)\n\n--- Source code under test ---\n\n        <App foo={\n        { bar: true, baz: true }\n        } />;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <App foo={ { bar: true, baz: true } }> {{ bar: true, baz:...", ({ task }) => {
      const code = `
        <App foo={
        { bar: true, baz: true }
        }>
        {{ bar: true, baz: true }}
        </App>;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 7)\n\n--- Source code under test ---\n\n        <App foo={\n        { bar: true, baz: true }\n        }>\n        {{ bar: true, baz: true }}\n        </App>;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <App>{ foo /* comment 1 */ }</App>", ({ task }) => {
      const code = `<App>{ foo /* comment 1 */ }</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 8)\n\n--- Source code under test ---\n<App>{ foo /* comment 1 */ }</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <App>{ /* comment 1 */ foo }</App>", ({ task }) => {
      const code = `<App>{ /* comment 1 */ foo }</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 9)\n\n--- Source code under test ---\n<App>{ /* comment 1 */ foo }</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[75]: <App {...bar} />;", ({ task }) => {
      const code = `<App {...bar} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 75)\n\n--- Source code under test ---\n<App {...bar} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[84]: <App foo={bar} {...baz} />;", ({ task }) => {
      const code = `<App foo={bar} {...baz} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 84)\n\n--- Source code under test ---\n<App foo={bar} {...baz} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[94]: <App>{bar} {baz}</App>;", ({ task }) => {
      const code = `<App>{bar} {baz}</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 94)\n\n--- Source code under test ---\n<App>{bar} {baz}</App>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[140]: <>{bar} {baz}</>;", ({ task }) => {
      const code = `<>{bar} {baz}</>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 140)\n\n--- Source code under test ---\n<>{bar} {baz}</>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[141]: <div onLayout={() => { /* dummy callback to fix android b...", ({ task }) => {
      const code = `<div onLayout={() => { /* dummy callback to fix android bug with component measuring */ }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: valid (index 141)\n\n--- Source code under test ---\n<div onLayout={() => { /* dummy callback to fix android bug with component measuring */ }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App foo={ bar }>{bar}</App>;", ({ task }) => {
      const code = `<App foo={ bar }>{bar}</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: invalid (index 0)\n\n--- Source code under test ---\n<App foo={ bar }>{bar}</App>;\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noSpaceAfter): There should be no space after '{'\n  [1] (messageId: noSpaceBefore): There should be no space before '}'\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("There should be no space after '{'");
      expect(matches[1].message).toBe("There should be no space before '}'");
    });

    it("invalid[1]: <App foo={ bar }>{ bar }</App>;", ({ task }) => {
      const code = `<App foo={ bar }>{ bar }</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: invalid (index 1)\n\n--- Source code under test ---\n<App foo={ bar }>{ bar }</App>;\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noSpaceAfter): There should be no space after '{'\n  [1] (messageId: noSpaceBefore): There should be no space before '}'\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("There should be no space after '{'");
      expect(matches[1].message).toBe("There should be no space before '}'");
    });

    it("invalid[2]: <App foo={ { bar: true, baz: true } }>{{ bar: true, baz: ...", ({ task }) => {
      const code = `<App foo={ { bar: true, baz: true } }>{{ bar: true, baz: true }}</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: invalid (index 2)\n\n--- Source code under test ---\n<App foo={ { bar: true, baz: true } }>{{ bar: true, baz: true }}</App>;\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noSpaceAfter): There should be no space after '{'\n  [1] (messageId: noSpaceBefore): There should be no space before '}'\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("There should be no space after '{'");
      expect(matches[1].message).toBe("There should be no space before '}'");
    });

    it("invalid[3]: <App foo={ { bar: true, baz: true } }>{ { bar: true, baz:...", ({ task }) => {
      const code = `<App foo={ { bar: true, baz: true } }>{ { bar: true, baz: true } }</App>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: invalid (index 3)\n\n--- Source code under test ---\n<App foo={ { bar: true, baz: true } }>{ { bar: true, baz: true } }</App>;\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noSpaceAfter): There should be no space after '{'\n  [1] (messageId: noSpaceBefore): There should be no space before '}'\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("There should be no space after '{'");
      expect(matches[1].message).toBe("There should be no space before '}'");
    });

    it("invalid[86]: <App foo={ foo /* comment 16 */ } />", ({ task }) => {
      const code = `<App foo={ foo /* comment 16 */ } />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: invalid (index 86)\n\n--- Source code under test ---\n<App foo={ foo /* comment 16 */ } />\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noSpaceAfter): There should be no space after '{'\n  [1] (messageId: noSpaceBefore): There should be no space before '}'\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("There should be no space after '{'");
      expect(matches[1].message).toBe("There should be no space before '}'");
    });

    it("invalid[88]: <App foo={ /* comment 18 */ foo } />", ({ task }) => {
      const code = `<App foo={ /* comment 18 */ foo } />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-spacing\nType: invalid (index 88)\n\n--- Source code under test ---\n<App foo={ /* comment 18 */ foo } />\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noSpaceAfter): There should be no space after '{'\n  [1] (messageId: noSpaceBefore): There should be no space before '}'\n\nRule message templates:\n  noNewlineAfter: There should be no newline after '{{token}}'\n  noNewlineBefore: There should be no newline before '{{token}}'\n  noSpaceAfter: There should be no space after '{{token}}'\n  noSpaceBefore: There should be no space before '{{token}}'\n  spaceNeededAfter: A space is required after '{{token}}'\n  spaceNeededBefore: A space is required before '{{token}}'";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("There should be no space after '{'");
      expect(matches[1].message).toBe("There should be no space before '}'");
    });

  });
});
