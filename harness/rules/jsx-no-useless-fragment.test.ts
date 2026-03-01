import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-no-useless-fragment";
const VALID_COUNT = 12;

const RULE_MESSAGES = [
  "Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.",
  "Passing a fragment to an HTML element is useless.",
];

const cases = [
  { code: `<><Foo /><Bar /></>`, filename: "test.jsx" },
  { code: `<>foo<div /></>`, filename: "test.jsx" },
  { code: `<> <div /></>`, filename: "test.jsx" },
  { code: `<>{"moo"} </>`, filename: "test.jsx" },
  { code: `<NotFragment />`, filename: "test.jsx" },
  { code: `<React.NotFragment />`, filename: "test.jsx" },
  { code: `<NotReact.Fragment />`, filename: "test.jsx" },
  { code: `<Foo><><div /><div /></></Foo>`, filename: "test.jsx" },
  { code: `<div p={<>{"a"}{"b"}</>} />`, filename: "test.jsx" },
  { code: `<Fragment key={item.id}>{item.value}</Fragment>`, filename: "test.jsx" },
  { code: `<Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />`, filename: "test.jsx" },
  { code: `<>{foos.map(foo => foo)}</>`, filename: "test.jsx" },
  { code: `<></>`, filename: "test.jsx" },
  { code: `<>{}</>`, filename: "test.jsx" },
  { code: `<p>moo<>foo</></p>`, filename: "test.jsx" },
  { code: `<>{meow}</>`, filename: "test.jsx" },
  { code: `<p><>{meow}</></p>`, filename: "test.jsx" },
  { code: `<><div/></>`, filename: "test.jsx" },
  { code: `
        <>
          <div/>
        </>
      `, filename: "test.jsx" },
  { code: `<Fragment />`, filename: "test.jsx" },
  { code: `
        <React.Fragment>
          <Foo />
        </React.Fragment>
      `, filename: "test.jsx" },
  { code: `<Eeee><>foo</></Eeee>`, filename: "test.jsx" },
  { code: `<div><>foo</></div>`, filename: "test.jsx" },
  { code: `<div><>{"a"}{"b"}</></div>`, filename: "test.jsx" },
  { code: `<div><>{"a"}{"b"}</></div>`, filename: "test.jsx" },
  { code: `
        <section>
          <Eeee />
          <Eeee />
          <>{"a"}{"b"}</>
        </section>`, filename: "test.jsx" },
  { code: `<div><Fragment>{"a"}{"b"}</Fragment></div>`, filename: "test.jsx" },
  { code: `
        <section>
          git<>
            <b>hub</b>.
          </>

          git<> <b>hub</b></>
        </section>`, filename: "test.jsx" },
  { code: `<div>a <>{""}{""}</> a</div>`, filename: "test.jsx" },
  { code: `
        const Comp = () => (
          <html>
            <React.Fragment />
          </html>
        );
      `, filename: "test.jsx" },
];

describe("jsx-no-useless-fragment", () => {
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
    it("valid[0]: <><Foo /><Bar /></>", ({ task }) => {
      const code = `<><Foo /><Bar /></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 0)\n\n--- Source code under test ---\n<><Foo /><Bar /></>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <>foo<div /></>", ({ task }) => {
      const code = `<>foo<div /></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 1)\n\n--- Source code under test ---\n<>foo<div /></>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <> <div /></>", ({ task }) => {
      const code = `<> <div /></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 2)\n\n--- Source code under test ---\n<> <div /></>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <>{\"moo\"} </>", ({ task }) => {
      const code = `<>{"moo"} </>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 3)\n\n--- Source code under test ---\n<>{\"moo\"} </>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <NotFragment />", ({ task }) => {
      const code = `<NotFragment />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 4)\n\n--- Source code under test ---\n<NotFragment />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <React.NotFragment />", ({ task }) => {
      const code = `<React.NotFragment />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 5)\n\n--- Source code under test ---\n<React.NotFragment />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <NotReact.Fragment />", ({ task }) => {
      const code = `<NotReact.Fragment />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 6)\n\n--- Source code under test ---\n<NotReact.Fragment />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <Foo><><div /><div /></></Foo>", ({ task }) => {
      const code = `<Foo><><div /><div /></></Foo>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 7)\n\n--- Source code under test ---\n<Foo><><div /><div /></></Foo>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <div p={<>{\"a\"}{\"b\"}</>} />", ({ task }) => {
      const code = `<div p={<>{"a"}{"b"}</>} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 8)\n\n--- Source code under test ---\n<div p={<>{\"a\"}{\"b\"}</>} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <Fragment key={item.id}>{item.value}</Fragment>", ({ task }) => {
      const code = `<Fragment key={item.id}>{item.value}</Fragment>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 9)\n\n--- Source code under test ---\n<Fragment key={item.id}>{item.value}</Fragment>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />", ({ task }) => {
      const code = `<Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 10)\n\n--- Source code under test ---\n<Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <>{foos.map(foo => foo)}</>", ({ task }) => {
      const code = `<>{foos.map(foo => foo)}</>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 11)\n\n--- Source code under test ---\n<>{foos.map(foo => foo)}</>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <></>", ({ task }) => {
      const code = `<></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 0)\n\n--- Source code under test ---\n<></>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[1]: <>{}</>", ({ task }) => {
      const code = `<>{}</>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 1)\n\n--- Source code under test ---\n<>{}</>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[2]: <p>moo<>foo</></p>", ({ task }) => {
      const code = `<p>moo<>foo</></p>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 2)\n\n--- Source code under test ---\n<p>moo<>foo</></p>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[3]: <>{meow}</>", ({ task }) => {
      const code = `<>{meow}</>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 3)\n\n--- Source code under test ---\n<>{meow}</>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[4]: <p><>{meow}</></p>", ({ task }) => {
      const code = `<p><>{meow}</></p>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 4)\n\n--- Source code under test ---\n<p><>{meow}</></p>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[5]: <><div/></>", ({ task }) => {
      const code = `<><div/></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 5)\n\n--- Source code under test ---\n<><div/></>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[6]: <> <div/> </>", ({ task }) => {
      const code = `
        <>
          <div/>
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        <>\n          <div/>\n        </>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[7]: <Fragment />", ({ task }) => {
      const code = `<Fragment />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 7)\n\n--- Source code under test ---\n<Fragment />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[8]: <React.Fragment> <Foo /> </React.Fragment>", ({ task }) => {
      const code = `
        <React.Fragment>
          <Foo />
        </React.Fragment>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        <React.Fragment>\n          <Foo />\n        </React.Fragment>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[10]: <Eeee><>foo</></Eeee>", ({ task }) => {
      const code = `<Eeee><>foo</></Eeee>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 10)\n\n--- Source code under test ---\n<Eeee><>foo</></Eeee>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[11]: <div><>foo</></div>", ({ task }) => {
      const code = `<div><>foo</></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 11)\n\n--- Source code under test ---\n<div><>foo</></div>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[12]: <div><>{\"a\"}{\"b\"}</></div>", ({ task }) => {
      const code = `<div><>{"a"}{"b"}</></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 12)\n\n--- Source code under test ---\n<div><>{\"a\"}{\"b\"}</></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[13]: <div><>{\"a\"}{\"b\"}</></div>", ({ task }) => {
      const code = `<div><>{"a"}{"b"}</></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 13)\n\n--- Source code under test ---\n<div><>{\"a\"}{\"b\"}</></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, ts-old, no-ts-new, no-babel, no-default\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[14]: <section> <Eeee /> <Eeee /> <>{\"a\"}{\"b\"}</> </section>", ({ task }) => {
      const code = `
        <section>
          <Eeee />
          <Eeee />
          <>{"a"}{"b"}</>
        </section>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        <section>\n          <Eeee />\n          <Eeee />\n          <>{\"a\"}{\"b\"}</>\n        </section>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[15]: <div><Fragment>{\"a\"}{\"b\"}</Fragment></div>", ({ task }) => {
      const code = `<div><Fragment>{"a"}{"b"}</Fragment></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 15)\n\n--- Source code under test ---\n<div><Fragment>{\"a\"}{\"b\"}</Fragment></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[16]: <section> git<> <b>hub</b>. </> git<> <b>hub</b></> </sec...", ({ task }) => {
      const code = `
        <section>
          git<>
            <b>hub</b>.
          </>

          git<> <b>hub</b></>
        </section>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        <section>\n          git<>\n            <b>hub</b>.\n          </>\n\n          git<> <b>hub</b></>\n        </section>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[17]: <div>a <>{\"\"}{\"\"}</> a</div>", ({ task }) => {
      const code = `<div>a <>{""}{""}</> a</div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 17)\n\n--- Source code under test ---\n<div>a <>{\"\"}{\"\"}</> a</div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[18]: const Comp = () => ( <html> <React.Fragment /> </html> );", ({ task }) => {
      const code = `
        const Comp = () => (
          <html>
            <React.Fragment />
          </html>
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        const Comp = () => (\n          <html>\n            <React.Fragment />\n          </html>\n        );\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

  });
});
