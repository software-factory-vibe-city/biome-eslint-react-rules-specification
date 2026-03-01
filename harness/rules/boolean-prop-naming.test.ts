import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Prop name `{{propName}}` doesn’t match rule `{{pattern}}`",
  "Prop name `something` doesn’t match rule `^is[A-Z]([A-Za-z0-9]?)+`",
  "Prop name `somethingElse` doesn’t match rule `^is[A-Z]([A-Za-z0-9]?)+`",
  "Prop name `showScore` doesn’t match rule `^(is|has)[A-Z]([A-Za-z0-9]?)+`",
  "Boolean prop names must begin with either 'is' or 'has'",
  "It is better if your prop (something) matches this pattern: (^is[A-Z]([A-Za-z0-9]?)+)",
  "Prop name `failingItIs` doesn’t match rule `^is[A-Z]([A-Za-z0-9]?)+`",
  "Prop name `enabled` doesn’t match rule `^is[A-Z]([A-Za-z0-9]?)+`",
  "Prop name `enabled` doesn’t match rule `^(is|has)[A-Z]([A-Za-z0-9]?)+`",
  "Prop name `lol` doesn’t match rule `^(is|has)[A-Z]([A-Za-z0-9]?)+`",
  "Prop name `semi` doesn’t match rule `^(is|has)[A-Z]([A-Za-z0-9]?)+`",
];

describe("boolean-prop-naming", () => {
  describe("valid", () => {
    it("valid[0]: var Hello = createReactClass({ propTypes: {isSomething: P...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          propTypes: {isSomething: PropTypes.bool, hasValue: PropTypes.bool},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: boolean-prop-naming\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          propTypes: {isSomething: PropTypes.bool, hasValue: PropTypes.bool},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  patternMismatch: Prop name `{{propName}}` doesn’t match rule `{{pattern}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "boolean-prop-naming", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: var Hello = createReactClass({ propTypes: {isSomething: P...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          propTypes: {isSomething: PropTypes.bool.isRequired, hasValue: PropTypes.bool.isRequired},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: boolean-prop-naming\nType: valid (index 23)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          propTypes: {isSomething: PropTypes.bool.isRequired, hasValue: PropTypes.bool.isRequired},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  patternMismatch: Prop name `{{propName}}` doesn’t match rule `{{pattern}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "boolean-prop-naming", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: class Hello extends React.Component { static propTypes = ...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          static propTypes = {
            isSomething: PropTypes.bool.isRequired,
            hasValue: PropTypes.bool.isRequired
          };

          render() {
            return (
              <div />
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: boolean-prop-naming\nType: valid (index 24)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          static propTypes = {\n            isSomething: PropTypes.bool.isRequired,\n            hasValue: PropTypes.bool.isRequired\n          };\n\n          render() {\n            return (\n              <div />\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  patternMismatch: Prop name `{{propName}}` doesn’t match rule `{{pattern}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "boolean-prop-naming", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: class Hello extends React.Component { render() { return (...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return (
              <div />
            );
          }
        }

        Hello.propTypes = {
          isSomething: PropTypes.bool.isRequired,
          hasValue: PropTypes.bool.isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: boolean-prop-naming\nType: valid (index 25)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return (\n              <div />\n            );\n          }\n        }\n\n        Hello.propTypes = {\n          isSomething: PropTypes.bool.isRequired,\n          hasValue: PropTypes.bool.isRequired\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  patternMismatch: Prop name `{{propName}}` doesn’t match rule `{{pattern}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "boolean-prop-naming", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: class Hello extends React.Component { render() { return (...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return (
              <div />
            );
          }
        }

        Hello.propTypes = {
          isSomething: PropTypes.bool.isRequired,
          nested: PropTypes.shape({
            isWorking: PropTypes.bool
          })
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: boolean-prop-naming\nType: valid (index 28)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return (\n              <div />\n            );\n          }\n        }\n\n        Hello.propTypes = {\n          isSomething: PropTypes.bool.isRequired,\n          nested: PropTypes.shape({\n            isWorking: PropTypes.bool\n          })\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  patternMismatch: Prop name `{{propName}}` doesn’t match rule `{{pattern}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "boolean-prop-naming", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: // Strip @jsx comments, see https://github.com/microsoft/...", async ({ task }) => {
      const code = `
        // Strip @jsx comments, see https://github.com/microsoft/fluentui/issues/29126
        const resultCode = result.code
          .replace('/** @jsxRuntime automatic */', '')
          .replace('/** @jsxImportSource @fluentui/react-jsx-runtime */', '');
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: boolean-prop-naming\nType: valid (index 38)\n\n--- Source code under test ---\n\n        // Strip @jsx comments, see https://github.com/microsoft/fluentui/issues/29126\n        const resultCode = result.code\n          .replace('/** @jsxRuntime automatic */', '')\n          .replace('/** @jsxImportSource @fluentui/react-jsx-runtime */', '');\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  patternMismatch: Prop name `{{propName}}` doesn’t match rule `{{pattern}}`";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "boolean-prop-naming", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

});
