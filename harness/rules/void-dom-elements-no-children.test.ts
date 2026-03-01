import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "void-dom-elements-no-children";
const VALID_COUNT = 14;

const RULE_MESSAGES = [
  "Void DOM element <{{element}} /> cannot receive children.",
  "Void DOM element <br /> cannot receive children.",
  "Void DOM element <img /> cannot receive children.",
];

const cases = [
  { code: `<div>Foo</div>;`, filename: "test.jsx" },
  { code: `<div children="Foo" />;`, filename: "test.jsx" },
  { code: `<div dangerouslySetInnerHTML={{ __html: "Foo" }} />;`, filename: "test.jsx" },
  { code: `React.createElement("div", {}, "Foo");`, filename: "test.jsx" },
  { code: `React.createElement("div", { children: "Foo" });`, filename: "test.jsx" },
  { code: `React.createElement("div", { dangerouslySetInnerHTML: { __html: "Foo" } });`, filename: "test.jsx" },
  { code: `document.createElement("img");`, filename: "test.jsx" },
  { code: `React.createElement("img");`, filename: "test.jsx" },
  { code: `React.createElement();`, filename: "test.jsx" },
  { code: `document.createElement();`, filename: "test.jsx" },
  { code: `
        const props = {};
        React.createElement("img", props);
      `, filename: "test.jsx" },
  { code: `
        import React, {createElement} from "react";
        createElement("div");
      `, filename: "test.jsx" },
  { code: `
        import React, {createElement} from "react";
        createElement("img");
      `, filename: "test.jsx" },
  { code: `
        import React, {createElement, PureComponent} from "react";
        class Button extends PureComponent {
          handleClick(ev) {
            ev.preventDefault();
          }
          render() {
            return <div onClick={this.handleClick}>Hello</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `<br>Foo</br>;`, filename: "test.jsx" },
  { code: `<br children="Foo" />;`, filename: "test.jsx" },
  { code: `<img {...props} children="Foo" />;`, filename: "test.jsx" },
  { code: `<br dangerouslySetInnerHTML={{ __html: "Foo" }} />;`, filename: "test.jsx" },
  { code: `React.createElement("br", {}, "Foo");`, filename: "test.jsx" },
  { code: `React.createElement("br", { children: "Foo" });`, filename: "test.jsx" },
  { code: `React.createElement("br", { dangerouslySetInnerHTML: { __html: "Foo" } });`, filename: "test.jsx" },
  { code: `
        import React, {createElement} from "react";
        createElement("img", {}, "Foo");
      `, filename: "test.jsx" },
  { code: `
        import React, {createElement} from "react";
        createElement("img", { children: "Foo" });
      `, filename: "test.jsx" },
  { code: `
        import React, {createElement} from "react";
        createElement("img", { dangerouslySetInnerHTML: { __html: "Foo" } });
      `, filename: "test.jsx" },
];

describe("void-dom-elements-no-children", () => {
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
    it("valid[0]: <div>Foo</div>;", ({ task }) => {
      const code = `<div>Foo</div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 0)\n\n--- Source code under test ---\n<div>Foo</div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <div children=\"Foo\" />;", ({ task }) => {
      const code = `<div children="Foo" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 1)\n\n--- Source code under test ---\n<div children=\"Foo\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <div dangerouslySetInnerHTML={{ __html: \"Foo\" }} />;", ({ task }) => {
      const code = `<div dangerouslySetInnerHTML={{ __html: "Foo" }} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 2)\n\n--- Source code under test ---\n<div dangerouslySetInnerHTML={{ __html: \"Foo\" }} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: React.createElement(\"div\", {}, \"Foo\");", ({ task }) => {
      const code = `React.createElement("div", {}, "Foo");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 3)\n\n--- Source code under test ---\nReact.createElement(\"div\", {}, \"Foo\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: React.createElement(\"div\", { children: \"Foo\" });", ({ task }) => {
      const code = `React.createElement("div", { children: "Foo" });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 4)\n\n--- Source code under test ---\nReact.createElement(\"div\", { children: \"Foo\" });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"div\", { dangerouslySetInnerHTML: { _...", ({ task }) => {
      const code = `React.createElement("div", { dangerouslySetInnerHTML: { __html: "Foo" } });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"div\", { dangerouslySetInnerHTML: { __html: \"Foo\" } });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: document.createElement(\"img\");", ({ task }) => {
      const code = `document.createElement("img");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 6)\n\n--- Source code under test ---\ndocument.createElement(\"img\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: React.createElement(\"img\");", ({ task }) => {
      const code = `React.createElement("img");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"img\");\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: React.createElement();", ({ task }) => {
      const code = `React.createElement();`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 8)\n\n--- Source code under test ---\nReact.createElement();\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: document.createElement();", ({ task }) => {
      const code = `document.createElement();`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 9)\n\n--- Source code under test ---\ndocument.createElement();\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: const props = {}; React.createElement(\"img\", props);", ({ task }) => {
      const code = `
        const props = {};
        React.createElement("img", props);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 10)\n\n--- Source code under test ---\n\n        const props = {};\n        React.createElement(\"img\", props);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: import React, {createElement} from \"react\"; createElement...", ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("div");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 11)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"div\");\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: import React, {createElement} from \"react\"; createElement...", ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("img");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: valid (index 12)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"img\");\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: import React, {createElement, PureComponent} from \"react\"...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <br>Foo</br>;", ({ task }) => {
      const code = `<br>Foo</br>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 0)\n\n--- Source code under test ---\n<br>Foo</br>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[1]: <br children=\"Foo\" />;", ({ task }) => {
      const code = `<br children="Foo" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 1)\n\n--- Source code under test ---\n<br children=\"Foo\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[2]: <img {...props} children=\"Foo\" />;", ({ task }) => {
      const code = `<img {...props} children="Foo" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 2)\n\n--- Source code under test ---\n<img {...props} children=\"Foo\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <img /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <img /> cannot receive children.");
    });

    it("invalid[3]: <br dangerouslySetInnerHTML={{ __html: \"Foo\" }} />;", ({ task }) => {
      const code = `<br dangerouslySetInnerHTML={{ __html: "Foo" }} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 3)\n\n--- Source code under test ---\n<br dangerouslySetInnerHTML={{ __html: \"Foo\" }} />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[4]: React.createElement(\"br\", {}, \"Foo\");", ({ task }) => {
      const code = `React.createElement("br", {}, "Foo");`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 4)\n\n--- Source code under test ---\nReact.createElement(\"br\", {}, \"Foo\");\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[5]: React.createElement(\"br\", { children: \"Foo\" });", ({ task }) => {
      const code = `React.createElement("br", { children: "Foo" });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"br\", { children: \"Foo\" });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[6]: React.createElement(\"br\", { dangerouslySetInnerHTML: { __...", ({ task }) => {
      const code = `React.createElement("br", { dangerouslySetInnerHTML: { __html: "Foo" } });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 6)\n\n--- Source code under test ---\nReact.createElement(\"br\", { dangerouslySetInnerHTML: { __html: \"Foo\" } });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <br /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <br /> cannot receive children.");
    });

    it("invalid[7]: import React, {createElement} from \"react\"; createElement...", ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("img", {}, "Foo");
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"img\", {}, \"Foo\");\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <img /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <img /> cannot receive children.");
    });

    it("invalid[8]: import React, {createElement} from \"react\"; createElement...", ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("img", { children: "Foo" });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"img\", { children: \"Foo\" });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <img /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <img /> cannot receive children.");
    });

    it("invalid[9]: import React, {createElement} from \"react\"; createElement...", ({ task }) => {
      const code = `
        import React, {createElement} from "react";
        createElement("img", { dangerouslySetInnerHTML: { __html: "Foo" } });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: void-dom-elements-no-children\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        import React, {createElement} from \"react\";\n        createElement(\"img\", { dangerouslySetInnerHTML: { __html: \"Foo\" } });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noChildrenInVoidEl): Void DOM element <img /> cannot receive children.\n\nRule message templates:\n  noChildrenInVoidEl: Void DOM element <{{element}} /> cannot receive children.";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Void DOM element <img /> cannot receive children.");
    });

  });
});
