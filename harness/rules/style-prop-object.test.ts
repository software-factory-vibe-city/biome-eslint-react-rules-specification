import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Style prop value must be an object",
];

describe("style-prop-object", () => {
  describe("valid", () => {
    it("valid[0]: <div style={{ color: \"red\" }} />", async ({ task }) => {
      const code = `<div style={{ color: "red" }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 0)\n\n--- Source code under test ---\n<div style={{ color: \"red\" }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <Hello style={{ color: \"red\" }} />", async ({ task }) => {
      const code = `<Hello style={{ color: "red" }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 1)\n\n--- Source code under test ---\n<Hello style={{ color: \"red\" }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: function redDiv() { const styles = { color: \"red\" }; retu...", async ({ task }) => {
      const code = `
        function redDiv() {
          const styles = { color: "red" };
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 2)\n\n--- Source code under test ---\n\n        function redDiv() {\n          const styles = { color: \"red\" };\n          return <div style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: function redDiv() { const styles = { color: \"red\" }; retu...", async ({ task }) => {
      const code = `
        function redDiv() {
          const styles = { color: "red" };
          return <Hello style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 3)\n\n--- Source code under test ---\n\n        function redDiv() {\n          const styles = { color: \"red\" };\n          return <Hello style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: const styles = { color: \"red\" }; function redDiv() { retu...", async ({ task }) => {
      const code = `
        const styles = { color: "red" };
        function redDiv() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 4)\n\n--- Source code under test ---\n\n        const styles = { color: \"red\" };\n        function redDiv() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: function redDiv(props) { return <div style={props.styles}...", async ({ task }) => {
      const code = `
        function redDiv(props) {
          return <div style={props.styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 5)\n\n--- Source code under test ---\n\n        function redDiv(props) {\n          return <div style={props.styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: import styles from './styles'; function redDiv() { return...", async ({ task }) => {
      const code = `
        import styles from './styles';
        function redDiv() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 6)\n\n--- Source code under test ---\n\n        import styles from './styles';\n        function redDiv() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: import mystyles from './styles'; const styles = Object.as...", async ({ task }) => {
      const code = `
        import mystyles from './styles';
        const styles = Object.assign({ color: 'red' }, mystyles);
        function redDiv() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 7)\n\n--- Source code under test ---\n\n        import mystyles from './styles';\n        const styles = Object.assign({ color: 'red' }, mystyles);\n        function redDiv() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: const otherProps = { style: { color: \"red\" } }; const { a...", async ({ task }) => {
      const code = `
        const otherProps = { style: { color: "red" } };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 8)\n\n--- Source code under test ---\n\n        const otherProps = { style: { color: \"red\" } };\n        const { a, b, ...props } = otherProps;\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const styles = Object.assign({ color: 'red' }, mystyles);...", async ({ task }) => {
      const code = `
        const styles = Object.assign({ color: 'red' }, mystyles);
        React.createElement("div", { style: styles });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 9)\n\n--- Source code under test ---\n\n        const styles = Object.assign({ color: 'red' }, mystyles);\n        React.createElement(\"div\", { style: styles });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <div style></div>", async ({ task }) => {
      const code = `<div style></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 10)\n\n--- Source code under test ---\n<div style></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(MyCustomElem, { [style]: true }, 'My ...", async ({ task }) => {
      const code = `
        React.createElement(MyCustomElem, {
          [style]: true
        }, 'My custom Elem')
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 11)\n\n--- Source code under test ---\n\n        React.createElement(MyCustomElem, {\n          [style]: true\n        }, 'My custom Elem')\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: let style; <div style={style}></div>", async ({ task }) => {
      const code = `
        let style;
        <div style={style}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 12)\n\n--- Source code under test ---\n\n        let style;\n        <div style={style}></div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: let style = null; <div style={style}></div>", async ({ task }) => {
      const code = `
        let style = null;
        <div style={style}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 13)\n\n--- Source code under test ---\n\n        let style = null;\n        <div style={style}></div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: let style = undefined; <div style={style}></div>", async ({ task }) => {
      const code = `
        let style = undefined;
        <div style={style}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 14)\n\n--- Source code under test ---\n\n        let style = undefined;\n        <div style={style}></div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <div style={undefined}></div>", async ({ task }) => {
      const code = `<div style={undefined}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 15)\n\n--- Source code under test ---\n<div style={undefined}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: const props = { style: undefined }; <div {...props} />", async ({ task }) => {
      const code = `
        const props = { style: undefined };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 16)\n\n--- Source code under test ---\n\n        const props = { style: undefined };\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: const otherProps = { style: undefined }; const { a, b, .....", async ({ task }) => {
      const code = `
        const otherProps = { style: undefined };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 17)\n\n--- Source code under test ---\n\n        const otherProps = { style: undefined };\n        const { a, b, ...props } = otherProps;\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: React.createElement(\"div\", { style: undefined })", async ({ task }) => {
      const code = `
        React.createElement("div", {
          style: undefined
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 18)\n\n--- Source code under test ---\n\n        React.createElement(\"div\", {\n          style: undefined\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: let style; React.createElement(\"div\", { style })", async ({ task }) => {
      const code = `
        let style;
        React.createElement("div", {
          style
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 19)\n\n--- Source code under test ---\n\n        let style;\n        React.createElement(\"div\", {\n          style\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <div style={null}></div>", async ({ task }) => {
      const code = `<div style={null}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 20)\n\n--- Source code under test ---\n<div style={null}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: const props = { style: null }; <div {...props} />", async ({ task }) => {
      const code = `
        const props = { style: null };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 21)\n\n--- Source code under test ---\n\n        const props = { style: null };\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: const otherProps = { style: null }; const { a, b, ...prop...", async ({ task }) => {
      const code = `
        const otherProps = { style: null };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 22)\n\n--- Source code under test ---\n\n        const otherProps = { style: null };\n        const { a, b, ...props } = otherProps;\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: React.createElement(\"div\", { style: null })", async ({ task }) => {
      const code = `
        React.createElement("div", {
          style: null
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 23)\n\n--- Source code under test ---\n\n        React.createElement(\"div\", {\n          style: null\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: const MyComponent = (props) => { React.createElement(MyCu...", async ({ task }) => {
      const code = `
        const MyComponent = (props) => {
          React.createElement(MyCustomElem, {
            ...props
          });
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 24)\n\n--- Source code under test ---\n\n        const MyComponent = (props) => {\n          React.createElement(MyCustomElem, {\n            ...props\n          });\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div style=\"color: 'red'\" />", async ({ task }) => {
      const code = `<div style="color: 'red'" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 0)\n\n--- Source code under test ---\n<div style=\"color: 'red'\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[1]: <Hello style=\"color: 'red'\" />", async ({ task }) => {
      const code = `<Hello style="color: 'red'" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 1)\n\n--- Source code under test ---\n<Hello style=\"color: 'red'\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[2]: <div style={true} />", async ({ task }) => {
      const code = `<div style={true} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 2)\n\n--- Source code under test ---\n<div style={true} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[3]: const styles = 'color: \"red\"'; function redDiv2() { retur...", async ({ task }) => {
      const code = `
        const styles = 'color: "red"';
        function redDiv2() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        const styles = 'color: \"red\"';\n        function redDiv2() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[4]: const styles = 'color: \"red\"'; function redDiv2() { retur...", async ({ task }) => {
      const code = `
        const styles = 'color: "red"';
        function redDiv2() {
          return <Hello style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        const styles = 'color: \"red\"';\n        function redDiv2() {\n          return <Hello style={styles} />;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[5]: const styles = true; function redDiv() { return <div styl...", async ({ task }) => {
      const code = `
        const styles = true;
        function redDiv() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        const styles = true;\n        function redDiv() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "style-prop-object", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

  });
});
