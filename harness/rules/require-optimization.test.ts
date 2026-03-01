import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "require-optimization";
const VALID_COUNT = 12;

const RULE_MESSAGES = [
  "Component is not optimized. Please add a shouldComponentUpdate method.",
];

const cases = [
  { code: `
        class A {}
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        class YourComponent extends React.Component {
          shouldComponentUpdate () {}
        }
      `, filename: "test.jsx" },
  { code: `
        import React, {Component} from "react";
        class YourComponent extends Component {
          shouldComponentUpdate () {}
        }
      `, filename: "test.jsx" },
  { code: `
        import React, {Component} from "react";
        @reactMixin.decorate(PureRenderMixin)
        class YourComponent extends Component {
          componentDidMount () {}
          render() {}
        }
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        createReactClass({
          shouldComponentUpdate: function () {}
        })
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        createReactClass({
          mixins: [PureRenderMixin]
        })
      `, filename: "test.jsx" },
  { code: `
        @reactMixin.decorate(PureRenderMixin)
        class DecoratedComponent extends Component {}
      `, filename: "test.jsx" },
  { code: `
        const FunctionalComponent = function (props) {
          return <div />;
        }
      `, filename: "test.jsx" },
  { code: `
        function FunctionalComponent(props) {
          return <div />;
        }
      `, filename: "test.jsx" },
  { code: `
        const FunctionalComponent = (props) => {
          return <div />;
        }
      `, filename: "test.jsx" },
  { code: `
        const obj = { prop: [,,,,,] }
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick = () => {}
          shouldComponentUpdate(){
            return true;
          }
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        class YourComponent extends React.Component {}
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick() {}
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick = () => {}
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `, filename: "test.jsx" },
  { code: `
        import React, {Component} from "react";
        class YourComponent extends Component {}
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        createReactClass({})
      `, filename: "test.jsx" },
  { code: `
        import React from "react";
        createReactClass({
          mixins: [RandomMixin]
        })
      `, filename: "test.jsx" },
  { code: `
        @reactMixin.decorate(SomeOtherMixin)
        class DecoratedComponent extends Component {}
      `, filename: "test.jsx" },
];

describe("require-optimization", () => {
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
    it("valid[0]: class A {}", ({ task }) => {
      const code = `
        class A {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class A {}\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: import React from \"react\"; class YourComponent extends Re...", ({ task }) => {
      const code = `
        import React from "react";
        class YourComponent extends React.Component {
          shouldComponentUpdate () {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 1)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        class YourComponent extends React.Component {\n          shouldComponentUpdate () {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: import React, {Component} from \"react\"; class YourCompone...", ({ task }) => {
      const code = `
        import React, {Component} from "react";
        class YourComponent extends Component {
          shouldComponentUpdate () {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 2)\n\n--- Source code under test ---\n\n        import React, {Component} from \"react\";\n        class YourComponent extends Component {\n          shouldComponentUpdate () {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: import React, {Component} from \"react\"; @reactMixin.decor...", ({ task }) => {
      const code = `
        import React, {Component} from "react";
        @reactMixin.decorate(PureRenderMixin)
        class YourComponent extends Component {
          componentDidMount () {}
          render() {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 3)\n\n--- Source code under test ---\n\n        import React, {Component} from \"react\";\n        @reactMixin.decorate(PureRenderMixin)\n        class YourComponent extends Component {\n          componentDidMount () {}\n          render() {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: decorators\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: import React from \"react\"; createReactClass({ shouldCompo...", ({ task }) => {
      const code = `
        import React from "react";
        createReactClass({
          shouldComponentUpdate: function () {}
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 4)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        createReactClass({\n          shouldComponentUpdate: function () {}\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: import React from \"react\"; createReactClass({ mixins: [Pu...", ({ task }) => {
      const code = `
        import React from "react";
        createReactClass({
          mixins: [PureRenderMixin]
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 5)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        createReactClass({\n          mixins: [PureRenderMixin]\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: @reactMixin.decorate(PureRenderMixin) class DecoratedComp...", ({ task }) => {
      const code = `
        @reactMixin.decorate(PureRenderMixin)
        class DecoratedComponent extends Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 6)\n\n--- Source code under test ---\n\n        @reactMixin.decorate(PureRenderMixin)\n        class DecoratedComponent extends Component {}\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: decorators\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: const FunctionalComponent = function (props) { return <di...", ({ task }) => {
      const code = `
        const FunctionalComponent = function (props) {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 7)\n\n--- Source code under test ---\n\n        const FunctionalComponent = function (props) {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: function FunctionalComponent(props) { return <div />; }", ({ task }) => {
      const code = `
        function FunctionalComponent(props) {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 8)\n\n--- Source code under test ---\n\n        function FunctionalComponent(props) {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const FunctionalComponent = (props) => { return <div />; }", ({ task }) => {
      const code = `
        const FunctionalComponent = (props) => {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 9)\n\n--- Source code under test ---\n\n        const FunctionalComponent = (props) => {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: const obj = { prop: [,,,,,] }", ({ task }) => {
      const code = `
        const obj = { prop: [,,,,,] }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 13)\n\n--- Source code under test ---\n\n        const obj = { prop: [,,,,,] }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: import React from \"react\"; class YourComponent extends Re...", ({ task }) => {
      const code = `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick = () => {}
          shouldComponentUpdate(){
            return true;
          }
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 14)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        class YourComponent extends React.Component {\n          handleClick = () => {}\n          shouldComponentUpdate(){\n            return true;\n          }\n          render() {\n            return <div onClick={this.handleClick}>123</div>\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: import React from \"react\"; class YourComponent extends Re...", ({ task }) => {
      const code = `
        import React from "react";
        class YourComponent extends React.Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        class YourComponent extends React.Component {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[1]: import React from \"react\"; class YourComponent extends Re...", ({ task }) => {
      const code = `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick() {}
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        class YourComponent extends React.Component {\n          handleClick() {}\n          render() {\n            return <div onClick={this.handleClick}>123</div>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[2]: import React from \"react\"; class YourComponent extends Re...", ({ task }) => {
      const code = `
        import React from "react";
        class YourComponent extends React.Component {
          handleClick = () => {}
          render() {
            return <div onClick={this.handleClick}>123</div>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        class YourComponent extends React.Component {\n          handleClick = () => {}\n          render() {\n            return <div onClick={this.handleClick}>123</div>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nFeatures: class fields\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[3]: import React, {Component} from \"react\"; class YourCompone...", ({ task }) => {
      const code = `
        import React, {Component} from "react";
        class YourComponent extends Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        import React, {Component} from \"react\";\n        class YourComponent extends Component {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[4]: import React from \"react\"; createReactClass({})", ({ task }) => {
      const code = `
        import React from "react";
        createReactClass({})
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        createReactClass({})\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[5]: import React from \"react\"; createReactClass({ mixins: [Ra...", ({ task }) => {
      const code = `
        import React from "react";
        createReactClass({
          mixins: [RandomMixin]
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        createReactClass({\n          mixins: [RandomMixin]\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[6]: @reactMixin.decorate(SomeOtherMixin) class DecoratedCompo...", ({ task }) => {
      const code = `
        @reactMixin.decorate(SomeOtherMixin)
        class DecoratedComponent extends Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        @reactMixin.decorate(SomeOtherMixin)\n        class DecoratedComponent extends Component {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nFeatures: decorators\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

  });
});
