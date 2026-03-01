import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Void DOM element <{{element}} /> cannot receive children.",
  "Void DOM element <br /> cannot receive children.",
  "Void DOM element <img /> cannot receive children.",
];

describe("void-dom-elements-no-children", () => {
  describe("valid", () => {
    it("valid[0]: <div>Foo</div>;", async ({ task }) => {
      const code = `<div>Foo</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 0)\n\n--- Source code under test ---\n<div>Foo</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <div children=\"Foo\" />;", async ({ task }) => {
      const code = `<div children="Foo" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 1)\n\n--- Source code under test ---\n<div children=\"Foo\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <div dangerouslySetInnerHTML={{ __html: \"Foo\" }} />;", async ({ task }) => {
      const code = `<div dangerouslySetInnerHTML={{ __html: "Foo" }} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 2)\n\n--- Source code under test ---\n<div dangerouslySetInnerHTML={{ __html: \"Foo\" }} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: React.createElement(\"div\", {}, \"Foo\");", async ({ task }) => {
      const code = `React.createElement("div", {}, "Foo");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, \"Foo\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: React.createElement(\"div\", { children: \"Foo\" });", async ({ task }) => {
      const code = `React.createElement("div", { children: "Foo" });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 4)\n\n--- Source code under test ---\nReact.createElement(\"div\", { children: \"Foo\" });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"div\", { dangerouslySetInnerHTML: { _...", async ({ task }) => {
      const code = `React.createElement("div", { dangerouslySetInnerHTML: { __html: "Foo" } });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"div\", { dangerouslySetInnerHTML: { __html: \"Foo\" } });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: document.createElement(\"img\");", async ({ task }) => {
      const code = `document.createElement("img");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 6)\n\n--- Source code under test ---\ndocument.createElement(\"img\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: React.createElement(\"img\");", async ({ task }) => {
      const code = `React.createElement("img");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"img\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: React.createElement();", async ({ task }) => {
      const code = `React.createElement();`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 8)\n\n--- Source code under test ---\nReact.createElement();\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: document.createElement();", async ({ task }) => {
      const code = `document.createElement();`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 9)\n\n--- Source code under test ---\ndocument.createElement();\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: const props = {}; React.createElement(\"img\", props);", async ({ task }) => {
      const code = `
        const props = {};
        React.createElement("img", props);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 10)\n\n--- Source code under test ---\n\n        const props = {};\n        React.createElement(\"img\", props);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: import React, {createElement} from \"react\"; createElement...", async ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("div");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 11)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"div\");\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: import React, {createElement} from \"react\"; createElement...", async ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("img");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 12)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"img\");\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: import React, {createElement, PureComponent} from \"react\"...", async ({ task }) => {
      const code = `
        import React, {createElement, PureComponent} from "react";
        class Button extends PureComponent {
          handleClick(ev) {
            ev.preventDefault();
          }
          render() {
            return <div onClick={this.handleClick}>Hello</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 13)\n\n--- Source code under test ---\n\n        import React, {createElement, PureComponent} from \"react\";\n        class Button extends PureComponent {\n          handleClick(ev) {\n            ev.preventDefault();\n          }\n          render() {\n            return <div onClick={this.handleClick}>Hello</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <br>Foo</br>;", async ({ task }) => {
      const code = `<br>Foo</br>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 0)\n\n--- Source code under test ---\n<br>Foo</br>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[1]: <br children=\"Foo\" />;", async ({ task }) => {
      const code = `<br children="Foo" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 1)\n\n--- Source code under test ---\n<br children=\"Foo\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[2]: <img {...props} children=\"Foo\" />;", async ({ task }) => {
      const code = `<img {...props} children="Foo" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 2)\n\n--- Source code under test ---\n<img {...props} children=\"Foo\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <img /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <img /> cannot receive children.");
    });

    it("invalid[3]: <br dangerouslySetInnerHTML={{ __html: \"Foo\" }} />;", async ({ task }) => {
      const code = `<br dangerouslySetInnerHTML={{ __html: "Foo" }} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 3)\n\n--- Source code under test ---\n<br dangerouslySetInnerHTML={{ __html: \"Foo\" }} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[4]: React.createElement(\"br\", {}, \"Foo\");", async ({ task }) => {
      const code = `React.createElement("br", {}, "Foo");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 4)\n\n--- Source code under test ---\nReact.createElement(\"br\", {}, \"Foo\");\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[5]: React.createElement(\"br\", { children: \"Foo\" });", async ({ task }) => {
      const code = `React.createElement("br", { children: "Foo" });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"br\", { children: \"Foo\" });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[6]: React.createElement(\"br\", { dangerouslySetInnerHTML: { __...", async ({ task }) => {
      const code = `React.createElement("br", { dangerouslySetInnerHTML: { __html: "Foo" } });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 6)\n\n--- Source code under test ---\nReact.createElement(\"br\", { dangerouslySetInnerHTML: { __html: \"Foo\" } });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[7]: import React, {createElement} from \"react\"; createElement...", async ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("img", {}, "Foo");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"img\", {}, \"Foo\");\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <img /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <img /> cannot receive children.");
    });

    it("invalid[8]: import React, {createElement} from \"react\"; createElement...", async ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("img", { children: "Foo" });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"img\", { children: \"Foo\" });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <img /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <img /> cannot receive children.");
    });

    it("invalid[9]: import React, {createElement} from \"react\"; createElement...", async ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("img", { dangerouslySetInnerHTML: { __html: "Foo" } });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"img\", { dangerouslySetInnerHTML: { __html: \"Foo\" } });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <img /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "void-dom-elements-no-children", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <img /> cannot receive children.");
    });

  });
});
