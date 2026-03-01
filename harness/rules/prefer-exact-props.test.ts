import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Component propTypes should be exact by using {{exactPropWrappers}}.",
  "Component flow props should be set with exact objects.",
  "Component propTypes should be exact by using 'exact'.",
  "Component propTypes should be exact by using one of 'exact', 'forbidExtraProps'.",
];

describe("prefer-exact-props", () => {
  describe("valid", () => {
    it("valid[4]: function Component(props: {}) { return <div />; }", async ({ task }) => {
      const code = `
        function Component(props: {}) {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-exact-props\nType: valid (index 4)\n\n--- Source code under test ---\n\n        function Component(props: {}) {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types\n\nRule message templates:\n  propTypes: Component propTypes should be exact by using {{exactPropWrappers}}.\n  flow: Component flow props should be set with exact objects.";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "prefer-exact-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: type Props = {} function Component(props: Props) { return...", async ({ task }) => {
      const code = `
        type Props = {}
        function Component(props: Props) {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-exact-props\nType: valid (index 8)\n\n--- Source code under test ---\n\n        type Props = {}\n        function Component(props: Props) {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types\n\nRule message templates:\n  propTypes: Component propTypes should be exact by using {{exactPropWrappers}}.\n  flow: Component flow props should be set with exact objects.";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "prefer-exact-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: import type Props from 'foo'; function Component(props: P...", async ({ task }) => {
      const code = `
        import type Props from 'foo';
        function Component(props: Props) {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-exact-props\nType: valid (index 9)\n\n--- Source code under test ---\n\n        import type Props from 'foo';\n        function Component(props: Props) {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types\n\nRule message templates:\n  propTypes: Component propTypes should be exact by using {{exactPropWrappers}}.\n  flow: Component flow props should be set with exact objects.";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "prefer-exact-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: class Component extends React.Component { state = {hi: 'h...", async ({ task }) => {
      const code = `
        class Component extends React.Component {
          state = {hi: 'hi'}
          render() {
            return <div>{this.state.hi}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-exact-props\nType: valid (index 13)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          state = {hi: 'hi'}\n          render() {\n            return <div>{this.state.hi}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  propTypes: Component propTypes should be exact by using {{exactPropWrappers}}.\n  flow: Component flow props should be set with exact objects.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-exact-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: function Component({ foo, bar }) { return <div>{foo}{bar}...", async ({ task }) => {
      const code = `
        function Component({ foo, bar }) {
          return <div>{foo}{bar}</div>;
        }
        Component.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-exact-props\nType: valid (index 15)\n\n--- Source code under test ---\n\n        function Component({ foo, bar }) {\n          return <div>{foo}{bar}</div>;\n        }\n        Component.propTypes = {\n          foo: PropTypes.string,\n          bar: PropTypes.string,\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  propTypes: Component propTypes should be exact by using {{exactPropWrappers}}.\n  flow: Component flow props should be set with exact objects.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-exact-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: class Component extends React.Component { render() { cons...", async ({ task }) => {
      const code = `
        class Component extends React.Component {
          render() {
            const { foo, bar } = this.props;
            return <div>{foo}{bar}</div>;
          }
        }
        Component.propTypes = {
          foo: PropTypes.string,
          bar: PropTypes.string,
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-exact-props\nType: valid (index 16)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          render() {\n            const { foo, bar } = this.props;\n            return <div>{foo}{bar}</div>;\n          }\n        }\n        Component.propTypes = {\n          foo: PropTypes.string,\n          bar: PropTypes.string,\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  propTypes: Component propTypes should be exact by using {{exactPropWrappers}}.\n  flow: Component flow props should be set with exact objects.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-exact-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: import somethingElse from \"something-else\"; const props =...", async ({ task }) => {
      const code = `
        import somethingElse from "something-else";
        const props = {
          foo: PropTypes.string,
          bar: PropTypes.shape({
            baz: PropTypes.string
          })
        };
        class Component extends React.Component {
          render() {
            return <div />;
          }
        }
        Component.propTypes = somethingElse(props);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-exact-props\nType: valid (index 17)\n\n--- Source code under test ---\n\n        import somethingElse from \"something-else\";\n        const props = {\n          foo: PropTypes.string,\n          bar: PropTypes.shape({\n            baz: PropTypes.string\n          })\n        };\n        class Component extends React.Component {\n          render() {\n            return <div />;\n          }\n        }\n        Component.propTypes = somethingElse(props);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  propTypes: Component propTypes should be exact by using {{exactPropWrappers}}.\n  flow: Component flow props should be set with exact objects.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-exact-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: import somethingElse from \"something-else\"; const props =...", async ({ task }) => {
      const code = `
        import somethingElse from "something-else";
        const props =
        class Component extends React.Component {
          static propTypes = somethingElse({
            foo: PropTypes.string,
            bar: PropTypes.shape({
              baz: PropTypes.string
            })
          });
          render() {
            return <div />;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-exact-props\nType: valid (index 18)\n\n--- Source code under test ---\n\n        import somethingElse from \"something-else\";\n        const props =\n        class Component extends React.Component {\n          static propTypes = somethingElse({\n            foo: PropTypes.string,\n            bar: PropTypes.shape({\n              baz: PropTypes.string\n            })\n          });\n          render() {\n            return <div />;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  propTypes: Component propTypes should be exact by using {{exactPropWrappers}}.\n  flow: Component flow props should be set with exact objects.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "prefer-exact-props", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

});
