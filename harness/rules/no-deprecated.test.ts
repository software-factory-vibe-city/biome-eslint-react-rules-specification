import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "{{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}",
  "React.renderComponent is deprecated since React 0.12.0, use React.render instead",
  "Foo.renderComponent is deprecated since React 0.12.0, use Foo.render instead",
  "this.transferPropsTo is deprecated since React 0.12.0, use spread operator ({...}) instead",
  "React.addons.TestUtils is deprecated since React 15.5.0, use ReactDOM.TestUtils instead",
  "React.addons.classSet is deprecated since React 0.13.0, use the npm module classnames instead",
  "React.render is deprecated since React 0.14.0, use ReactDOM.render instead",
  "React.unmountComponentAtNode is deprecated since React 0.14.0, use ReactDOM.unmountComponentAtNode instead",
  "React.findDOMNode is deprecated since React 0.14.0, use ReactDOM.findDOMNode instead",
  "React.renderToString is deprecated since React 0.14.0, use ReactDOMServer.renderToString instead",
  "React.renderToStaticMarkup is deprecated since React 0.14.0, use ReactDOMServer.renderToStaticMarkup instead",
  "React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead",
  "Foo.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead",
  "React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead",
  "ReactPerf.printDOM is deprecated since React 15.0.0, use ReactPerf.printOperations instead",
  "React.DOM is deprecated since React 15.6.0, use the npm module react-dom-factories instead",
  "componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.",
  "componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.",
  "componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.",
  "ReactDOM.render is deprecated since React 18.0.0, use createRoot instead, see https://reactjs.org/link/switch-to-createroot",
  "ReactDOM.hydrate is deprecated since React 18.0.0, use hydrateRoot instead, see https://reactjs.org/link/switch-to-createroot",
  "ReactDOM.unmountComponentAtNode is deprecated since React 18.0.0, use root.unmount instead, see https://reactjs.org/link/switch-to-createroot",
  "ReactDOMServer.renderToNodeStream is deprecated since React 18.0.0, use renderToPipeableStream instead, see https://reactjs.org/docs/react-dom-server.html#rendertonodestream",
];

describe("no-deprecated", () => {
  describe("valid", () => {
    it("valid[0]: var element = React.createElement('p', {}, null);", async ({ task }) => {
      const code = `var element = React.createElement('p', {}, null);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 0)\n\n--- Source code under test ---\nvar element = React.createElement('p', {}, null);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var clone = React.cloneElement(element);", async ({ task }) => {
      const code = `var clone = React.cloneElement(element);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 1)\n\n--- Source code under test ---\nvar clone = React.cloneElement(element);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: ReactDOM.cloneElement(child, container);", async ({ task }) => {
      const code = `ReactDOM.cloneElement(child, container);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 2)\n\n--- Source code under test ---\nReactDOM.cloneElement(child, container);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: ReactDOM.findDOMNode(instance);", async ({ task }) => {
      const code = `ReactDOM.findDOMNode(instance);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 3)\n\n--- Source code under test ---\nReactDOM.findDOMNode(instance);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: ReactDOM.createPortal(child, container);", async ({ task }) => {
      const code = `ReactDOM.createPortal(child, container);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 4)\n\n--- Source code under test ---\nReactDOM.createPortal(child, container);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: ReactDOMServer.renderToString(element);", async ({ task }) => {
      const code = `ReactDOMServer.renderToString(element);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 5)\n\n--- Source code under test ---\nReactDOMServer.renderToString(element);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: ReactDOMServer.renderToStaticMarkup(element);", async ({ task }) => {
      const code = `ReactDOMServer.renderToStaticMarkup(element);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 6)\n\n--- Source code under test ---\nReactDOMServer.renderToStaticMarkup(element);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var Foo = createReactClass({ render: function() {} })", async ({ task }) => {
      const code = `
        var Foo = createReactClass({
          render: function() {}
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 7)\n\n--- Source code under test ---\n\n        var Foo = createReactClass({\n          render: function() {}\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: var Foo = createReactClassNonReact({ componentWillMount: ...", async ({ task }) => {
      const code = `
        var Foo = createReactClassNonReact({
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {}
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 8)\n\n--- Source code under test ---\n\n        var Foo = createReactClassNonReact({\n          componentWillMount: function() {},\n          componentWillReceiveProps: function() {},\n          componentWillUpdate: function() {}\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: var Foo = { componentWillMount: function() {}, componentW...", async ({ task }) => {
      const code = `
        var Foo = {
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {}
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 9)\n\n--- Source code under test ---\n\n        var Foo = {\n          componentWillMount: function() {},\n          componentWillReceiveProps: function() {},\n          componentWillUpdate: function() {}\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: class Foo { constructor() {} componentWillMount() {} comp...", async ({ task }) => {
      const code = `
        class Foo {
          constructor() {}
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 10)\n\n--- Source code under test ---\n\n        class Foo {\n          constructor() {}\n          componentWillMount() {}\n          componentWillReceiveProps() {}\n          componentWillUpdate() {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: import React from \"react\"; let { default: defaultReactExp...", async ({ task }) => {
      const code = `
        import React from "react";

        let { default: defaultReactExport, ...allReactExports } = React;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 15)\n\n--- Source code under test ---\n\n        import React from \"react\";\n\n        let { default: defaultReactExport, ...allReactExports } = React;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: import ReactDOM, { createRoot } from 'react-dom/client'; ...", async ({ task }) => {
      const code = `
        import ReactDOM, { createRoot } from 'react-dom/client';
        ReactDOM.createRoot(container);
        const root = createRoot(container);
        root.unmount();
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 17)\n\n--- Source code under test ---\n\n        import ReactDOM, { createRoot } from 'react-dom/client';\n        ReactDOM.createRoot(container);\n        const root = createRoot(container);\n        root.unmount();\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: import ReactDOM, { hydrateRoot } from 'react-dom/client';...", async ({ task }) => {
      const code = `
        import ReactDOM, { hydrateRoot } from 'react-dom/client';
        ReactDOM.hydrateRoot(container, <App/>);
        hydrateRoot(container, <App/>);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 18)\n\n--- Source code under test ---\n\n        import ReactDOM, { hydrateRoot } from 'react-dom/client';\n        ReactDOM.hydrateRoot(container, <App/>);\n        hydrateRoot(container, <App/>);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: import ReactDOMServer, { renderToPipeableStream } from 'r...", async ({ task }) => {
      const code = `
        import ReactDOMServer, { renderToPipeableStream } from 'react-dom/server';
        ReactDOMServer.renderToPipeableStream(<App />, {});
        renderToPipeableStream(<App />, {});
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 19)\n\n--- Source code under test ---\n\n        import ReactDOMServer, { renderToPipeableStream } from 'react-dom/server';\n        ReactDOMServer.renderToPipeableStream(<App />, {});\n        renderToPipeableStream(<App />, {});\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: import { renderToString } from 'react-dom/server';", async ({ task }) => {
      const code = `
        import { renderToString } from 'react-dom/server';
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 20)\n\n--- Source code under test ---\n\n        import { renderToString } from 'react-dom/server';\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: const { renderToString } = require('react-dom/server');", async ({ task }) => {
      const code = `
        const { renderToString } = require('react-dom/server');
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: valid (index 21)\n\n--- Source code under test ---\n\n        const { renderToString } = require('react-dom/server');\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: React.renderComponent()", async ({ task }) => {
      const code = `React.renderComponent()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 0)\n\n--- Source code under test ---\nReact.renderComponent()\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.renderComponent is deprecated since React 0.12.0, use React.render instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.renderComponent is deprecated since React 0.12.0, use React.render instead");
    });

    it("invalid[2]: /** @jsx Foo */ Foo.renderComponent()", async ({ task }) => {
      const code = `/** @jsx Foo */ Foo.renderComponent()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 2)\n\n--- Source code under test ---\n/** @jsx Foo */ Foo.renderComponent()\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): Foo.renderComponent is deprecated since React 0.12.0, use Foo.render instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo.renderComponent is deprecated since React 0.12.0, use Foo.render instead");
    });

    it("invalid[3]: this.transferPropsTo()", async ({ task }) => {
      const code = `this.transferPropsTo()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 3)\n\n--- Source code under test ---\nthis.transferPropsTo()\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): this.transferPropsTo is deprecated since React 0.12.0, use spread operator ({...}) instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("this.transferPropsTo is deprecated since React 0.12.0, use spread operator ({...}) instead");
    });

    it("invalid[4]: React.addons.TestUtils", async ({ task }) => {
      const code = `React.addons.TestUtils`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 4)\n\n--- Source code under test ---\nReact.addons.TestUtils\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.addons.TestUtils is deprecated since React 15.5.0, use ReactDOM.TestUtils instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.addons.TestUtils is deprecated since React 15.5.0, use ReactDOM.TestUtils instead");
    });

    it("invalid[5]: React.addons.classSet()", async ({ task }) => {
      const code = `React.addons.classSet()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 5)\n\n--- Source code under test ---\nReact.addons.classSet()\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.addons.classSet is deprecated since React 0.13.0, use the npm module classnames instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.addons.classSet is deprecated since React 0.13.0, use the npm module classnames instead");
    });

    it("invalid[6]: React.render(element, container);", async ({ task }) => {
      const code = `React.render(element, container);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 6)\n\n--- Source code under test ---\nReact.render(element, container);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.render is deprecated since React 0.14.0, use ReactDOM.render instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.render is deprecated since React 0.14.0, use ReactDOM.render instead");
    });

    it("invalid[7]: React.unmountComponentAtNode(container);", async ({ task }) => {
      const code = `React.unmountComponentAtNode(container);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 7)\n\n--- Source code under test ---\nReact.unmountComponentAtNode(container);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.unmountComponentAtNode is deprecated since React 0.14.0, use ReactDOM.unmountComponentAtNode instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.unmountComponentAtNode is deprecated since React 0.14.0, use ReactDOM.unmountComponentAtNode instead");
    });

    it("invalid[8]: React.findDOMNode(instance);", async ({ task }) => {
      const code = `React.findDOMNode(instance);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 8)\n\n--- Source code under test ---\nReact.findDOMNode(instance);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.findDOMNode is deprecated since React 0.14.0, use ReactDOM.findDOMNode instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.findDOMNode is deprecated since React 0.14.0, use ReactDOM.findDOMNode instead");
    });

    it("invalid[9]: React.renderToString(element);", async ({ task }) => {
      const code = `React.renderToString(element);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 9)\n\n--- Source code under test ---\nReact.renderToString(element);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.renderToString is deprecated since React 0.14.0, use ReactDOMServer.renderToString instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.renderToString is deprecated since React 0.14.0, use ReactDOMServer.renderToString instead");
    });

    it("invalid[10]: React.renderToStaticMarkup(element);", async ({ task }) => {
      const code = `React.renderToStaticMarkup(element);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 10)\n\n--- Source code under test ---\nReact.renderToStaticMarkup(element);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.renderToStaticMarkup is deprecated since React 0.14.0, use ReactDOMServer.renderToStaticMarkup instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.renderToStaticMarkup is deprecated since React 0.14.0, use ReactDOMServer.renderToStaticMarkup instead");
    });

    it("invalid[11]: React.createClass({});", async ({ task }) => {
      const code = `React.createClass({});`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 11)\n\n--- Source code under test ---\nReact.createClass({});\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead");
    });

    it("invalid[13]: React.PropTypes", async ({ task }) => {
      const code = `React.PropTypes`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 13)\n\n--- Source code under test ---\nReact.PropTypes\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead");
    });

    it("invalid[14]: var {createClass} = require('react');", async ({ task }) => {
      const code = `var {createClass} = require('react');`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 14)\n\n--- Source code under test ---\nvar {createClass} = require('react');\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead");
    });

    it("invalid[15]: var {createClass, PropTypes} = require('react');", async ({ task }) => {
      const code = `var {createClass, PropTypes} = require('react');`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 15)\n\n--- Source code under test ---\nvar {createClass, PropTypes} = require('react');\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: deprecated): React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead\n  [1] (messageId: deprecated): React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead");
      expect(matches[1].message).toBe("React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead");
    });

    it("invalid[16]: import {createClass} from 'react';", async ({ task }) => {
      const code = `import {createClass} from 'react';`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 16)\n\n--- Source code under test ---\nimport {createClass} from 'react';\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead");
    });

    it("invalid[17]: import {createClass, PropTypes} from 'react';", async ({ task }) => {
      const code = `import {createClass, PropTypes} from 'react';`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 17)\n\n--- Source code under test ---\nimport {createClass, PropTypes} from 'react';\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: deprecated): React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead\n  [1] (messageId: deprecated): React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead");
      expect(matches[1].message).toBe("React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead");
    });

    it("invalid[18]: import React from 'react'; const {createClass, PropTypes}...", async ({ task }) => {
      const code = `
      import React from 'react';
      const {createClass, PropTypes} = React;
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 18)\n\n--- Source code under test ---\n\n      import React from 'react';\n      const {createClass, PropTypes} = React;\n    \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: deprecated): React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead\n  [1] (messageId: deprecated): React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("React.createClass is deprecated since React 15.5.0, use the npm module create-react-class instead");
      expect(matches[1].message).toBe("React.PropTypes is deprecated since React 15.5.0, use the npm module prop-types instead");
    });

    it("invalid[19]: import {printDOM} from 'react-addons-perf';", async ({ task }) => {
      const code = `import {printDOM} from 'react-addons-perf';`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 19)\n\n--- Source code under test ---\nimport {printDOM} from 'react-addons-perf';\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): ReactPerf.printDOM is deprecated since React 15.0.0, use ReactPerf.printOperations instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("ReactPerf.printDOM is deprecated since React 15.0.0, use ReactPerf.printOperations instead");
    });

    it("invalid[20]: import ReactPerf from 'react-addons-perf'; const {printDO...", async ({ task }) => {
      const code = `
        import ReactPerf from 'react-addons-perf';
        const {printDOM} = ReactPerf;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 20)\n\n--- Source code under test ---\n\n        import ReactPerf from 'react-addons-perf';\n        const {printDOM} = ReactPerf;\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): ReactPerf.printDOM is deprecated since React 15.0.0, use ReactPerf.printOperations instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("ReactPerf.printDOM is deprecated since React 15.0.0, use ReactPerf.printOperations instead");
    });

    it("invalid[21]: React.DOM.div", async ({ task }) => {
      const code = `React.DOM.div`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 21)\n\n--- Source code under test ---\nReact.DOM.div\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: deprecated): React.DOM is deprecated since React 15.6.0, use the npm module react-dom-factories instead\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("React.DOM is deprecated since React 15.6.0, use the npm module react-dom-factories instead");
    });

    it("invalid[22]: class Bar extends React.PureComponent { componentWillMoun...", async ({ task }) => {
      const code = `
        class Bar extends React.PureComponent {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 22)\n\n--- Source code under test ---\n\n        class Bar extends React.PureComponent {\n          componentWillMount() {}\n          componentWillReceiveProps() {}\n          componentWillUpdate() {}\n        };\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: deprecated): componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [1] (messageId: deprecated): componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [2] (messageId: deprecated): componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[1].message).toBe("componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[2].message).toBe("componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
    });

    it("invalid[23]: function Foo() { return class Bar extends React.PureCompo...", async ({ task }) => {
      const code = `
        function Foo() {
          return class Bar extends React.PureComponent {
            componentWillMount() {}
            componentWillReceiveProps() {}
            componentWillUpdate() {}
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 23)\n\n--- Source code under test ---\n\n        function Foo() {\n          return class Bar extends React.PureComponent {\n            componentWillMount() {}\n            componentWillReceiveProps() {}\n            componentWillUpdate() {}\n          };\n        }\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: deprecated): componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [1] (messageId: deprecated): componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [2] (messageId: deprecated): componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[1].message).toBe("componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[2].message).toBe("componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
    });

    it("invalid[24]: class Bar extends PureComponent { componentWillMount() {}...", async ({ task }) => {
      const code = `
        class Bar extends PureComponent {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        class Bar extends PureComponent {\n          componentWillMount() {}\n          componentWillReceiveProps() {}\n          componentWillUpdate() {}\n        };\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: deprecated): componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [1] (messageId: deprecated): componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [2] (messageId: deprecated): componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[1].message).toBe("componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[2].message).toBe("componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
    });

    it("invalid[25]: class Foo extends React.Component { componentWillMount() ...", async ({ task }) => {
      const code = `
        class Foo extends React.Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          componentWillMount() {}\n          componentWillReceiveProps() {}\n          componentWillUpdate() {}\n        }\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: deprecated): componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [1] (messageId: deprecated): componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [2] (messageId: deprecated): componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[1].message).toBe("componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[2].message).toBe("componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
    });

    it("invalid[26]: class Foo extends Component { componentWillMount() {} com...", async ({ task }) => {
      const code = `
        class Foo extends Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        class Foo extends Component {\n          componentWillMount() {}\n          componentWillReceiveProps() {}\n          componentWillUpdate() {}\n        }\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: deprecated): componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [1] (messageId: deprecated): componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [2] (messageId: deprecated): componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[1].message).toBe("componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[2].message).toBe("componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
    });

    it("invalid[27]: var Foo = createReactClass({ componentWillMount: function...", async ({ task }) => {
      const code = `
        var Foo = createReactClass({
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {}
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 27)\n\n--- Source code under test ---\n\n        var Foo = createReactClass({\n          componentWillMount: function() {},\n          componentWillReceiveProps: function() {},\n          componentWillUpdate: function() {}\n        })\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: deprecated): componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [1] (messageId: deprecated): componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [2] (messageId: deprecated): componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[1].message).toBe("componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[2].message).toBe("componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
    });

    it("invalid[28]: class Foo extends React.Component { constructor() {} comp...", async ({ task }) => {
      const code = `
        class Foo extends React.Component {
          constructor() {}
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 28)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          constructor() {}\n          componentWillMount() {}\n          componentWillReceiveProps() {}\n          componentWillUpdate() {}\n        }\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: deprecated): componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [1] (messageId: deprecated): componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n  [2] (messageId: deprecated): componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("componentWillMount is deprecated since React 16.9.0, use UNSAFE_componentWillMount instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[1].message).toBe("componentWillReceiveProps is deprecated since React 16.9.0, use UNSAFE_componentWillReceiveProps instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
      expect(matches[2].message).toBe("componentWillUpdate is deprecated since React 16.9.0, use UNSAFE_componentWillUpdate instead, see https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.");
    });

    it("invalid[29]: import { render } from 'react-dom'; ReactDOM.render(<div>...", async ({ task }) => {
      const code = `
        import { render } from 'react-dom';
        ReactDOM.render(<div></div>, container);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 29)\n\n--- Source code under test ---\n\n        import { render } from 'react-dom';\n        ReactDOM.render(<div></div>, container);\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: deprecated): ReactDOM.render is deprecated since React 18.0.0, use createRoot instead, see https://reactjs.org/link/switch-to-createroot\n  [1] (messageId: deprecated): ReactDOM.render is deprecated since React 18.0.0, use createRoot instead, see https://reactjs.org/link/switch-to-createroot\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("ReactDOM.render is deprecated since React 18.0.0, use createRoot instead, see https://reactjs.org/link/switch-to-createroot");
      expect(matches[1].message).toBe("ReactDOM.render is deprecated since React 18.0.0, use createRoot instead, see https://reactjs.org/link/switch-to-createroot");
    });

    it("invalid[30]: import { hydrate } from 'react-dom'; ReactDOM.hydrate(<di...", async ({ task }) => {
      const code = `
        import { hydrate } from 'react-dom';
        ReactDOM.hydrate(<div></div>, container);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 30)\n\n--- Source code under test ---\n\n        import { hydrate } from 'react-dom';\n        ReactDOM.hydrate(<div></div>, container);\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: deprecated): ReactDOM.hydrate is deprecated since React 18.0.0, use hydrateRoot instead, see https://reactjs.org/link/switch-to-createroot\n  [1] (messageId: deprecated): ReactDOM.hydrate is deprecated since React 18.0.0, use hydrateRoot instead, see https://reactjs.org/link/switch-to-createroot\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("ReactDOM.hydrate is deprecated since React 18.0.0, use hydrateRoot instead, see https://reactjs.org/link/switch-to-createroot");
      expect(matches[1].message).toBe("ReactDOM.hydrate is deprecated since React 18.0.0, use hydrateRoot instead, see https://reactjs.org/link/switch-to-createroot");
    });

    it("invalid[31]: import { unmountComponentAtNode } from 'react-dom'; React...", async ({ task }) => {
      const code = `
        import { unmountComponentAtNode } from 'react-dom';
        ReactDOM.unmountComponentAtNode(container);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 31)\n\n--- Source code under test ---\n\n        import { unmountComponentAtNode } from 'react-dom';\n        ReactDOM.unmountComponentAtNode(container);\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: deprecated): ReactDOM.unmountComponentAtNode is deprecated since React 18.0.0, use root.unmount instead, see https://reactjs.org/link/switch-to-createroot\n  [1] (messageId: deprecated): ReactDOM.unmountComponentAtNode is deprecated since React 18.0.0, use root.unmount instead, see https://reactjs.org/link/switch-to-createroot\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("ReactDOM.unmountComponentAtNode is deprecated since React 18.0.0, use root.unmount instead, see https://reactjs.org/link/switch-to-createroot");
      expect(matches[1].message).toBe("ReactDOM.unmountComponentAtNode is deprecated since React 18.0.0, use root.unmount instead, see https://reactjs.org/link/switch-to-createroot");
    });

    it("invalid[32]: import { renderToNodeStream } from 'react-dom/server'; Re...", async ({ task }) => {
      const code = `
        import { renderToNodeStream } from 'react-dom/server';
        ReactDOMServer.renderToNodeStream(element);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-deprecated\nType: invalid (index 32)\n\n--- Source code under test ---\n\n        import { renderToNodeStream } from 'react-dom/server';\n        ReactDOMServer.renderToNodeStream(element);\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: deprecated): ReactDOMServer.renderToNodeStream is deprecated since React 18.0.0, use renderToPipeableStream instead, see https://reactjs.org/docs/react-dom-server.html#rendertonodestream\n  [1] (messageId: deprecated): ReactDOMServer.renderToNodeStream is deprecated since React 18.0.0, use renderToPipeableStream instead, see https://reactjs.org/docs/react-dom-server.html#rendertonodestream\n\nRule message templates:\n  deprecated: {{oldMethod}} is deprecated since React {{version}}{{newMethod}}{{refs}}";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-deprecated", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("ReactDOMServer.renderToNodeStream is deprecated since React 18.0.0, use renderToPipeableStream instead, see https://reactjs.org/docs/react-dom-server.html#rendertonodestream");
      expect(matches[1].message).toBe("ReactDOMServer.renderToNodeStream is deprecated since React 18.0.0, use renderToPipeableStream instead, see https://reactjs.org/docs/react-dom-server.html#rendertonodestream");
    });

  });
});
