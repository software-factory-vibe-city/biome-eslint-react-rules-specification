import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Only set one of `children` or `props.dangerouslySetInnerHTML`",
];

describe("no-danger-with-children", () => {
  describe("valid", () => {
    it("valid[0]: <div>Children</div>", async ({ task }) => {
      const code = `<div>Children</div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 0)\n\n--- Source code under test ---\n<div>Children</div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <div {...props} />", async ({ task }) => {
      const code = `<div {...props} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 1)\n\n--- Source code under test ---\n<div {...props} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <div dangerouslySetInnerHTML={{ __html: \"HTML\" }} />", async ({ task }) => {
      const code = `<div dangerouslySetInnerHTML={{ __html: "HTML" }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 2)\n\n--- Source code under test ---\n<div dangerouslySetInnerHTML={{ __html: \"HTML\" }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <div children=\"Children\" />", async ({ task }) => {
      const code = `<div children="Children" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 3)\n\n--- Source code under test ---\n<div children=\"Children\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: const props = { dangerouslySetInnerHTML: { __html: \"HTML\"...", async ({ task }) => {
      const code = `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 4)\n\n--- Source code under test ---\n\n        const props = { dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: const moreProps = { className: \"eslint\" }; const props = ...", async ({ task }) => {
      const code = `
        const moreProps = { className: "eslint" };
        const props = { children: "Children", ...moreProps };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 5)\n\n--- Source code under test ---\n\n        const moreProps = { className: \"eslint\" };\n        const props = { children: \"Children\", ...moreProps };\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: const otherProps = { children: \"Children\" }; const { a, b...", async ({ task }) => {
      const code = `
        const otherProps = { children: "Children" };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 6)\n\n--- Source code under test ---\n\n        const otherProps = { children: \"Children\" };\n        const { a, b, ...props } = otherProps;\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <Hello>Children</Hello>", async ({ task }) => {
      const code = `<Hello>Children</Hello>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 7)\n\n--- Source code under test ---\n<Hello>Children</Hello>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }} />", async ({ task }) => {
      const code = `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 8)\n\n--- Source code under test ---\n<Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}> </He...", async ({ task }) => {
      const code = `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
        </Hello>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 9)\n\n--- Source code under test ---\n\n        <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}>\n        </Hello>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: React.createElement(\"div\", { dangerouslySetInnerHTML: { _...", async ({ task }) => {
      const code = `React.createElement("div", { dangerouslySetInnerHTML: { __html: "HTML" } });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 10)\n\n--- Source code under test ---\nReact.createElement(\"div\", { dangerouslySetInnerHTML: { __html: \"HTML\" } });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"div\", {}, \"Children\");", async ({ task }) => {
      const code = `React.createElement("div", {}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: React.createElement(\"Hello\", { dangerouslySetInnerHTML: {...", async ({ task }) => {
      const code = `React.createElement("Hello", { dangerouslySetInnerHTML: { __html: "HTML" } });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 12)\n\n--- Source code under test ---\nReact.createElement(\"Hello\", { dangerouslySetInnerHTML: { __html: \"HTML\" } });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(\"Hello\", {}, \"Children\");", async ({ task }) => {
      const code = `React.createElement("Hello", {}, "Children");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"Hello\", {}, \"Children\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <Hello {...undefined}>Children</Hello>", async ({ task }) => {
      const code = `<Hello {...undefined}>Children</Hello>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 14)\n\n--- Source code under test ---\n<Hello {...undefined}>Children</Hello>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: React.createElement(\"Hello\", undefined, \"Children\")", async ({ task }) => {
      const code = `React.createElement("Hello", undefined, "Children")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"Hello\", undefined, \"Children\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: const props = {...props, scratch: {mode: 'edit'}}; const ...", async ({ task }) => {
      const code = `
        const props = {...props, scratch: {mode: 'edit'}};
        const component = shallow(<TaskEditableTitle {...props} />);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: valid (index 16)\n\n--- Source code under test ---\n\n        const props = {...props, scratch: {mode: 'edit'}};\n        const component = shallow(<TaskEditableTitle {...props} />);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div dangerouslySetInnerHTML={{ __html: \"HTML\" }}> Childr...", async ({ task }) => {
      const code = `
        <div dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        <div dangerouslySetInnerHTML={{ __html: \"HTML\" }}>\n          Children\n        </div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[1]: <div dangerouslySetInnerHTML={{ __html: \"HTML\" }} childre...", async ({ task }) => {
      const code = `<div dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 1)\n\n--- Source code under test ---\n<div dangerouslySetInnerHTML={{ __html: \"HTML\" }} children=\"Children\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[2]: const props = { dangerouslySetInnerHTML: { __html: \"HTML\"...", async ({ task }) => {
      const code = `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props}>Children</div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        const props = { dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        <div {...props}>Children</div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[3]: const props = { children: \"Children\", dangerouslySetInner...", async ({ task }) => {
      const code = `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        const props = { children: \"Children\", dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        <div {...props} />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[4]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}> Chil...", async ({ task }) => {
      const code = `
        <Hello dangerouslySetInnerHTML={{ __html: "HTML" }}>
          Children
        </Hello>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}>\n          Children\n        </Hello>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[5]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }} child...", async ({ task }) => {
      const code = `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }} children="Children" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 5)\n\n--- Source code under test ---\n<Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }} children=\"Children\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[6]: <Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}> </He...", async ({ task }) => {
      const code = `<Hello dangerouslySetInnerHTML={{ __html: "HTML" }}> </Hello>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 6)\n\n--- Source code under test ---\n<Hello dangerouslySetInnerHTML={{ __html: \"HTML\" }}> </Hello>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[7]: React.createElement( \"div\", { dangerouslySetInnerHTML: { ...", async ({ task }) => {
      const code = `
        React.createElement(
          "div",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        React.createElement(\n          \"div\",\n          { dangerouslySetInnerHTML: { __html: \"HTML\" } },\n          \"Children\"\n        );\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[8]: React.createElement( \"div\", { dangerouslySetInnerHTML: { ...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[9]: React.createElement( \"Hello\", { dangerouslySetInnerHTML: ...", async ({ task }) => {
      const code = `
        React.createElement(
          "Hello",
          { dangerouslySetInnerHTML: { __html: "HTML" } },
          "Children"
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        React.createElement(\n          \"Hello\",\n          { dangerouslySetInnerHTML: { __html: \"HTML\" } },\n          \"Children\"\n        );\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[10]: React.createElement( \"Hello\", { dangerouslySetInnerHTML: ...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[11]: const props = { dangerouslySetInnerHTML: { __html: \"HTML\"...", async ({ task }) => {
      const code = `
        const props = { dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props, "Children");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        const props = { dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        React.createElement(\"div\", props, \"Children\");\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[12]: const props = { children: \"Children\", dangerouslySetInner...", async ({ task }) => {
      const code = `
        const props = { children: "Children", dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        const props = { children: \"Children\", dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        React.createElement(\"div\", props);\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

    it("invalid[13]: const moreProps = { children: \"Children\" }; const otherPr...", async ({ task }) => {
      const code = `
        const moreProps = { children: "Children" };
        const otherProps = { ...moreProps };
        const props = { ...otherProps, dangerouslySetInnerHTML: { __html: "HTML" } };
        React.createElement("div", props);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-danger-with-children\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        const moreProps = { children: \"Children\" };\n        const otherProps = { ...moreProps };\n        const props = { ...otherProps, dangerouslySetInnerHTML: { __html: \"HTML\" } };\n        React.createElement(\"div\", props);\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: dangerWithChildren): Only set one of `children` or `props.dangerouslySetInnerHTML`\n\nRule message templates:\n  dangerWithChildren: Only set one of `children` or `props.dangerouslySetInnerHTML`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-danger-with-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Only set one of `children` or `props.dangerouslySetInnerHTML`");
    });

  });
});
