import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Missing \"key\" prop for element in iterator",
  "Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead",
  "Missing \"key\" prop for element in array",
  "Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead",
  "`key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`",
  "`key` prop must be unique",
  "Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use Act.Frag instead",
  "Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use Act.Frag instead",
];

describe("jsx-key", () => {
  describe("valid", () => {
    it("valid[0]: [1, 2, 3].map((item) => { return item === 'bar' ? <div ke...", async ({ task }) => {
      const code = `
        [1, 2, 3].map((item) => {
         return item === 'bar' ? <div key={item}>{item}</div> : <span key={item}>{item}</span>;
        })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 0)\n\n--- Source code under test ---\n\n        [1, 2, 3].map((item) => {\n         return item === 'bar' ? <div key={item}>{item}</div> : <span key={item}>{item}</span>;\n        })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: fn()", async ({ task }) => {
      const code = `fn()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 1)\n\n--- Source code under test ---\nfn()\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: [1, 2, 3].map(function () {})", async ({ task }) => {
      const code = `[1, 2, 3].map(function () {})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 2)\n\n--- Source code under test ---\n[1, 2, 3].map(function () {})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App />;", async ({ task }) => {
      const code = `<App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 3)\n\n--- Source code under test ---\n<App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: [<App key={0} />, <App key={1} />];", async ({ task }) => {
      const code = `[<App key={0} />, <App key={1} />];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 4)\n\n--- Source code under test ---\n[<App key={0} />, <App key={1} />];\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: [1, 2, 3].map(function(x) { return <App key={x} /> });", async ({ task }) => {
      const code = `[1, 2, 3].map(function(x) { return <App key={x} /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 5)\n\n--- Source code under test ---\n[1, 2, 3].map(function(x) { return <App key={x} /> });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: [1, 2, 3].map(x => <App key={x} />);", async ({ task }) => {
      const code = `[1, 2, 3].map(x => <App key={x} />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 6)\n\n--- Source code under test ---\n[1, 2, 3].map(x => <App key={x} />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: [1, 2 ,3].map(x => x && <App x={x} key={x} />);", async ({ task }) => {
      const code = `[1, 2 ,3].map(x => x && <App x={x} key={x} />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 7)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x && <App x={x} key={x} />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: [1, 2 ,3].map(x => x ? <App x={x} key=\"1\" /> : <OtherApp ...", async ({ task }) => {
      const code = `[1, 2 ,3].map(x => x ? <App x={x} key="1" /> : <OtherApp x={x} key="2" />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 8)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x ? <App x={x} key=\"1\" /> : <OtherApp x={x} key=\"2\" />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: [1, 2, 3].map(x => { return <App key={x} /> });", async ({ task }) => {
      const code = `[1, 2, 3].map(x => { return <App key={x} /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 9)\n\n--- Source code under test ---\n[1, 2, 3].map(x => { return <App key={x} /> });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: Array.from([1, 2, 3], function(x) { return <App key={x} /...", async ({ task }) => {
      const code = `Array.from([1, 2, 3], function(x) { return <App key={x} /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 10)\n\n--- Source code under test ---\nArray.from([1, 2, 3], function(x) { return <App key={x} /> });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: Array.from([1, 2, 3], (x => <App key={x} />));", async ({ task }) => {
      const code = `Array.from([1, 2, 3], (x => <App key={x} />));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 11)\n\n--- Source code under test ---\nArray.from([1, 2, 3], (x => <App key={x} />));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: Array.from([1, 2, 3], (x => {return <App key={x} />}));", async ({ task }) => {
      const code = `Array.from([1, 2, 3], (x => {return <App key={x} />}));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 12)\n\n--- Source code under test ---\nArray.from([1, 2, 3], (x => {return <App key={x} />}));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: Array.from([1, 2, 3], someFn);", async ({ task }) => {
      const code = `Array.from([1, 2, 3], someFn);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 13)\n\n--- Source code under test ---\nArray.from([1, 2, 3], someFn);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: Array.from([1, 2, 3]);", async ({ task }) => {
      const code = `Array.from([1, 2, 3]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 14)\n\n--- Source code under test ---\nArray.from([1, 2, 3]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: [1, 2, 3].foo(x => <App />);", async ({ task }) => {
      const code = `[1, 2, 3].foo(x => <App />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 15)\n\n--- Source code under test ---\n[1, 2, 3].foo(x => <App />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: var App = () => <div />;", async ({ task }) => {
      const code = `var App = () => <div />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 16)\n\n--- Source code under test ---\nvar App = () => <div />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: [1, 2, 3].map(function(x) { return; });", async ({ task }) => {
      const code = `[1, 2, 3].map(function(x) { return; });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 17)\n\n--- Source code under test ---\n[1, 2, 3].map(function(x) { return; });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: foo(() => <div />);", async ({ task }) => {
      const code = `foo(() => <div />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 18)\n\n--- Source code under test ---\nfoo(() => <div />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: foo(() => <></>);", async ({ task }) => {
      const code = `foo(() => <></>);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 19)\n\n--- Source code under test ---\nfoo(() => <></>);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <></>;", async ({ task }) => {
      const code = `<></>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 20)\n\n--- Source code under test ---\n<></>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <App {...{}} />;", async ({ task }) => {
      const code = `<App {...{}} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 21)\n\n--- Source code under test ---\n<App {...{}} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: const spans = [ <span key=\"notunique\"/>, <span key=\"notun...", async ({ task }) => {
      const code = `
        const spans = [
          <span key="notunique"/>,
          <span key="notunique"/>,
        ];
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 24)\n\n--- Source code under test ---\n\n        const spans = [\n          <span key=\"notunique\"/>,\n          <span key=\"notunique\"/>,\n        ];\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: function Component(props) { return hasPayment ? ( <div cl...", async ({ task }) => {
      const code = `
        function Component(props) {
          return hasPayment ? (
            <div className="stuff">
              <BookingDetailSomething {...props} />
              {props.modal && props.calculatedPrice && (
                <SomeOtherThing items={props.something} discount={props.discount} />
              )}
            </div>
          ) : null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 25)\n\n--- Source code under test ---\n\n        function Component(props) {\n          return hasPayment ? (\n            <div className=\"stuff\">\n              <BookingDetailSomething {...props} />\n              {props.modal && props.calculatedPrice && (\n                <SomeOtherThing items={props.something} discount={props.discount} />\n              )}\n            </div>\n          ) : null;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: import React, { FC, useRef, useState } from 'react'; impo...", async ({ task }) => {
      const code = `
        import React, { FC, useRef, useState } from 'react';

        import './ResourceVideo.sass';
        import VimeoVideoPlayInModal from '../vimeoVideoPlayInModal/VimeoVideoPlayInModal';

        type Props = {
          videoUrl: string;
          videoTitle: string;
        };
        const ResourceVideo: FC<Props> = ({
          videoUrl,
          videoTitle,
        }: Props): JSX.Element => {
          return (
            <div className="resource-video">
              <VimeoVideoPlayInModal videoUrl={videoUrl} />
              <h3>{videoTitle}</h3>
            </div>
          );
        };

        export default ResourceVideo;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 26)\n\n--- Source code under test ---\n\n        import React, { FC, useRef, useState } from 'react';\n\n        import './ResourceVideo.sass';\n        import VimeoVideoPlayInModal from '../vimeoVideoPlayInModal/VimeoVideoPlayInModal';\n\n        type Props = {\n          videoUrl: string;\n          videoTitle: string;\n        };\n        const ResourceVideo: FC<Props> = ({\n          videoUrl,\n          videoTitle,\n        }: Props): JSX.Element => {\n          return (\n            <div className=\"resource-video\">\n              <VimeoVideoPlayInModal videoUrl={videoUrl} />\n              <h3>{videoTitle}</h3>\n            </div>\n          );\n        };\n\n        export default ResourceVideo;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: // testrule.jsx const trackLink = () => {}; const getAnal...", async ({ task }) => {
      const code = `
        // testrule.jsx
        const trackLink = () => {};
        const getAnalyticsUiElement = () => {};

        const onTextButtonClick = (e, item) => trackLink([, getAnalyticsUiElement(item), item.name], e);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 27)\n\n--- Source code under test ---\n\n        // testrule.jsx\n        const trackLink = () => {};\n        const getAnalyticsUiElement = () => {};\n\n        const onTextButtonClick = (e, item) => trackLink([, getAnalyticsUiElement(item), item.name], e);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: function Component({ allRatings }) { return ( <RatingDeta...", async ({ task }) => {
      const code = `
        function Component({ allRatings }) {
          return (
            <RatingDetailsStyles>
              {Object.entries(allRatings)?.map(([key, value], index) => {
                const rate = value?.split(/(?=[%, /])/);

                if (!rate) return null;

                return (
                  <li key={\`\${entertainment.tmdbId}\${index}\`}>
                    <img src={\`/assets/rating/\${key}.png\`} />
                    <span className="rating-details--rate">{rate?.[0]}</span>
                    <span className="rating-details--rate-suffix">{rate?.[1]}</span>
                  </li>
                );
              })}
            </RatingDetailsStyles>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 28)\n\n--- Source code under test ---\n\n        function Component({ allRatings }) {\n          return (\n            <RatingDetailsStyles>\n              {Object.entries(allRatings)?.map(([key, value], index) => {\n                const rate = value?.split(/(?=[%, /])/);\n\n                if (!rate) return null;\n\n                return (\n                  <li key={`${entertainment.tmdbId}${index}`}>\n                    <img src={`/assets/rating/${key}.png`} />\n                    <span className=\"rating-details--rate\">{rate?.[0]}</span>\n                    <span className=\"rating-details--rate-suffix\">{rate?.[1]}</span>\n                  </li>\n                );\n              })}\n            </RatingDetailsStyles>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: optional chaining\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: const baz = foo?.bar?.()?.[1] ?? 'qux'; qux()?.map() cons...", async ({ task }) => {
      const code = `
        const baz = foo?.bar?.()?.[1] ?? 'qux';

        qux()?.map()

        const directiveRanges = comments?.map(tryParseTSDirective)
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 29)\n\n--- Source code under test ---\n\n        const baz = foo?.bar?.()?.[1] ?? 'qux';\n\n        qux()?.map()\n\n        const directiveRanges = comments?.map(tryParseTSDirective)\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: optional chaining, nullish coalescing\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: import { observable } from \"mobx\"; export interface Clust...", async ({ task }) => {
      const code = `
        import { observable } from "mobx";

        export interface ClusterFrameInfo {
          frameId: number;
          processId: number;
        }

        export const clusterFrameMap = observable.map<string, ClusterFrameInfo>();
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 30)\n\n--- Source code under test ---\n\n        import { observable } from \"mobx\";\n\n        export interface ClusterFrameInfo {\n          frameId: number;\n          processId: number;\n        }\n\n        export const clusterFrameMap = observable.map<string, ClusterFrameInfo>();\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types, no-babel-old\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: React.Children.toArray([1, 2 ,3].map(x => <App />));", async ({ task }) => {
      const code = `React.Children.toArray([1, 2 ,3].map(x => <App />));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 31)\n\n--- Source code under test ---\nReact.Children.toArray([1, 2 ,3].map(x => <App />));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: import { Children } from \"react\"; Children.toArray([1, 2 ...", async ({ task }) => {
      const code = `
        import { Children } from "react";
        Children.toArray([1, 2 ,3].map(x => <App />));
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 32)\n\n--- Source code under test ---\n\n        import { Children } from \"react\";\n        Children.toArray([1, 2 ,3].map(x => <App />));\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: [1, 2, 3].map((item) => { return item === 'bar' ? <div>{i...", async ({ task }) => {
      const code = `
        [1, 2, 3].map((item) => {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        [1, 2, 3].map((item) => {\n          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;\n        })\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[1]: [1, 2, 3].map(function(item) { return item === 'bar' ? <d...", async ({ task }) => {
      const code = `
        [1, 2, 3].map(function(item) {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        [1, 2, 3].map(function(item) {\n          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;\n        })\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[2]: Array.from([1, 2, 3], (item) => { return item === 'bar' ?...", async ({ task }) => {
      const code = `
        Array.from([1, 2, 3], (item) => {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        Array.from([1, 2, 3], (item) => {\n          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;\n        })\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[3]: import { Fragment } from 'react'; const ITEMS = ['bar', '...", async ({ task }) => {
      const code = `
        import { Fragment } from 'react';

        const ITEMS = ['bar', 'foo'];

        export default function BugIssue() {
          return (
            <Fragment>
              {ITEMS.map((item) => {
                return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
              })}
            </Fragment>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        import { Fragment } from 'react';\n\n        const ITEMS = ['bar', 'foo'];\n\n        export default function BugIssue() {\n          return (\n            <Fragment>\n              {ITEMS.map((item) => {\n                return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;\n              })}\n            </Fragment>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[4]: [<App />];", async ({ task }) => {
      const code = `[<App />];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 4)\n\n--- Source code under test ---\n[<App />];\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingArrayKey): Missing \"key\" prop for element in array\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in array");
    });

    it("invalid[5]: [<App {...key} />];", async ({ task }) => {
      const code = `[<App {...key} />];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 5)\n\n--- Source code under test ---\n[<App {...key} />];\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingArrayKey): Missing \"key\" prop for element in array\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in array");
    });

    it("invalid[6]: [<App key={0}/>, <App />];", async ({ task }) => {
      const code = `[<App key={0}/>, <App />];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 6)\n\n--- Source code under test ---\n[<App key={0}/>, <App />];\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingArrayKey): Missing \"key\" prop for element in array\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in array");
    });

    it("invalid[7]: [1, 2 ,3].map(function(x) { return <App /> });", async ({ task }) => {
      const code = `[1, 2 ,3].map(function(x) { return <App /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 7)\n\n--- Source code under test ---\n[1, 2 ,3].map(function(x) { return <App /> });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[8]: [1, 2 ,3].map(x => <App />);", async ({ task }) => {
      const code = `[1, 2 ,3].map(x => <App />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 8)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => <App />);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[9]: [1, 2 ,3].map(x => x && <App x={x} />);", async ({ task }) => {
      const code = `[1, 2 ,3].map(x => x && <App x={x} />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 9)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x && <App x={x} />);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[10]: [1, 2 ,3].map(x => x ? <App x={x} key=\"1\" /> : <OtherApp ...", async ({ task }) => {
      const code = `[1, 2 ,3].map(x => x ? <App x={x} key="1" /> : <OtherApp x={x} />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 10)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x ? <App x={x} key=\"1\" /> : <OtherApp x={x} />);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[11]: [1, 2 ,3].map(x => x ? <App x={x} /> : <OtherApp x={x} ke...", async ({ task }) => {
      const code = `[1, 2 ,3].map(x => x ? <App x={x} /> : <OtherApp x={x} key="2" />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 11)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x ? <App x={x} /> : <OtherApp x={x} key=\"2\" />);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[12]: [1, 2 ,3].map(x => { return <App /> });", async ({ task }) => {
      const code = `[1, 2 ,3].map(x => { return <App /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 12)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => { return <App /> });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[13]: Array.from([1, 2 ,3], function(x) { return <App /> });", async ({ task }) => {
      const code = `Array.from([1, 2 ,3], function(x) { return <App /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 13)\n\n--- Source code under test ---\nArray.from([1, 2 ,3], function(x) { return <App /> });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[14]: Array.from([1, 2 ,3], (x => { return <App /> }));", async ({ task }) => {
      const code = `Array.from([1, 2 ,3], (x => { return <App /> }));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 14)\n\n--- Source code under test ---\nArray.from([1, 2 ,3], (x => { return <App /> }));\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[15]: Array.from([1, 2 ,3], (x => <App />));", async ({ task }) => {
      const code = `Array.from([1, 2 ,3], (x => <App />));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 15)\n\n--- Source code under test ---\nArray.from([1, 2 ,3], (x => <App />));\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[16]: [1, 2, 3]?.map(x => <BabelEslintApp />)", async ({ task }) => {
      const code = `[1, 2, 3]?.map(x => <BabelEslintApp />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 16)\n\n--- Source code under test ---\n[1, 2, 3]?.map(x => <BabelEslintApp />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nFeatures: no-default\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[17]: [1, 2, 3]?.map(x => <TypescriptEslintApp />)", async ({ task }) => {
      const code = `[1, 2, 3]?.map(x => <TypescriptEslintApp />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 17)\n\n--- Source code under test ---\n[1, 2, 3]?.map(x => <TypescriptEslintApp />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nFeatures: ts\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.tsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[24]: const Test = () => { const list = [1, 2, 3, 4, 5]; return...", async ({ task }) => {
      const code = `
        const Test = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) {
                  return <div>{item}</div>;
                }

                return <div />;
              })}
            </div>
          );
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        const Test = () => {\n          const list = [1, 2, 3, 4, 5];\n\n          return (\n            <div>\n              {list.map(item => {\n                if (item < 2) {\n                  return <div>{item}</div>;\n                }\n\n                return <div />;\n              })}\n            </div>\n          );\n        };\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[25]: const TestO = () => { const list = [1, 2, 3, 4, 5]; retur...", async ({ task }) => {
      const code = `
        const TestO = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) {
                  return <div>{item}</div>;
                } else if (item < 5) {
                  return <div></div>
                }  else {
                  return <div></div>
                }

                return <div />;
              })}
            </div>
          );
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        const TestO = () => {\n          const list = [1, 2, 3, 4, 5];\n\n          return (\n            <div>\n              {list.map(item => {\n                if (item < 2) {\n                  return <div>{item}</div>;\n                } else if (item < 5) {\n                  return <div></div>\n                }  else {\n                  return <div></div>\n                }\n\n                return <div />;\n              })}\n            </div>\n          );\n        };\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [2] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [3] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[2].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[3].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[26]: const TestCase = () => { const list = [1, 2, 3, 4, 5]; re...", async ({ task }) => {
      const code = `
        const TestCase = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) return <div>{item}</div>;
                else if (item < 5) return <div />;
                else return <div />;
              })}
            </div>
          );
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        const TestCase = () => {\n          const list = [1, 2, 3, 4, 5];\n\n          return (\n            <div>\n              {list.map(item => {\n                if (item < 2) return <div>{item}</div>;\n                else if (item < 5) return <div />;\n                else return <div />;\n              })}\n            </div>\n          );\n        };\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [2] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-key", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[2].message).toBe("Missing \"key\" prop for element in iterator");
    });

  });
});
