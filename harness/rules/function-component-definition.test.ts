import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Function component is not a function declaration",
  "Function component is not a function expression",
  "Function component is not an arrow function",
];

describe("function-component-definition", () => {
  describe("valid", () => {
    it("valid[55]: export default (key, subTree = {}) => { return (state) =>...", async ({ task }) => {
      const code = `
        export default (key, subTree = {}) => {
          return (state) => {
            const dataInStore = getFromDataModel(key)(state);
            const fullPaths = dataInStore.map((item, index) => {
              return [key, index];
            });

            return {
              key,
              paths: fullPaths.map((p) => [p[1]]),
              fullPaths,
              subTree: Object.keys(subTree).length ? subTree : null,
            }
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: function-component-definition\nType: valid (index 55)\n\n--- Source code under test ---\n\n        export default (key, subTree = {}) => {\n          return (state) => {\n            const dataInStore = getFromDataModel(key)(state);\n            const fullPaths = dataInStore.map((item, index) => {\n              return [key, index];\n            });\n\n            return {\n              key,\n              paths: fullPaths.map((p) => [p[1]]),\n              fullPaths,\n              subTree: Object.keys(subTree).length ? subTree : null,\n            }\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  function-declaration: Function component is not a function declaration\n  function-expression: Function component is not a function expression\n  arrow-function: Function component is not an arrow function";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "function-component-definition", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[56]: function mapStateToProps() { const internItems = makeInte...", async ({ task }) => {
      const code = `
        function mapStateToProps() {
          const internItems = makeInternArray();
          const internClassList = makeInternArray();

          return (state, props) => {
            const { store, bucket, singleCharacter } = props;

            return {
              store: null,
              destinyVersion: store.destinyVersion,
              storeId: store.id,
            }
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: function-component-definition\nType: valid (index 56)\n\n--- Source code under test ---\n\n        function mapStateToProps() {\n          const internItems = makeInternArray();\n          const internClassList = makeInternArray();\n\n          return (state, props) => {\n            const { store, bucket, singleCharacter } = props;\n\n            return {\n              store: null,\n              destinyVersion: store.destinyVersion,\n              storeId: store.id,\n            }\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  function-declaration: Function component is not a function declaration\n  function-expression: Function component is not a function expression\n  arrow-function: Function component is not an arrow function";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "function-component-definition", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

});
