import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-curly-brace-presence";
const VALID_COUNT = 24;

const RULE_MESSAGES = [
  "Curly braces are unnecessary here.",
  "Need to wrap this literal in a JSX expression.",
];

const cases = [
  { code: `<App {...props}>foo</App>`, filename: "test.jsx" },
  { code: `<>foo</>`, filename: "test.jsx" },
  { code: `<App>{' '}</App>`, filename: "test.jsx" },
  { code: `<App>{' '}
</App>`, filename: "test.jsx" },
  { code: `<App>{'     '}</App>`, filename: "test.jsx" },
  { code: `<App>{'     '}
</App>`, filename: "test.jsx" },
  { code: `<App>{[]}</App>`, filename: "test.jsx" },
  { code: `<App>foo</App>`, filename: "test.jsx" },
  { code: `<App>{"foo"}{<Component>bar</Component>}</App>`, filename: "test.jsx" },
  { code: `<App prop='bar'>foo</App>`, filename: "test.jsx" },
  { code: `<App prop={true}>foo</App>`, filename: "test.jsx" },
  { code: `<App prop>foo</App>`, filename: "test.jsx" },
  { code: `<App prop='bar'>{'foo \\n bar'}</App>`, filename: "test.jsx" },
  { code: `<App prop={ ' ' }/>`, filename: "test.jsx" },
  { code: `
        <MyComponent p={<Foo>Bar</Foo>}>
        </MyComponent>
      `, filename: "test.jsx" },
  { code: `
        const Component2 = () => {
          return <span>/*</span>;
        };
      `, filename: "test.jsx" },
  { code: `<App>{/* comment */}</App>`, filename: "test.jsx" },
  { code: `<App>{/* comment */ <Foo />}</App>`, filename: "test.jsx" },
  { code: `<App>{/* comment */ 'foo'}</App>`, filename: "test.jsx" },
  { code: `<App prop={/* comment */ 'foo'} />`, filename: "test.jsx" },
  { code: `
          <App>
            {
              // comment
              <Foo />
            }
          </App>
        `, filename: "test.jsx" },
  { code: `<App horror=<div /> />`, filename: "test.jsx" },
  { code: `<App horror={<div />} />`, filename: "test.jsx" },
  { code: `
        <script>{\`window.foo = "bar"\`}</script>
      `, filename: "test.jsx" },
  { code: `<App>{<myApp></myApp>}</App>`, filename: "test.jsx" },
  { code: `<MyComponent>{'foo'}</MyComponent>`, filename: "test.jsx" },
  { code: `<MyComponent prop={'bar'}>foo</MyComponent>`, filename: "test.jsx" },
];

describe("jsx-curly-brace-presence", () => {
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
    it("valid[0]: <App {...props}>foo</App>", ({ task }) => {
      const code = `<App {...props}>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 0)\n\n--- Source code under test ---\n<App {...props}>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <>foo</>", ({ task }) => {
      const code = `<>foo</>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 1)\n\n--- Source code under test ---\n<>foo</>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App>{' '}</App>", ({ task }) => {
      const code = `<App>{' '}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 3)\n\n--- Source code under test ---\n<App>{' '}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App>{' '} </App>", ({ task }) => {
      const code = `<App>{' '}
</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 4)\n\n--- Source code under test ---\n<App>{' '}\n</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App>{' '}</App>", ({ task }) => {
      const code = `<App>{'     '}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 5)\n\n--- Source code under test ---\n<App>{'     '}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App>{' '} </App>", ({ task }) => {
      const code = `<App>{'     '}
</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 6)\n\n--- Source code under test ---\n<App>{'     '}\n</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <App>{[]}</App>", ({ task }) => {
      const code = `<App>{[]}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 20)\n\n--- Source code under test ---\n<App>{[]}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <App>foo</App>", ({ task }) => {
      const code = `<App>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 21)\n\n--- Source code under test ---\n<App>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: <App>{\"foo\"}{<Component>bar</Component>}</App>", ({ task }) => {
      const code = `<App>{"foo"}{<Component>bar</Component>}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 22)\n\n--- Source code under test ---\n<App>{\"foo\"}{<Component>bar</Component>}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: <App prop='bar'>foo</App>", ({ task }) => {
      const code = `<App prop='bar'>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 23)\n\n--- Source code under test ---\n<App prop='bar'>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: <App prop={true}>foo</App>", ({ task }) => {
      const code = `<App prop={true}>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 24)\n\n--- Source code under test ---\n<App prop={true}>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: <App prop>foo</App>", ({ task }) => {
      const code = `<App prop>foo</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 25)\n\n--- Source code under test ---\n<App prop>foo</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: <App prop='bar'>{'foo \\n bar'}</App>", ({ task }) => {
      const code = `<App prop='bar'>{'foo \\n bar'}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 26)\n\n--- Source code under test ---\n<App prop='bar'>{'foo \\n bar'}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: <App prop={ ' ' }/>", ({ task }) => {
      const code = `<App prop={ ' ' }/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 27)\n\n--- Source code under test ---\n<App prop={ ' ' }/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[70]: <MyComponent p={<Foo>Bar</Foo>}> </MyComponent>", ({ task }) => {
      const code = `
        <MyComponent p={<Foo>Bar</Foo>}>
        </MyComponent>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 70)\n\n--- Source code under test ---\n\n        <MyComponent p={<Foo>Bar</Foo>}>\n        </MyComponent>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[73]: const Component2 = () => { return <span>/*</span>; };", ({ task }) => {
      const code = `
        const Component2 = () => {
          return <span>/*</span>;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 73)\n\n--- Source code under test ---\n\n        const Component2 = () => {\n          return <span>/*</span>;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: no-ts-old\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[76]: <App>{/* comment */}</App>", ({ task }) => {
      const code = `<App>{/* comment */}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 76)\n\n--- Source code under test ---\n<App>{/* comment */}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[77]: <App>{/* comment */ <Foo />}</App>", ({ task }) => {
      const code = `<App>{/* comment */ <Foo />}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 77)\n\n--- Source code under test ---\n<App>{/* comment */ <Foo />}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[78]: <App>{/* comment */ 'foo'}</App>", ({ task }) => {
      const code = `<App>{/* comment */ 'foo'}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 78)\n\n--- Source code under test ---\n<App>{/* comment */ 'foo'}</App>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[79]: <App prop={/* comment */ 'foo'} />", ({ task }) => {
      const code = `<App prop={/* comment */ 'foo'} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 79)\n\n--- Source code under test ---\n<App prop={/* comment */ 'foo'} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[80]: <App> { // comment <Foo /> } </App>", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[81]: <App horror=<div /> />", ({ task }) => {
      const code = `<App horror=<div /> />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 81)\n\n--- Source code under test ---\n<App horror=<div /> />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: no-ts\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[82]: <App horror={<div />} />", ({ task }) => {
      const code = `<App horror={<div />} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 82)\n\n--- Source code under test ---\n<App horror={<div />} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[85]: <script>{`window.foo = \"bar\"`}</script>", ({ task }) => {
      const code = `
        <script>{\`window.foo = "bar"\`}</script>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: valid (index 85)\n\n--- Source code under test ---\n\n        <script>{`window.foo = \"bar\"`}</script>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[2]: <App>{<myApp></myApp>}</App>", ({ task }) => {
      const code = `<App>{<myApp></myApp>}</App>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: invalid (index 2)\n\n--- Source code under test ---\n<App>{<myApp></myApp>}</App>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unnecessaryCurly): Curly braces are unnecessary here.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Curly braces are unnecessary here.");
    });

    it("invalid[6]: <MyComponent>{'foo'}</MyComponent>", ({ task }) => {
      const code = `<MyComponent>{'foo'}</MyComponent>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: invalid (index 6)\n\n--- Source code under test ---\n<MyComponent>{'foo'}</MyComponent>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unnecessaryCurly): Curly braces are unnecessary here.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Curly braces are unnecessary here.");
    });

    it("invalid[7]: <MyComponent prop={'bar'}>foo</MyComponent>", ({ task }) => {
      const code = `<MyComponent prop={'bar'}>foo</MyComponent>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-curly-brace-presence\nType: invalid (index 7)\n\n--- Source code under test ---\n<MyComponent prop={'bar'}>foo</MyComponent>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unnecessaryCurly): Curly braces are unnecessary here.\n\nRule message templates:\n  unnecessaryCurly: Curly braces are unnecessary here.\n  missingCurly: Need to wrap this literal in a JSX expression.";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Curly braces are unnecessary here.");
    });

  });
});
