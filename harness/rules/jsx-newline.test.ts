import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "JSX element should start in a new line",
  "JSX element should not start in a new line",
  "Multiline JSX elements should start in a new line",
];

describe("jsx-newline", () => {
  describe("valid", () => {
    it("valid[0]: <div> <Button>{data.label}</Button> <List /> <Button> <Ic...", async ({ task }) => {
      const code = `
        <div>
          <Button>{data.label}</Button>

          <List />

          <Button>
            <IconPreview />
            Button 2

            <span></span>
          </Button>

          {showSomething === true && <Something />}

          <Button>Button 3</Button>

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: valid (index 0)\n\n--- Source code under test ---\n\n        <div>\n          <Button>{data.label}</Button>\n\n          <List />\n\n          <Button>\n            <IconPreview />\n            Button 2\n\n            <span></span>\n          </Button>\n\n          {showSomething === true && <Something />}\n\n          <Button>Button 3</Button>\n\n          {showSomethingElse === true ? (\n            <SomethingElse />\n          ) : (\n            <ErrorMessage />\n          )}\n        </div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <> <Button>{data.label}</Button> Test <span>Should be in ...", async ({ task }) => {
      const code = `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: valid (index 2)\n\n--- Source code under test ---\n\n        <>\n          <Button>{data.label}</Button>\n          Test\n\n          <span>Should be in new line</span>\n        </>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: {/* fake-eslint-disable-next-line react/forbid-component-...", async ({ task }) => {
      const code = `
        {/* fake-eslint-disable-next-line react/forbid-component-props */}
        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>
          <Icon f7='gear' />
        </Button>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: valid (index 4)\n\n--- Source code under test ---\n\n        {/* fake-eslint-disable-next-line react/forbid-component-props */}\n        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>\n          <Icon f7='gear' />\n        </Button>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <Button popoverOpen='#settings-popover' style={{ width: '...", async ({ task }) => {
      const code = `
        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>
          {/* fake-eslint-disable-next-line should also work inside a component */}
          <Icon f7='gear' />
        </Button>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: valid (index 5)\n\n--- Source code under test ---\n\n        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>\n          {/* fake-eslint-disable-next-line should also work inside a component */}\n          <Icon f7='gear' />\n        </Button>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <Button popoverOpen='#settings-popover' style={{ width: '...", async ({ task }) => {
      const code = `
        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>
          {/* should work inside a component */}
          {/* and it should work when using multiple comments */}
          <Icon f7='gear' />
        </Button>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: valid (index 6)\n\n--- Source code under test ---\n\n        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>\n          {/* should work inside a component */}\n          {/* and it should work when using multiple comments */}\n          <Icon f7='gear' />\n        </Button>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <Button popoverOpen='#settings-popover' style={{ width: '...", async ({ task }) => {
      const code = `
        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>
          {/* this is a multiline
              block comment */}
          <Icon f7='gear' />
        </Button>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: valid (index 7)\n\n--- Source code under test ---\n\n        <Button popoverOpen='#settings-popover' style={{ width: 'fit-content' }}>\n          {/* this is a multiline\n              block comment */}\n          <Icon f7='gear' />\n        </Button>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <> {/* does this */} <Icon f7='gear' /> {/* also work wit...", async ({ task }) => {
      const code = `
        <>
          {/* does this */}
          <Icon f7='gear' />

          {/* also work with multiple components and inside a fragment? */}
          <OneLineComponent />
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: valid (index 8)\n\n--- Source code under test ---\n\n        <>\n          {/* does this */}\n          <Icon f7='gear' />\n\n          {/* also work with multiple components and inside a fragment? */}\n          <OneLineComponent />\n        </>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div> <Button>{data.label}</Button> <List /> </div>", async ({ task }) => {
      const code = `
        <div>
          <Button>{data.label}</Button>
          <List />
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        <div>\n          <Button>{data.label}</Button>\n          <List />\n        </div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: require): JSX element should start in a new line\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX element should start in a new line");
    });

    it("invalid[1]: <div> <Button>{data.label}</Button> {showSomething === tr...", async ({ task }) => {
      const code = `
        <div>
          <Button>{data.label}</Button>
          {showSomething === true && <Something />}
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        <div>\n          <Button>{data.label}</Button>\n          {showSomething === true && <Something />}\n        </div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: require): JSX element should start in a new line\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX element should start in a new line");
    });

    it("invalid[2]: <div> {showSomething === true && <Something />} <Button>{...", async ({ task }) => {
      const code = `
        <div>
          {showSomething === true && <Something />}
          <Button>{data.label}</Button>
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        <div>\n          {showSomething === true && <Something />}\n          <Button>{data.label}</Button>\n        </div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: require): JSX element should start in a new line\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX element should start in a new line");
    });

    it("invalid[3]: <div> {showSomething === true && <Something />} {showSome...", async ({ task }) => {
      const code = `
        <div>
          {showSomething === true && <Something />}
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        <div>\n          {showSomething === true && <Something />}\n          {showSomethingElse === true ? (\n            <SomethingElse />\n          ) : (\n            <ErrorMessage />\n          )}\n        </div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: require): JSX element should start in a new line\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX element should start in a new line");
    });

    it("invalid[4]: <div> {/* This should however still not work*/} <Icon f7=...", async ({ task }) => {
      const code = `
        <div>
          {/* This should however still not work*/}
          <Icon f7='gear' />

          <OneLineComponent />
          {/* Comments between components still need a newLine */}
          <OneLineComponent />
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        <div>\n          {/* This should however still not work*/}\n          <Icon f7='gear' />\n\n          <OneLineComponent />\n          {/* Comments between components still need a newLine */}\n          <OneLineComponent />\n        </div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: require): JSX element should start in a new line\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX element should start in a new line");
    });

    it("invalid[7]: <div> <div> <button></button> <button></button> </div> <d...", async ({ task }) => {
      const code = `
        <div>
          <div>
            <button></button>
            <button></button>
          </div>
          <div>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        <div>\n          <div>\n            <button></button>\n            <button></button>\n          </div>\n          <div>\n            <span></span>\n            <span></span>\n          </div>\n        </div>\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: require): JSX element should start in a new line\n  [1] (messageId: require): JSX element should start in a new line\n  [2] (messageId: require): JSX element should start in a new line\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("JSX element should start in a new line");
      expect(matches[1].message).toBe("JSX element should start in a new line");
      expect(matches[2].message).toBe("JSX element should start in a new line");
    });

    it("invalid[13]: <> <Button>{data.label}</Button> Test <span>Should be in ...", async ({ task }) => {
      const code = `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-newline\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        <>\n          <Button>{data.label}</Button>\n          Test\n          <span>Should be in new line</span>\n        </>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: require): JSX element should start in a new line\n\nFeatures: fragment\n\nRule message templates:\n  require: JSX element should start in a new line\n  prevent: JSX element should not start in a new line\n  allowMultilines: Multiline JSX elements should start in a new line";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-newline", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("JSX element should start in a new line");
    });

  });
});
