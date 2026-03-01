import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.",
];

describe("jsx-no-script-url", () => {
  describe("valid", () => {
    it("valid[0]: <a href=\"https://reactjs.org\"></a>", async ({ task }) => {
      const code = `<a href="https://reactjs.org"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: valid (index 0)\n\n--- Source code under test ---\n<a href=\"https://reactjs.org\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <a href=\"mailto:foo@bar.com\"></a>", async ({ task }) => {
      const code = `<a href="mailto:foo@bar.com"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: valid (index 1)\n\n--- Source code under test ---\n<a href=\"mailto:foo@bar.com\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <a href=\"#\"></a>", async ({ task }) => {
      const code = `<a href="#"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: valid (index 2)\n\n--- Source code under test ---\n<a href=\"#\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <a href=\"\"></a>", async ({ task }) => {
      const code = `<a href=""></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: valid (index 3)\n\n--- Source code under test ---\n<a href=\"\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <a name=\"foo\"></a>", async ({ task }) => {
      const code = `<a name="foo"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: valid (index 4)\n\n--- Source code under test ---\n<a name=\"foo\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <a href={\"javascript:\"}></a>", async ({ task }) => {
      const code = `<a href={"javascript:"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: valid (index 5)\n\n--- Source code under test ---\n<a href={\"javascript:\"}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <Foo href=\"javascript:\"></Foo>", async ({ task }) => {
      const code = `<Foo href="javascript:"></Foo>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: valid (index 6)\n\n--- Source code under test ---\n<Foo href=\"javascript:\"></Foo>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <a href />", async ({ task }) => {
      const code = `<a href />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: valid (index 7)\n\n--- Source code under test ---\n<a href />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <a href=\"javascript:\"></a>", async ({ task }) => {
      const code = `<a href="javascript:"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: invalid (index 0)\n\n--- Source code under test ---\n<a href=\"javascript:\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noScriptURL): A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.");
    });

    it("invalid[1]: <a href=\"javascript:void(0)\"></a>", async ({ task }) => {
      const code = `<a href="javascript:void(0)"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: invalid (index 1)\n\n--- Source code under test ---\n<a href=\"javascript:void(0)\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noScriptURL): A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.");
    });

    it("invalid[2]: <a href=\"j a v ascript:\"></a>", async ({ task }) => {
      const code = `<a href="j


av	ascript:"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-script-url\nType: invalid (index 2)\n\n--- Source code under test ---\n<a href=\"j\n\n\na\rv\tascript:\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noScriptURL): A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.\n\nRule message templates:\n  noScriptURL: A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-script-url", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.");
    });

  });
});
