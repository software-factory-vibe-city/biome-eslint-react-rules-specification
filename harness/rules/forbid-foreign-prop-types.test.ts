import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Using propTypes from another component is not safe because they may be removed in production builds",
];

describe("forbid-foreign-prop-types", () => {
  describe("valid", () => {
    it("valid[0]: import { propTypes } from \"SomeComponent\";", async ({ task }) => {
      const code = `import { propTypes } from "SomeComponent";`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 0)\n\n--- Source code under test ---\nimport { propTypes } from \"SomeComponent\";\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: import { propTypes as someComponentPropTypes } from \"Some...", async ({ task }) => {
      const code = `import { propTypes as someComponentPropTypes } from "SomeComponent";`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 1)\n\n--- Source code under test ---\nimport { propTypes as someComponentPropTypes } from \"SomeComponent\";\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: const foo = propTypes", async ({ task }) => {
      const code = `const foo = propTypes`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 2)\n\n--- Source code under test ---\nconst foo = propTypes\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: foo(propTypes)", async ({ task }) => {
      const code = `foo(propTypes)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 3)\n\n--- Source code under test ---\nfoo(propTypes)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: foo + propTypes", async ({ task }) => {
      const code = `foo + propTypes`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 4)\n\n--- Source code under test ---\nfoo + propTypes\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: const foo = [propTypes]", async ({ task }) => {
      const code = `const foo = [propTypes]`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 5)\n\n--- Source code under test ---\nconst foo = [propTypes]\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: const foo = { propTypes }", async ({ task }) => {
      const code = `const foo = { propTypes }`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 6)\n\n--- Source code under test ---\nconst foo = { propTypes }\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: Foo.propTypes = propTypes", async ({ task }) => {
      const code = `Foo.propTypes = propTypes`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 7)\n\n--- Source code under test ---\nFoo.propTypes = propTypes\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: Foo[\"propTypes\"] = propTypes", async ({ task }) => {
      const code = `Foo["propTypes"] = propTypes`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 8)\n\n--- Source code under test ---\nFoo[\"propTypes\"] = propTypes\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const propTypes = \"bar\"; Foo[propTypes];", async ({ task }) => {
      const code = `const propTypes = "bar"; Foo[propTypes];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: valid (index 9)\n\n--- Source code under test ---\nconst propTypes = \"bar\"; Foo[propTypes];\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Foo = createReactClass({ propTypes: Bar.propTypes, re...", async ({ task }) => {
      const code = `
        var Foo = createReactClass({
          propTypes: Bar.propTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Foo = createReactClass({\n          propTypes: Bar.propTypes,\n          render: function() {\n            return <Foo className=\"bar\" />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Using propTypes from another component is not safe because they may be removed in production builds\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using propTypes from another component is not safe because they may be removed in production builds");
    });

    it("invalid[1]: var Foo = createReactClass({ propTypes: Bar[\"propTypes\"],...", async ({ task }) => {
      const code = `
        var Foo = createReactClass({
          propTypes: Bar["propTypes"],
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var Foo = createReactClass({\n          propTypes: Bar[\"propTypes\"],\n          render: function() {\n            return <Foo className=\"bar\" />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Using propTypes from another component is not safe because they may be removed in production builds\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using propTypes from another component is not safe because they may be removed in production builds");
    });

    it("invalid[2]: var { propTypes } = SomeComponent var Foo = createReactCl...", async ({ task }) => {
      const code = `
        var { propTypes } = SomeComponent
        var Foo = createReactClass({
          propTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        var { propTypes } = SomeComponent\n        var Foo = createReactClass({\n          propTypes,\n          render: function() {\n            return <Foo className=\"bar\" />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Using propTypes from another component is not safe because they may be removed in production builds\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using propTypes from another component is not safe because they may be removed in production builds");
    });

    it("invalid[3]: var { propTypes: things, ...foo } = SomeComponent var Foo...", async ({ task }) => {
      const code = `
        var { propTypes: things, ...foo } = SomeComponent
        var Foo = createReactClass({
          propTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        var { propTypes: things, ...foo } = SomeComponent\n        var Foo = createReactClass({\n          propTypes,\n          render: function() {\n            return <Foo className=\"bar\" />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Using propTypes from another component is not safe because they may be removed in production builds\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using propTypes from another component is not safe because they may be removed in production builds");
    });

    it("invalid[4]: class MyComponent extends React.Component { static fooBar...", async ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          static fooBar = {
            baz: Qux.propTypes.baz
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          static fooBar = {\n            baz: Qux.propTypes.baz\n          };\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Using propTypes from another component is not safe because they may be removed in production builds\n\nFeatures: class fields, no-ts\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using propTypes from another component is not safe because they may be removed in production builds");
    });

    it("invalid[5]: var { propTypes: typesOfProps } = SomeComponent var Foo =...", async ({ task }) => {
      const code = `
        var { propTypes: typesOfProps } = SomeComponent
        var Foo = createReactClass({
          propTypes: typesOfProps,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-foreign-prop-types\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        var { propTypes: typesOfProps } = SomeComponent\n        var Foo = createReactClass({\n          propTypes: typesOfProps,\n          render: function() {\n            return <Foo className=\"bar\" />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Using propTypes from another component is not safe because they may be removed in production builds\n\nRule message templates:\n  forbiddenPropType: Using propTypes from another component is not safe because they may be removed in production builds";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-foreign-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using propTypes from another component is not safe because they may be removed in production builds");
    });

  });
});
