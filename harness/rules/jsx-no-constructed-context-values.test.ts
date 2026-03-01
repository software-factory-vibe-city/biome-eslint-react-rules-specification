import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-no-constructed-context-values";
const VALID_COUNT = 17;

const RULE_MESSAGES = [
  "The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.",
  "The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.",
  "The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'foo' array (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'foo' function expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useCallback hook.",
  "The 'foo' class expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'foo' new expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'foo' function declaration (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useCallback hook.",
  "The 'a' object (at line 3) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'bar' object (at line 3) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'bar' object (at line 3) passed as the value prop to the Context provider (at line 4) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The object passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'Wrapper' JSX element (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'someRegex' regular expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'bar' assignment expression (at line 4) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The 'foo' function declaration (at line 6) passed as the value prop to the Context provider (at line 7) changes every render. To fix this consider wrapping it in a useCallback hook.",
  "The 'foo' object (at line 3) passed as the value prop to the Context provider (at line 3) changes every render. To fix this consider wrapping it in a useMemo hook.",
  "The object passed as the value prop to the Context provider (at line 3) changes every render. To fix this consider wrapping it in a useMemo hook.",
];

const cases = [
  { code: `const Component = () => <Context.Provider value={props}></Context.Provider>`, filename: "test.jsx" },
  { code: `const Component = () => <Context.Provider value={100}></Context.Provider>`, filename: "test.jsx" },
  { code: `const Component = () => <Context.Provider value="Some string"></Context.Provider>`, filename: "test.jsx" },
  { code: `
        function Component({oneProp, twoProp, redProp, blueProp,}) {
          return (
            <NewContext.Provider value={twoProp}></NewContext.Provider>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function Foo(section) {
          const foo = section.section_components?.edges;

          return (
            <Context.Provider value={foo}></Context.Provider>
          )
        }
      `, filename: "test.jsx" },
  { code: `
        import foo from 'foo';
        function innerContext() {
          return (
            <Context.Provider value={foo.something}></Context.Provider>
          )
        }
      `, filename: "test.jsx" },
  { code: `
        // Passes because the lint rule doesn't handle JSX spread attributes
        function innerContext() {
          const foo = {value: 'something'}
          return (
            <Context.Provider {...foo}></Context.Provider>
          )
        }
      `, filename: "test.jsx" },
  { code: `
        // Passes because the lint rule doesn't handle JSX spread attributes
        function innerContext() {
          const foo = useMemo(() => {
            return bar;
          })
          return (
            <Context.Provider value={foo}></Context.Provider>
          )
        }
      `, filename: "test.jsx" },
  { code: `
        // Passes because we can't statically check if it's using the default value
        function Component({ a = {} }) {
          return (<Context.Provider value={a}></Context.Provider>);
        }
      `, filename: "test.jsx" },
  { code: `
          import React from 'react';
          import MyContext from './MyContext';

          const value = '';

          function ContextProvider(props) {
              return (
                  <MyContext.Provider value={value as any}>
                      {props.children}
                  </MyContext.Provider>
              )
          }
        `, filename: "test.tsx" },
  { code: `
        import React from 'react';
        import BooleanContext from './BooleanContext';

        function ContextProvider(props) {
            return (
                <BooleanContext.Provider value>
                    {props.children}
                </BooleanContext.Provider>
            )
        }
      `, filename: "test.jsx" },
  { code: `
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
          <AppContext.Provider value={{}}>
            <AppView />
          </AppContext.Provider>
        );
      `, filename: "test.jsx" },
  { code: `
        // Passes because the context is not a provider
        function Component() {
          return <MyContext.Consumer value={{ foo: 'bar' }} />;
        }
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';

        const MyContext = React.createContext();
        const Component = () => <MyContext value={props}></MyContext>;
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';

        const MyContext = React.createContext();
        const Component = () => <MyContext value={100}></MyContext>;
      `, filename: "test.jsx" },
  { code: `
        const SomeContext = createContext();
        const Component = () => <SomeContext value="Some string"></SomeContext>;
      `, filename: "test.jsx" },
  { code: `
        // Passes because MyContext is not a variable declarator
        function Component({ MyContext }) {
          return <MyContext value={{ foo: "bar" }} />;
        }
      `, filename: "test.jsx" },
  { code: `function Component() { const foo = {}; return (<Context.Provider value={foo}></Context.Provider>) }`, filename: "test.jsx" },
  { code: `function Component() { const foo = []; return (<Context.Provider value={foo}></Context.Provider>) }`, filename: "test.jsx" },
  { code: `function Component() { const foo = () => {}; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { const foo = function bar(){}; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { const foo = class SomeClass{}; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { const foo = new SomeClass(); return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { function foo() {}; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { const foo = true ? {} : "fine"; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { const foo = bar || {}; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { const foo = bar && {}; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { const foo = bar ? baz ? {} : null : null; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `function Component() { let foo = {}; return (<Context.Provider value={foo}></Context.Provider>) }`, filename: "test.jsx" },
  { code: `function Component() { var foo = {}; return (<Context.Provider value={foo}></Context.Provider>)}`, filename: "test.jsx" },
  { code: `
        function Component() {
          let a = {};
          a = 10;
          return (<Context.Provider value={a}></Context.Provider>);
        }
      `, filename: "test.jsx" },
  { code: `
        function Component() {
          const foo = {};
          const bar = foo;
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `, filename: "test.jsx" },
  { code: `
        function Component(foo) {
          let bar = true ? foo : {};
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `, filename: "test.jsx" },
  { code: `function Component() { return (<Context.Provider value={{foo: "bar"}}></Context.Provider>);}`, filename: "test.jsx" },
  { code: `function Component() { const Wrapper = (<SomeComp />); return (<Context.Provider value={Wrapper}></Context.Provider>);}`, filename: "test.jsx" },
  { code: `function Component() { const someRegex = /HelloWorld/; return (<Context.Provider value={someRegex}></Context.Provider>);}`, filename: "test.jsx" },
  { code: `
        function Component() {
          let foo = null;
          let bar = x = () => {};
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';

        const Context = React.createContext();
        function Component() {
          function foo() {};
          return (<Context value={foo}></Context>)
        }
      `, filename: "test.jsx" },
  { code: `
        const MyContext = createContext();
        function Component() { const foo = {}; return (<MyContext value={foo}></MyContext>) }
      `, filename: "test.jsx" },
  { code: `
        const MyContext = createContext();
        function Component() { return (<MyContext value={{foo: "bar"}}></MyContext>); }
      `, filename: "test.jsx" },
];

describe("jsx-no-constructed-context-values", () => {
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
    it("valid[0]: const Component = () => <Context.Provider value={props}><...", ({ task }) => {
      const code = `const Component = () => <Context.Provider value={props}></Context.Provider>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 0)\n\n--- Source code under test ---\nconst Component = () => <Context.Provider value={props}></Context.Provider>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: const Component = () => <Context.Provider value={100}></C...", ({ task }) => {
      const code = `const Component = () => <Context.Provider value={100}></Context.Provider>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 1)\n\n--- Source code under test ---\nconst Component = () => <Context.Provider value={100}></Context.Provider>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: const Component = () => <Context.Provider value=\"Some str...", ({ task }) => {
      const code = `const Component = () => <Context.Provider value="Some string"></Context.Provider>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 2)\n\n--- Source code under test ---\nconst Component = () => <Context.Provider value=\"Some string\"></Context.Provider>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: function Component({oneProp, twoProp, redProp, blueProp,}...", ({ task }) => {
      const code = `
        function Component({oneProp, twoProp, redProp, blueProp,}) {
          return (
            <NewContext.Provider value={twoProp}></NewContext.Provider>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 4)\n\n--- Source code under test ---\n\n        function Component({oneProp, twoProp, redProp, blueProp,}) {\n          return (\n            <NewContext.Provider value={twoProp}></NewContext.Provider>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: function Foo(section) { const foo = section.section_compo...", ({ task }) => {
      const code = `
        function Foo(section) {
          const foo = section.section_components?.edges;

          return (
            <Context.Provider value={foo}></Context.Provider>
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 5)\n\n--- Source code under test ---\n\n        function Foo(section) {\n          const foo = section.section_components?.edges;\n\n          return (\n            <Context.Provider value={foo}></Context.Provider>\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: optional chaining\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: import foo from 'foo'; function innerContext() { return (...", ({ task }) => {
      const code = `
        import foo from 'foo';
        function innerContext() {
          return (
            <Context.Provider value={foo.something}></Context.Provider>
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 6)\n\n--- Source code under test ---\n\n        import foo from 'foo';\n        function innerContext() {\n          return (\n            <Context.Provider value={foo.something}></Context.Provider>\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: // Passes because the lint rule doesn't handle JSX spread...", ({ task }) => {
      const code = `
        // Passes because the lint rule doesn't handle JSX spread attributes
        function innerContext() {
          const foo = {value: 'something'}
          return (
            <Context.Provider {...foo}></Context.Provider>
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 7)\n\n--- Source code under test ---\n\n        // Passes because the lint rule doesn't handle JSX spread attributes\n        function innerContext() {\n          const foo = {value: 'something'}\n          return (\n            <Context.Provider {...foo}></Context.Provider>\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: // Passes because the lint rule doesn't handle JSX spread...", ({ task }) => {
      const code = `
        // Passes because the lint rule doesn't handle JSX spread attributes
        function innerContext() {
          const foo = useMemo(() => {
            return bar;
          })
          return (
            <Context.Provider value={foo}></Context.Provider>
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 8)\n\n--- Source code under test ---\n\n        // Passes because the lint rule doesn't handle JSX spread attributes\n        function innerContext() {\n          const foo = useMemo(() => {\n            return bar;\n          })\n          return (\n            <Context.Provider value={foo}></Context.Provider>\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: // Passes because we can't statically check if it's using...", ({ task }) => {
      const code = `
        // Passes because we can't statically check if it's using the default value
        function Component({ a = {} }) {
          return (<Context.Provider value={a}></Context.Provider>);
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 9)\n\n--- Source code under test ---\n\n        // Passes because we can't statically check if it's using the default value\n        function Component({ a = {} }) {\n          return (<Context.Provider value={a}></Context.Provider>);\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: import React from 'react'; import MyContext from './MyCon...", ({ task }) => {
      const code = `
          import React from 'react';
          import MyContext from './MyContext';

          const value = '';

          function ContextProvider(props) {
              return (
                  <MyContext.Provider value={value as any}>
                      {props.children}
                  </MyContext.Provider>
              )
          }
        `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 10)\n\n--- Source code under test ---\n\n          import React from 'react';\n          import MyContext from './MyContext';\n\n          const value = '';\n\n          function ContextProvider(props) {\n              return (\n                  <MyContext.Provider value={value as any}>\n                      {props.children}\n                  </MyContext.Provider>\n              )\n          }\n        \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types, no-babel\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: import React from 'react'; import BooleanContext from './...", ({ task }) => {
      const code = `
        import React from 'react';
        import BooleanContext from './BooleanContext';

        function ContextProvider(props) {
            return (
                <BooleanContext.Provider value>
                    {props.children}
                </BooleanContext.Provider>
            )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 11)\n\n--- Source code under test ---\n\n        import React from 'react';\n        import BooleanContext from './BooleanContext';\n\n        function ContextProvider(props) {\n            return (\n                <BooleanContext.Provider value>\n                    {props.children}\n                </BooleanContext.Provider>\n            )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: const root = ReactDOM.createRoot(document.getElementById(...", ({ task }) => {
      const code = `
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
          <AppContext.Provider value={{}}>
            <AppView />
          </AppContext.Provider>
        );
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 12)\n\n--- Source code under test ---\n\n        const root = ReactDOM.createRoot(document.getElementById('root'));\n        root.render(\n          <AppContext.Provider value={{}}>\n            <AppView />\n          </AppContext.Provider>\n        );\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: // Passes because the context is not a provider function ...", ({ task }) => {
      const code = `
        // Passes because the context is not a provider
        function Component() {
          return <MyContext.Consumer value={{ foo: 'bar' }} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 13)\n\n--- Source code under test ---\n\n        // Passes because the context is not a provider\n        function Component() {\n          return <MyContext.Consumer value={{ foo: 'bar' }} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: import React from 'react'; const MyContext = React.create...", ({ task }) => {
      const code = `
        import React from 'react';

        const MyContext = React.createContext();
        const Component = () => <MyContext value={props}></MyContext>;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 14)\n\n--- Source code under test ---\n\n        import React from 'react';\n\n        const MyContext = React.createContext();\n        const Component = () => <MyContext value={props}></MyContext>;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: import React from 'react'; const MyContext = React.create...", ({ task }) => {
      const code = `
        import React from 'react';

        const MyContext = React.createContext();
        const Component = () => <MyContext value={100}></MyContext>;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 15)\n\n--- Source code under test ---\n\n        import React from 'react';\n\n        const MyContext = React.createContext();\n        const Component = () => <MyContext value={100}></MyContext>;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: const SomeContext = createContext(); const Component = ()...", ({ task }) => {
      const code = `
        const SomeContext = createContext();
        const Component = () => <SomeContext value="Some string"></SomeContext>;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 16)\n\n--- Source code under test ---\n\n        const SomeContext = createContext();\n        const Component = () => <SomeContext value=\"Some string\"></SomeContext>;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: // Passes because MyContext is not a variable declarator ...", ({ task }) => {
      const code = `
        // Passes because MyContext is not a variable declarator
        function Component({ MyContext }) {
          return <MyContext value={{ foo: "bar" }} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: valid (index 17)\n\n--- Source code under test ---\n\n        // Passes because MyContext is not a variable declarator\n        function Component({ MyContext }) {\n          return <MyContext value={{ foo: \"bar\" }} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: function Component() { const foo = {}; return (<Context.P...", ({ task }) => {
      const code = `function Component() { const foo = {}; return (<Context.Provider value={foo}></Context.Provider>) }`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 0)\n\n--- Source code under test ---\nfunction Component() { const foo = {}; return (<Context.Provider value={foo}></Context.Provider>) }\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[1]: function Component() { const foo = []; return (<Context.P...", ({ task }) => {
      const code = `function Component() { const foo = []; return (<Context.Provider value={foo}></Context.Provider>) }`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 1)\n\n--- Source code under test ---\nfunction Component() { const foo = []; return (<Context.Provider value={foo}></Context.Provider>) }\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' array (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' array (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[2]: function Component() { const foo = () => {}; return (<Con...", ({ task }) => {
      const code = `function Component() { const foo = () => {}; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 2)\n\n--- Source code under test ---\nfunction Component() { const foo = () => {}; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsgFunc): The 'foo' function expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useCallback hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' function expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useCallback hook.");
    });

    it("invalid[3]: function Component() { const foo = function bar(){}; retu...", ({ task }) => {
      const code = `function Component() { const foo = function bar(){}; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 3)\n\n--- Source code under test ---\nfunction Component() { const foo = function bar(){}; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsgFunc): The 'foo' function expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useCallback hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' function expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useCallback hook.");
    });

    it("invalid[4]: function Component() { const foo = class SomeClass{}; ret...", ({ task }) => {
      const code = `function Component() { const foo = class SomeClass{}; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 4)\n\n--- Source code under test ---\nfunction Component() { const foo = class SomeClass{}; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' class expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' class expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[5]: function Component() { const foo = new SomeClass(); retur...", ({ task }) => {
      const code = `function Component() { const foo = new SomeClass(); return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 5)\n\n--- Source code under test ---\nfunction Component() { const foo = new SomeClass(); return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' new expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' new expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[6]: function Component() { function foo() {}; return (<Contex...", ({ task }) => {
      const code = `function Component() { function foo() {}; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 6)\n\n--- Source code under test ---\nfunction Component() { function foo() {}; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsgFunc): The 'foo' function declaration (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useCallback hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' function declaration (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useCallback hook.");
    });

    it("invalid[7]: function Component() { const foo = true ? {} : \"fine\"; re...", ({ task }) => {
      const code = `function Component() { const foo = true ? {} : "fine"; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 7)\n\n--- Source code under test ---\nfunction Component() { const foo = true ? {} : \"fine\"; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[8]: function Component() { const foo = bar || {}; return (<Co...", ({ task }) => {
      const code = `function Component() { const foo = bar || {}; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 8)\n\n--- Source code under test ---\nfunction Component() { const foo = bar || {}; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[9]: function Component() { const foo = bar && {}; return (<Co...", ({ task }) => {
      const code = `function Component() { const foo = bar && {}; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 9)\n\n--- Source code under test ---\nfunction Component() { const foo = bar && {}; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[10]: function Component() { const foo = bar ? baz ? {} : null ...", ({ task }) => {
      const code = `function Component() { const foo = bar ? baz ? {} : null : null; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 10)\n\n--- Source code under test ---\nfunction Component() { const foo = bar ? baz ? {} : null : null; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[11]: function Component() { let foo = {}; return (<Context.Pro...", ({ task }) => {
      const code = `function Component() { let foo = {}; return (<Context.Provider value={foo}></Context.Provider>) }`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 11)\n\n--- Source code under test ---\nfunction Component() { let foo = {}; return (<Context.Provider value={foo}></Context.Provider>) }\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[12]: function Component() { var foo = {}; return (<Context.Pro...", ({ task }) => {
      const code = `function Component() { var foo = {}; return (<Context.Provider value={foo}></Context.Provider>)}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 12)\n\n--- Source code under test ---\nfunction Component() { var foo = {}; return (<Context.Provider value={foo}></Context.Provider>)}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' object (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[13]: function Component() { let a = {}; a = 10; return (<Conte...", ({ task }) => {
      const code = `
        function Component() {
          let a = {};
          a = 10;
          return (<Context.Provider value={a}></Context.Provider>);
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        function Component() {\n          let a = {};\n          a = 10;\n          return (<Context.Provider value={a}></Context.Provider>);\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'a' object (at line 3) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'a' object (at line 3) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[14]: function Component() { const foo = {}; const bar = foo; r...", ({ task }) => {
      const code = `
        function Component() {
          const foo = {};
          const bar = foo;
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        function Component() {\n          const foo = {};\n          const bar = foo;\n          return (<Context.Provider value={bar}></Context.Provider>);\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'bar' object (at line 3) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'bar' object (at line 3) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[15]: function Component(foo) { let bar = true ? foo : {}; retu...", ({ task }) => {
      const code = `
        function Component(foo) {
          let bar = true ? foo : {};
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        function Component(foo) {\n          let bar = true ? foo : {};\n          return (<Context.Provider value={bar}></Context.Provider>);\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'bar' object (at line 3) passed as the value prop to the Context provider (at line 4) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'bar' object (at line 3) passed as the value prop to the Context provider (at line 4) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[16]: function Component() { return (<Context.Provider value={{...", ({ task }) => {
      const code = `function Component() { return (<Context.Provider value={{foo: "bar"}}></Context.Provider>);}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 16)\n\n--- Source code under test ---\nfunction Component() { return (<Context.Provider value={{foo: \"bar\"}}></Context.Provider>);}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: defaultMsg): The object passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The object passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[17]: function Component() { const Wrapper = (<SomeComp />); re...", ({ task }) => {
      const code = `function Component() { const Wrapper = (<SomeComp />); return (<Context.Provider value={Wrapper}></Context.Provider>);}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 17)\n\n--- Source code under test ---\nfunction Component() { const Wrapper = (<SomeComp />); return (<Context.Provider value={Wrapper}></Context.Provider>);}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'Wrapper' JSX element (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'Wrapper' JSX element (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[18]: function Component() { const someRegex = /HelloWorld/; re...", ({ task }) => {
      const code = `function Component() { const someRegex = /HelloWorld/; return (<Context.Provider value={someRegex}></Context.Provider>);}`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 18)\n\n--- Source code under test ---\nfunction Component() { const someRegex = /HelloWorld/; return (<Context.Provider value={someRegex}></Context.Provider>);}\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'someRegex' regular expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'someRegex' regular expression (at line 1) passed as the value prop to the Context provider (at line 1) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[19]: function Component() { let foo = null; let bar = x = () =...", ({ task }) => {
      const code = `
        function Component() {
          let foo = null;
          let bar = x = () => {};
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 19)\n\n--- Source code under test ---\n\n        function Component() {\n          let foo = null;\n          let bar = x = () => {};\n          return (<Context.Provider value={bar}></Context.Provider>);\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'bar' assignment expression (at line 4) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'bar' assignment expression (at line 4) passed as the value prop to the Context provider (at line 5) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[20]: import React from 'react'; const Context = React.createCo...", ({ task }) => {
      const code = `
        import React from 'react';

        const Context = React.createContext();
        function Component() {
          function foo() {};
          return (<Context value={foo}></Context>)
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 20)\n\n--- Source code under test ---\n\n        import React from 'react';\n\n        const Context = React.createContext();\n        function Component() {\n          function foo() {};\n          return (<Context value={foo}></Context>)\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsgFunc): The 'foo' function declaration (at line 6) passed as the value prop to the Context provider (at line 7) changes every render. To fix this consider wrapping it in a useCallback hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' function declaration (at line 6) passed as the value prop to the Context provider (at line 7) changes every render. To fix this consider wrapping it in a useCallback hook.");
    });

    it("invalid[21]: const MyContext = createContext(); function Component() {...", ({ task }) => {
      const code = `
        const MyContext = createContext();
        function Component() { const foo = {}; return (<MyContext value={foo}></MyContext>) }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 21)\n\n--- Source code under test ---\n\n        const MyContext = createContext();\n        function Component() { const foo = {}; return (<MyContext value={foo}></MyContext>) }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: withIdentifierMsg): The 'foo' object (at line 3) passed as the value prop to the Context provider (at line 3) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The 'foo' object (at line 3) passed as the value prop to the Context provider (at line 3) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

    it("invalid[22]: const MyContext = createContext(); function Component() {...", ({ task }) => {
      const code = `
        const MyContext = createContext();
        function Component() { return (<MyContext value={{foo: "bar"}}></MyContext>); }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-constructed-context-values\nType: invalid (index 22)\n\n--- Source code under test ---\n\n        const MyContext = createContext();\n        function Component() { return (<MyContext value={{foo: \"bar\"}}></MyContext>); }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: defaultMsg): The object passed as the value prop to the Context provider (at line 3) changes every render. To fix this consider wrapping it in a useMemo hook.\n\nRule message templates:\n  withIdentifierMsg: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  withIdentifierMsgFunc: The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.\n  defaultMsg: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.\n  defaultMsgFunc: The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The object passed as the value prop to the Context provider (at line 3) changes every render. To fix this consider wrapping it in a useMemo hook.");
    });

  });
});
