import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Curly braces are unnecessary here.",
  "Need to wrap this literal in a JSX expression.",
];

describe("jsx-curly-brace-presence", () => {
  describe("valid", () => {
    it("valid[0]: <App {...props}>foo</App>", async ({ task }) => {
      const code = `<App {...props}>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 0)\n\n--- Source code under test ---\n<App {...props}>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <>foo</>", async ({ task }) => {
      const code = `<>foo</>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 1)\n\n--- Source code under test ---\n<>foo</>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App>{' '}</App>", async ({ task }) => {
      const code = `<App>{' '}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 3)\n\n--- Source code under test ---\n<App>{' '}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App>{' '} </App>", async ({ task }) => {
      const code = `<App>{' '}
</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 4)\n\n--- Source code under test ---\n<App>{' '}\n</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App>{' '}</App>", async ({ task }) => {
      const code = `<App>{'     '}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 5)\n\n--- Source code under test ---\n<App>{'     '}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App>{' '} </App>", async ({ task }) => {
      const code = `<App>{'     '}
</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 6)\n\n--- Source code under test ---\n<App>{'     '}\n</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <App>{[]}</App>", async ({ task }) => {
      const code = `<App>{[]}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 20)\n\n--- Source code under test ---\n<App>{[]}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <App>foo</App>", async ({ task }) => {
      const code = `<App>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 21)\n\n--- Source code under test ---\n<App>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: <App>{\"foo\"}{<Component>bar</Component>}</App>", async ({ task }) => {
      const code = `<App>{"foo"}{<Component>bar</Component>}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 22)\n\n--- Source code under test ---\n<App>{\"foo\"}{<Component>bar</Component>}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: <App prop='bar'>foo</App>", async ({ task }) => {
      const code = `<App prop='bar'>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 23)\n\n--- Source code under test ---\n<App prop='bar'>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: <App prop={true}>foo</App>", async ({ task }) => {
      const code = `<App prop={true}>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 24)\n\n--- Source code under test ---\n<App prop={true}>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: <App prop>foo</App>", async ({ task }) => {
      const code = `<App prop>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 25)\n\n--- Source code under test ---\n<App prop>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: <App prop='bar'>{'foo \\n bar'}</App>", async ({ task }) => {
      const code = `<App prop='bar'>{'foo \\n bar'}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 26)\n\n--- Source code under test ---\n<App prop='bar'>{'foo \\n bar'}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: <App prop={ ' ' }/>", async ({ task }) => {
      const code = `<App prop={ ' ' }/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 27)\n\n--- Source code under test ---\n<App prop={ ' ' }/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[70]: <MyComponent p={<Foo>Bar</Foo>}> </MyComponent>", async ({ task }) => {
      const code = `
        <MyComponent p={<Foo>Bar</Foo>}>
        </MyComponent>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 70)\n\n--- Source code under test ---\n\n        <MyComponent p={<Foo>Bar</Foo>}>\n        </MyComponent>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[73]: const Component2 = () => { return <span>/*</span>; };", async ({ task }) => {
      const code = `
        const Component2 = () => {
          return <span>/*</span>;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 73)\n\n--- Source code under test ---\n\n        const Component2 = () => {\n          return <span>/*</span>;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: no-ts-old\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[76]: <App>{/* comment */}</App>", async ({ task }) => {
      const code = `<App>{/* comment */}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 76)\n\n--- Source code under test ---\n<App>{/* comment */}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[77]: <App>{/* comment */ <Foo />}</App>", async ({ task }) => {
      const code = `<App>{/* comment */ <Foo />}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 77)\n\n--- Source code under test ---\n<App>{/* comment */ <Foo />}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[78]: <App>{/* comment */ 'foo'}</App>", async ({ task }) => {
      const code = `<App>{/* comment */ 'foo'}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 78)\n\n--- Source code under test ---\n<App>{/* comment */ 'foo'}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[79]: <App prop={/* comment */ 'foo'} />", async ({ task }) => {
      const code = `<App prop={/* comment */ 'foo'} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 79)\n\n--- Source code under test ---\n<App prop={/* comment */ 'foo'} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[80]: <App> { // comment <Foo /> } </App>", async ({ task }) => {
      const code = `
          <App>
            {
              // comment
              <Foo />
            }
          </App>
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 80)\n\n--- Source code under test ---\n\n          <App>\n            {\n              // comment\n              <Foo />\n            }\n          </App>\n        \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[81]: <App horror=<div /> />", async ({ task }) => {
      const code = `<App horror=<div /> />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 81)\n\n--- Source code under test ---\n<App horror=<div /> />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: no-ts\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[82]: <App horror={<div />} />", async ({ task }) => {
      const code = `<App horror={<div />} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 82)\n\n--- Source code under test ---\n<App horror={<div />} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[85]: <script>{`window.foo = \"bar\"`}</script>", async ({ task }) => {
      const code = `
        <script>{\`window.foo = "bar"\`}</script>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 85)\n\n--- Source code under test ---\n\n        <script>{`window.foo = \"bar\"`}</script>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[2]: <App>{<myApp></myApp>}</App>", async ({ task }) => {
      const code = `<App>{<myApp></myApp>}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: invalid (index 2)\n\n--- Source code under test ---\n<App>{<myApp></myApp>}</App>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unnecessaryCurly): Curly braces are unnecessary here.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Curly braces are unnecessary here.");
    });

    it("invalid[6]: <MyComponent>{'foo'}</MyComponent>", async ({ task }) => {
      const code = `<MyComponent>{'foo'}</MyComponent>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: invalid (index 6)\n\n--- Source code under test ---\n<MyComponent>{'foo'}</MyComponent>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unnecessaryCurly): Curly braces are unnecessary here.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Curly braces are unnecessary here.");
    });

    it("invalid[7]: <MyComponent prop={'bar'}>foo</MyComponent>", async ({ task }) => {
      const code = `<MyComponent prop={'bar'}>foo</MyComponent>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: invalid (index 7)\n\n--- Source code under test ---\n<MyComponent prop={'bar'}>foo</MyComponent>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unnecessaryCurly): Curly braces are unnecessary here.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-curly-brace-presence", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Curly braces are unnecessary here.");
    });

  });
});
