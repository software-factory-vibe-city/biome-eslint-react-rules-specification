import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Imported JSX component {{name}} must be in PascalCase",
  "Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE",
  "Imported JSX component Test_component must be in PascalCase",
  "Imported JSX component TEST_COMPONENT must be in PascalCase",
  "Imported JSX component YMCA must be in PascalCase",
  "Imported JSX component _TEST_COMPONENT must be in PascalCase or SCREAMING_SNAKE_CASE",
  "Imported JSX component TEST_COMPONENT_ must be in PascalCase or SCREAMING_SNAKE_CASE",
  "Imported JSX component TEST-COMPONENT must be in PascalCase or SCREAMING_SNAKE_CASE",
  "Imported JSX component __ must be in PascalCase or SCREAMING_SNAKE_CASE",
  "Imported JSX component _div must be in PascalCase",
  "Imported JSX component $a must be in PascalCase",
  "Imported JSX component Foo_DEPRECATED must be in PascalCase",
  "Imported JSX component h1 must be in PascalCase",
  "Imported JSX component $Typography must be in PascalCase",
  "Imported JSX component STYLED must be in PascalCase",
];

describe("jsx-pascal-case", () => {
  describe("valid", () => {
    it("valid[0]: <testcomponent />", async ({ task }) => {
      const code = `<testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 0)\n\n--- Source code under test ---\n<testcomponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <testComponent />", async ({ task }) => {
      const code = `<testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 1)\n\n--- Source code under test ---\n<testComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <test_component />", async ({ task }) => {
      const code = `<test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 2)\n\n--- Source code under test ---\n<test_component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <TestComponent />", async ({ task }) => {
      const code = `<TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 3)\n\n--- Source code under test ---\n<TestComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <CSSTransitionGroup />", async ({ task }) => {
      const code = `<CSSTransitionGroup />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 4)\n\n--- Source code under test ---\n<CSSTransitionGroup />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <BetterThanCSS />", async ({ task }) => {
      const code = `<BetterThanCSS />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 5)\n\n--- Source code under test ---\n<BetterThanCSS />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <TestComponent><div /></TestComponent>", async ({ task }) => {
      const code = `<TestComponent><div /></TestComponent>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 6)\n\n--- Source code under test ---\n<TestComponent><div /></TestComponent>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <Test1Component />", async ({ task }) => {
      const code = `<Test1Component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 7)\n\n--- Source code under test ---\n<Test1Component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <TestComponent1 />", async ({ task }) => {
      const code = `<TestComponent1 />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 8)\n\n--- Source code under test ---\n<TestComponent1 />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <T3StComp0Nent />", async ({ task }) => {
      const code = `<T3StComp0Nent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 9)\n\n--- Source code under test ---\n<T3StComp0Nent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <Éurströmming />", async ({ task }) => {
      const code = `<Éurströmming />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 10)\n\n--- Source code under test ---\n<Éurströmming />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <Año />", async ({ task }) => {
      const code = `<Año />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 11)\n\n--- Source code under test ---\n<Año />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <Søknad />", async ({ task }) => {
      const code = `<Søknad />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 12)\n\n--- Source code under test ---\n<Søknad />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <T />", async ({ task }) => {
      const code = `<T />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 13)\n\n--- Source code under test ---\n<T />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <Modal.Header />", async ({ task }) => {
      const code = `<Modal.Header />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 16)\n\n--- Source code under test ---\n<Modal.Header />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <qualification.T3StComp0Nent />", async ({ task }) => {
      const code = `<qualification.T3StComp0Nent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 17)\n\n--- Source code under test ---\n<qualification.T3StComp0Nent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <Modal:Header />", async ({ task }) => {
      const code = `<Modal:Header />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 18)\n\n--- Source code under test ---\n<Modal:Header />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: jsx namespace\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: <$ />", async ({ task }) => {
      const code = `<$ />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 22)\n\n--- Source code under test ---\n<$ />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: <_ />", async ({ task }) => {
      const code = `<_ />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 23)\n\n--- Source code under test ---\n<_ />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: <H1>Hello!</H1>", async ({ task }) => {
      const code = `<H1>Hello!</H1>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 24)\n\n--- Source code under test ---\n<H1>Hello!</H1>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: <Typography.P />", async ({ task }) => {
      const code = `<Typography.P />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 25)\n\n--- Source code under test ---\n<Typography.P />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <Test_component />", async ({ task }) => {
      const code = `<Test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 0)\n\n--- Source code under test ---\n<Test_component />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component Test_component must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component Test_component must be in PascalCase");
    });

    it("invalid[1]: <TEST_COMPONENT />", async ({ task }) => {
      const code = `<TEST_COMPONENT />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 1)\n\n--- Source code under test ---\n<TEST_COMPONENT />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component TEST_COMPONENT must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component TEST_COMPONENT must be in PascalCase");
    });

    it("invalid[2]: <YMCA />", async ({ task }) => {
      const code = `<YMCA />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 2)\n\n--- Source code under test ---\n<YMCA />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component YMCA must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component YMCA must be in PascalCase");
    });

    it("invalid[9]: <$a />", async ({ task }) => {
      const code = `<$a />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 9)\n\n--- Source code under test ---\n<$a />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component $a must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component $a must be in PascalCase");
    });

    it("invalid[11]: <Styled.h1 />", async ({ task }) => {
      const code = `<Styled.h1 />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 11)\n\n--- Source code under test ---\n<Styled.h1 />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component h1 must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component h1 must be in PascalCase");
    });

    it("invalid[12]: <$Typography.P />", async ({ task }) => {
      const code = `<$Typography.P />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 12)\n\n--- Source code under test ---\n<$Typography.P />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component $Typography must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-pascal-case", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component $Typography must be in PascalCase");
    });

  });
});
