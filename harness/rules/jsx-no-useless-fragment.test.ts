import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.",
  "Passing a fragment to an HTML element is useless.",
];

describe("jsx-no-useless-fragment", () => {
  describe("valid", () => {
    it("valid[0]: <><Foo /><Bar /></>", async ({ task }) => {
      const code = `<><Foo /><Bar /></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 0)\n\n--- Source code under test ---\n<><Foo /><Bar /></>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <>foo<div /></>", async ({ task }) => {
      const code = `<>foo<div /></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 1)\n\n--- Source code under test ---\n<>foo<div /></>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <> <div /></>", async ({ task }) => {
      const code = `<> <div /></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 2)\n\n--- Source code under test ---\n<> <div /></>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <>{\"moo\"} </>", async ({ task }) => {
      const code = `<>{"moo"} </>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 3)\n\n--- Source code under test ---\n<>{\"moo\"} </>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <NotFragment />", async ({ task }) => {
      const code = `<NotFragment />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 4)\n\n--- Source code under test ---\n<NotFragment />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <React.NotFragment />", async ({ task }) => {
      const code = `<React.NotFragment />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 5)\n\n--- Source code under test ---\n<React.NotFragment />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <NotReact.Fragment />", async ({ task }) => {
      const code = `<NotReact.Fragment />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 6)\n\n--- Source code under test ---\n<NotReact.Fragment />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <Foo><><div /><div /></></Foo>", async ({ task }) => {
      const code = `<Foo><><div /><div /></></Foo>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 7)\n\n--- Source code under test ---\n<Foo><><div /><div /></></Foo>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <div p={<>{\"a\"}{\"b\"}</>} />", async ({ task }) => {
      const code = `<div p={<>{"a"}{"b"}</>} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 8)\n\n--- Source code under test ---\n<div p={<>{\"a\"}{\"b\"}</>} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <Fragment key={item.id}>{item.value}</Fragment>", async ({ task }) => {
      const code = `<Fragment key={item.id}>{item.value}</Fragment>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 9)\n\n--- Source code under test ---\n<Fragment key={item.id}>{item.value}</Fragment>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />", async ({ task }) => {
      const code = `<Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 10)\n\n--- Source code under test ---\n<Fooo content={<>eeee ee eeeeeee eeeeeeee</>} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <>{foos.map(foo => foo)}</>", async ({ task }) => {
      const code = `<>{foos.map(foo => foo)}</>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: valid (index 11)\n\n--- Source code under test ---\n<>{foos.map(foo => foo)}</>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <></>", async ({ task }) => {
      const code = `<></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 0)\n\n--- Source code under test ---\n<></>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[1]: <>{}</>", async ({ task }) => {
      const code = `<>{}</>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 1)\n\n--- Source code under test ---\n<>{}</>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[2]: <p>moo<>foo</></p>", async ({ task }) => {
      const code = `<p>moo<>foo</></p>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 2)\n\n--- Source code under test ---\n<p>moo<>foo</></p>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[3]: <>{meow}</>", async ({ task }) => {
      const code = `<>{meow}</>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 3)\n\n--- Source code under test ---\n<>{meow}</>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[4]: <p><>{meow}</></p>", async ({ task }) => {
      const code = `<p><>{meow}</></p>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 4)\n\n--- Source code under test ---\n<p><>{meow}</></p>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[5]: <><div/></>", async ({ task }) => {
      const code = `<><div/></>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 5)\n\n--- Source code under test ---\n<><div/></>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[6]: <> <div/> </>", async ({ task }) => {
      const code = `
        <>
          <div/>
        </>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        <>\n          <div/>\n        </>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[7]: <Fragment />", async ({ task }) => {
      const code = `<Fragment />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 7)\n\n--- Source code under test ---\n<Fragment />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[8]: <React.Fragment> <Foo /> </React.Fragment>", async ({ task }) => {
      const code = `
        <React.Fragment>
          <Foo />
        </React.Fragment>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        <React.Fragment>\n          <Foo />\n        </React.Fragment>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[10]: <Eeee><>foo</></Eeee>", async ({ task }) => {
      const code = `<Eeee><>foo</></Eeee>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 10)\n\n--- Source code under test ---\n<Eeee><>foo</></Eeee>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
    });

    it("invalid[11]: <div><>foo</></div>", async ({ task }) => {
      const code = `<div><>foo</></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 11)\n\n--- Source code under test ---\n<div><>foo</></div>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[12]: <div><>{\"a\"}{\"b\"}</></div>", async ({ task }) => {
      const code = `<div><>{"a"}{"b"}</></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 12)\n\n--- Source code under test ---\n<div><>{\"a\"}{\"b\"}</></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[13]: <div><>{\"a\"}{\"b\"}</></div>", async ({ task }) => {
      const code = `<div><>{"a"}{"b"}</></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 13)\n\n--- Source code under test ---\n<div><>{\"a\"}{\"b\"}</></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, ts-old, no-ts-new, no-babel, no-default\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[14]: <section> <Eeee /> <Eeee /> <>{\"a\"}{\"b\"}</> </section>", async ({ task }) => {
      const code = `
        <section>
          <Eeee />
          <Eeee />
          <>{"a"}{"b"}</>
        </section>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        <section>\n          <Eeee />\n          <Eeee />\n          <>{\"a\"}{\"b\"}</>\n        </section>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[15]: <div><Fragment>{\"a\"}{\"b\"}</Fragment></div>", async ({ task }) => {
      const code = `<div><Fragment>{"a"}{"b"}</Fragment></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 15)\n\n--- Source code under test ---\n<div><Fragment>{\"a\"}{\"b\"}</Fragment></div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[16]: <section> git<> <b>hub</b>. </> git<> <b>hub</b></> </sec...", async ({ task }) => {
      const code = `
        <section>
          git<>
            <b>hub</b>.
          </>

          git<> <b>hub</b></>
        </section>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        <section>\n          git<>\n            <b>hub</b>.\n          </>\n\n          git<> <b>hub</b></>\n        </section>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[17]: <div>a <>{\"\"}{\"\"}</> a</div>", async ({ task }) => {
      const code = `<div>a <>{""}{""}</> a</div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 17)\n\n--- Source code under test ---\n<div>a <>{\"\"}{\"\"}</> a</div>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Passing a fragment to an HTML element is useless.");
    });

    it("invalid[18]: const Comp = () => ( <html> <React.Fragment /> </html> );", async ({ task }) => {
      const code = `
        const Comp = () => (
          <html>
            <React.Fragment />
          </html>
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-useless-fragment\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        const Comp = () => (\n          <html>\n            <React.Fragment />\n          </html>\n        );\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: NeedsMoreChildren): Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  [1] (messageId: ChildOfHtmlElement): Passing a fragment to an HTML element is useless.\n\nRule message templates:\n  NeedsMoreChildren: Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.\n  ChildOfHtmlElement: Passing a fragment to an HTML element is useless.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-useless-fragment", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Fragments should contain more than one child - otherwise, there’s no need for a Fragment at all.");
      expect(matches[1].message).toBe("Passing a fragment to an HTML element is useless.");
    });

  });
});
