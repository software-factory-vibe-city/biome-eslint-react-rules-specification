import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not pass children as props. Instead, nest children between the opening and closing tags.",
  "Do not pass children as props. Instead, pass them as additional arguments to React.createElement.",
  "Do not nest a function between the opening and closing tags. Instead, pass it as a prop.",
  "Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.",
];

describe("no-children-prop", () => {
  describe("valid", () => {
    it("valid[0]: <div />;", async ({ task }) => {
      const code = `<div />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 0)\n\n--- Source code under test ---\n<div />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <div></div>;", async ({ task }) => {
      const code = `<div></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 1)\n\n--- Source code under test ---\n<div></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: React.createElement(\"div\", {});", async ({ task }) => {
      const code = `React.createElement("div", {});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 2)\n\n--- Source code under test ---\nReact.createElement(\"div\", {});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: React.createElement(\"div\", undefined);", async ({ task }) => {
      const code = `React.createElement("div", undefined);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <div className=\"class-name\"></div>;", async ({ task }) => {
      const code = `<div className="class-name"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 4)\n\n--- Source code under test ---\n<div className=\"class-name\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"div\", {className: \"class-name\"});", async ({ task }) => {
      const code = `React.createElement("div", {className: "class-name"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"div\", {className: \"class-name\"});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <div>Children</div>;", async ({ task }) => {
      const code = `<div>Children</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 6)\n\n--- Source code under test ---\n<div>Children</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: React.createElement(\"div\", \"Children\");", async ({ task }) => {
      const code = `React.createElement("div", "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"div\", \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: React.createElement(\"div\", {}, \"Children\");", async ({ task }) => {
      const code = `React.createElement("div", {}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 8)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: React.createElement(\"div\", undefined, \"Children\");", async ({ task }) => {
      const code = `React.createElement("div", undefined, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 9)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <div className=\"class-name\">Children</div>;", async ({ task }) => {
      const code = `<div className="class-name">Children</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 10)\n\n--- Source code under test ---\n<div className=\"class-name\">Children</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"div\", {className: \"class-name\"}, \"Ch...", async ({ task }) => {
      const code = `React.createElement("div", {className: "class-name"}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"div\", {className: \"class-name\"}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <div><div /></div>;", async ({ task }) => {
      const code = `<div><div /></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 12)\n\n--- Source code under test ---\n<div><div /></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(\"div\", React.createElement(\"div\"));", async ({ task }) => {
      const code = `React.createElement("div", React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"div\", React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: React.createElement(\"div\", {}, React.createElement(\"div\"));", async ({ task }) => {
      const code = `React.createElement("div", {}, React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 14)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: React.createElement(\"div\", undefined, React.createElement...", async ({ task }) => {
      const code = `React.createElement("div", undefined, React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <div><div /><div /></div>;", async ({ task }) => {
      const code = `<div><div /><div /></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 16)\n\n--- Source code under test ---\n<div><div /><div /></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: React.createElement(\"div\", React.createElement(\"div\"), Re...", async ({ task }) => {
      const code = `React.createElement("div", React.createElement("div"), React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 17)\n\n--- Source code under test ---\nReact.createElement(\"div\", React.createElement(\"div\"), React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: React.createElement(\"div\", {}, React.createElement(\"div\")...", async ({ task }) => {
      const code = `React.createElement("div", {}, React.createElement("div"), React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 18)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, React.createElement(\"div\"), React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: React.createElement(\"div\", undefined, React.createElement...", async ({ task }) => {
      const code = `React.createElement("div", undefined, React.createElement("div"), React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 19)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, React.createElement(\"div\"), React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: React.createElement(\"div\", [React.createElement(\"div\"), R...", async ({ task }) => {
      const code = `React.createElement("div", [React.createElement("div"), React.createElement("div")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 20)\n\n--- Source code under test ---\nReact.createElement(\"div\", [React.createElement(\"div\"), React.createElement(\"div\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: React.createElement(\"div\", {}, [React.createElement(\"div\"...", async ({ task }) => {
      const code = `React.createElement("div", {}, [React.createElement("div"), React.createElement("div")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 21)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, [React.createElement(\"div\"), React.createElement(\"div\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: React.createElement(\"div\", undefined, [React.createElemen...", async ({ task }) => {
      const code = `React.createElement("div", undefined, [React.createElement("div"), React.createElement("div")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 22)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, [React.createElement(\"div\"), React.createElement(\"div\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: <MyComponent />", async ({ task }) => {
      const code = `<MyComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 23)\n\n--- Source code under test ---\n<MyComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: React.createElement(MyComponent);", async ({ task }) => {
      const code = `React.createElement(MyComponent);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 24)\n\n--- Source code under test ---\nReact.createElement(MyComponent);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.createElement(MyComponent, {});", async ({ task }) => {
      const code = `React.createElement(MyComponent, {});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 25)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: React.createElement(MyComponent, undefined);", async ({ task }) => {
      const code = `React.createElement(MyComponent, undefined);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 26)\n\n--- Source code under test ---\nReact.createElement(MyComponent, undefined);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: <MyComponent>Children</MyComponent>;", async ({ task }) => {
      const code = `<MyComponent>Children</MyComponent>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 27)\n\n--- Source code under test ---\n<MyComponent>Children</MyComponent>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: React.createElement(MyComponent, \"Children\");", async ({ task }) => {
      const code = `React.createElement(MyComponent, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 28)\n\n--- Source code under test ---\nReact.createElement(MyComponent, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: React.createElement(MyComponent, {}, \"Children\");", async ({ task }) => {
      const code = `React.createElement(MyComponent, {}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 29)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: React.createElement(MyComponent, undefined, \"Children\");", async ({ task }) => {
      const code = `React.createElement(MyComponent, undefined, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 30)\n\n--- Source code under test ---\nReact.createElement(MyComponent, undefined, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: <MyComponent className=\"class-name\"></MyComponent>;", async ({ task }) => {
      const code = `<MyComponent className="class-name"></MyComponent>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 31)\n\n--- Source code under test ---\n<MyComponent className=\"class-name\"></MyComponent>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: React.createElement(MyComponent, {className: \"class-name\"});", async ({ task }) => {
      const code = `React.createElement(MyComponent, {className: "class-name"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 32)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {className: \"class-name\"});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: <MyComponent className=\"class-name\">Children</MyComponent>;", async ({ task }) => {
      const code = `<MyComponent className="class-name">Children</MyComponent>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 33)\n\n--- Source code under test ---\n<MyComponent className=\"class-name\">Children</MyComponent>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: React.createElement(MyComponent, {className: \"class-name\"...", async ({ task }) => {
      const code = `React.createElement(MyComponent, {className: "class-name"}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 34)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {className: \"class-name\"}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: <MyComponent className=\"class-name\" {...props} />;", async ({ task }) => {
      const code = `<MyComponent className="class-name" {...props} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 35)\n\n--- Source code under test ---\n<MyComponent className=\"class-name\" {...props} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: React.createElement(MyComponent, {className: \"class-name\"...", async ({ task }) => {
      const code = `React.createElement(MyComponent, {className: "class-name", ...props});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 36)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {className: \"class-name\", ...props});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div children />;", async ({ task }) => {
      const code = `<div children />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 0)\n\n--- Source code under test ---\n<div children />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[1]: <div children=\"Children\" />;", async ({ task }) => {
      const code = `<div children="Children" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 1)\n\n--- Source code under test ---\n<div children=\"Children\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[2]: <div children={<div />} />;", async ({ task }) => {
      const code = `<div children={<div />} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 2)\n\n--- Source code under test ---\n<div children={<div />} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[3]: <div children={[<div />, <div />]} />;", async ({ task }) => {
      const code = `<div children={[<div />, <div />]} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 3)\n\n--- Source code under test ---\n<div children={[<div />, <div />]} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[4]: <div children=\"Children\">Children</div>;", async ({ task }) => {
      const code = `<div children="Children">Children</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 4)\n\n--- Source code under test ---\n<div children=\"Children\">Children</div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[5]: React.createElement(\"div\", {children: \"Children\"});", async ({ task }) => {
      const code = `React.createElement("div", {children: "Children"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"div\", {children: \"Children\"});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[6]: React.createElement(\"div\", {children: \"Children\"}, \"Child...", async ({ task }) => {
      const code = `React.createElement("div", {children: "Children"}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 6)\n\n--- Source code under test ---\nReact.createElement(\"div\", {children: \"Children\"}, \"Children\");\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[7]: React.createElement(\"div\", {children: React.createElement...", async ({ task }) => {
      const code = `React.createElement("div", {children: React.createElement("div")});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"div\", {children: React.createElement(\"div\")});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[8]: React.createElement(\"div\", {children: [React.createElemen...", async ({ task }) => {
      const code = `React.createElement("div", {children: [React.createElement("div"), React.createElement("div")]});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 8)\n\n--- Source code under test ---\nReact.createElement(\"div\", {children: [React.createElement(\"div\"), React.createElement(\"div\")]});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[9]: <MyComponent children=\"Children\" />", async ({ task }) => {
      const code = `<MyComponent children="Children" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 9)\n\n--- Source code under test ---\n<MyComponent children=\"Children\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[10]: React.createElement(MyComponent, {children: \"Children\"});", async ({ task }) => {
      const code = `React.createElement(MyComponent, {children: "Children"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 10)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {children: \"Children\"});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[11]: <MyComponent className=\"class-name\" children=\"Children\" />;", async ({ task }) => {
      const code = `<MyComponent className="class-name" children="Children" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 11)\n\n--- Source code under test ---\n<MyComponent className=\"class-name\" children=\"Children\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[12]: React.createElement(MyComponent, {children: \"Children\", c...", async ({ task }) => {
      const code = `React.createElement(MyComponent, {children: "Children", className: "class-name"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 12)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {children: \"Children\", className: \"class-name\"});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[13]: <MyComponent {...props} children=\"Children\" />;", async ({ task }) => {
      const code = `<MyComponent {...props} children="Children" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 13)\n\n--- Source code under test ---\n<MyComponent {...props} children=\"Children\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[14]: React.createElement(MyComponent, {...props, children: \"Ch...", async ({ task }) => {
      const code = `React.createElement(MyComponent, {...props, children: "Children"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 14)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {...props, children: \"Children\"})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-children-prop", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

  });
});
