import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "style-prop-object";
const VALID_COUNT = 25;

const RULE_MESSAGES = [
  "Style prop value must be an object",
];

const cases = [
  { code: `<div style={{ color: "red" }} />`, filename: "test.jsx" },
  { code: `<Hello style={{ color: "red" }} />`, filename: "test.jsx" },
  { code: `
        function redDiv() {
          const styles = { color: "red" };
          return <div style={styles} />;
        }
      `, filename: "test.jsx" },
  { code: `
        function redDiv() {
          const styles = { color: "red" };
          return <Hello style={styles} />;
        }
      `, filename: "test.jsx" },
  { code: `
        const styles = { color: "red" };
        function redDiv() {
          return <div style={styles} />;
        }
      `, filename: "test.jsx" },
  { code: `
        function redDiv(props) {
          return <div style={props.styles} />;
        }
      `, filename: "test.jsx" },
  { code: `
        import styles from './styles';
        function redDiv() {
          return <div style={styles} />;
        }
      `, filename: "test.jsx" },
  { code: `
        import mystyles from './styles';
        const styles = Object.assign({ color: 'red' }, mystyles);
        function redDiv() {
          return <div style={styles} />;
        }
      `, filename: "test.jsx" },
  { code: `
        const otherProps = { style: { color: "red" } };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `
        const styles = Object.assign({ color: 'red' }, mystyles);
        React.createElement("div", { style: styles });
      `, filename: "test.jsx" },
  { code: `<div style></div>`, filename: "test.jsx" },
  { code: `
        React.createElement(MyCustomElem, {
          [style]: true
        }, 'My custom Elem')
      `, filename: "test.jsx" },
  { code: `
        let style;
        <div style={style}></div>
      `, filename: "test.jsx" },
  { code: `
        let style = null;
        <div style={style}></div>
      `, filename: "test.jsx" },
  { code: `
        let style = undefined;
        <div style={style}></div>
      `, filename: "test.jsx" },
  { code: `<div style={undefined}></div>`, filename: "test.jsx" },
  { code: `
        const props = { style: undefined };
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `
        const otherProps = { style: undefined };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `
        React.createElement("div", {
          style: undefined
        })
      `, filename: "test.jsx" },
  { code: `
        let style;
        React.createElement("div", {
          style
        })
      `, filename: "test.jsx" },
  { code: `<div style={null}></div>`, filename: "test.jsx" },
  { code: `
        const props = { style: null };
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `
        const otherProps = { style: null };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `, filename: "test.jsx" },
  { code: `
        React.createElement("div", {
          style: null
        })
      `, filename: "test.jsx" },
  { code: `
        const MyComponent = (props) => {
          React.createElement(MyCustomElem, {
            ...props
          });
        };
      `, filename: "test.jsx" },
  { code: `<div style="color: 'red'" />`, filename: "test.jsx" },
  { code: `<Hello style="color: 'red'" />`, filename: "test.jsx" },
  { code: `<div style={true} />`, filename: "test.jsx" },
  { code: `
        const styles = 'color: "red"';
        function redDiv2() {
          return <div style={styles} />;
        }
      `, filename: "test.jsx" },
  { code: `
        const styles = 'color: "red"';
        function redDiv2() {
          return <Hello style={styles} />;
        }
      `, filename: "test.jsx" },
  { code: `
        const styles = true;
        function redDiv() {
          return <div style={styles} />;
        }
      `, filename: "test.jsx" },
];

describe("style-prop-object", () => {
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
    it("valid[0]: <div style={{ color: \"red\" }} />", ({ task }) => {
      const code = `<div style={{ color: "red" }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 0)\n\n--- Source code under test ---\n<div style={{ color: \"red\" }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <Hello style={{ color: \"red\" }} />", ({ task }) => {
      const code = `<Hello style={{ color: "red" }} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 1)\n\n--- Source code under test ---\n<Hello style={{ color: \"red\" }} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: function redDiv() { const styles = { color: \"red\" }; retu...", ({ task }) => {
      const code = `
        function redDiv() {
          const styles = { color: "red" };
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 2)\n\n--- Source code under test ---\n\n        function redDiv() {\n          const styles = { color: \"red\" };\n          return <div style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: function redDiv() { const styles = { color: \"red\" }; retu...", ({ task }) => {
      const code = `
        function redDiv() {
          const styles = { color: "red" };
          return <Hello style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 3)\n\n--- Source code under test ---\n\n        function redDiv() {\n          const styles = { color: \"red\" };\n          return <Hello style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: const styles = { color: \"red\" }; function redDiv() { retu...", ({ task }) => {
      const code = `
        const styles = { color: "red" };
        function redDiv() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 4)\n\n--- Source code under test ---\n\n        const styles = { color: \"red\" };\n        function redDiv() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: function redDiv(props) { return <div style={props.styles}...", ({ task }) => {
      const code = `
        function redDiv(props) {
          return <div style={props.styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 5)\n\n--- Source code under test ---\n\n        function redDiv(props) {\n          return <div style={props.styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: import styles from './styles'; function redDiv() { return...", ({ task }) => {
      const code = `
        import styles from './styles';
        function redDiv() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 6)\n\n--- Source code under test ---\n\n        import styles from './styles';\n        function redDiv() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: import mystyles from './styles'; const styles = Object.as...", ({ task }) => {
      const code = `
        import mystyles from './styles';
        const styles = Object.assign({ color: 'red' }, mystyles);
        function redDiv() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 7)\n\n--- Source code under test ---\n\n        import mystyles from './styles';\n        const styles = Object.assign({ color: 'red' }, mystyles);\n        function redDiv() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: const otherProps = { style: { color: \"red\" } }; const { a...", ({ task }) => {
      const code = `
        const otherProps = { style: { color: "red" } };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 8)\n\n--- Source code under test ---\n\n        const otherProps = { style: { color: \"red\" } };\n        const { a, b, ...props } = otherProps;\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const styles = Object.assign({ color: 'red' }, mystyles);...", ({ task }) => {
      const code = `
        const styles = Object.assign({ color: 'red' }, mystyles);
        React.createElement("div", { style: styles });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 9)\n\n--- Source code under test ---\n\n        const styles = Object.assign({ color: 'red' }, mystyles);\n        React.createElement(\"div\", { style: styles });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <div style></div>", ({ task }) => {
      const code = `<div style></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 10)\n\n--- Source code under test ---\n<div style></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(MyCustomElem, { [style]: true }, 'My ...", ({ task }) => {
      const code = `
        React.createElement(MyCustomElem, {
          [style]: true
        }, 'My custom Elem')
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 11)\n\n--- Source code under test ---\n\n        React.createElement(MyCustomElem, {\n          [style]: true\n        }, 'My custom Elem')\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: let style; <div style={style}></div>", ({ task }) => {
      const code = `
        let style;
        <div style={style}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 12)\n\n--- Source code under test ---\n\n        let style;\n        <div style={style}></div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: let style = null; <div style={style}></div>", ({ task }) => {
      const code = `
        let style = null;
        <div style={style}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 13)\n\n--- Source code under test ---\n\n        let style = null;\n        <div style={style}></div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: let style = undefined; <div style={style}></div>", ({ task }) => {
      const code = `
        let style = undefined;
        <div style={style}></div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 14)\n\n--- Source code under test ---\n\n        let style = undefined;\n        <div style={style}></div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <div style={undefined}></div>", ({ task }) => {
      const code = `<div style={undefined}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 15)\n\n--- Source code under test ---\n<div style={undefined}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: const props = { style: undefined }; <div {...props} />", ({ task }) => {
      const code = `
        const props = { style: undefined };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 16)\n\n--- Source code under test ---\n\n        const props = { style: undefined };\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: const otherProps = { style: undefined }; const { a, b, .....", ({ task }) => {
      const code = `
        const otherProps = { style: undefined };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 17)\n\n--- Source code under test ---\n\n        const otherProps = { style: undefined };\n        const { a, b, ...props } = otherProps;\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: React.createElement(\"div\", { style: undefined })", ({ task }) => {
      const code = `
        React.createElement("div", {
          style: undefined
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 18)\n\n--- Source code under test ---\n\n        React.createElement(\"div\", {\n          style: undefined\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: let style; React.createElement(\"div\", { style })", ({ task }) => {
      const code = `
        let style;
        React.createElement("div", {
          style
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 19)\n\n--- Source code under test ---\n\n        let style;\n        React.createElement(\"div\", {\n          style\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <div style={null}></div>", ({ task }) => {
      const code = `<div style={null}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 20)\n\n--- Source code under test ---\n<div style={null}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: const props = { style: null }; <div {...props} />", ({ task }) => {
      const code = `
        const props = { style: null };
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 21)\n\n--- Source code under test ---\n\n        const props = { style: null };\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: const otherProps = { style: null }; const { a, b, ...prop...", ({ task }) => {
      const code = `
        const otherProps = { style: null };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 22)\n\n--- Source code under test ---\n\n        const otherProps = { style: null };\n        const { a, b, ...props } = otherProps;\n        <div {...props} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: React.createElement(\"div\", { style: null })", ({ task }) => {
      const code = `
        React.createElement("div", {
          style: null
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 23)\n\n--- Source code under test ---\n\n        React.createElement(\"div\", {\n          style: null\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: const MyComponent = (props) => { React.createElement(MyCu...", ({ task }) => {
      const code = `
        const MyComponent = (props) => {
          React.createElement(MyCustomElem, {
            ...props
          });
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: valid (index 24)\n\n--- Source code under test ---\n\n        const MyComponent = (props) => {\n          React.createElement(MyCustomElem, {\n            ...props\n          });\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <div style=\"color: 'red'\" />", ({ task }) => {
      const code = `<div style="color: 'red'" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 0)\n\n--- Source code under test ---\n<div style=\"color: 'red'\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[1]: <Hello style=\"color: 'red'\" />", ({ task }) => {
      const code = `<Hello style="color: 'red'" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 1)\n\n--- Source code under test ---\n<Hello style=\"color: 'red'\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[2]: <div style={true} />", ({ task }) => {
      const code = `<div style={true} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 2)\n\n--- Source code under test ---\n<div style={true} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[3]: const styles = 'color: \"red\"'; function redDiv2() { retur...", ({ task }) => {
      const code = `
        const styles = 'color: "red"';
        function redDiv2() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        const styles = 'color: \"red\"';\n        function redDiv2() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[4]: const styles = 'color: \"red\"'; function redDiv2() { retur...", ({ task }) => {
      const code = `
        const styles = 'color: "red"';
        function redDiv2() {
          return <Hello style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        const styles = 'color: \"red\"';\n        function redDiv2() {\n          return <Hello style={styles} />;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

    it("invalid[5]: const styles = true; function redDiv() { return <div styl...", ({ task }) => {
      const code = `
        const styles = true;
        function redDiv() {
          return <div style={styles} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: style-prop-object\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        const styles = true;\n        function redDiv() {\n          return <div style={styles} />;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: stylePropNotObject): Style prop value must be an object\n\nRule message templates:\n  stylePropNotObject: Style prop value must be an object";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Style prop value must be an object");
    });

  });
});
