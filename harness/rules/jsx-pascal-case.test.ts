import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-pascal-case";
const VALID_COUNT = 21;

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

const cases = [
  { code: `<testcomponent />`, filename: "test.jsx" },
  { code: `<testComponent />`, filename: "test.jsx" },
  { code: `<test_component />`, filename: "test.jsx" },
  { code: `<TestComponent />`, filename: "test.jsx" },
  { code: `<CSSTransitionGroup />`, filename: "test.jsx" },
  { code: `<BetterThanCSS />`, filename: "test.jsx" },
  { code: `<TestComponent><div /></TestComponent>`, filename: "test.jsx" },
  { code: `<Test1Component />`, filename: "test.jsx" },
  { code: `<TestComponent1 />`, filename: "test.jsx" },
  { code: `<T3StComp0Nent />`, filename: "test.jsx" },
  { code: `<Éurströmming />`, filename: "test.jsx" },
  { code: `<Año />`, filename: "test.jsx" },
  { code: `<Søknad />`, filename: "test.jsx" },
  { code: `<T />`, filename: "test.jsx" },
  { code: `<Modal.Header />`, filename: "test.jsx" },
  { code: `<qualification.T3StComp0Nent />`, filename: "test.jsx" },
  { code: `<Modal:Header />`, filename: "test.jsx" },
  { code: `<$ />`, filename: "test.jsx" },
  { code: `<_ />`, filename: "test.jsx" },
  { code: `<H1>Hello!</H1>`, filename: "test.jsx" },
  { code: `<Typography.P />`, filename: "test.jsx" },
  { code: `<Test_component />`, filename: "test.jsx" },
  { code: `<TEST_COMPONENT />`, filename: "test.jsx" },
  { code: `<YMCA />`, filename: "test.jsx" },
  { code: `<$a />`, filename: "test.jsx" },
  { code: `<Styled.h1 />`, filename: "test.jsx" },
  { code: `<$Typography.P />`, filename: "test.jsx" },
];

describe("jsx-pascal-case", () => {
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
    it("valid[0]: <testcomponent />", ({ task }) => {
      const code = `<testcomponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 0)\n\n--- Source code under test ---\n<testcomponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <testComponent />", ({ task }) => {
      const code = `<testComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 1)\n\n--- Source code under test ---\n<testComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <test_component />", ({ task }) => {
      const code = `<test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 2)\n\n--- Source code under test ---\n<test_component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <TestComponent />", ({ task }) => {
      const code = `<TestComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 3)\n\n--- Source code under test ---\n<TestComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <CSSTransitionGroup />", ({ task }) => {
      const code = `<CSSTransitionGroup />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 4)\n\n--- Source code under test ---\n<CSSTransitionGroup />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <BetterThanCSS />", ({ task }) => {
      const code = `<BetterThanCSS />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 5)\n\n--- Source code under test ---\n<BetterThanCSS />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <TestComponent><div /></TestComponent>", ({ task }) => {
      const code = `<TestComponent><div /></TestComponent>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 6)\n\n--- Source code under test ---\n<TestComponent><div /></TestComponent>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <Test1Component />", ({ task }) => {
      const code = `<Test1Component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 7)\n\n--- Source code under test ---\n<Test1Component />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <TestComponent1 />", ({ task }) => {
      const code = `<TestComponent1 />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 8)\n\n--- Source code under test ---\n<TestComponent1 />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <T3StComp0Nent />", ({ task }) => {
      const code = `<T3StComp0Nent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 9)\n\n--- Source code under test ---\n<T3StComp0Nent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <Éurströmming />", ({ task }) => {
      const code = `<Éurströmming />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 10)\n\n--- Source code under test ---\n<Éurströmming />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <Año />", ({ task }) => {
      const code = `<Año />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 11)\n\n--- Source code under test ---\n<Año />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <Søknad />", ({ task }) => {
      const code = `<Søknad />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 12)\n\n--- Source code under test ---\n<Søknad />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <T />", ({ task }) => {
      const code = `<T />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 13)\n\n--- Source code under test ---\n<T />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <Modal.Header />", ({ task }) => {
      const code = `<Modal.Header />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 16)\n\n--- Source code under test ---\n<Modal.Header />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <qualification.T3StComp0Nent />", ({ task }) => {
      const code = `<qualification.T3StComp0Nent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 17)\n\n--- Source code under test ---\n<qualification.T3StComp0Nent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <Modal:Header />", ({ task }) => {
      const code = `<Modal:Header />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 18)\n\n--- Source code under test ---\n<Modal:Header />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: jsx namespace\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: <$ />", ({ task }) => {
      const code = `<$ />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 22)\n\n--- Source code under test ---\n<$ />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: <_ />", ({ task }) => {
      const code = `<_ />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 23)\n\n--- Source code under test ---\n<_ />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: <H1>Hello!</H1>", ({ task }) => {
      const code = `<H1>Hello!</H1>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 24)\n\n--- Source code under test ---\n<H1>Hello!</H1>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: <Typography.P />", ({ task }) => {
      const code = `<Typography.P />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: valid (index 25)\n\n--- Source code under test ---\n<Typography.P />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <Test_component />", ({ task }) => {
      const code = `<Test_component />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 0)\n\n--- Source code under test ---\n<Test_component />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component Test_component must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component Test_component must be in PascalCase");
    });

    it("invalid[1]: <TEST_COMPONENT />", ({ task }) => {
      const code = `<TEST_COMPONENT />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 1)\n\n--- Source code under test ---\n<TEST_COMPONENT />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component TEST_COMPONENT must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component TEST_COMPONENT must be in PascalCase");
    });

    it("invalid[2]: <YMCA />", ({ task }) => {
      const code = `<YMCA />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 2)\n\n--- Source code under test ---\n<YMCA />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component YMCA must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component YMCA must be in PascalCase");
    });

    it("invalid[9]: <$a />", ({ task }) => {
      const code = `<$a />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 9)\n\n--- Source code under test ---\n<$a />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component $a must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component $a must be in PascalCase");
    });

    it("invalid[11]: <Styled.h1 />", ({ task }) => {
      const code = `<Styled.h1 />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 11)\n\n--- Source code under test ---\n<Styled.h1 />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component h1 must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component h1 must be in PascalCase");
    });

    it("invalid[12]: <$Typography.P />", ({ task }) => {
      const code = `<$Typography.P />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-pascal-case\nType: invalid (index 12)\n\n--- Source code under test ---\n<$Typography.P />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: usePascalCase): Imported JSX component $Typography must be in PascalCase\n\nRule message templates:\n  usePascalCase: Imported JSX component {{name}} must be in PascalCase\n  usePascalOrSnakeCase: Imported JSX component {{name}} must be in PascalCase or SCREAMING_SNAKE_CASE";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Imported JSX component $Typography must be in PascalCase");
    });

  });
});
