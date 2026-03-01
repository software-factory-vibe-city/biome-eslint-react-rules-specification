import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-arrow-function-lifecycle";
const VALID_COUNT = 37;

const RULE_MESSAGES = [
  "{{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "getDefaultProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "getChildContext is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "UNSAFE_componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "componentDidMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "UNSAFE_componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "shouldComponentUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "UNSAFE_componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "getSnapshotBeforeUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "componentDidUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "componentDidCatch is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "componentWillUnmount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
  "getDerivedStateFromProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.",
];

const cases = [
  { code: `
        var Hello = createReactClass({
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getDefaultProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getInitialState: function() { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getChildContext: function() { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getDerivedStateFromProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          UNSAFE_componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidMount: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          UNSAFE_componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          shouldComponentUpdate: function() { return true; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          UNSAFE_componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getSnapshotBeforeUpdate: function() { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidUpdate: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidCatch: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentWillUnmount: function() {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDefaultProps() { return {}; }
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getInitialState() { return {}; }
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getChildContext() { return {}; }
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDerivedStateFromProps() { return {}; }
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillMount() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidMount() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate() { return true; }
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUpdate() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate() { return {}; }
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidUpdate() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidCatch() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUnmount() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDerivedStateFromProps = () => { return {}; } // not a lifecycle method
          static getDerivedStateFromProps() {}
          render() { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getDerivedStateFromProps: () => { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        class MyComponent extends React.Component {
          onChange: () => void;
        }
      `, filename: "test.tsx" },
  { code: `
        var Hello = createReactClass({
          render: () => { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getDefaultProps: () => { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getInitialState: () => { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getChildContext: () => { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentWillMount: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          UNSAFE_componentWillMount: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidMount: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentWillReceiveProps: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          UNSAFE_componentWillReceiveProps: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          shouldComponentUpdate: () => { return true; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentWillUpdate: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          UNSAFE_componentWillUpdate: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          getSnapshotBeforeUpdate: () => { return {}; },
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidUpdate: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidCatch: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentWillUnmount: () => {},
          render: function() { return <div />; }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDefaultProps = () => { return {}; }
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getInitialState = () => { return {}; }
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getChildContext = () => { return {}; }
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          static getDerivedStateFromProps = () => { return {}; }
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillMount = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidMount = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate = () => { return true; }
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUpdate = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate = () => { return {}; }
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidUpdate = (prevProps) => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidCatch = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUnmount = () => {}
          render = () => { return <div />; }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render = () => <div />
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render = () => /*first*/<div />/*second*/
        }
      `, filename: "test.jsx" },
  { code: `
        export default class Root extends Component {
          getInitialState = () => ({
            errorImporting: null,
            errorParsing: null,
            errorUploading: null,
            file: null,
            fromExtension: false,
            importSuccess: false,
            isImporting: false,
            isParsing: false,
            isUploading: false,
            parsedResults: null,
            showLongRunningMessage: false,
          });
        }
      `, filename: "test.jsx" },
];

describe("no-arrow-function-lifecycle", () => {
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
    it("valid[0]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ getDefaultProps: function(...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getDefaultProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getDefaultProps: function() { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ getInitialState: function(...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getInitialState: function() { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getInitialState: function() { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ getChildContext: function(...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getChildContext: function() { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getChildContext: function() { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = createReactClass({ getDerivedStateFromProps: ...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getDerivedStateFromProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getDerivedStateFromProps: function() { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var Hello = createReactClass({ componentWillMount: functi...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 5)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillMount: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: var Hello = createReactClass({ UNSAFE_componentWillMount:...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          UNSAFE_componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 6)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          UNSAFE_componentWillMount: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var Hello = createReactClass({ componentDidMount: functio...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 7)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: var Hello = createReactClass({ componentWillReceiveProps:...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 8)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillReceiveProps: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: var Hello = createReactClass({ UNSAFE_componentWillReceiv...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          UNSAFE_componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 9)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          UNSAFE_componentWillReceiveProps: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: var Hello = createReactClass({ shouldComponentUpdate: fun...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          shouldComponentUpdate: function() { return true; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 10)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          shouldComponentUpdate: function() { return true; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: var Hello = createReactClass({ componentWillUpdate: funct...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 11)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUpdate: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: var Hello = createReactClass({ UNSAFE_componentWillUpdate...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          UNSAFE_componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 12)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          UNSAFE_componentWillUpdate: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: var Hello = createReactClass({ getSnapshotBeforeUpdate: f...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getSnapshotBeforeUpdate: function() { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 13)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getSnapshotBeforeUpdate: function() { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: var Hello = createReactClass({ componentDidUpdate: functi...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 14)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: var Hello = createReactClass({ componentDidCatch: functio...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidCatch: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 15)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidCatch: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: var Hello = createReactClass({ componentWillUnmount: func...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUnmount: function() {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 16)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUnmount: function() {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 17)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDefaultProps() { return {}; }
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 18)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getDefaultProps() { return {}; }\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getInitialState() { return {}; }
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 19)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getInitialState() { return {}; }\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getChildContext() { return {}; }
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 20)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getChildContext() { return {}; }\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDerivedStateFromProps() { return {}; }
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 21)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getDerivedStateFromProps() { return {}; }\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillMount() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 22)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentWillMount() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 23)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          UNSAFE_componentWillMount() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidMount() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 24)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentDidMount() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 25)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentWillReceiveProps() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 26)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          UNSAFE_componentWillReceiveProps() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate() { return true; }
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 27)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          shouldComponentUpdate() { return true; }\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUpdate() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 28)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentWillUpdate() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 29)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          UNSAFE_componentWillUpdate() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate() { return {}; }
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 30)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getSnapshotBeforeUpdate() { return {}; }\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidUpdate() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 31)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentDidUpdate() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidCatch() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 32)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentDidCatch() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUnmount() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 33)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentWillUnmount() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDerivedStateFromProps = () => { return {}; } // not a lifecycle method
          static getDerivedStateFromProps() {}
          render() { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 34)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getDerivedStateFromProps = () => { return {}; } // not a lifecycle method\n          static getDerivedStateFromProps() {}\n          render() { return <div />; }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: var Hello = createReactClass({ getDerivedStateFromProps: ...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getDerivedStateFromProps: () => { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 35)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getDerivedStateFromProps: () => { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: class MyComponent extends React.Component { onChange: () ...", ({ task }) => {
      const code = `
        class MyComponent extends React.Component {
          onChange: () => void;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: valid (index 36)\n\n--- Source code under test ---\n\n        class MyComponent extends React.Component {\n          onChange: () => void;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ render: () => { return <di...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: () => { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: () => { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[1]: var Hello = createReactClass({ getDefaultProps: () => { r...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getDefaultProps: () => { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getDefaultProps: () => { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: getDefaultProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("getDefaultProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[2]: var Hello = createReactClass({ getInitialState: () => { r...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getInitialState: () => { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getInitialState: () => { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[3]: var Hello = createReactClass({ getChildContext: () => { r...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getChildContext: () => { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getChildContext: () => { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: getChildContext is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("getChildContext is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[4]: var Hello = createReactClass({ componentWillMount: () => ...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillMount: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillMount: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[5]: var Hello = createReactClass({ UNSAFE_componentWillMount:...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          UNSAFE_componentWillMount: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          UNSAFE_componentWillMount: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: UNSAFE_componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("UNSAFE_componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[6]: var Hello = createReactClass({ componentDidMount: () => {...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: componentDidMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("componentDidMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[7]: var Hello = createReactClass({ componentWillReceiveProps:...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillReceiveProps: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillReceiveProps: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[8]: var Hello = createReactClass({ UNSAFE_componentWillReceiv...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          UNSAFE_componentWillReceiveProps: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          UNSAFE_componentWillReceiveProps: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: UNSAFE_componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("UNSAFE_componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[9]: var Hello = createReactClass({ shouldComponentUpdate: () ...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          shouldComponentUpdate: () => { return true; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          shouldComponentUpdate: () => { return true; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: shouldComponentUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("shouldComponentUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[10]: var Hello = createReactClass({ componentWillUpdate: () =>...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUpdate: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUpdate: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[11]: var Hello = createReactClass({ UNSAFE_componentWillUpdate...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          UNSAFE_componentWillUpdate: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          UNSAFE_componentWillUpdate: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: UNSAFE_componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("UNSAFE_componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[12]: var Hello = createReactClass({ getSnapshotBeforeUpdate: (...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          getSnapshotBeforeUpdate: () => { return {}; },
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          getSnapshotBeforeUpdate: () => { return {}; },\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: getSnapshotBeforeUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("getSnapshotBeforeUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[13]: var Hello = createReactClass({ componentDidUpdate: () => ...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidUpdate: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidUpdate: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: componentDidUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("componentDidUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[14]: var Hello = createReactClass({ componentDidCatch: () => {...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidCatch: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidCatch: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: componentDidCatch is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("componentDidCatch is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[15]: var Hello = createReactClass({ componentWillUnmount: () =...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentWillUnmount: () => {},
          render: function() { return <div />; }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentWillUnmount: () => {},\n          render: function() { return <div />; }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: componentWillUnmount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[52], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("componentWillUnmount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[16]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[53], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[17]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDefaultProps = () => { return {}; }
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 17)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getDefaultProps = () => { return {}; }\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: getDefaultProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[54], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("getDefaultProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[18]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getInitialState = () => { return {}; }
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getInitialState = () => { return {}; }\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[55], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[19]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getChildContext = () => { return {}; }
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 19)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getChildContext = () => { return {}; }\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: getChildContext is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[56], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("getChildContext is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[20]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          static getDerivedStateFromProps = () => { return {}; }
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 20)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          static getDerivedStateFromProps = () => { return {}; }\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: getDerivedStateFromProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[57], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("getDerivedStateFromProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[21]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillMount = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 21)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentWillMount = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[58], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[22]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 22)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          UNSAFE_componentWillMount = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: UNSAFE_componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[59], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("UNSAFE_componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[23]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidMount = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 23)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentDidMount = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: componentDidMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[60], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("componentDidMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[24]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentWillReceiveProps = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[61], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[25]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          UNSAFE_componentWillReceiveProps = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: UNSAFE_componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[62], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("UNSAFE_componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[26]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate = () => { return true; }
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          shouldComponentUpdate = () => { return true; }\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: shouldComponentUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[63], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("shouldComponentUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[27]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUpdate = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 27)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentWillUpdate = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[64], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[28]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 28)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          UNSAFE_componentWillUpdate = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: UNSAFE_componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[65], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("UNSAFE_componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[29]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate = () => { return {}; }
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 29)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          getSnapshotBeforeUpdate = () => { return {}; }\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: getSnapshotBeforeUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[66], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("getSnapshotBeforeUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[30]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidUpdate = (prevProps) => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 30)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentDidUpdate = (prevProps) => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: componentDidUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[67], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("componentDidUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[31]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidCatch = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 31)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentDidCatch = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: componentDidCatch is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[68], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("componentDidCatch is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[32]: class Hello extends React.Component { handleEventMethods ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUnmount = () => {}
          render = () => { return <div />; }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 32)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          handleEventMethods = () => {}\n          componentWillUnmount = () => {}\n          render = () => { return <div />; }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0]: componentWillUnmount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n  [1]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[69], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("componentWillUnmount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
      expect(matches[1].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[33]: class Hello extends React.Component { render = () => <div...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render = () => <div />
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 33)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render = () => <div />\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[70], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[34]: class Hello extends React.Component { render = () => /*fi...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render = () => /*first*/<div />/*second*/
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 34)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render = () => /*first*/<div />/*second*/\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[71], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

    it("invalid[35]: export default class Root extends Component { getInitialS...", ({ task }) => {
      const code = `
        export default class Root extends Component {
          getInitialState = () => ({
            errorImporting: null,
            errorParsing: null,
            errorUploading: null,
            file: null,
            fromExtension: false,
            importSuccess: false,
            isImporting: false,
            isParsing: false,
            isUploading: false,
            parsedResults: null,
            showLongRunningMessage: false,
          });
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-arrow-function-lifecycle\nType: invalid (index 35)\n\n--- Source code under test ---\n\n        export default class Root extends Component {\n          getInitialState = () => ({\n            errorImporting: null,\n            errorParsing: null,\n            errorUploading: null,\n            file: null,\n            fromExtension: false,\n            importSuccess: false,\n            isImporting: false,\n            isParsing: false,\n            isUploading: false,\n            parsedResults: null,\n            showLongRunningMessage: false,\n          });\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.\n\nFeatures: class fields\n\nRule message templates:\n  lifecycle: {{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.";
      const matches = ruleErrors(results[72], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.");
    });

  });
});
