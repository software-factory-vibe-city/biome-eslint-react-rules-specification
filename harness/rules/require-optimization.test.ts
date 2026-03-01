import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Component is not optimized. Please add a shouldComponentUpdate method.",
];

describe("require-optimization", () => {
  describe("valid", () => {
    it("valid[0]: class A {}", async ({ task }) => {
      const code = `
        class A {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class A {}\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: import React from \"react\"; class YourComponent extends Re...", async ({ task }) => {
      const code = `
        import React from "react";
        class YourComponent extends React.Component {
          shouldComponentUpdate () {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 1)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        class YourComponent extends React.Component {\n          shouldComponentUpdate () {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: import React, {Component} from \"react\"; class YourCompone...", async ({ task }) => {
      const code = `
        import React, {Component} from "react";
        class YourComponent extends Component {
          shouldComponentUpdate () {}
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 2)\n\n--- Source code under test ---\n\n        import React, {Component} from \"react\";\n        class YourComponent extends Component {\n          shouldComponentUpdate () {}\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: import React, {Component} from \"react\"; @reactMixin.decor...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: import React from \"react\"; createReactClass({ shouldCompo...", async ({ task }) => {
      const code = `
        import React from "react";
        createReactClass({
          shouldComponentUpdate: function () {}
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 4)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        createReactClass({\n          shouldComponentUpdate: function () {}\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: import React from \"react\"; createReactClass({ mixins: [Pu...", async ({ task }) => {
      const code = `
        import React from "react";
        createReactClass({
          mixins: [PureRenderMixin]
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 5)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        createReactClass({\n          mixins: [PureRenderMixin]\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: @reactMixin.decorate(PureRenderMixin) class DecoratedComp...", async ({ task }) => {
      const code = `
        @reactMixin.decorate(PureRenderMixin)
        class DecoratedComponent extends Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 6)\n\n--- Source code under test ---\n\n        @reactMixin.decorate(PureRenderMixin)\n        class DecoratedComponent extends Component {}\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: decorators\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: const FunctionalComponent = function (props) { return <di...", async ({ task }) => {
      const code = `
        const FunctionalComponent = function (props) {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 7)\n\n--- Source code under test ---\n\n        const FunctionalComponent = function (props) {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: function FunctionalComponent(props) { return <div />; }", async ({ task }) => {
      const code = `
        function FunctionalComponent(props) {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 8)\n\n--- Source code under test ---\n\n        function FunctionalComponent(props) {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const FunctionalComponent = (props) => { return <div />; }", async ({ task }) => {
      const code = `
        const FunctionalComponent = (props) => {
          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 9)\n\n--- Source code under test ---\n\n        const FunctionalComponent = (props) => {\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: const obj = { prop: [,,,,,] }", async ({ task }) => {
      const code = `
        const obj = { prop: [,,,,,] }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: valid (index 13)\n\n--- Source code under test ---\n\n        const obj = { prop: [,,,,,] }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: import React from \"react\"; class YourComponent extends Re...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: import React from \"react\"; class YourComponent extends Re...", async ({ task }) => {
      const code = `
        import React from "react";
        class YourComponent extends React.Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        class YourComponent extends React.Component {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[1]: import React from \"react\"; class YourComponent extends Re...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[2]: import React from \"react\"; class YourComponent extends Re...", async ({ task }) => {
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
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[3]: import React, {Component} from \"react\"; class YourCompone...", async ({ task }) => {
      const code = `
        import React, {Component} from "react";
        class YourComponent extends Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        import React, {Component} from \"react\";\n        class YourComponent extends Component {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[4]: import React from \"react\"; createReactClass({})", async ({ task }) => {
      const code = `
        import React from "react";
        createReactClass({})
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        createReactClass({})\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[5]: import React from \"react\"; createReactClass({ mixins: [Ra...", async ({ task }) => {
      const code = `
        import React from "react";
        createReactClass({
          mixins: [RandomMixin]
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        createReactClass({\n          mixins: [RandomMixin]\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

    it("invalid[6]: @reactMixin.decorate(SomeOtherMixin) class DecoratedCompo...", async ({ task }) => {
      const code = `
        @reactMixin.decorate(SomeOtherMixin)
        class DecoratedComponent extends Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: require-optimization\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        @reactMixin.decorate(SomeOtherMixin)\n        class DecoratedComponent extends Component {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldComponentUpdate): Component is not optimized. Please add a shouldComponentUpdate method.\n\nFeatures: decorators\n\nRule message templates:\n  noShouldComponentUpdate: Component is not optimized. Please add a shouldComponentUpdate method.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "require-optimization", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Component is not optimized. Please add a shouldComponentUpdate method.");
    });

  });
});
