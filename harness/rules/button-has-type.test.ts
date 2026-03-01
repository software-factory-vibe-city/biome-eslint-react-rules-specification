import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "button-has-type";
const VALID_COUNT = 27;

const RULE_MESSAGES = [
  "Missing an explicit type attribute for button",
  "The button type attribute must be specified by a static string or a trivial ternary expression",
  "\"{{value}}\" is an invalid value for button type attribute",
  "\"foo\" is an invalid value for button type attribute",
  "\"reset\" is an invalid value for button type attribute",
  "\"true\" is an invalid value for button type attribute",
];

const cases = [
  { code: `<span/>`, filename: "test.jsx" },
  { code: `<span type="foo"/>`, filename: "test.jsx" },
  { code: `<button type="button"/>`, filename: "test.jsx" },
  { code: `<button type="submit"/>`, filename: "test.jsx" },
  { code: `<button type="reset"/>`, filename: "test.jsx" },
  { code: `<button type={"button"}/>`, filename: "test.jsx" },
  { code: `<button type={'button'}/>`, filename: "test.jsx" },
  { code: `<button type={\`button\`}/>`, filename: "test.jsx" },
  { code: `<button type={condition ? "button" : "submit"}/>`, filename: "test.jsx" },
  { code: `<button type={condition ? 'button' : 'submit'}/>`, filename: "test.jsx" },
  { code: `<button type={condition ? \`button\` : \`submit\`}/>`, filename: "test.jsx" },
  { code: `React.createElement("span")`, filename: "test.jsx" },
  { code: `React.createElement("span", {type: "foo"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: "button"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: 'button'})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: \`button\`})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: "submit"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: 'submit'})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: \`submit\`})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: "reset"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: 'reset'})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: \`reset\`})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: condition ? "button" : "submit"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: condition ? 'button' : 'submit'})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: condition ? \`button\` : \`submit\`})`, filename: "test.jsx" },
  { code: `document.createElement("button")`, filename: "test.jsx" },
  { code: `
        function MyComponent(): ReactElement {
          const buttonProps: (Required<Attributes> & ButtonHTMLAttributes<HTMLButtonElement>)[] = [
            {
              children: 'test',
              key: 'test',
              onClick: (): void => {
                return;
              },
            },
          ];

          return <>
            {
              buttonProps.map(
                ({ key, ...props }: Required<Attributes> & ButtonHTMLAttributes<HTMLButtonElement>): ReactElement =>
                  <button key={key} type="button" {...props} />
              )
            }
          </>;
        }
      `, filename: "test.tsx" },
  { code: `<button/>`, filename: "test.jsx" },
  { code: `<button type="foo"/>`, filename: "test.jsx" },
  { code: `<button type={foo}/>`, filename: "test.jsx" },
  { code: `<button type={"foo"}/>`, filename: "test.jsx" },
  { code: `<button type={'foo'}/>`, filename: "test.jsx" },
  { code: `<button type={\`foo\`}/>`, filename: "test.jsx" },
  { code: `<button type={\`button\${foo}\`}/>`, filename: "test.jsx" },
  { code: `<button type={condition ? "button" : foo}/>`, filename: "test.jsx" },
  { code: `<button type={condition ? "button" : "foo"}/>`, filename: "test.jsx" },
  { code: `<button type={condition ? foo : "button"}/>`, filename: "test.jsx" },
  { code: `<button type={condition ? "foo" : "button"}/>`, filename: "test.jsx" },
  { code: `<button type/>`, filename: "test.jsx" },
  { code: `React.createElement("button")`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: foo})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: "foo"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: condition ? "button" : foo})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: condition ? "button" : "foo"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: condition ? foo : "button"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {type: condition ? "foo" : "button"})`, filename: "test.jsx" },
  { code: `React.createElement("button", {...extraProps})`, filename: "test.jsx" },
  { code: `function Button({ type, ...extraProps }) { const button = type; return <button type={button} {...extraProps} />; }`, filename: "test.jsx" },
];

describe("button-has-type", () => {
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
    it("valid[0]: <span/>", ({ task }) => {
      const code = `<span/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 0)\n\n--- Source code under test ---\n<span/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <span type=\"foo\"/>", ({ task }) => {
      const code = `<span type="foo"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 1)\n\n--- Source code under test ---\n<span type=\"foo\"/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <button type=\"button\"/>", ({ task }) => {
      const code = `<button type="button"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 2)\n\n--- Source code under test ---\n<button type=\"button\"/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <button type=\"submit\"/>", ({ task }) => {
      const code = `<button type="submit"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 3)\n\n--- Source code under test ---\n<button type=\"submit\"/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <button type=\"reset\"/>", ({ task }) => {
      const code = `<button type="reset"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 4)\n\n--- Source code under test ---\n<button type=\"reset\"/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <button type={\"button\"}/>", ({ task }) => {
      const code = `<button type={"button"}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 5)\n\n--- Source code under test ---\n<button type={\"button\"}/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <button type={'button'}/>", ({ task }) => {
      const code = `<button type={'button'}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 6)\n\n--- Source code under test ---\n<button type={'button'}/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <button type={`button`}/>", ({ task }) => {
      const code = `<button type={\`button\`}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 7)\n\n--- Source code under test ---\n<button type={`button`}/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <button type={condition ? \"button\" : \"submit\"}/>", ({ task }) => {
      const code = `<button type={condition ? "button" : "submit"}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 8)\n\n--- Source code under test ---\n<button type={condition ? \"button\" : \"submit\"}/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <button type={condition ? 'button' : 'submit'}/>", ({ task }) => {
      const code = `<button type={condition ? 'button' : 'submit'}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 9)\n\n--- Source code under test ---\n<button type={condition ? 'button' : 'submit'}/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <button type={condition ? `button` : `submit`}/>", ({ task }) => {
      const code = `<button type={condition ? \`button\` : \`submit\`}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 10)\n\n--- Source code under test ---\n<button type={condition ? `button` : `submit`}/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: React.createElement(\"span\")", ({ task }) => {
      const code = `React.createElement("span")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 12)\n\n--- Source code under test ---\nReact.createElement(\"span\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(\"span\", {type: \"foo\"})", ({ task }) => {
      const code = `React.createElement("span", {type: "foo"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"span\", {type: \"foo\"})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: React.createElement(\"button\", {type: \"button\"})", ({ task }) => {
      const code = `React.createElement("button", {type: "button"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 14)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: \"button\"})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: React.createElement(\"button\", {type: 'button'})", ({ task }) => {
      const code = `React.createElement("button", {type: 'button'})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: 'button'})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: React.createElement(\"button\", {type: `button`})", ({ task }) => {
      const code = `React.createElement("button", {type: \`button\`})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 16)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: `button`})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: React.createElement(\"button\", {type: \"submit\"})", ({ task }) => {
      const code = `React.createElement("button", {type: "submit"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 17)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: \"submit\"})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: React.createElement(\"button\", {type: 'submit'})", ({ task }) => {
      const code = `React.createElement("button", {type: 'submit'})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 18)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: 'submit'})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: React.createElement(\"button\", {type: `submit`})", ({ task }) => {
      const code = `React.createElement("button", {type: \`submit\`})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 19)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: `submit`})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: React.createElement(\"button\", {type: \"reset\"})", ({ task }) => {
      const code = `React.createElement("button", {type: "reset"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 20)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: \"reset\"})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: React.createElement(\"button\", {type: 'reset'})", ({ task }) => {
      const code = `React.createElement("button", {type: 'reset'})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 21)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: 'reset'})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: React.createElement(\"button\", {type: `reset`})", ({ task }) => {
      const code = `React.createElement("button", {type: \`reset\`})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 22)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: `reset`})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: React.createElement(\"button\", {type: condition ? \"button\"...", ({ task }) => {
      const code = `React.createElement("button", {type: condition ? "button" : "submit"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 23)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: condition ? \"button\" : \"submit\"})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: React.createElement(\"button\", {type: condition ? 'button'...", ({ task }) => {
      const code = `React.createElement("button", {type: condition ? 'button' : 'submit'})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 24)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: condition ? 'button' : 'submit'})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.createElement(\"button\", {type: condition ? `button`...", ({ task }) => {
      const code = `React.createElement("button", {type: condition ? \`button\` : \`submit\`})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 25)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: condition ? `button` : `submit`})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: document.createElement(\"button\")", ({ task }) => {
      const code = `document.createElement("button")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 27)\n\n--- Source code under test ---\ndocument.createElement(\"button\")\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: function MyComponent(): ReactElement { const buttonProps:...", ({ task }) => {
      const code = `
        function MyComponent(): ReactElement {
          const buttonProps: (Required<Attributes> & ButtonHTMLAttributes<HTMLButtonElement>)[] = [
            {
              children: 'test',
              key: 'test',
              onClick: (): void => {
                return;
              },
            },
          ];

          return <>
            {
              buttonProps.map(
                ({ key, ...props }: Required<Attributes> & ButtonHTMLAttributes<HTMLButtonElement>): ReactElement =>
                  <button key={key} type="button" {...props} />
              )
            }
          </>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: valid (index 29)\n\n--- Source code under test ---\n\n        function MyComponent(): ReactElement {\n          const buttonProps: (Required<Attributes> & ButtonHTMLAttributes<HTMLButtonElement>)[] = [\n            {\n              children: 'test',\n              key: 'test',\n              onClick: (): void => {\n                return;\n              },\n            },\n          ];\n\n          return <>\n            {\n              buttonProps.map(\n                ({ key, ...props }: Required<Attributes> & ButtonHTMLAttributes<HTMLButtonElement>): ReactElement =>\n                  <button key={key} type=\"button\" {...props} />\n              )\n            }\n          </>;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment, types\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <button/>", ({ task }) => {
      const code = `<button/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 0)\n\n--- Source code under test ---\n<button/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingType): Missing an explicit type attribute for button\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing an explicit type attribute for button");
    });

    it("invalid[1]: <button type=\"foo\"/>", ({ task }) => {
      const code = `<button type="foo"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 1)\n\n--- Source code under test ---\n<button type=\"foo\"/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[2]: <button type={foo}/>", ({ task }) => {
      const code = `<button type={foo}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 2)\n\n--- Source code under test ---\n<button type={foo}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: complexType): The button type attribute must be specified by a static string or a trivial ternary expression\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The button type attribute must be specified by a static string or a trivial ternary expression");
    });

    it("invalid[3]: <button type={\"foo\"}/>", ({ task }) => {
      const code = `<button type={"foo"}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 3)\n\n--- Source code under test ---\n<button type={\"foo\"}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[4]: <button type={'foo'}/>", ({ task }) => {
      const code = `<button type={'foo'}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 4)\n\n--- Source code under test ---\n<button type={'foo'}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[5]: <button type={`foo`}/>", ({ task }) => {
      const code = `<button type={\`foo\`}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 5)\n\n--- Source code under test ---\n<button type={`foo`}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[6]: <button type={`button${foo}`}/>", ({ task }) => {
      const code = `<button type={\`button\${foo}\`}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 6)\n\n--- Source code under test ---\n<button type={`button${foo}`}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: complexType): The button type attribute must be specified by a static string or a trivial ternary expression\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The button type attribute must be specified by a static string or a trivial ternary expression");
    });

    it("invalid[8]: <button type={condition ? \"button\" : foo}/>", ({ task }) => {
      const code = `<button type={condition ? "button" : foo}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 8)\n\n--- Source code under test ---\n<button type={condition ? \"button\" : foo}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: complexType): The button type attribute must be specified by a static string or a trivial ternary expression\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The button type attribute must be specified by a static string or a trivial ternary expression");
    });

    it("invalid[9]: <button type={condition ? \"button\" : \"foo\"}/>", ({ task }) => {
      const code = `<button type={condition ? "button" : "foo"}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 9)\n\n--- Source code under test ---\n<button type={condition ? \"button\" : \"foo\"}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[11]: <button type={condition ? foo : \"button\"}/>", ({ task }) => {
      const code = `<button type={condition ? foo : "button"}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 11)\n\n--- Source code under test ---\n<button type={condition ? foo : \"button\"}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: complexType): The button type attribute must be specified by a static string or a trivial ternary expression\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The button type attribute must be specified by a static string or a trivial ternary expression");
    });

    it("invalid[12]: <button type={condition ? \"foo\" : \"button\"}/>", ({ task }) => {
      const code = `<button type={condition ? "foo" : "button"}/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 12)\n\n--- Source code under test ---\n<button type={condition ? \"foo\" : \"button\"}/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[13]: <button type/>", ({ task }) => {
      const code = `<button type/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 13)\n\n--- Source code under test ---\n<button type/>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"true\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"true\" is an invalid value for button type attribute");
    });

    it("invalid[15]: React.createElement(\"button\")", ({ task }) => {
      const code = `React.createElement("button")`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 15)\n\n--- Source code under test ---\nReact.createElement(\"button\")\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingType): Missing an explicit type attribute for button\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing an explicit type attribute for button");
    });

    it("invalid[16]: React.createElement(\"button\", {type: foo})", ({ task }) => {
      const code = `React.createElement("button", {type: foo})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 16)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: foo})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: complexType): The button type attribute must be specified by a static string or a trivial ternary expression\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The button type attribute must be specified by a static string or a trivial ternary expression");
    });

    it("invalid[17]: React.createElement(\"button\", {type: \"foo\"})", ({ task }) => {
      const code = `React.createElement("button", {type: "foo"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 17)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: \"foo\"})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[19]: React.createElement(\"button\", {type: condition ? \"button\"...", ({ task }) => {
      const code = `React.createElement("button", {type: condition ? "button" : foo})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 19)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: condition ? \"button\" : foo})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: complexType): The button type attribute must be specified by a static string or a trivial ternary expression\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The button type attribute must be specified by a static string or a trivial ternary expression");
    });

    it("invalid[20]: React.createElement(\"button\", {type: condition ? \"button\"...", ({ task }) => {
      const code = `React.createElement("button", {type: condition ? "button" : "foo"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 20)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: condition ? \"button\" : \"foo\"})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[22]: React.createElement(\"button\", {type: condition ? foo : \"b...", ({ task }) => {
      const code = `React.createElement("button", {type: condition ? foo : "button"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 22)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: condition ? foo : \"button\"})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: complexType): The button type attribute must be specified by a static string or a trivial ternary expression\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The button type attribute must be specified by a static string or a trivial ternary expression");
    });

    it("invalid[23]: React.createElement(\"button\", {type: condition ? \"foo\" : ...", ({ task }) => {
      const code = `React.createElement("button", {type: condition ? "foo" : "button"})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 23)\n\n--- Source code under test ---\nReact.createElement(\"button\", {type: condition ? \"foo\" : \"button\"})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidValue): \"foo\" is an invalid value for button type attribute\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("\"foo\" is an invalid value for button type attribute");
    });

    it("invalid[25]: React.createElement(\"button\", {...extraProps})", ({ task }) => {
      const code = `React.createElement("button", {...extraProps})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 25)\n\n--- Source code under test ---\nReact.createElement(\"button\", {...extraProps})\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingType): Missing an explicit type attribute for button\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing an explicit type attribute for button");
    });

    it("invalid[27]: function Button({ type, ...extraProps }) { const button =...", ({ task }) => {
      const code = `function Button({ type, ...extraProps }) { const button = type; return <button type={button} {...extraProps} />; }`;
      task.meta.source = code;
      task.meta.explanation = "Rule: button-has-type\nType: invalid (index 27)\n\n--- Source code under test ---\nfunction Button({ type, ...extraProps }) { const button = type; return <button type={button} {...extraProps} />; }\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: complexType): The button type attribute must be specified by a static string or a trivial ternary expression\n\nRule message templates:\n  missingType: Missing an explicit type attribute for button\n  complexType: The button type attribute must be specified by a static string or a trivial ternary expression\n  invalidValue: \"{{value}}\" is an invalid value for button type attribute\n  forbiddenValue: \"{{value}}\" is an invalid value for button type attribute";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The button type attribute must be specified by a static string or a trivial ternary expression");
    });

  });
});
