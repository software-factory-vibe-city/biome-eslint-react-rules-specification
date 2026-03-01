import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-danger-with-children";
const VALID_COUNT = 17;

const RULE_MESSAGES = [
  "Only set one of `children` or `props.dangerouslySetInnerHTML`",
];

const cases = [
  { code: `<div>Children</div>`, filename: "test.jsx" },
  { code: `<div {...props} />`, filename: "test.jsx" },
  { code: `<div dangerouslySetInnerHTML={{ __html: "HTML" }} />`, filename: "test.jsx" },
  { code: `<div children="Children" />`, filename: "test.jsx" },
  { code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `
        const moreProps = { className: "eslint" };
        const props = { children: "Children", ...moreProps };
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `
        const otherProps = { children: "Children" };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `<Hello>Children</Hello>`, filename: "test.jsx" },
  { code: `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />`, filename: "test.jsx" },
  { code: `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
        </Hello>
      `, filename: "test.jsx" },
  { code: `React.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });`, filename: "test.jsx" },
  { code: `React.createElement("div", {}, "Children");`, filename: "test.jsx" },
  { code: `React.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });`, filename: "test.jsx" },
  { code: `React.createElement("Hello", {}, "Children");`, filename: "test.jsx" },
  { code: `<Hello {...undefined}>Children</Hello>`, filename: "test.jsx" },
  { code: `React.createElement("Hello", undefined, "Children")`, filename: "test.jsx" },
  { code: `
        const props = {...props, scratch: {mode: 'edit'}};
        const component = shallow(<TaskEditableTitle {...props} />);
      `, filename: "test.jsx" },
  { code: `
        <div dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </div>
      `, filename: "test.jsx" },
  { code: `<div dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />`, filename: "test.jsx" },
  { code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props}>Children</div>
      `, filename: "test.jsx" },
  { code: `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </Hello>
      `, filename: "test.jsx" },
  { code: `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />`, filename: "test.jsx" },
  { code: `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}> </Hello>`, filename: "test.jsx" },
  { code: `
        React.createElement(
          "div",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `, filename: "test.jsx" },
  { code: `
        React.createElement(
          "div",
          {
            dangerouslySetInnerHTML: { __html: "HTML" },
            children: "Children",
          }
        );
      `, filename: "test.jsx" },
  { code: `
        React.createElement(
          "Hello",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `, filename: "test.jsx" },
  { code: `
        React.createElement(
          "Hello",
          {
            dangerouslySetInnerHTML: { __html: "HTML" },
            children: "Children",
          }
        );
      `, filename: "test.jsx" },
  { code: `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props, "Children");
      `, filename: "test.jsx" },
  { code: `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props);
      `, filename: "test.jsx" },
  { code: `
        const moreProps = { children: "Children" };
        const otherProps = { ...moreProps };
        const props = { ...otherProps, dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props);
      `, filename: "test.jsx" },
];

describe("no-danger-with-children", () => {
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
    it("valid[0]: <div>Children</div>", ({ task }) => {
      const code = `<div>Children</div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 0)\n\n--- Source code under test ---\n<div>Children</div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <div {...props} />", ({ task }) => {
      const code = `<div {...props} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 1)\n\n--- Source code under test ---\n<div {...props} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <div dangerouslySetInnerHTML={{ __html: \"HTML\" }} />", ({ task }) => {
      const code = `<div dangerouslySetInnerHTML={{ __html: "HTML" }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 2)\n\n--- Source code under test ---\n<div dangerouslySetInnerHTML={{ __html: \"HTML\" }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <div children=\"Children\" />", ({ task }) => {
      const code = `<div children="Children" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 3)\n\n--- Source code under test ---\n<div children=\"Children\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: const props = { dangerouslySetInnerHTML: { __html: \"HTML\"...", ({ task }) => {
      const code = `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 4)\n\n--- Source code under test ---\n\n        const props = { dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: const moreProps = { className: \"eslint\" }; const props = ...", ({ task }) => {
      const code = `
        const moreProps = { className: "eslint" };
        const props = { children: "Children", ...moreProps };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 5)\n\n--- Source code under test ---\n\n        const moreProps = { className: \"eslint\" };\n        const props = { children: \"Children\", ...moreProps };\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: const otherProps = { children: \"Children\" }; const { a, b...", ({ task }) => {
      const code = `
        const otherProps = { children: "Children" };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 6)\n\n--- Source code under test ---\n\n        const otherProps = { children: \"Children\" };\n        const { a, b, ...props } = otherProps;\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <Hello>Children</Hello>", ({ task }) => {
      const code = `<Hello>Children</Hello>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 7)\n\n--- Source code under test ---\n<Hello>Children</Hello>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }} />", ({ task }) => {
      const code = `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 8)\n\n--- Source code under test ---\n<Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}> </He...", ({ task }) => {
      const code = `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
        </Hello>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 9)\n\n--- Source code under test ---\n\n        <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}>\n        </Hello>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: React.createElement(\"div\", { dangerouslySetInnerHTML: { _...", ({ task }) => {
      const code = `React.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 10)\n\n--- Source code under test ---\nReact.createElement(\"div\", { dangerouslySetInnerHTML: { __html: \"HTML\" } });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"div\", {}, \"Children\");", ({ task }) => {
      const code = `React.createElement("div", {}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: React.createElement(\"Hello\", { dangerouslySetInnerHTML: {...", ({ task }) => {
      const code = `React.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 12)\n\n--- Source code under test ---\nReact.createElement(\"Hello\", { dangerouslySetInnerHTML: { __html: \"HTML\" } });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(\"Hello\", {}, \"Children\");", ({ task }) => {
      const code = `React.createElement("Hello", {}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"Hello\", {}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <Hello {...undefined}>Children</Hello>", ({ task }) => {
      const code = `<Hello {...undefined}>Children</Hello>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 14)\n\n--- Source code under test ---\n<Hello {...undefined}>Children</Hello>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: React.createElement(\"Hello\", undefined, \"Children\")", ({ task }) => {
      const code = `React.createElement("Hello", undefined, "Children")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"Hello\", undefined, \"Children\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: const props = {...props, scratch: {mode: 'edit'}}; const ...", ({ task }) => {
      const code = `
        const props = {...props, scratch: {mode: 'edit'}};
        const component = shallow(<TaskEditableTitle {...props} />);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 16)\n\n--- Source code under test ---\n\n        const props = {...props, scratch: {mode: 'edit'}};\n        const component = shallow(<TaskEditableTitle {...props} />);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div dangerouslySetInnerHTML={{ __html: \"HTML\" }}> Childr...", ({ task }) => {
      const code = `
        <div dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        <div dangerouslySetInnerHTML={{ __html: \"HTML\" }}>\n          Children\n        </div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[1]: <div dangerouslySetInnerHTML={{ __html: \"HTML\" }} childre...", ({ task }) => {
      const code = `<div dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 1)\n\n--- Source code under test ---\n<div dangerouslySetInnerHTML={{ __html: \"HTML\" }} children=\"Children\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[2]: const props = { dangerouslySetInnerHTML: { __html: \"HTML\"...", ({ task }) => {
      const code = `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props}>Children</div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        const props = { dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        <div {...props}>Children</div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[3]: const props = { children: \"Children\", dangerouslySetInner...", ({ task }) => {
      const code = `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        const props = { children: \"Children\", dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        <div {...props} />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[4]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}> Chil...", ({ task }) => {
      const code = `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </Hello>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}>\n          Children\n        </Hello>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[5]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }} child...", ({ task }) => {
      const code = `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 5)\n\n--- Source code under test ---\n<Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }} children=\"Children\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[6]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}> </He...", ({ task }) => {
      const code = `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}> </Hello>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 6)\n\n--- Source code under test ---\n<Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}> </Hello>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[7]: React.createElement( \"div\", { dangerouslySetInnerHTML: { ...", ({ task }) => {
      const code = `
        React.createElement(
          "div",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        React.createElement(\n          \"div\",\n          { dangerouslySetInnerHTML: { __html: \"HTML\" } },\n          \"Children\"\n        );\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[8]: React.createElement( \"div\", { dangerouslySetInnerHTML: { ...", ({ task }) => {
      const code = `
        React.createElement(
          "div",
          {
            dangerouslySetInnerHTML: { __html: "HTML" },
            children: "Children",
          }
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        React.createElement(\n          \"div\",\n          {\n            dangerouslySetInnerHTML: { __html: \"HTML\" },\n            children: \"Children\",\n          }\n        );\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[9]: React.createElement( \"Hello\", { dangerouslySetInnerHTML: ...", ({ task }) => {
      const code = `
        React.createElement(
          "Hello",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        React.createElement(\n          \"Hello\",\n          { dangerouslySetInnerHTML: { __html: \"HTML\" } },\n          \"Children\"\n        );\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[10]: React.createElement( \"Hello\", { dangerouslySetInnerHTML: ...", ({ task }) => {
      const code = `
        React.createElement(
          "Hello",
          {
            dangerouslySetInnerHTML: { __html: "HTML" },
            children: "Children",
          }
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        React.createElement(\n          \"Hello\",\n          {\n            dangerouslySetInnerHTML: { __html: \"HTML\" },\n            children: \"Children\",\n          }\n        );\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[11]: const props = { dangerouslySetInnerHTML: { __html: \"HTML\"...", ({ task }) => {
      const code = `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props, "Children");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        const props = { dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        React.createElement(\"div\", props, \"Children\");\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[12]: const props = { children: \"Children\", dangerouslySetInner...", ({ task }) => {
      const code = `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        const props = { children: \"Children\", dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        React.createElement(\"div\", props);\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[13]: const moreProps = { children: \"Children\" }; const otherPr...", ({ task }) => {
      const code = `
        const moreProps = { children: "Children" };
        const otherProps = { ...moreProps };
        const props = { ...otherProps, dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        const moreProps = { children: \"Children\" };\n        const otherProps = { ...moreProps };\n        const props = { ...otherProps, dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        React.createElement(\"div\", props);\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

  });
});
