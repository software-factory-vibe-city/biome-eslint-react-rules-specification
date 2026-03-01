import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-access-state-in-setstate";
const VALID_COUNT = 10;

const RULE_MESSAGES = [
  "Use callback in setState when referencing the previous state.",
];

const cases = [
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(state => ({value: state.value + 1}))
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          multiplyValue: function(obj) {
            return obj.value*2
          },
          onClick: function() {
            var value = this.state.value
            this.multiplyValue({ value: value })
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var SearchForm = createReactClass({
          render: function () {
            return (
              <div>
                {(function () {
                  if (this.state.prompt) {
                    return <div>{this.state.prompt}</div>
                  }
                }).call(this)}
              </div>
            );
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({}, () => console.log(this.state));
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({}, () => 1 + 1);
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            var nextValueNotUsed = this.state.value + 1
            var nextValue = 2
            this.setState({value: nextValue})
          }
        });
      `, filename: "test.jsx" },
  { code: `
        function testFunction({a, b}) {
        };
      `, filename: "test.jsx" },
  { code: `
        class ComponentA extends React.Component {
          state = {
            greeting: 'hello',
          };

          myFunc = () => {
            this.setState({ greeting: 'hi' }, () => this.doStuff());
          };

          doStuff = () => {
            console.log(this.state.greeting);
          };
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends Abstract {
          update = () => {
            const result = this.getResult ( this.state.foo );
            return this.setState ({ result });
          };
        }
      `, filename: "test.jsx" },
  { code: `
        class StateContainer extends Container {
          anything() {
            return this.setState({value: this.state.value + 1})
          }
        };
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({value: this.state.value + 1})
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(() => ({value: this.state.value + 1}))
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            var nextValue = this.state.value + 1
            this.setState({value: nextValue})
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            var {state, ...rest} = this
            this.setState({value: state.value + 1})
          }
        });
      `, filename: "test.jsx" },
  { code: `
        function nextState(state) {
          return {value: state.value + 1}
        }
        var Hello = React.createClass({
          onClick: function() {
            this.setState(nextState(this.state))
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(this.state, () => 1 + 1);
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(this.state, () => console.log(this.state));
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = React.createClass({
          nextState: function() {
            return {value: this.state.value + 1}
          },
          onClick: function() {
            this.setState(nextState())
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          onClick() {
            this.setState(this.state, () => console.log(this.state));
          }
        }
      `, filename: "test.jsx" },
];

describe("no-access-state-in-setstate", () => {
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
    it("valid[0]: var Hello = React.createClass({ onClick: function() { thi...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(state => ({value: state.value + 1}))
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            this.setState(state => ({value: state.value + 1}))\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = React.createClass({ multiplyValue: function(o...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          multiplyValue: function(obj) {
            return obj.value*2
          },
          onClick: function() {
            var value = this.state.value
            this.multiplyValue({ value: value })
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          multiplyValue: function(obj) {\n            return obj.value*2\n          },\n          onClick: function() {\n            var value = this.state.value\n            this.multiplyValue({ value: value })\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var SearchForm = createReactClass({ render: function () {...", ({ task }) => {
      const code = `
        var SearchForm = createReactClass({
          render: function () {
            return (
              <div>
                {(function () {
                  if (this.state.prompt) {
                    return <div>{this.state.prompt}</div>
                  }
                }).call(this)}
              </div>
            );
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var SearchForm = createReactClass({\n          render: function () {\n            return (\n              <div>\n                {(function () {\n                  if (this.state.prompt) {\n                    return <div>{this.state.prompt}</div>\n                  }\n                }).call(this)}\n              </div>\n            );\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = React.createClass({ onClick: function() { thi...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({}, () => console.log(this.state));
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 3)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            this.setState({}, () => console.log(this.state));\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = React.createClass({ onClick: function() { thi...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({}, () => 1 + 1);
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 4)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            this.setState({}, () => 1 + 1);\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var Hello = React.createClass({ onClick: function() { var...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            var nextValueNotUsed = this.state.value + 1
            var nextValue = 2
            this.setState({value: nextValue})
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 5)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            var nextValueNotUsed = this.state.value + 1\n            var nextValue = 2\n            this.setState({value: nextValue})\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: function testFunction({a, b}) { };", ({ task }) => {
      const code = `
        function testFunction({a, b}) {
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 6)\n\n--- Source code under test ---\n\n        function testFunction({a, b}) {\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: class ComponentA extends React.Component { state = { gree...", ({ task }) => {
      const code = `
        class ComponentA extends React.Component {
          state = {
            greeting: 'hello',
          };

          myFunc = () => {
            this.setState({ greeting: 'hi' }, () => this.doStuff());
          };

          doStuff = () => {
            console.log(this.state.greeting);
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 7)\n\n--- Source code under test ---\n\n        class ComponentA extends React.Component {\n          state = {\n            greeting: 'hello',\n          };\n\n          myFunc = () => {\n            this.setState({ greeting: 'hi' }, () => this.doStuff());\n          };\n\n          doStuff = () => {\n            console.log(this.state.greeting);\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: class Foo extends Abstract { update = () => { const resul...", ({ task }) => {
      const code = `
        class Foo extends Abstract {
          update = () => {
            const result = this.getResult ( this.state.foo );
            return this.setState ({ result });
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 8)\n\n--- Source code under test ---\n\n        class Foo extends Abstract {\n          update = () => {\n            const result = this.getResult ( this.state.foo );\n            return this.setState ({ result });\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: class StateContainer extends Container { anything() { ret...", ({ task }) => {
      const code = `
        class StateContainer extends Container {
          anything() {
            return this.setState({value: this.state.value + 1})
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: valid (index 9)\n\n--- Source code under test ---\n\n        class StateContainer extends Container {\n          anything() {\n            return this.setState({value: this.state.value + 1})\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = React.createClass({ onClick: function() { thi...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            this.setState({value: this.state.value + 1})
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            this.setState({value: this.state.value + 1})\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

    it("invalid[1]: var Hello = React.createClass({ onClick: function() { thi...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(() => ({value: this.state.value + 1}))
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            this.setState(() => ({value: this.state.value + 1}))\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

    it("invalid[2]: var Hello = React.createClass({ onClick: function() { var...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            var nextValue = this.state.value + 1
            this.setState({value: nextValue})
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            var nextValue = this.state.value + 1\n            this.setState({value: nextValue})\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

    it("invalid[3]: var Hello = React.createClass({ onClick: function() { var...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            var {state, ...rest} = this
            this.setState({value: state.value + 1})
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            var {state, ...rest} = this\n            this.setState({value: state.value + 1})\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

    it("invalid[4]: function nextState(state) { return {value: state.value + ...", ({ task }) => {
      const code = `
        function nextState(state) {
          return {value: state.value + 1}
        }
        var Hello = React.createClass({
          onClick: function() {
            this.setState(nextState(this.state))
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        function nextState(state) {\n          return {value: state.value + 1}\n        }\n        var Hello = React.createClass({\n          onClick: function() {\n            this.setState(nextState(this.state))\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

    it("invalid[5]: var Hello = React.createClass({ onClick: function() { thi...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(this.state, () => 1 + 1);
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            this.setState(this.state, () => 1 + 1);\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

    it("invalid[6]: var Hello = React.createClass({ onClick: function() { thi...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          onClick: function() {
            this.setState(this.state, () => console.log(this.state));
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          onClick: function() {\n            this.setState(this.state, () => console.log(this.state));\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

    it("invalid[7]: var Hello = React.createClass({ nextState: function() { r...", ({ task }) => {
      const code = `
        var Hello = React.createClass({
          nextState: function() {
            return {value: this.state.value + 1}
          },
          onClick: function() {
            this.setState(nextState())
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        var Hello = React.createClass({\n          nextState: function() {\n            return {value: this.state.value + 1}\n          },\n          onClick: function() {\n            this.setState(nextState())\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

    it("invalid[8]: class Hello extends React.Component { onClick() { this.se...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          onClick() {
            this.setState(this.state, () => console.log(this.state));
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-access-state-in-setstate\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          onClick() {\n            this.setState(this.state, () => console.log(this.state));\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: useCallback): Use callback in setState when referencing the previous state.\n\nRule message templates:\n  useCallback: Use callback in setState when referencing the previous state.";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Use callback in setState when referencing the previous state.");
    });

  });
});
