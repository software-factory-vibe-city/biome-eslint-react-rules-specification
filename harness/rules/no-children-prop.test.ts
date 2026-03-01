import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-children-prop";
const VALID_COUNT = 37;

const RULE_MESSAGES = [
  "Do not pass children as props. Instead, nest children between the opening and closing tags.",
  "Do not pass children as props. Instead, pass them as additional arguments to React.createElement.",
  "Do not nest a function between the opening and closing tags. Instead, pass it as a prop.",
  "Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.",
];

const cases = [
  { code: `<div />;`, filename: "test.jsx" },
  { code: `<div></div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", {});`, filename: "test.jsx" },
  { code: `React.createElement("div", undefined);`, filename: "test.jsx" },
  { code: `<div className="class-name"></div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", {className: "class-name"});`, filename: "test.jsx" },
  { code: `<div>Children</div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", "Children");`, filename: "test.jsx" },
  { code: `React.createElement("div", {}, "Children");`, filename: "test.jsx" },
  { code: `React.createElement("div", undefined, "Children");`, filename: "test.jsx" },
  { code: `<div className="class-name">Children</div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", {className: "class-name"}, "Children");`, filename: "test.jsx" },
  { code: `<div><div /></div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", React.createElement("div"));`, filename: "test.jsx" },
  { code: `React.createElement("div", {}, React.createElement("div"));`, filename: "test.jsx" },
  { code: `React.createElement("div", undefined, React.createElement("div"));`, filename: "test.jsx" },
  { code: `<div><div /><div /></div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", React.createElement("div"), React.createElement("div"));`, filename: "test.jsx" },
  { code: `React.createElement("div", {}, React.createElement("div"), React.createElement("div"));`, filename: "test.jsx" },
  { code: `React.createElement("div", undefined, React.createElement("div"), React.createElement("div"));`, filename: "test.jsx" },
  { code: `React.createElement("div", [React.createElement("div"), React.createElement("div")]);`, filename: "test.jsx" },
  { code: `React.createElement("div", {}, [React.createElement("div"), React.createElement("div")]);`, filename: "test.jsx" },
  { code: `React.createElement("div", undefined, [React.createElement("div"), React.createElement("div")]);`, filename: "test.jsx" },
  { code: `<MyComponent />`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent);`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, {});`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, undefined);`, filename: "test.jsx" },
  { code: `<MyComponent>Children</MyComponent>;`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, "Children");`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, {}, "Children");`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, undefined, "Children");`, filename: "test.jsx" },
  { code: `<MyComponent className="class-name"></MyComponent>;`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, {className: "class-name"});`, filename: "test.jsx" },
  { code: `<MyComponent className="class-name">Children</MyComponent>;`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, {className: "class-name"}, "Children");`, filename: "test.jsx" },
  { code: `<MyComponent className="class-name" {...props} />;`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, {className: "class-name", ...props});`, filename: "test.jsx" },
  { code: `<div children />;`, filename: "test.jsx" },
  { code: `<div children="Children" />;`, filename: "test.jsx" },
  { code: `<div children={<div />} />;`, filename: "test.jsx" },
  { code: `<div children={[<div />, <div />]} />;`, filename: "test.jsx" },
  { code: `<div children="Children">Children</div>;`, filename: "test.jsx" },
  { code: `React.createElement("div", {children: "Children"});`, filename: "test.jsx" },
  { code: `React.createElement("div", {children: "Children"}, "Children");`, filename: "test.jsx" },
  { code: `React.createElement("div", {children: React.createElement("div")});`, filename: "test.jsx" },
  { code: `React.createElement("div", {children: [React.createElement("div"), React.createElement("div")]});`, filename: "test.jsx" },
  { code: `<MyComponent children="Children" />`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, {children: "Children"});`, filename: "test.jsx" },
  { code: `<MyComponent className="class-name" children="Children" />;`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, {children: "Children", className: "class-name"});`, filename: "test.jsx" },
  { code: `<MyComponent {...props} children="Children" />;`, filename: "test.jsx" },
  { code: `React.createElement(MyComponent, {...props, children: "Children"})`, filename: "test.jsx" },
];

describe("no-children-prop", () => {
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
    it("valid[0]: <div />;", ({ task }) => {
      const code = `<div />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 0)\n\n--- Source code under test ---\n<div />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <div></div>;", ({ task }) => {
      const code = `<div></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 1)\n\n--- Source code under test ---\n<div></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: React.createElement(\"div\", {});", ({ task }) => {
      const code = `React.createElement("div", {});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 2)\n\n--- Source code under test ---\nReact.createElement(\"div\", {});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: React.createElement(\"div\", undefined);", ({ task }) => {
      const code = `React.createElement("div", undefined);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <div className=\"class-name\"></div>;", ({ task }) => {
      const code = `<div className="class-name"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 4)\n\n--- Source code under test ---\n<div className=\"class-name\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"div\", {className: \"class-name\"});", ({ task }) => {
      const code = `React.createElement("div", {className: "class-name"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"div\", {className: \"class-name\"});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <div>Children</div>;", ({ task }) => {
      const code = `<div>Children</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 6)\n\n--- Source code under test ---\n<div>Children</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: React.createElement(\"div\", \"Children\");", ({ task }) => {
      const code = `React.createElement("div", "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"div\", \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: React.createElement(\"div\", {}, \"Children\");", ({ task }) => {
      const code = `React.createElement("div", {}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 8)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: React.createElement(\"div\", undefined, \"Children\");", ({ task }) => {
      const code = `React.createElement("div", undefined, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 9)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <div className=\"class-name\">Children</div>;", ({ task }) => {
      const code = `<div className="class-name">Children</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 10)\n\n--- Source code under test ---\n<div className=\"class-name\">Children</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"div\", {className: \"class-name\"}, \"Ch...", ({ task }) => {
      const code = `React.createElement("div", {className: "class-name"}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"div\", {className: \"class-name\"}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <div><div /></div>;", ({ task }) => {
      const code = `<div><div /></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 12)\n\n--- Source code under test ---\n<div><div /></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(\"div\", React.createElement(\"div\"));", ({ task }) => {
      const code = `React.createElement("div", React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"div\", React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: React.createElement(\"div\", {}, React.createElement(\"div\"));", ({ task }) => {
      const code = `React.createElement("div", {}, React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 14)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: React.createElement(\"div\", undefined, React.createElement...", ({ task }) => {
      const code = `React.createElement("div", undefined, React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <div><div /><div /></div>;", ({ task }) => {
      const code = `<div><div /><div /></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 16)\n\n--- Source code under test ---\n<div><div /><div /></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: React.createElement(\"div\", React.createElement(\"div\"), Re...", ({ task }) => {
      const code = `React.createElement("div", React.createElement("div"), React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 17)\n\n--- Source code under test ---\nReact.createElement(\"div\", React.createElement(\"div\"), React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: React.createElement(\"div\", {}, React.createElement(\"div\")...", ({ task }) => {
      const code = `React.createElement("div", {}, React.createElement("div"), React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 18)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, React.createElement(\"div\"), React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: React.createElement(\"div\", undefined, React.createElement...", ({ task }) => {
      const code = `React.createElement("div", undefined, React.createElement("div"), React.createElement("div"));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 19)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, React.createElement(\"div\"), React.createElement(\"div\"));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: React.createElement(\"div\", [React.createElement(\"div\"), R...", ({ task }) => {
      const code = `React.createElement("div", [React.createElement("div"), React.createElement("div")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 20)\n\n--- Source code under test ---\nReact.createElement(\"div\", [React.createElement(\"div\"), React.createElement(\"div\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: React.createElement(\"div\", {}, [React.createElement(\"div\"...", ({ task }) => {
      const code = `React.createElement("div", {}, [React.createElement("div"), React.createElement("div")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 21)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, [React.createElement(\"div\"), React.createElement(\"div\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: React.createElement(\"div\", undefined, [React.createElemen...", ({ task }) => {
      const code = `React.createElement("div", undefined, [React.createElement("div"), React.createElement("div")]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 22)\n\n--- Source code under test ---\nReact.createElement(\"div\", undefined, [React.createElement(\"div\"), React.createElement(\"div\")]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: <MyComponent />", ({ task }) => {
      const code = `<MyComponent />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 23)\n\n--- Source code under test ---\n<MyComponent />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: React.createElement(MyComponent);", ({ task }) => {
      const code = `React.createElement(MyComponent);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 24)\n\n--- Source code under test ---\nReact.createElement(MyComponent);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.createElement(MyComponent, {});", ({ task }) => {
      const code = `React.createElement(MyComponent, {});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 25)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: React.createElement(MyComponent, undefined);", ({ task }) => {
      const code = `React.createElement(MyComponent, undefined);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 26)\n\n--- Source code under test ---\nReact.createElement(MyComponent, undefined);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: <MyComponent>Children</MyComponent>;", ({ task }) => {
      const code = `<MyComponent>Children</MyComponent>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 27)\n\n--- Source code under test ---\n<MyComponent>Children</MyComponent>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: React.createElement(MyComponent, \"Children\");", ({ task }) => {
      const code = `React.createElement(MyComponent, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 28)\n\n--- Source code under test ---\nReact.createElement(MyComponent, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: React.createElement(MyComponent, {}, \"Children\");", ({ task }) => {
      const code = `React.createElement(MyComponent, {}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 29)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: React.createElement(MyComponent, undefined, \"Children\");", ({ task }) => {
      const code = `React.createElement(MyComponent, undefined, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 30)\n\n--- Source code under test ---\nReact.createElement(MyComponent, undefined, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: <MyComponent className=\"class-name\"></MyComponent>;", ({ task }) => {
      const code = `<MyComponent className="class-name"></MyComponent>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 31)\n\n--- Source code under test ---\n<MyComponent className=\"class-name\"></MyComponent>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: React.createElement(MyComponent, {className: \"class-name\"});", ({ task }) => {
      const code = `React.createElement(MyComponent, {className: "class-name"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 32)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {className: \"class-name\"});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: <MyComponent className=\"class-name\">Children</MyComponent>;", ({ task }) => {
      const code = `<MyComponent className="class-name">Children</MyComponent>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 33)\n\n--- Source code under test ---\n<MyComponent className=\"class-name\">Children</MyComponent>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: React.createElement(MyComponent, {className: \"class-name\"...", ({ task }) => {
      const code = `React.createElement(MyComponent, {className: "class-name"}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 34)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {className: \"class-name\"}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: <MyComponent className=\"class-name\" {...props} />;", ({ task }) => {
      const code = `<MyComponent className="class-name" {...props} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 35)\n\n--- Source code under test ---\n<MyComponent className=\"class-name\" {...props} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: React.createElement(MyComponent, {className: \"class-name\"...", ({ task }) => {
      const code = `React.createElement(MyComponent, {className: "class-name", ...props});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: valid (index 36)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {className: \"class-name\", ...props});\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div children />;", ({ task }) => {
      const code = `<div children />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 0)\n\n--- Source code under test ---\n<div children />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[1]: <div children=\"Children\" />;", ({ task }) => {
      const code = `<div children="Children" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 1)\n\n--- Source code under test ---\n<div children=\"Children\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[2]: <div children={<div />} />;", ({ task }) => {
      const code = `<div children={<div />} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 2)\n\n--- Source code under test ---\n<div children={<div />} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[3]: <div children={[<div />, <div />]} />;", ({ task }) => {
      const code = `<div children={[<div />, <div />]} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 3)\n\n--- Source code under test ---\n<div children={[<div />, <div />]} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[4]: <div children=\"Children\">Children</div>;", ({ task }) => {
      const code = `<div children="Children">Children</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 4)\n\n--- Source code under test ---\n<div children=\"Children\">Children</div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[5]: React.createElement(\"div\", {children: \"Children\"});", ({ task }) => {
      const code = `React.createElement("div", {children: "Children"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"div\", {children: \"Children\"});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[6]: React.createElement(\"div\", {children: \"Children\"}, \"Child...", ({ task }) => {
      const code = `React.createElement("div", {children: "Children"}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 6)\n\n--- Source code under test ---\nReact.createElement(\"div\", {children: \"Children\"}, \"Children\");\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[7]: React.createElement(\"div\", {children: React.createElement...", ({ task }) => {
      const code = `React.createElement("div", {children: React.createElement("div")});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"div\", {children: React.createElement(\"div\")});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[8]: React.createElement(\"div\", {children: [React.createElemen...", ({ task }) => {
      const code = `React.createElement("div", {children: [React.createElement("div"), React.createElement("div")]});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 8)\n\n--- Source code under test ---\nReact.createElement(\"div\", {children: [React.createElement(\"div\"), React.createElement(\"div\")]});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[9]: <MyComponent children=\"Children\" />", ({ task }) => {
      const code = `<MyComponent children="Children" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 9)\n\n--- Source code under test ---\n<MyComponent children=\"Children\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[10]: React.createElement(MyComponent, {children: \"Children\"});", ({ task }) => {
      const code = `React.createElement(MyComponent, {children: "Children"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 10)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {children: \"Children\"});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[11]: <MyComponent className=\"class-name\" children=\"Children\" />;", ({ task }) => {
      const code = `<MyComponent className="class-name" children="Children" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 11)\n\n--- Source code under test ---\n<MyComponent className=\"class-name\" children=\"Children\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[12]: React.createElement(MyComponent, {children: \"Children\", c...", ({ task }) => {
      const code = `React.createElement(MyComponent, {children: "Children", className: "class-name"});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 12)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {children: \"Children\", className: \"class-name\"});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

    it("invalid[13]: <MyComponent {...props} children=\"Children\" />;", ({ task }) => {
      const code = `<MyComponent {...props} children="Children" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 13)\n\n--- Source code under test ---\n<MyComponent {...props} children=\"Children\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: nestChildren): Do not pass children as props. Instead, nest children between the opening and closing tags.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, nest children between the opening and closing tags.");
    });

    it("invalid[14]: React.createElement(MyComponent, {...props, children: \"Ch...", ({ task }) => {
      const code = `React.createElement(MyComponent, {...props, children: "Children"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-children-prop\nType: invalid (index 14)\n\n--- Source code under test ---\nReact.createElement(MyComponent, {...props, children: \"Children\"})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: passChildrenAsArgs): Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n\nRule message templates:\n  nestChildren: Do not pass children as props. Instead, nest children between the opening and closing tags.\n  passChildrenAsArgs: Do not pass children as props. Instead, pass them as additional arguments to React.createElement.\n  nestFunction: Do not nest a function between the opening and closing tags. Instead, pass it as a prop.\n  passFunctionAsArgs: Do not pass a function as an additional argument to React.createElement. Instead, pass it as a prop.";
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not pass children as props. Instead, pass them as additional arguments to React.createElement.");
    });

  });
});
