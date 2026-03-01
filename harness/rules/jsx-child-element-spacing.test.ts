import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-child-element-spacing";
const VALID_COUNT = 21;

const RULE_MESSAGES = [
  "Ambiguous spacing after previous element {{element}}",
  "Ambiguous spacing before next element {{element}}",
  "Ambiguous spacing before next element a",
  "Ambiguous spacing after previous element a",
  "Ambiguous spacing before next element code",
];

const cases = [
  { code: `
        <App>
          foo
        </App>
      `, filename: "test.jsx" },
  { code: `
        <>
          foo
        </>
      `, filename: "test.jsx" },
  { code: `
        <App>
          <a>bar</a>
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          <a>
            <b>nested</b>
          </a>
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          foo
          bar
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          foo<a>bar</a>baz
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          foo
          {' '}
          <a>bar</a>
          {' '}
          baz
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          foo
          {' '}<a>bar</a>{' '}
          baz
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          foo{' '}
          <a>bar</a>
          {' '}baz
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          foo{/*
          */}<a>bar</a>{/*
          */}baz
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          Please take a look at <a href="https://js.org">this link</a>.
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          Please take a look at
          {' '}
          <a href="https://js.org">this link</a>.
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          <p>A</p>
          <p>B</p>
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          <p>A</p><p>B</p>
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          <a>foo</a>
          <a>bar</a>
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          <a>
            <b>nested1</b>
            <b>nested2</b>
          </a>
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          A
          B
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          A
          <br/>
          B
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          A<br/>
          B
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          A<br/>B
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>A<br/>B</App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          foo
          <a>bar</a>
        </App>
      `, filename: "test.jsx" },
  { code: `
        <>
          foo
          <a>bar</a>
        </>
      `, filename: "test.jsx" },
  { code: `
        <App>
          <a>bar</a>
          baz
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          {' '}<a>bar</a>
          baz
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          Please take a look at
          <a href="https://js.org">this link</a>.
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          Some <code>loops</code> and some
          <code>if</code> statements.
        </App>
      `, filename: "test.jsx" },
  { code: `
        <App>
          Here is
          <a href="https://js.org">a link</a> and here is
          <a href="https://js.org">another</a>
        </App>
      `, filename: "test.jsx" },
];

describe("jsx-child-element-spacing", () => {
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
    it("valid[0]: <App> foo </App>", ({ task }) => {
      const code = `
        <App>
          foo
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 0)\n\n--- Source code under test ---\n\n        <App>\n          foo\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <> foo </>", ({ task }) => {
      const code = `
        <>
          foo
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 1)\n\n--- Source code under test ---\n\n        <>\n          foo\n        </>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App> <a>bar</a> </App>", ({ task }) => {
      const code = `
        <App>
          <a>bar</a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 2)\n\n--- Source code under test ---\n\n        <App>\n          <a>bar</a>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App> <a> <b>nested</b> </a> </App>", ({ task }) => {
      const code = `
        <App>
          <a>
            <b>nested</b>
          </a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 3)\n\n--- Source code under test ---\n\n        <App>\n          <a>\n            <b>nested</b>\n          </a>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App> foo bar </App>", ({ task }) => {
      const code = `
        <App>
          foo
          bar
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 4)\n\n--- Source code under test ---\n\n        <App>\n          foo\n          bar\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App> foo<a>bar</a>baz </App>", ({ task }) => {
      const code = `
        <App>
          foo<a>bar</a>baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 5)\n\n--- Source code under test ---\n\n        <App>\n          foo<a>bar</a>baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App> foo {' '} <a>bar</a> {' '} baz </App>", ({ task }) => {
      const code = `
        <App>
          foo
          {' '}
          <a>bar</a>
          {' '}
          baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 6)\n\n--- Source code under test ---\n\n        <App>\n          foo\n          {' '}\n          <a>bar</a>\n          {' '}\n          baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <App> foo {' '}<a>bar</a>{' '} baz </App>", ({ task }) => {
      const code = `
        <App>
          foo
          {' '}<a>bar</a>{' '}
          baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 7)\n\n--- Source code under test ---\n\n        <App>\n          foo\n          {' '}<a>bar</a>{' '}\n          baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <App> foo{' '} <a>bar</a> {' '}baz </App>", ({ task }) => {
      const code = `
        <App>
          foo{' '}
          <a>bar</a>
          {' '}baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 8)\n\n--- Source code under test ---\n\n        <App>\n          foo{' '}\n          <a>bar</a>\n          {' '}baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <App> foo{/* */}<a>bar</a>{/* */}baz </App>", ({ task }) => {
      const code = `
        <App>
          foo{/*
          */}<a>bar</a>{/*
          */}baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 9)\n\n--- Source code under test ---\n\n        <App>\n          foo{/*\n          */}<a>bar</a>{/*\n          */}baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <App> Please take a look at <a href=\"https://js.org\">this...", ({ task }) => {
      const code = `
        <App>
          Please take a look at <a href="https://js.org">this link</a>.
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 10)\n\n--- Source code under test ---\n\n        <App>\n          Please take a look at <a href=\"https://js.org\">this link</a>.\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <App> Please take a look at {' '} <a href=\"https://js.org...", ({ task }) => {
      const code = `
        <App>
          Please take a look at
          {' '}
          <a href="https://js.org">this link</a>.
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 11)\n\n--- Source code under test ---\n\n        <App>\n          Please take a look at\n          {' '}\n          <a href=\"https://js.org\">this link</a>.\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <App> <p>A</p> <p>B</p> </App>", ({ task }) => {
      const code = `
        <App>
          <p>A</p>
          <p>B</p>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 12)\n\n--- Source code under test ---\n\n        <App>\n          <p>A</p>\n          <p>B</p>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <App> <p>A</p><p>B</p> </App>", ({ task }) => {
      const code = `
        <App>
          <p>A</p><p>B</p>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 13)\n\n--- Source code under test ---\n\n        <App>\n          <p>A</p><p>B</p>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <App> <a>foo</a> <a>bar</a> </App>", ({ task }) => {
      const code = `
        <App>
          <a>foo</a>
          <a>bar</a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 14)\n\n--- Source code under test ---\n\n        <App>\n          <a>foo</a>\n          <a>bar</a>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <App> <a> <b>nested1</b> <b>nested2</b> </a> </App>", ({ task }) => {
      const code = `
        <App>
          <a>
            <b>nested1</b>
            <b>nested2</b>
          </a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 15)\n\n--- Source code under test ---\n\n        <App>\n          <a>\n            <b>nested1</b>\n            <b>nested2</b>\n          </a>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <App> A B </App>", ({ task }) => {
      const code = `
        <App>
          A
          B
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 16)\n\n--- Source code under test ---\n\n        <App>\n          A\n          B\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <App> A <br/> B </App>", ({ task }) => {
      const code = `
        <App>
          A
          <br/>
          B
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 17)\n\n--- Source code under test ---\n\n        <App>\n          A\n          <br/>\n          B\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <App> A<br/> B </App>", ({ task }) => {
      const code = `
        <App>
          A<br/>
          B
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 18)\n\n--- Source code under test ---\n\n        <App>\n          A<br/>\n          B\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <App> A<br/>B </App>", ({ task }) => {
      const code = `
        <App>
          A<br/>B
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 19)\n\n--- Source code under test ---\n\n        <App>\n          A<br/>B\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <App>A<br/>B</App>", ({ task }) => {
      const code = `
        <App>A<br/>B</App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 20)\n\n--- Source code under test ---\n\n        <App>A<br/>B</App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App> foo <a>bar</a> </App>", ({ task }) => {
      const code = `
        <App>
          foo
          <a>bar</a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        <App>\n          foo\n          <a>bar</a>\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing before next element a");
    });

    it("invalid[1]: <> foo <a>bar</a> </>", ({ task }) => {
      const code = `
        <>
          foo
          <a>bar</a>
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        <>\n          foo\n          <a>bar</a>\n        </>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n\nFeatures: fragment\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing before next element a");
    });

    it("invalid[2]: <App> <a>bar</a> baz </App>", ({ task }) => {
      const code = `
        <App>
          <a>bar</a>
          baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        <App>\n          <a>bar</a>\n          baz\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingAfterPrev): Ambiguous spacing after previous element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing after previous element a");
    });

    it("invalid[3]: <App> {' '}<a>bar</a> baz </App>", ({ task }) => {
      const code = `
        <App>
          {' '}<a>bar</a>
          baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        <App>\n          {' '}<a>bar</a>\n          baz\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingAfterPrev): Ambiguous spacing after previous element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing after previous element a");
    });

    it("invalid[4]: <App> Please take a look at <a href=\"https://js.org\">this...", ({ task }) => {
      const code = `
        <App>
          Please take a look at
          <a href="https://js.org">this link</a>.
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        <App>\n          Please take a look at\n          <a href=\"https://js.org\">this link</a>.\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing before next element a");
    });

    it("invalid[5]: <App> Some <code>loops</code> and some <code>if</code> st...", ({ task }) => {
      const code = `
        <App>
          Some <code>loops</code> and some
          <code>if</code> statements.
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        <App>\n          Some <code>loops</code> and some\n          <code>if</code> statements.\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element code\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing before next element code");
    });

    it("invalid[6]: <App> Here is <a href=\"https://js.org\">a link</a> and her...", ({ task }) => {
      const code = `
        <App>
          Here is
          <a href="https://js.org">a link</a> and here is
          <a href="https://js.org">another</a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        <App>\n          Here is\n          <a href=\"https://js.org\">a link</a> and here is\n          <a href=\"https://js.org\">another</a>\n        </App>\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n  [1] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Ambiguous spacing before next element a");
      expect(matches[1].message).toBe("Ambiguous spacing before next element a");
    });

  });
});
