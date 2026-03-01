import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Prop type \"{{target}}\" is forbidden",
  "Prop type \"any\" is forbidden",
  "Prop type \"number\" is forbidden",
  "Prop type \"array\" is forbidden",
  "Prop type \"object\" is forbidden",
];

describe("forbid-prop-types", () => {
  describe("valid", () => {
    it("valid[0]: var First = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var First = createReactClass({
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var First = createReactClass({ propTypes: externalPropTyp...", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: externalPropTypes,
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: externalPropTypes,\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var First = createReactClass({ propTypes: { s: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            s: PropTypes.string,
            n: PropTypes.number,
            i: PropTypes.instanceOf,
            b: PropTypes.bool
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            s: PropTypes.string,\n            n: PropTypes.number,\n            i: PropTypes.instanceOf,\n            b: PropTypes.bool\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: class First extends React.Component { render() { return <...", async ({ task }) => {
      const code = `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
          a: PropTypes.string,
          b: PropTypes.string
        };
        First.propTypes.justforcheck = PropTypes.string;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 6)\n\n--- Source code under test ---\n\n        class First extends React.Component {\n          render() {\n            return <div />;\n          }\n        }\n        First.propTypes = {\n          a: PropTypes.string,\n          b: PropTypes.string\n        };\n        First.propTypes.justforcheck = PropTypes.string;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: class First extends React.Component { render() { return <...", async ({ task }) => {
      const code = `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
          elem: PropTypes.instanceOf(HTMLElement)
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 7)\n\n--- Source code under test ---\n\n        class First extends React.Component {\n          render() {\n            return <div />;\n          }\n        }\n        First.propTypes = {\n          elem: PropTypes.instanceOf(HTMLElement)\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: class Hello extends React.Component { render() { return <...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div>Hello</div>;
          }
        }
        Hello.propTypes = {
          "aria-controls": PropTypes.string
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 8)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div>Hello</div>;\n          }\n        }\n        Hello.propTypes = {\n          \"aria-controls\": PropTypes.string\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: var Hello = createReactClass({ render: function() { let {...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            let { a, ...b } = obj;
            let c = { ...d };
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 9)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            let { a, ...b } = obj;\n            let c = { ...d };\n            return <div />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: var Hello = createReactClass({ propTypes: { retailer: Pro...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          propTypes: {
            retailer: PropTypes.instanceOf(Map).isRequired,
            requestRetailer: PropTypes.func.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 10)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          propTypes: {\n            retailer: PropTypes.instanceOf(Map).isRequired,\n            requestRetailer: PropTypes.func.isRequired\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: class Test extends React.component { static propTypes = {...", async ({ task }) => {
      const code = `
        class Test extends React.component {
          static propTypes = {
            intl: React.propTypes.number,
            ...propTypes
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 11)\n\n--- Source code under test ---\n\n        class Test extends React.component {\n          static propTypes = {\n            intl: React.propTypes.number,\n            ...propTypes\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: class Test extends React.component { static get propTypes...", async ({ task }) => {
      const code = `
        class Test extends React.component {
          static get propTypes() {
            return {
              intl: React.propTypes.number,
              ...propTypes
            };
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 12)\n\n--- Source code under test ---\n\n        class Test extends React.component {\n          static get propTypes() {\n            return {\n              intl: React.propTypes.number,\n              ...propTypes\n            };\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[37]: class TestComponent extends React.Component { static defa...", async ({ task }) => {
      const code = `
        class TestComponent extends React.Component {
          static defaultProps = function () {
            const date = new Date();
            return {
              date
            };
          }();
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 37)\n\n--- Source code under test ---\n\n        class TestComponent extends React.Component {\n          static defaultProps = function () {\n            const date = new Date();\n            return {\n              date\n            };\n          }();\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: class HeroTeaserList extends React.Component { render() {...", async ({ task }) => {
      const code = `
        class HeroTeaserList extends React.Component {
          render() { return null; }
        }
        HeroTeaserList.propTypes = Object.assign({
          heroIndex: PropTypes.number,
          preview: PropTypes.bool,
        }, componentApi, teaserListProps);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 38)\n\n--- Source code under test ---\n\n        class HeroTeaserList extends React.Component {\n          render() { return null; }\n        }\n        HeroTeaserList.propTypes = Object.assign({\n          heroIndex: PropTypes.number,\n          preview: PropTypes.bool,\n        }, componentApi, teaserListProps);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[39]: import PropTypes from \"prop-types\"; const Foo = { foo: Pr...", async ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        const Foo = {
          foo: PropTypes.string,
        };
        const Bar = {
          bar: PropTypes.shape(Foo),
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 39)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        const Foo = {\n          foo: PropTypes.string,\n        };\n        const Bar = {\n          bar: PropTypes.shape(Foo),\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[40]: import yup from \"yup\" const formValidation = Yup.object()...", async ({ task }) => {
      const code = `
        import yup from "yup"
        const formValidation = Yup.object().shape({
          name: Yup.string(),
          customer_ids: Yup.array()
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 40)\n\n--- Source code under test ---\n\n        import yup from \"yup\"\n        const formValidation = Yup.object().shape({\n          name: Yup.string(),\n          customer_ids: Yup.array()\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[43]: import CustomPropTypes from \"prop-types\"; class Component...", async ({ task }) => {
      const code = `
        import CustomPropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: CustomPropTypes.shape({
            b: CustomPropTypes.String,
            c: CustomPropTypes.number.isRequired,
          })
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 43)\n\n--- Source code under test ---\n\n        import CustomPropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: CustomPropTypes.shape({\n            b: CustomPropTypes.String,\n            c: CustomPropTypes.number.isRequired,\n          })\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[44]: import CustomReact from \"react\" class Component extends R...", async ({ task }) => {
      const code = `
        import CustomReact from "react"
        class Component extends React.Component {};
        Component.propTypes = {
          b: CustomReact.PropTypes.string,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 44)\n\n--- Source code under test ---\n\n        import CustomReact from \"react\"\n        class Component extends React.Component {};\n        Component.propTypes = {\n          b: CustomReact.PropTypes.string,\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[45]: import PropTypes from \"yup\" class Component extends React...", async ({ task }) => {
      const code = `
        import PropTypes from "yup"
        class Component extends React.Component {};
        Component.propTypes = {
          b: PropTypes.array(),
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 45)\n\n--- Source code under test ---\n\n        import PropTypes from \"yup\"\n        class Component extends React.Component {};\n        Component.propTypes = {\n          b: PropTypes.array(),\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[47]: import { PropTypes } from \"not-react\" class Component ext...", async ({ task }) => {
      const code = `
        import { PropTypes } from "not-react"
        class Component extends React.Component {};
        Component.propTypes = {
          b: PropTypes.array(),
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: valid (index 47)\n\n--- Source code under test ---\n\n        import { PropTypes } from \"not-react\"\n        class Component extends React.Component {};\n        Component.propTypes = {\n          b: PropTypes.array(),\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var First = createReactClass({ propTypes: { a: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            a: PropTypes.any\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"any\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"any\" is forbidden");
    });

    it("invalid[2]: var First = createReactClass({ propTypes: { a: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.any.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            a: PropTypes.any.isRequired\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"any\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"any\" is forbidden");
    });

    it("invalid[3]: var First = createReactClass({ propTypes: { a: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.array
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            a: PropTypes.array\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"array\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"array\" is forbidden");
    });

    it("invalid[4]: var First = createReactClass({ propTypes: { a: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.array.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            a: PropTypes.array.isRequired\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"array\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"array\" is forbidden");
    });

    it("invalid[5]: var First = createReactClass({ propTypes: { a: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.object
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            a: PropTypes.object\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"object\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"object\" is forbidden");
    });

    it("invalid[6]: var First = createReactClass({ propTypes: { a: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.object.isRequired
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            a: PropTypes.object.isRequired\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"object\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"object\" is forbidden");
    });

    it("invalid[7]: var First = createReactClass({ propTypes: { a: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.array,
            o: PropTypes.object
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            a: PropTypes.array,\n            o: PropTypes.object\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: [error count only — no message specified]\n  [1]: [error count only — no message specified]\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
    });

    it("invalid[8]: var First = createReactClass({ propTypes: { a: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            a: PropTypes.array
          },
          render: function() {
            return <div />;
          }
        });
        var Second = createReactClass({
          propTypes: {
            o: PropTypes.object
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            a: PropTypes.array\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n        var Second = createReactClass({\n          propTypes: {\n            o: PropTypes.object\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: [error count only — no message specified]\n  [1]: [error count only — no message specified]\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
    });

    it("invalid[9]: class First extends React.Component { render() { return <...", async ({ task }) => {
      const code = `
        class First extends React.Component {
          render() {
            return <div />;
          }
        }
        First.propTypes = {
            a: PropTypes.array,
            o: PropTypes.object
        };
        class Second extends React.Component {
          render() {
            return <div />;
          }
        }
        Second.propTypes = {
            a: PropTypes.array,
            o: PropTypes.object
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        class First extends React.Component {\n          render() {\n            return <div />;\n          }\n        }\n        First.propTypes = {\n            a: PropTypes.array,\n            o: PropTypes.object\n        };\n        class Second extends React.Component {\n          render() {\n            return <div />;\n          }\n        }\n        Second.propTypes = {\n            a: PropTypes.array,\n            o: PropTypes.object\n        };\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0]: [error count only — no message specified]\n  [1]: [error count only — no message specified]\n  [2]: [error count only — no message specified]\n  [3]: [error count only — no message specified]\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(4);
    });

    it("invalid[11]: import { forbidExtraProps } from \"airbnb-prop-types\"; exp...", async ({ task }) => {
      const code = `
        import { forbidExtraProps } from "airbnb-prop-types";
        export const propTypes = {dpm: PropTypes.any};
        export default function Component() {}
        Component.propTypes = propTypes;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        import { forbidExtraProps } from \"airbnb-prop-types\";\n        export const propTypes = {dpm: PropTypes.any};\n        export default function Component() {}\n        Component.propTypes = propTypes;\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"any\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"any\" is forbidden");
    });

    it("invalid[13]: class Component extends React.Component { static propType...", async ({ task }) => {
      const code = `
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.array,
            o: PropTypes.object
          };
          render() {
            return <div />;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static propTypes = {\n            a: PropTypes.array,\n            o: PropTypes.object\n          };\n          render() {\n            return <div />;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: [error count only — no message specified]\n  [1]: [error count only — no message specified]\n\nFeatures: class fields\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
    });

    it("invalid[14]: class Component extends React.Component { static get prop...", async ({ task }) => {
      const code = `
        class Component extends React.Component {
          static get propTypes() {
            return {
              a: PropTypes.array,
              o: PropTypes.object
            };
          };
          render() {
            return <div />;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static get propTypes() {\n            return {\n              a: PropTypes.array,\n              o: PropTypes.object\n            };\n          };\n          render() {\n            return <div />;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: [error count only — no message specified]\n  [1]: [error count only — no message specified]\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
    });

    it("invalid[57]: var First = createReactClass({ propTypes: { s: PropTypes....", async ({ task }) => {
      const code = `
        var First = createReactClass({
          propTypes: {
            s: PropTypes.shape({
              o: PropTypes.object
            })
          },
          render: function() {
            return <div />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 57)\n\n--- Source code under test ---\n\n        var First = createReactClass({\n          propTypes: {\n            s: PropTypes.shape({\n              o: PropTypes.object\n            })\n          },\n          render: function() {\n            return <div />;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: [error count only — no message specified]\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
    });

    it("invalid[58]: import React from './React'; import { arrayOf, object } f...", async ({ task }) => {
      const code = `
        import React from './React';

        import { arrayOf, object } from 'prop-types';

        const App = ({ foo }) => (
          <div>
            Hello world {foo}
          </div>
        );

        App.propTypes = {
          foo: arrayOf(object)
        }

        export default App;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 58)\n\n--- Source code under test ---\n\n        import React from './React';\n\n        import { arrayOf, object } from 'prop-types';\n\n        const App = ({ foo }) => (\n          <div>\n            Hello world {foo}\n          </div>\n        );\n\n        App.propTypes = {\n          foo: arrayOf(object)\n        }\n\n        export default App;\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"object\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"object\" is forbidden");
    });

    it("invalid[59]: import React from './React'; import PropTypes, { arrayOf ...", async ({ task }) => {
      const code = `
        import React from './React';

        import PropTypes, { arrayOf } from 'prop-types';

        const App = ({ foo }) => (
          <div>
            Hello world {foo}
          </div>
        );

        App.propTypes = {
          foo: arrayOf(PropTypes.object)
        }

        export default App;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 59)\n\n--- Source code under test ---\n\n        import React from './React';\n\n        import PropTypes, { arrayOf } from 'prop-types';\n\n        const App = ({ foo }) => (\n          <div>\n            Hello world {foo}\n          </div>\n        );\n\n        App.propTypes = {\n          foo: arrayOf(PropTypes.object)\n        }\n\n        export default App;\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"object\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"object\" is forbidden");
    });

    it("invalid[60]: import CustomPropTypes from \"prop-types\"; class Component...", async ({ task }) => {
      const code = `
        import CustomPropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: CustomPropTypes.shape({
            b: CustomPropTypes.String,
            c: CustomPropTypes.object.isRequired,
          })
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 60)\n\n--- Source code under test ---\n\n        import CustomPropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: CustomPropTypes.shape({\n            b: CustomPropTypes.String,\n            c: CustomPropTypes.object.isRequired,\n          })\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"object\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"object\" is forbidden");
    });

    it("invalid[61]: import { PropTypes as CustomPropTypes } from \"react\"; cla...", async ({ task }) => {
      const code = `
        import { PropTypes as CustomPropTypes } from "react";
        class Component extends React.Component {};
        Component.propTypes = {
          a: CustomPropTypes.shape({
            b: CustomPropTypes.String,
            c: CustomPropTypes.object.isRequired,
          })
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 61)\n\n--- Source code under test ---\n\n        import { PropTypes as CustomPropTypes } from \"react\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: CustomPropTypes.shape({\n            b: CustomPropTypes.String,\n            c: CustomPropTypes.object.isRequired,\n          })\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"object\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"object\" is forbidden");
    });

    it("invalid[62]: import CustomReact from \"react\" class Component extends R...", async ({ task }) => {
      const code = `
        import CustomReact from "react"
        class Component extends React.Component {};
        Component.propTypes = {
          b: CustomReact.PropTypes.object,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forbid-prop-types\nType: invalid (index 62)\n\n--- Source code under test ---\n\n        import CustomReact from \"react\"\n        class Component extends React.Component {};\n        Component.propTypes = {\n          b: CustomReact.PropTypes.object,\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: forbiddenPropType): Prop type \"object\" is forbidden\n\nRule message templates:\n  forbiddenPropType: Prop type \"{{target}}\" is forbidden";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forbid-prop-types", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop type \"object\" is forbidden");
    });

  });
});
