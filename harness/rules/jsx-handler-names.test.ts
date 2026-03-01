import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only",
  "Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'",
  "Handler function for onChange prop key must be a camelCase name beginning with 'handle' only",
  "Prop key for handleChange must begin with 'on'",
  "Prop key for handleChange must begin with 'when'",
  "Prop key for handleInput must begin with 'on'",
  "Prop key for handleCheckbox must begin with 'on'",
  "Prop key for handleButton must begin with 'on'",
];

describe("jsx-handler-names", () => {
  describe("valid", () => {
    it("valid[0]: <TestComponent onChange={this.handleChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 0)\n\n--- Source code under test ---\n<TestComponent onChange={this.handleChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <TestComponent onChange={this.handle123Change} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.handle123Change} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 1)\n\n--- Source code under test ---\n<TestComponent onChange={this.handle123Change} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <TestComponent onChange={this.props.onChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.props.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 2)\n\n--- Source code under test ---\n<TestComponent onChange={this.props.onChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <TestComponent onChange={ this .handleChange } />", async ({ task }) => {
      const code = `
        <TestComponent
          onChange={
            this
              .handleChange
          } />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 3)\n\n--- Source code under test ---\n\n        <TestComponent\n          onChange={\n            this\n              .handleChange\n          } />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <TestComponent onChange={ this .props .handleChange } />", async ({ task }) => {
      const code = `
        <TestComponent
          onChange={
            this
              .props
              .handleChange
          } />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 4)\n\n--- Source code under test ---\n\n        <TestComponent\n          onChange={\n            this\n              .props\n              .handleChange\n          } />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <TestComponent onChange={() => 42} />", async ({ task }) => {
      const code = `<TestComponent onChange={() => 42} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 10)\n\n--- Source code under test ---\n<TestComponent onChange={() => 42} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <TestComponent onChange={this.props.onFoo} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.props.onFoo} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 11)\n\n--- Source code under test ---\n<TestComponent onChange={this.props.onFoo} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <TestComponent isSelected={this.props.isSelected} />", async ({ task }) => {
      const code = `<TestComponent isSelected={this.props.isSelected} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 12)\n\n--- Source code under test ---\n<TestComponent isSelected={this.props.isSelected} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <TestComponent shouldDisplay={this.state.shouldDisplay} />", async ({ task }) => {
      const code = `<TestComponent shouldDisplay={this.state.shouldDisplay} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 13)\n\n--- Source code under test ---\n<TestComponent shouldDisplay={this.state.shouldDisplay} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <TestComponent shouldDisplay={arr[0].prop} />", async ({ task }) => {
      const code = `<TestComponent shouldDisplay={arr[0].prop} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 14)\n\n--- Source code under test ---\n<TestComponent shouldDisplay={arr[0].prop} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <TestComponent onChange={props.onChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={props.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 15)\n\n--- Source code under test ---\n<TestComponent onChange={props.onChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <TestComponent ref={this.handleRef} />", async ({ task }) => {
      const code = `<TestComponent ref={this.handleRef} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 16)\n\n--- Source code under test ---\n<TestComponent ref={this.handleRef} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <TestComponent ref={this.somethingRef} />", async ({ task }) => {
      const code = `<TestComponent ref={this.somethingRef} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 17)\n\n--- Source code under test ---\n<TestComponent ref={this.somethingRef} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <TestComponent onChange={props::handleChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={props::handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 19)\n\n--- Source code under test ---\n<TestComponent onChange={props::handleChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <TestComponent onChange={::props.onChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={::props.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 20)\n\n--- Source code under test ---\n<TestComponent onChange={::props.onChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <TestComponent onChange={props.foo::handleChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={props.foo::handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 21)\n\n--- Source code under test ---\n<TestComponent onChange={props.foo::handleChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: <TestComponent only={this.only} />", async ({ task }) => {
      const code = `<TestComponent only={this.only} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 25)\n\n--- Source code under test ---\n<TestComponent only={this.only} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <TestComponent onChange={this.doSomethingOnChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.doSomethingOnChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 0)\n\n--- Source code under test ---\n<TestComponent onChange={this.doSomethingOnChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[1]: <TestComponent onChange={this.handlerChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.handlerChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 1)\n\n--- Source code under test ---\n<TestComponent onChange={this.handlerChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[2]: <TestComponent onChange={this.handle} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.handle} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 2)\n\n--- Source code under test ---\n<TestComponent onChange={this.handle} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[3]: <TestComponent onChange={this.handle2} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.handle2} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 3)\n\n--- Source code under test ---\n<TestComponent onChange={this.handle2} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[4]: <TestComponent onChange={this.handl3Change} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.handl3Change} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 4)\n\n--- Source code under test ---\n<TestComponent onChange={this.handl3Change} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[5]: <TestComponent onChange={this.handle4change} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.handle4change} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 5)\n\n--- Source code under test ---\n<TestComponent onChange={this.handle4change} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[8]: <TestComponent only={this.handleChange} />", async ({ task }) => {
      const code = `<TestComponent only={this.handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 8)\n\n--- Source code under test ---\n<TestComponent only={this.handleChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Prop key for handleChange must begin with 'on'\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop key for handleChange must begin with 'on'");
    });

    it("invalid[9]: <TestComponent2 only={this.handleChange} />", async ({ task }) => {
      const code = `<TestComponent2 only={this.handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 9)\n\n--- Source code under test ---\n<TestComponent2 only={this.handleChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badPropKey): Prop key for handleChange must begin with 'on'\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop key for handleChange must begin with 'on'");
    });

    it("invalid[10]: <TestComponent handleChange={this.handleChange} />", async ({ task }) => {
      const code = `<TestComponent handleChange={this.handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 10)\n\n--- Source code under test ---\n<TestComponent handleChange={this.handleChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badPropKey): Prop key for handleChange must begin with 'on'\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop key for handleChange must begin with 'on'");
    });

    it("invalid[15]: <TestComponent onChange={this.onChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={this.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 15)\n\n--- Source code under test ---\n<TestComponent onChange={this.onChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[16]: <TestComponent onChange={props::onChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={props::onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 16)\n\n--- Source code under test ---\n<TestComponent onChange={props::onChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[17]: <TestComponent onChange={props.foo::onChange} />", async ({ task }) => {
      const code = `<TestComponent onChange={props.foo::onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 17)\n\n--- Source code under test ---\n<TestComponent onChange={props.foo::onChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-handler-names", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

  });
});
