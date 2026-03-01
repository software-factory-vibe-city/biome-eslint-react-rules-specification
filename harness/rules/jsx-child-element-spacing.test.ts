import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Ambiguous spacing after previous element {{element}}",
  "Ambiguous spacing before next element {{element}}",
  "Ambiguous spacing before next element a",
  "Ambiguous spacing after previous element a",
  "Ambiguous spacing before next element code",
];

describe("jsx-child-element-spacing", () => {
  describe("valid", () => {
    it("valid[0]: <App> foo </App>", async ({ task }) => {
      const code = `
        <App>
          foo
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 0)\n\n--- Source code under test ---\n\n        <App>\n          foo\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <> foo </>", async ({ task }) => {
      const code = `
        <>
          foo
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 1)\n\n--- Source code under test ---\n\n        <>\n          foo\n        </>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App> <a>bar</a> </App>", async ({ task }) => {
      const code = `
        <App>
          <a>bar</a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 2)\n\n--- Source code under test ---\n\n        <App>\n          <a>bar</a>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App> <a> <b>nested</b> </a> </App>", async ({ task }) => {
      const code = `
        <App>
          <a>
            <b>nested</b>
          </a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 3)\n\n--- Source code under test ---\n\n        <App>\n          <a>\n            <b>nested</b>\n          </a>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App> foo bar </App>", async ({ task }) => {
      const code = `
        <App>
          foo
          bar
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 4)\n\n--- Source code under test ---\n\n        <App>\n          foo\n          bar\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App> foo<a>bar</a>baz </App>", async ({ task }) => {
      const code = `
        <App>
          foo<a>bar</a>baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 5)\n\n--- Source code under test ---\n\n        <App>\n          foo<a>bar</a>baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App> foo {' '} <a>bar</a> {' '} baz </App>", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <App> foo {' '}<a>bar</a>{' '} baz </App>", async ({ task }) => {
      const code = `
        <App>
          foo
          {' '}<a>bar</a>{' '}
          baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 7)\n\n--- Source code under test ---\n\n        <App>\n          foo\n          {' '}<a>bar</a>{' '}\n          baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <App> foo{' '} <a>bar</a> {' '}baz </App>", async ({ task }) => {
      const code = `
        <App>
          foo{' '}
          <a>bar</a>
          {' '}baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 8)\n\n--- Source code under test ---\n\n        <App>\n          foo{' '}\n          <a>bar</a>\n          {' '}baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <App> foo{/* */}<a>bar</a>{/* */}baz </App>", async ({ task }) => {
      const code = `
        <App>
          foo{/*
          */}<a>bar</a>{/*
          */}baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 9)\n\n--- Source code under test ---\n\n        <App>\n          foo{/*\n          */}<a>bar</a>{/*\n          */}baz\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <App> Please take a look at <a href=\"https://js.org\">this...", async ({ task }) => {
      const code = `
        <App>
          Please take a look at <a href="https://js.org">this link</a>.
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 10)\n\n--- Source code under test ---\n\n        <App>\n          Please take a look at <a href=\"https://js.org\">this link</a>.\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <App> Please take a look at {' '} <a href=\"https://js.org...", async ({ task }) => {
      const code = `
        <App>
          Please take a look at
          {' '}
          <a href="https://js.org">this link</a>.
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 11)\n\n--- Source code under test ---\n\n        <App>\n          Please take a look at\n          {' '}\n          <a href=\"https://js.org\">this link</a>.\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <App> <p>A</p> <p>B</p> </App>", async ({ task }) => {
      const code = `
        <App>
          <p>A</p>
          <p>B</p>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 12)\n\n--- Source code under test ---\n\n        <App>\n          <p>A</p>\n          <p>B</p>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <App> <p>A</p><p>B</p> </App>", async ({ task }) => {
      const code = `
        <App>
          <p>A</p><p>B</p>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 13)\n\n--- Source code under test ---\n\n        <App>\n          <p>A</p><p>B</p>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <App> <a>foo</a> <a>bar</a> </App>", async ({ task }) => {
      const code = `
        <App>
          <a>foo</a>
          <a>bar</a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 14)\n\n--- Source code under test ---\n\n        <App>\n          <a>foo</a>\n          <a>bar</a>\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <App> <a> <b>nested1</b> <b>nested2</b> </a> </App>", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <App> A B </App>", async ({ task }) => {
      const code = `
        <App>
          A
          B
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 16)\n\n--- Source code under test ---\n\n        <App>\n          A\n          B\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <App> A <br/> B </App>", async ({ task }) => {
      const code = `
        <App>
          A
          <br/>
          B
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 17)\n\n--- Source code under test ---\n\n        <App>\n          A\n          <br/>\n          B\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <App> A<br/> B </App>", async ({ task }) => {
      const code = `
        <App>
          A<br/>
          B
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 18)\n\n--- Source code under test ---\n\n        <App>\n          A<br/>\n          B\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <App> A<br/>B </App>", async ({ task }) => {
      const code = `
        <App>
          A<br/>B
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 19)\n\n--- Source code under test ---\n\n        <App>\n          A<br/>B\n        </App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <App>A<br/>B</App>", async ({ task }) => {
      const code = `
        <App>A<br/>B</App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: valid (index 20)\n\n--- Source code under test ---\n\n        <App>A<br/>B</App>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App> foo <a>bar</a> </App>", async ({ task }) => {
      const code = `
        <App>
          foo
          <a>bar</a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        <App>\n          foo\n          <a>bar</a>\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing before next element a");
    });

    it("invalid[1]: <> foo <a>bar</a> </>", async ({ task }) => {
      const code = `
        <>
          foo
          <a>bar</a>
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        <>\n          foo\n          <a>bar</a>\n        </>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n\nFeatures: fragment\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing before next element a");
    });

    it("invalid[2]: <App> <a>bar</a> baz </App>", async ({ task }) => {
      const code = `
        <App>
          <a>bar</a>
          baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        <App>\n          <a>bar</a>\n          baz\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingAfterPrev): Ambiguous spacing after previous element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing after previous element a");
    });

    it("invalid[3]: <App> {' '}<a>bar</a> baz </App>", async ({ task }) => {
      const code = `
        <App>
          {' '}<a>bar</a>
          baz
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        <App>\n          {' '}<a>bar</a>\n          baz\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingAfterPrev): Ambiguous spacing after previous element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing after previous element a");
    });

    it("invalid[4]: <App> Please take a look at <a href=\"https://js.org\">this...", async ({ task }) => {
      const code = `
        <App>
          Please take a look at
          <a href="https://js.org">this link</a>.
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        <App>\n          Please take a look at\n          <a href=\"https://js.org\">this link</a>.\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing before next element a");
    });

    it("invalid[5]: <App> Some <code>loops</code> and some <code>if</code> st...", async ({ task }) => {
      const code = `
        <App>
          Some <code>loops</code> and some
          <code>if</code> statements.
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        <App>\n          Some <code>loops</code> and some\n          <code>if</code> statements.\n        </App>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element code\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Ambiguous spacing before next element code");
    });

    it("invalid[6]: <App> Here is <a href=\"https://js.org\">a link</a> and her...", async ({ task }) => {
      const code = `
        <App>
          Here is
          <a href="https://js.org">a link</a> and here is
          <a href="https://js.org">another</a>
        </App>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-child-element-spacing\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        <App>\n          Here is\n          <a href=\"https://js.org\">a link</a> and here is\n          <a href=\"https://js.org\">another</a>\n        </App>\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n  [1] (messageId: spacingBeforeNext): Ambiguous spacing before next element a\n\nRule message templates:\n  spacingAfterPrev: Ambiguous spacing after previous element {{element}}\n  spacingBeforeNext: Ambiguous spacing before next element {{element}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-child-element-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Ambiguous spacing before next element a");
      expect(matches[1].message).toBe("Ambiguous spacing before next element a");
    });

  });
});
