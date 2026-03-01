import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Must never use destructuring props assignment in SFC argument",
  "Must never use destructuring context assignment in SFC argument",
  "Must never use destructuring {{type}} assignment",
  "Must use destructuring {{type}} assignment",
  "Must destructure props in the function signature.",
  "Must use destructuring props assignment",
  "Must use destructuring state assignment",
  "Must use destructuring context assignment",
  "Must never use destructuring props assignment",
  "Must never use destructuring state assignment",
];

describe("destructuring-assignment", () => {
  describe("valid", () => {
    it("valid[0]: export const revisionStates2 = { [A.b]: props => { return...", async ({ task }) => {
      const code = `
        export const revisionStates2 = {
            [A.b]: props => {
              return props.editor !== null
                ? 'xyz'
                : 'abc'
            },
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 0)\n\n--- Source code under test ---\n\n        export const revisionStates2 = {\n            [A.b]: props => {\n              return props.editor !== null\n                ? 'xyz'\n                : 'abc'\n            },\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: export function hof(namespace) { const initialState = { b...", async ({ task }) => {
      const code = `
        export function hof(namespace) {
          const initialState = {
            bounds: null,
            search: false,
          };
          return (props) => {
            const {x, y} = props
            if (y) {
              return <span>{y}</span>;
            }
            return <span>{x}</span>
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 1)\n\n--- Source code under test ---\n\n        export function hof(namespace) {\n          const initialState = {\n            bounds: null,\n            search: false,\n          };\n          return (props) => {\n            const {x, y} = props\n            if (y) {\n              return <span>{y}</span>;\n            }\n            return <span>{x}</span>\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: export function hof(namespace) { const initialState = { b...", async ({ task }) => {
      const code = `
        export function hof(namespace) {
          const initialState = {
            bounds: null,
            search: false,
          };

          return (state = initialState, action) => {
            if (action.type === 'ABC') {
              return {...state, bounds: stuff ? action.x : null};
            }

            if (action.namespace !== namespace) {
              return state;
            }

            return null
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 2)\n\n--- Source code under test ---\n\n        export function hof(namespace) {\n          const initialState = {\n            bounds: null,\n            search: false,\n          };\n\n          return (state = initialState, action) => {\n            if (action.type === 'ABC') {\n              return {...state, bounds: stuff ? action.x : null};\n            }\n\n            if (action.namespace !== namespace) {\n              return state;\n            }\n\n            return null\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: const MyComponent = ({ id, className }) => ( <div id={id}...", async ({ task }) => {
      const code = `
        const MyComponent = ({ id, className }) => (
          <div id={id} className={className} />
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 3)\n\n--- Source code under test ---\n\n        const MyComponent = ({ id, className }) => (\n          <div id={id} className={className} />\n        );\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: const MyComponent = (props) => { const { id, className } ...", async ({ task }) => {
      const code = `
        const MyComponent = (props) => {
          const { id, className } = props;
          return <div id={id} className={className} />
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 5)\n\n--- Source code under test ---\n\n        const MyComponent = (props) => {\n          const { id, className } = props;\n          return <div id={id} className={className} />\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: const MyComponent = (props) => ( <div id={id} props={prop...", async ({ task }) => {
      const code = `
        const MyComponent = (props) => (
          <div id={id} props={props} />
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 7)\n\n--- Source code under test ---\n\n        const MyComponent = (props) => (\n          <div id={id} props={props} />\n        );\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const MyComponent = (props, { color }) => ( <div id={id} ...", async ({ task }) => {
      const code = `
        const MyComponent = (props, { color }) => (
          <div id={id} props={props} color={color} />
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 9)\n\n--- Source code under test ---\n\n        const MyComponent = (props, { color }) => (\n          <div id={id} props={props} color={color} />\n        );\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: const Foo = class extends React.PureComponent { render() ...", async ({ task }) => {
      const code = `
        const Foo = class extends React.PureComponent {
          render() {
            const { foo } = this.props;
            return <div>{foo}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 13)\n\n--- Source code under test ---\n\n        const Foo = class extends React.PureComponent {\n          render() {\n            const { foo } = this.props;\n            return <div>{foo}</div>;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: const div = styled.div` & .button { border-radius: ${prop...", async ({ task }) => {
      const code = `
        const div = styled.div\`
          & .button {
            border-radius: \${props => props.borderRadius}px;
          }
        \`
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 17)\n\n--- Source code under test ---\n\n        const div = styled.div`\n          & .button {\n            border-radius: ${props => props.borderRadius}px;\n          }\n        `\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: export default (context: $Context) => ({ foo: context.bar...", async ({ task }) => {
      const code = `
        export default (context: $Context) => ({
          foo: context.bar
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 18)\n\n--- Source code under test ---\n\n        export default (context: $Context) => ({\n          foo: context.bar\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: class Foo { bar(context) { return context.baz; } }", async ({ task }) => {
      const code = `
        class Foo {
          bar(context) {
            return context.baz;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 19)\n\n--- Source code under test ---\n\n        class Foo {\n          bar(context) {\n            return context.baz;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: class Foo { bar(props) { return props.baz; } }", async ({ task }) => {
      const code = `
        class Foo {
          bar(props) {
            return props.baz;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 20)\n\n--- Source code under test ---\n\n        class Foo {\n          bar(props) {\n            return props.baz;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: const obj = { foo(arg) { const a = arg.func(); return nul...", async ({ task }) => {
      const code = `
        const obj = {
          foo(arg) {
            const a = arg.func();
            return null;
          },
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 24)\n\n--- Source code under test ---\n\n        const obj = {\n          foo(arg) {\n            const a = arg.func();\n            return null;\n          },\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: const columns = [ { render: (val) => { if (val.url) { ret...", async ({ task }) => {
      const code = `
        const columns = [
          {
            render: (val) => {
              if (val.url) {
                return (
                  <a href={val.url}>
                    {val.test}
                  </a>
                );
              }
              return null;
            },
          },
        ];
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 25)\n\n--- Source code under test ---\n\n        const columns = [\n          {\n            render: (val) => {\n              if (val.url) {\n                return (\n                  <a href={val.url}>\n                    {val.test}\n                  </a>\n                );\n              }\n              return null;\n            },\n          },\n        ];\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: const columns = [ { render: val => <span>{val}</span>, },...", async ({ task }) => {
      const code = `
        const columns = [
          {
            render: val => <span>{val}</span>,
          },
          {
            someRenderFunc: function(val) {
              if (val.url) {
                return (
                  <a href={val.url}>
                    {val.test}
                  </a>
                );
              }
              return null;
            },
          },
        ];
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 26)\n\n--- Source code under test ---\n\n        const columns = [\n          {\n            render: val => <span>{val}</span>,\n          },\n          {\n            someRenderFunc: function(val) {\n              if (val.url) {\n                return (\n                  <a href={val.url}>\n                    {val.test}\n                  </a>\n                );\n              }\n              return null;\n            },\n          },\n        ];\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: export default (fileName) => { const match = fileName.mat...", async ({ task }) => {
      const code = `
        export default (fileName) => {
          const match = fileName.match(/some expression/);
          if (match) {
            return fn;
          }
          return null;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 27)\n\n--- Source code under test ---\n\n        export default (fileName) => {\n          const match = fileName.match(/some expression/);\n          if (match) {\n            return fn;\n          }\n          return null;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: class C extends React.Component { componentDidMount() { c...", async ({ task }) => {
      const code = `
        class C extends React.Component {
          componentDidMount() {
            const { forwardRef } = this.props;

            this.ref.current.focus();

            if (typeof forwardRef === 'function') {
              forwardRef(this.ref);
            }
          }
          render() {
            return <div />;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 28)\n\n--- Source code under test ---\n\n        class C extends React.Component {\n          componentDidMount() {\n            const { forwardRef } = this.props;\n\n            this.ref.current.focus();\n\n            if (typeof forwardRef === 'function') {\n              forwardRef(this.ref);\n            }\n          }\n          render() {\n            return <div />;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: import { useContext } from 'react'; const MyComponent = (...", async ({ task }) => {
      const code = `
        import { useContext } from 'react';

        const MyComponent = (props) => {
          const foo = useContext(aContext);
          return <div>{foo?.test}</div>
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: valid (index 38)\n\n--- Source code under test ---\n\n        import { useContext } from 'react';\n\n        const MyComponent = (props) => {\n          const foo = useContext(aContext);\n          return <div>{foo?.test}</div>\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: optional chaining\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: const MyComponent = (props) => { return (<div id={props.i...", async ({ task }) => {
      const code = `
        const MyComponent = (props) => {
          return (<div id={props.id} />)
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        const MyComponent = (props) => {\n          return (<div id={props.id} />)\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[3]: const Foo = class extends React.PureComponent { render() ...", async ({ task }) => {
      const code = `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.props.foo}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        const Foo = class extends React.PureComponent {\n          render() {\n            return <div>{this.props.foo}</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[4]: const Foo = class extends React.PureComponent { render() ...", async ({ task }) => {
      const code = `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.state.foo}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        const Foo = class extends React.PureComponent {\n          render() {\n            return <div>{this.state.foo}</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring state assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring state assignment");
    });

    it("invalid[5]: const Foo = class extends React.PureComponent { render() ...", async ({ task }) => {
      const code = `
        const Foo = class extends React.PureComponent {
          render() {
            return <div>{this.context.foo}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        const Foo = class extends React.PureComponent {\n          render() {\n            return <div>{this.context.foo}</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring context assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring context assignment");
    });

    it("invalid[6]: class Foo extends React.Component { render() { return thi...", async ({ task }) => {
      const code = `
        class Foo extends React.Component {
          render() { return this.foo(); }
          foo() {
            return this.props.children;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          render() { return this.foo(); }\n          foo() {\n            return this.props.children;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[7]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <Text>{this.props.foo}</Text>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <Text>{this.props.foo}</Text>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[8]: module.exports = { Foo(props) { return <p>{props.a}</p>; } }", async ({ task }) => {
      const code = `
        module.exports = {
          Foo(props) {
            return <p>{props.a}</p>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        module.exports = {\n          Foo(props) {\n            return <p>{props.a}</p>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[9]: export default function Foo(props) { return <p>{props.a}<...", async ({ task }) => {
      const code = `
        export default function Foo(props) {
          return <p>{props.a}</p>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        export default function Foo(props) {\n          return <p>{props.a}</p>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[10]: function hof() { return (props) => <p>{props.a}</p>; }", async ({ task }) => {
      const code = `
        function hof() {
          return (props) => <p>{props.a}</p>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        function hof() {\n          return (props) => <p>{props.a}</p>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[11]: const Foo = class extends React.PureComponent { render() ...", async ({ task }) => {
      const code = `
        const Foo = class extends React.PureComponent {
          render() {
            const foo = this.props.foo;
            return <div>{foo}</div>;
          }
        };
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        const Foo = class extends React.PureComponent {\n          render() {\n            const foo = this.props.foo;\n            return <div>{foo}</div>;\n          }\n        };\n        \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[15]: const columns = [ { CustomComponentName: function(props) ...", async ({ task }) => {
      const code = `
        const columns = [
          {
            CustomComponentName: function(props) {
              if (props.url) {
                return (
                  <a href={props.url}>
                    {props.test}
                  </a>
                );
              }
              return null;
            },
          },
        ];
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        const columns = [\n          {\n            CustomComponentName: function(props) {\n              if (props.url) {\n                return (\n                  <a href={props.url}>\n                    {props.test}\n                  </a>\n                );\n              }\n              return null;\n            },\n          },\n        ];\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n  [1] (messageId: useDestructAssignment): Must use destructuring props assignment\n  [2] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
      expect(matches[1].message).toBe("Must use destructuring props assignment");
      expect(matches[2].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[18]: import React from 'react'; const TestComp = (props) => { ...", async ({ task }) => {
      const code = `
        import React from 'react';

        const TestComp = (props) => {
          props.onClick3102();

          return (
            <div
              onClick={(evt) => {
                if (props.onClick3102) {
                  props.onClick3102(evt);
                }
              }}
            >
              <div />
            </div>
          );
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        import React from 'react';\n\n        const TestComp = (props) => {\n          props.onClick3102();\n\n          return (\n            <div\n              onClick={(evt) => {\n                if (props.onClick3102) {\n                  props.onClick3102(evt);\n                }\n              }}\n            >\n              <div />\n            </div>\n          );\n        };\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n  [1] (messageId: useDestructAssignment): Must use destructuring props assignment\n  [2] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
      expect(matches[1].message).toBe("Must use destructuring props assignment");
      expect(matches[2].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[19]: export const revisionStates2 = { [A.b]: props => { return...", async ({ task }) => {
      const code = `
        export const revisionStates2 = {
            [A.b]: props => {
              return props.editor !== null
                ? <span>{props.editor}</span>
                : null
            },
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 19)\n\n--- Source code under test ---\n\n        export const revisionStates2 = {\n            [A.b]: props => {\n              return props.editor !== null\n                ? <span>{props.editor}</span>\n                : null\n            },\n        };\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n  [1] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
      expect(matches[1].message).toBe("Must use destructuring props assignment");
    });

    it("invalid[20]: export function hof(namespace) { const initialState = { b...", async ({ task }) => {
      const code = `
        export function hof(namespace) {
          const initialState = {
            bounds: null,
            search: false,
          };
          return (props) => {
            if (props.y) {
              return <span>{props.y}</span>;
            }
            return <span>{props.x}</span>
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: destructuring-assignment\nType: invalid (index 20)\n\n--- Source code under test ---\n\n        export function hof(namespace) {\n          const initialState = {\n            bounds: null,\n            search: false,\n          };\n          return (props) => {\n            if (props.y) {\n              return <span>{props.y}</span>;\n            }\n            return <span>{props.x}</span>\n          };\n        }\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: useDestructAssignment): Must use destructuring props assignment\n  [1] (messageId: useDestructAssignment): Must use destructuring props assignment\n  [2] (messageId: useDestructAssignment): Must use destructuring props assignment\n\nRule message templates:\n  noDestructPropsInSFCArg: Must never use destructuring props assignment in SFC argument\n  noDestructContextInSFCArg: Must never use destructuring context assignment in SFC argument\n  noDestructAssignment: Must never use destructuring {{type}} assignment\n  useDestructAssignment: Must use destructuring {{type}} assignment\n  destructureInSignature: Must destructure props in the function signature.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "destructuring-assignment", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("Must use destructuring props assignment");
      expect(matches[1].message).toBe("Must use destructuring props assignment");
      expect(matches[2].message).toBe("Must use destructuring props assignment");
    });

  });
});
