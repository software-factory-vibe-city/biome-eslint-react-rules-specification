import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "forbid-component-props";
const VALID_COUNT = 5;

const RULE_MESSAGES = [
  "Prop \"{{prop}}\" is forbidden on Components",
  "Prop \"className\" is forbidden on Components",
  "Prop \"style\" is forbidden on Components",
  "Please use ourCoolClassName instead of ClassName",
  "Avoid using option",
  "Prop \"kebab-case-prop\" is forbidden on Components",
  "Avoid using kebab-case",
  "className available only for icons",
  "style available only for SVGs",
  "Avoid using className for SomeSvg and components that match the `UI*` and `*Icon` patterns",
];

const cases = [
  { code: `
        var First = createReactClass({
          render: function() {
            return <div className="foo" />;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo bar="baz" />;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <this.Foo bar="baz" />;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        const First = (props) => (
          <this.Foo {...props} />
        );
      `, filename: "test.jsx" },
  { code: `
        <fbt:param name="Total number of files" number={true} />
      `, filename: "test.jsx" },
  { code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo style={{color: "red"}} />;
          }
        });
      `, filename: "test.jsx" },
];

describe("forbid-component-props", () => {
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
    it("valid[0]: var First = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
        var First = createReactClass({
          render: function() {
            return <div className="foo" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-component-props\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          render: function() {\n            return <div className=\"foo\" />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  propIsForbidden: Prop \"{{prop}}\" is forbidden on Components";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var First = createReactClass({ propTypes: externalPropTyp...", ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo bar="baz" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-component-props\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: externalPropTypes,\n          render: function() {\n            return <Foo bar=\"baz\" />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  propIsForbidden: Prop \"{{prop}}\" is forbidden on Components";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var First = createReactClass({ propTypes: externalPropTyp...", ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <this.Foo bar="baz" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-component-props\nType: valid (index 5)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: externalPropTypes,\n          render: function() {\n            return <this.Foo bar=\"baz\" />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  propIsForbidden: Prop \"{{prop}}\" is forbidden on Components";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: const First = (props) => ( <this.Foo {...props} /> );", ({ task }) => {
      const code = `
        const First = (props) => (
          <this.Foo {...props} />
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-component-props\nType: valid (index 7)\n\n--- Source code under test ---\n\n        const First = (props) => (\n          <this.Foo {...props} />\n        );\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  propIsForbidden: Prop \"{{prop}}\" is forbidden on Components";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <fbt:param name=\"Total number of files\" number={true} />", ({ task }) => {
      const code = `
        <fbt:param name="Total number of files" number={true} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-component-props\nType: valid (index 12)\n\n--- Source code under test ---\n\n        <fbt:param name=\"Total number of files\" number={true} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: jsx namespace\n\nRule message templates:\n  propIsForbidden: Prop \"{{prop}}\" is forbidden on Components";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var First = createReactClass({ propTypes: externalPropTyp...", ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-component-props\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: externalPropTypes,\n          render: function() {\n            return <Foo className=\"bar\" />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: propIsForbidden): Prop \"className\" is forbidden on Components\n\nRule message templates:\n  propIsForbidden: Prop \"{{prop}}\" is forbidden on Components";
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop \"className\" is forbidden on Components");
    });

    it("invalid[1]: var First = createReactClass({ propTypes: externalPropTyp...", ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <Foo style={{color: "red"}} />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-component-props\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: externalPropTypes,\n          render: function() {\n            return <Foo style={{color: \"red\"}} />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: propIsForbidden): Prop \"style\" is forbidden on Components\n\nRule message templates:\n  propIsForbidden: Prop \"{{prop}}\" is forbidden on Components";
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop \"style\" is forbidden on Components");
    });

  });
});
