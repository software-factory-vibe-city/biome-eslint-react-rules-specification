import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Expected no line gap between “{{prop1}}” and “{{prop2}}”",
  "Expected only one space between “{{prop1}}” and “{{prop2}}”",
  "Expected only one space between “App” and “foo”",
  "Expected only one space between “foo” and “bar”",
  "Expected only one space between “foo” and “test”",
  "Expected only one space between “test” and “bar”",
  "Expected only one space between “Foo.Bar” and “baz”",
  "Expected only one space between “Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh” and “xyzzy”",
  "Expected no line gap between “title” and “type”",
  "Expected no line gap between “title” and “onClick”",
  "Expected no line gap between “onClick” and “type”",
];

describe("jsx-props-no-multi-spaces", () => {
  describe("valid", () => {
    it("valid[0]: <App />", async ({ task }) => {
      const code = `
        <App />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 0)\n\n--- Source code under test ---\n\n        <App />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App foo />", async ({ task }) => {
      const code = `
        <App foo />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 1)\n\n--- Source code under test ---\n\n        <App foo />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App foo bar />", async ({ task }) => {
      const code = `
        <App foo bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 2)\n\n--- Source code under test ---\n\n        <App foo bar />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App foo=\"with spaces \" bar />", async ({ task }) => {
      const code = `
        <App foo="with  spaces   " bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 3)\n\n--- Source code under test ---\n\n        <App foo=\"with  spaces   \" bar />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App foo bar />", async ({ task }) => {
      const code = `
        <App
          foo bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 4)\n\n--- Source code under test ---\n\n        <App\n          foo bar />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App foo bar />", async ({ task }) => {
      const code = `
        <App
          foo
          bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 5)\n\n--- Source code under test ---\n\n        <App\n          foo\n          bar />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App foo {...test} bar />", async ({ task }) => {
      const code = `
        <App
          foo {...test}
          bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 6)\n\n--- Source code under test ---\n\n        <App\n          foo {...test}\n          bar />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <App<T> foo bar />", async ({ task }) => {
      const code = `<App<T> foo bar />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 7)\n\n--- Source code under test ---\n<App<T> foo bar />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <Foo.Bar baz=\"quux\" />", async ({ task }) => {
      const code = `<Foo.Bar baz="quux" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 8)\n\n--- Source code under test ---\n<Foo.Bar baz=\"quux\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Wal...", async ({ task }) => {
      const code = `<Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh xyzzy="thud" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 9)\n\n--- Source code under test ---\n<Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh xyzzy=\"thud\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <button title=\"Some button 8\" type=\"button\" />", async ({ task }) => {
      const code = `
        <button
          title="Some button 8"
          type="button"
        />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 10)\n\n--- Source code under test ---\n\n        <button\n          title=\"Some button 8\"\n          type=\"button\"\n        />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <button title=\"Some button 8\" onClick={(value) => { conso...", async ({ task }) => {
      const code = `
        <button
          title="Some button 8"
          onClick={(value) => {
            console.log(value);
          }}
          type="button"
        />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 11)\n\n--- Source code under test ---\n\n        <button\n          title=\"Some button 8\"\n          onClick={(value) => {\n            console.log(value);\n          }}\n          type=\"button\"\n        />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <button title=\"Some button 2\" // this is a comment onClic...", async ({ task }) => {
      const code = `
          <button
            title="Some button 2"
            // this is a comment
            onClick={(value) => {
              console.log(value);
            }}
            type="button"
          />
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 12)\n\n--- Source code under test ---\n\n          <button\n            title=\"Some button 2\"\n            // this is a comment\n            onClick={(value) => {\n              console.log(value);\n            }}\n            type=\"button\"\n          />\n        \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <button title=\"Some button 2\" // this is a comment // thi...", async ({ task }) => {
      const code = `
          <button
            title="Some button 2"
            // this is a comment
            // this is a second comment
            onClick={(value) => {
              console.log(value);
            }}
            type="button"
          />
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 13)\n\n--- Source code under test ---\n\n          <button\n            title=\"Some button 2\"\n            // this is a comment\n            // this is a second comment\n            onClick={(value) => {\n              console.log(value);\n            }}\n            type=\"button\"\n          />\n        \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <App foo=\"Some button 3\" // comment // comment bar=\"\" />", async ({ task }) => {
      const code = `
          <App
            foo="Some button 3" // comment
            // comment
            bar=""
          />
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 14)\n\n--- Source code under test ---\n\n          <App\n            foo=\"Some button 3\" // comment\n            // comment\n            bar=\"\"\n          />\n        \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <button title=\"Some button 3\" /* this is a multiline comm...", async ({ task }) => {
      const code = `
          <button
            title="Some button 3"
            /* this is a multiline comment
                ...
                ... */
            onClick={(value) => {
              console.log(value);
            }}
            type="button"
          />
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: valid (index 15)\n\n--- Source code under test ---\n\n          <button\n            title=\"Some button 3\"\n            /* this is a multiline comment\n                ...\n                ... */\n            onClick={(value) => {\n              console.log(value);\n            }}\n            type=\"button\"\n          />\n        \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <App foo />", async ({ task }) => {
      const code = `
        <App  foo />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        <App  foo />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneSpace): Expected only one space between “App” and “foo”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Expected only one space between “App” and “foo”");
    });

    it("invalid[1]: <App foo=\"with spaces \" bar />", async ({ task }) => {
      const code = `
        <App foo="with  spaces   "   bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        <App foo=\"with  spaces   \"   bar />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneSpace): Expected only one space between “foo” and “bar”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Expected only one space between “foo” and “bar”");
    });

    it("invalid[2]: <App foo bar />", async ({ task }) => {
      const code = `
        <App foo  bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        <App foo  bar />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneSpace): Expected only one space between “foo” and “bar”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Expected only one space between “foo” and “bar”");
    });

    it("invalid[3]: <App foo bar />", async ({ task }) => {
      const code = `
        <App  foo   bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        <App  foo   bar />\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: onlyOneSpace): Expected only one space between “App” and “foo”\n  [1] (messageId: onlyOneSpace): Expected only one space between “foo” and “bar”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Expected only one space between “App” and “foo”");
      expect(matches[1].message).toBe("Expected only one space between “foo” and “bar”");
    });

    it("invalid[4]: <App foo {...test} bar />", async ({ task }) => {
      const code = `
        <App foo  {...test}  bar />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        <App foo  {...test}  bar />\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: onlyOneSpace): Expected only one space between “foo” and “test”\n  [1] (messageId: onlyOneSpace): Expected only one space between “test” and “bar”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Expected only one space between “foo” and “test”");
      expect(matches[1].message).toBe("Expected only one space between “test” and “bar”");
    });

    it("invalid[5]: <Foo.Bar baz=\"quux\" />", async ({ task }) => {
      const code = `<Foo.Bar  baz="quux" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 5)\n\n--- Source code under test ---\n<Foo.Bar  baz=\"quux\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneSpace): Expected only one space between “Foo.Bar” and “baz”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Expected only one space between “Foo.Bar” and “baz”");
    });

    it("invalid[6]: <Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Wal...", async ({ task }) => {
      const code = `
        <Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh  xyzzy="thud" />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        <Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh  xyzzy=\"thud\" />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneSpace): Expected only one space between “Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh” and “xyzzy”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Expected only one space between “Foobar.Foo.Bar.Baz.Qux.Quux.Quuz.Corge.Grault.Garply.Waldo.Fred.Plugh” and “xyzzy”");
    });

    it("invalid[7]: <button title='Some button' type=\"button\" />", async ({ task }) => {
      const code = `
        <button
          title='Some button'

          type="button"
        />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        <button\n          title='Some button'\n\n          type=\"button\"\n        />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noLineGap): Expected no line gap between “title” and “type”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Expected no line gap between “title” and “type”");
    });

    it("invalid[8]: <button title=\"Some button 4\" onClick={(value) => { conso...", async ({ task }) => {
      const code = `
        <button
          title="Some button 4"

          onClick={(value) => {
            console.log(value);
          }}

          type="button"
        />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        <button\n          title=\"Some button 4\"\n\n          onClick={(value) => {\n            console.log(value);\n          }}\n\n          type=\"button\"\n        />\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noLineGap): Expected no line gap between “title” and “onClick”\n  [1] (messageId: noLineGap): Expected no line gap between “onClick” and “type”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Expected no line gap between “title” and “onClick”");
      expect(matches[1].message).toBe("Expected no line gap between “onClick” and “type”");
    });

    it("invalid[9]: <button title=\"Some button 5\" // this is a comment onClic...", async ({ task }) => {
      const code = `
          <button
            title="Some button 5"
            // this is a comment
            onClick={(value) => {
              console.log(value);
            }}

            type="button"
          />
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 9)\n\n--- Source code under test ---\n\n          <button\n            title=\"Some button 5\"\n            // this is a comment\n            onClick={(value) => {\n              console.log(value);\n            }}\n\n            type=\"button\"\n          />\n        \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noLineGap): Expected no line gap between “onClick” and “type”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Expected no line gap between “onClick” and “type”");
    });

    it("invalid[10]: <button title=\"Some button 6\" // this is a comment // sec...", async ({ task }) => {
      const code = `
          <button
            title="Some button 6"
            // this is a comment
            // second comment

            onClick={(value) => {
              console.log(value);
            }}

            type="button"
          />
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 10)\n\n--- Source code under test ---\n\n          <button\n            title=\"Some button 6\"\n            // this is a comment\n            // second comment\n\n            onClick={(value) => {\n              console.log(value);\n            }}\n\n            type=\"button\"\n          />\n        \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noLineGap): Expected no line gap between “title” and “onClick”\n  [1] (messageId: noLineGap): Expected no line gap between “onClick” and “type”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Expected no line gap between “title” and “onClick”");
      expect(matches[1].message).toBe("Expected no line gap between “onClick” and “type”");
    });

    it("invalid[11]: <button title=\"Some button 7\" /*this is a multiline comme...", async ({ task }) => {
      const code = `
          <button
            title="Some button 7"
            /*this is a
              multiline
              comment
            */

            onClick={(value) => {
              console.log(value);
            }}

            type="button"
          />
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-props-no-multi-spaces\nType: invalid (index 11)\n\n--- Source code under test ---\n\n          <button\n            title=\"Some button 7\"\n            /*this is a\n              multiline\n              comment\n            */\n\n            onClick={(value) => {\n              console.log(value);\n            }}\n\n            type=\"button\"\n          />\n        \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: noLineGap): Expected no line gap between “title” and “onClick”\n  [1] (messageId: noLineGap): Expected no line gap between “onClick” and “type”\n\nRule message templates:\n  noLineGap: Expected no line gap between “{{prop1}}” and “{{prop2}}”\n  onlyOneSpace: Expected only one space between “{{prop1}}” and “{{prop2}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-props-no-multi-spaces", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Expected no line gap between “title” and “onClick”");
      expect(matches[1].message).toBe("Expected no line gap between “onClick” and “type”");
    });

  });
});
