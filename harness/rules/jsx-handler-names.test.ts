import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-handler-names";
const VALID_COUNT = 17;

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

const cases = [
  { code: `<TestComponent onChange={this.handleChange} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.handle123Change} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.props.onChange} />`, filename: "test.jsx" },
  { code: `
        <TestComponent
          onChange={
            this
              .handleChange
          } />
      `, filename: "test.jsx" },
  { code: `
        <TestComponent
          onChange={
            this
              .props
              .handleChange
          } />
      `, filename: "test.jsx" },
  { code: `<TestComponent onChange={() => 42} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.props.onFoo} />`, filename: "test.jsx" },
  { code: `<TestComponent isSelected={this.props.isSelected} />`, filename: "test.jsx" },
  { code: `<TestComponent shouldDisplay={this.state.shouldDisplay} />`, filename: "test.jsx" },
  { code: `<TestComponent shouldDisplay={arr[0].prop} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={props.onChange} />`, filename: "test.jsx" },
  { code: `<TestComponent ref={this.handleRef} />`, filename: "test.jsx" },
  { code: `<TestComponent ref={this.somethingRef} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={props::handleChange} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={::props.onChange} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={props.foo::handleChange} />`, filename: "test.jsx" },
  { code: `<TestComponent only={this.only} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.doSomethingOnChange} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.handlerChange} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.handle} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.handle2} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.handl3Change} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.handle4change} />`, filename: "test.jsx" },
  { code: `<TestComponent only={this.handleChange} />`, filename: "test.jsx" },
  { code: `<TestComponent2 only={this.handleChange} />`, filename: "test.jsx" },
  { code: `<TestComponent handleChange={this.handleChange} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={this.onChange} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={props::onChange} />`, filename: "test.jsx" },
  { code: `<TestComponent onChange={props.foo::onChange} />`, filename: "test.jsx" },
];

describe("jsx-handler-names", () => {
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
    it("valid[0]: <TestComponent onChange={this.handleChange} />", ({ task }) => {
      const code = `<TestComponent onChange={this.handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 0)\n\n--- Source code under test ---\n<TestComponent onChange={this.handleChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <TestComponent onChange={this.handle123Change} />", ({ task }) => {
      const code = `<TestComponent onChange={this.handle123Change} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 1)\n\n--- Source code under test ---\n<TestComponent onChange={this.handle123Change} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <TestComponent onChange={this.props.onChange} />", ({ task }) => {
      const code = `<TestComponent onChange={this.props.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 2)\n\n--- Source code under test ---\n<TestComponent onChange={this.props.onChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <TestComponent onChange={ this .handleChange } />", ({ task }) => {
      const code = `
        <TestComponent
          onChange={
            this
              .handleChange
          } />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 3)\n\n--- Source code under test ---\n\n        <TestComponent\n          onChange={\n            this\n              .handleChange\n          } />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <TestComponent onChange={ this .props .handleChange } />", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <TestComponent onChange={() => 42} />", ({ task }) => {
      const code = `<TestComponent onChange={() => 42} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 10)\n\n--- Source code under test ---\n<TestComponent onChange={() => 42} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <TestComponent onChange={this.props.onFoo} />", ({ task }) => {
      const code = `<TestComponent onChange={this.props.onFoo} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 11)\n\n--- Source code under test ---\n<TestComponent onChange={this.props.onFoo} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <TestComponent isSelected={this.props.isSelected} />", ({ task }) => {
      const code = `<TestComponent isSelected={this.props.isSelected} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 12)\n\n--- Source code under test ---\n<TestComponent isSelected={this.props.isSelected} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <TestComponent shouldDisplay={this.state.shouldDisplay} />", ({ task }) => {
      const code = `<TestComponent shouldDisplay={this.state.shouldDisplay} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 13)\n\n--- Source code under test ---\n<TestComponent shouldDisplay={this.state.shouldDisplay} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <TestComponent shouldDisplay={arr[0].prop} />", ({ task }) => {
      const code = `<TestComponent shouldDisplay={arr[0].prop} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 14)\n\n--- Source code under test ---\n<TestComponent shouldDisplay={arr[0].prop} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <TestComponent onChange={props.onChange} />", ({ task }) => {
      const code = `<TestComponent onChange={props.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 15)\n\n--- Source code under test ---\n<TestComponent onChange={props.onChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <TestComponent ref={this.handleRef} />", ({ task }) => {
      const code = `<TestComponent ref={this.handleRef} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 16)\n\n--- Source code under test ---\n<TestComponent ref={this.handleRef} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <TestComponent ref={this.somethingRef} />", ({ task }) => {
      const code = `<TestComponent ref={this.somethingRef} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 17)\n\n--- Source code under test ---\n<TestComponent ref={this.somethingRef} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <TestComponent onChange={props::handleChange} />", ({ task }) => {
      const code = `<TestComponent onChange={props::handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 19)\n\n--- Source code under test ---\n<TestComponent onChange={props::handleChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <TestComponent onChange={::props.onChange} />", ({ task }) => {
      const code = `<TestComponent onChange={::props.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 20)\n\n--- Source code under test ---\n<TestComponent onChange={::props.onChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <TestComponent onChange={props.foo::handleChange} />", ({ task }) => {
      const code = `<TestComponent onChange={props.foo::handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 21)\n\n--- Source code under test ---\n<TestComponent onChange={props.foo::handleChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: <TestComponent only={this.only} />", ({ task }) => {
      const code = `<TestComponent only={this.only} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: valid (index 25)\n\n--- Source code under test ---\n<TestComponent only={this.only} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <TestComponent onChange={this.doSomethingOnChange} />", ({ task }) => {
      const code = `<TestComponent onChange={this.doSomethingOnChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 0)\n\n--- Source code under test ---\n<TestComponent onChange={this.doSomethingOnChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[1]: <TestComponent onChange={this.handlerChange} />", ({ task }) => {
      const code = `<TestComponent onChange={this.handlerChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 1)\n\n--- Source code under test ---\n<TestComponent onChange={this.handlerChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[2]: <TestComponent onChange={this.handle} />", ({ task }) => {
      const code = `<TestComponent onChange={this.handle} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 2)\n\n--- Source code under test ---\n<TestComponent onChange={this.handle} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[3]: <TestComponent onChange={this.handle2} />", ({ task }) => {
      const code = `<TestComponent onChange={this.handle2} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 3)\n\n--- Source code under test ---\n<TestComponent onChange={this.handle2} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[4]: <TestComponent onChange={this.handl3Change} />", ({ task }) => {
      const code = `<TestComponent onChange={this.handl3Change} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 4)\n\n--- Source code under test ---\n<TestComponent onChange={this.handl3Change} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[5]: <TestComponent onChange={this.handle4change} />", ({ task }) => {
      const code = `<TestComponent onChange={this.handle4change} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 5)\n\n--- Source code under test ---\n<TestComponent onChange={this.handle4change} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[8]: <TestComponent only={this.handleChange} />", ({ task }) => {
      const code = `<TestComponent only={this.handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 8)\n\n--- Source code under test ---\n<TestComponent only={this.handleChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Prop key for handleChange must begin with 'on'\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop key for handleChange must begin with 'on'");
    });

    it("invalid[9]: <TestComponent2 only={this.handleChange} />", ({ task }) => {
      const code = `<TestComponent2 only={this.handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 9)\n\n--- Source code under test ---\n<TestComponent2 only={this.handleChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badPropKey): Prop key for handleChange must begin with 'on'\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop key for handleChange must begin with 'on'");
    });

    it("invalid[10]: <TestComponent handleChange={this.handleChange} />", ({ task }) => {
      const code = `<TestComponent handleChange={this.handleChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 10)\n\n--- Source code under test ---\n<TestComponent handleChange={this.handleChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badPropKey): Prop key for handleChange must begin with 'on'\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop key for handleChange must begin with 'on'");
    });

    it("invalid[15]: <TestComponent onChange={this.onChange} />", ({ task }) => {
      const code = `<TestComponent onChange={this.onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 15)\n\n--- Source code under test ---\n<TestComponent onChange={this.onChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[16]: <TestComponent onChange={props::onChange} />", ({ task }) => {
      const code = `<TestComponent onChange={props::onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 16)\n\n--- Source code under test ---\n<TestComponent onChange={props::onChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

    it("invalid[17]: <TestComponent onChange={props.foo::onChange} />", ({ task }) => {
      const code = `<TestComponent onChange={props.foo::onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-handler-names\nType: invalid (index 17)\n\n--- Source code under test ---\n<TestComponent onChange={props.foo::onChange} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: badHandlerName): Handler function for onChange prop key must be a camelCase name beginning with 'handle' only\n\nFeatures: bind operator\n\nRule message templates:\n  badHandlerName: Handler function for {{propKey}} prop key must be a camelCase name beginning with '{{handlerPrefix}}' only\n  badPropKey: Prop key for {{propValue}} must begin with '{{handlerPropPrefix}}'";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Handler function for onChange prop key must be a camelCase name beginning with 'handle' only");
    });

  });
});
