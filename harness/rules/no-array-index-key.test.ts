import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Do not use Array index in keys",
];

describe("no-array-index-key", () => {
  describe("valid", () => {
    it("valid[0]: <Foo key=\"foo\" />;", async ({ task }) => {
      const code = `<Foo key="foo" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 0)\n\n--- Source code under test ---\n<Foo key=\"foo\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <Foo key={i} />;", async ({ task }) => {
      const code = `<Foo key={i} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 1)\n\n--- Source code under test ---\n<Foo key={i} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <Foo key />;", async ({ task }) => {
      const code = `<Foo key />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 2)\n\n--- Source code under test ---\n<Foo key />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <Foo key={`foo-${i}`} />;", async ({ task }) => {
      const code = `<Foo key={\`foo-\${i}\`} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 3)\n\n--- Source code under test ---\n<Foo key={`foo-${i}`} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <Foo key={'foo-' + i} />;", async ({ task }) => {
      const code = `<Foo key={'foo-' + i} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 4)\n\n--- Source code under test ---\n<Foo key={'foo-' + i} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: foo.bar((baz, i) => <Foo key={i} />)", async ({ task }) => {
      const code = `foo.bar((baz, i) => <Foo key={i} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 5)\n\n--- Source code under test ---\nfoo.bar((baz, i) => <Foo key={i} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: foo.bar((bar, i) => <Foo key={`foo-${i}`} />)", async ({ task }) => {
      const code = `foo.bar((bar, i) => <Foo key={\`foo-\${i}\`} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 6)\n\n--- Source code under test ---\nfoo.bar((bar, i) => <Foo key={`foo-${i}`} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: foo.bar((bar, i) => <Foo key={'foo-' + i} />)", async ({ task }) => {
      const code = `foo.bar((bar, i) => <Foo key={'foo-' + i} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 7)\n\n--- Source code under test ---\nfoo.bar((bar, i) => <Foo key={'foo-' + i} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: foo.map((baz) => <Foo key={baz.id} />)", async ({ task }) => {
      const code = `foo.map((baz) => <Foo key={baz.id} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 8)\n\n--- Source code under test ---\nfoo.map((baz) => <Foo key={baz.id} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: foo.map((baz, i) => <Foo key={baz.id} />)", async ({ task }) => {
      const code = `foo.map((baz, i) => <Foo key={baz.id} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 9)\n\n--- Source code under test ---\nfoo.map((baz, i) => <Foo key={baz.id} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: foo.map((baz, i) => <Foo key={'foo' + baz.id} />)", async ({ task }) => {
      const code = `foo.map((baz, i) => <Foo key={'foo' + baz.id} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 10)\n\n--- Source code under test ---\nfoo.map((baz, i) => <Foo key={'foo' + baz.id} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: foo.map((baz, i) => React.cloneElement(someChild, { ...so...", async ({ task }) => {
      const code = `foo.map((baz, i) => React.cloneElement(someChild, { ...someChild.props }))`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 11)\n\n--- Source code under test ---\nfoo.map((baz, i) => React.cloneElement(someChild, { ...someChild.props }))\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: foo.map((baz, i) => cloneElement(someChild, { ...someChil...", async ({ task }) => {
      const code = `foo.map((baz, i) => cloneElement(someChild, { ...someChild.props }))`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 12)\n\n--- Source code under test ---\nfoo.map((baz, i) => cloneElement(someChild, { ...someChild.props }))\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: foo.map((item, i) => { return React.cloneElement(someChil...", async ({ task }) => {
      const code = `
        foo.map((item, i) => {
          return React.cloneElement(someChild, {
            key: item.id
          })
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 13)\n\n--- Source code under test ---\n\n        foo.map((item, i) => {\n          return React.cloneElement(someChild, {\n            key: item.id\n          })\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: foo.map((item, i) => { return cloneElement(someChild, { k...", async ({ task }) => {
      const code = `
        foo.map((item, i) => {
          return cloneElement(someChild, {
            key: item.id
          })
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 14)\n\n--- Source code under test ---\n\n        foo.map((item, i) => {\n          return cloneElement(someChild, {\n            key: item.id\n          })\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: foo.map((baz, i) => <Foo key />)", async ({ task }) => {
      const code = `foo.map((baz, i) => <Foo key />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 15)\n\n--- Source code under test ---\nfoo.map((baz, i) => <Foo key />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: foo.reduce((a, b) => a.concat(<Foo key={b.id} />), [])", async ({ task }) => {
      const code = `foo.reduce((a, b) => a.concat(<Foo key={b.id} />), [])`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 16)\n\n--- Source code under test ---\nfoo.reduce((a, b) => a.concat(<Foo key={b.id} />), [])\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: foo.map((bar, i) => <Foo key={i.baz.toString()} />)", async ({ task }) => {
      const code = `foo.map((bar, i) => <Foo key={i.baz.toString()} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 17)\n\n--- Source code under test ---\nfoo.map((bar, i) => <Foo key={i.baz.toString()} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: foo.map((bar, i) => <Foo key={i.toString} />)", async ({ task }) => {
      const code = `foo.map((bar, i) => <Foo key={i.toString} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 18)\n\n--- Source code under test ---\nfoo.map((bar, i) => <Foo key={i.toString} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: foo.map((bar, i) => <Foo key={String()} />)", async ({ task }) => {
      const code = `foo.map((bar, i) => <Foo key={String()} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 19)\n\n--- Source code under test ---\nfoo.map((bar, i) => <Foo key={String()} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: foo.map((bar, i) => <Foo key={String(baz)} />)", async ({ task }) => {
      const code = `foo.map((bar, i) => <Foo key={String(baz)} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 20)\n\n--- Source code under test ---\nfoo.map((bar, i) => <Foo key={String(baz)} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: foo.flatMap((a) => <Foo key={a} />)", async ({ task }) => {
      const code = `foo.flatMap((a) => <Foo key={a} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 21)\n\n--- Source code under test ---\nfoo.flatMap((a) => <Foo key={a} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: foo.reduce((a, b, i) => a.concat(<Foo key={b.id} />), [])", async ({ task }) => {
      const code = `foo.reduce((a, b, i) => a.concat(<Foo key={b.id} />), [])`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 22)\n\n--- Source code under test ---\nfoo.reduce((a, b, i) => a.concat(<Foo key={b.id} />), [])\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: foo.reduceRight((a, b) => a.concat(<Foo key={b.id} />), [])", async ({ task }) => {
      const code = `foo.reduceRight((a, b) => a.concat(<Foo key={b.id} />), [])`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 23)\n\n--- Source code under test ---\nfoo.reduceRight((a, b) => a.concat(<Foo key={b.id} />), [])\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: foo.reduceRight((a, b, i) => a.concat(<Foo key={b.id} />)...", async ({ task }) => {
      const code = `foo.reduceRight((a, b, i) => a.concat(<Foo key={b.id} />), [])`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 24)\n\n--- Source code under test ---\nfoo.reduceRight((a, b, i) => a.concat(<Foo key={b.id} />), [])\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.Children.map(this.props.children, (child, index, ar...", async ({ task }) => {
      const code = `
        React.Children.map(this.props.children, (child, index, arr) => {
          return React.cloneElement(child, { key: child.id });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 25)\n\n--- Source code under test ---\n\n        React.Children.map(this.props.children, (child, index, arr) => {\n          return React.cloneElement(child, { key: child.id });\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: React.Children.map(this.props.children, (child, index, ar...", async ({ task }) => {
      const code = `
        React.Children.map(this.props.children, (child, index, arr) => {
          return cloneElement(child, { key: child.id });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 26)\n\n--- Source code under test ---\n\n        React.Children.map(this.props.children, (child, index, arr) => {\n          return cloneElement(child, { key: child.id });\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: Children.forEach(this.props.children, (child, index, arr)...", async ({ task }) => {
      const code = `
        Children.forEach(this.props.children, (child, index, arr) => {
          return React.cloneElement(child, { key: child.id });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 27)\n\n--- Source code under test ---\n\n        Children.forEach(this.props.children, (child, index, arr) => {\n          return React.cloneElement(child, { key: child.id });\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: Children.forEach(this.props.children, (child, index, arr)...", async ({ task }) => {
      const code = `
        Children.forEach(this.props.children, (child, index, arr) => {
          return cloneElement(child, { key: child.id });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 28)\n\n--- Source code under test ---\n\n        Children.forEach(this.props.children, (child, index, arr) => {\n          return cloneElement(child, { key: child.id });\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: foo?.map(child => <Foo key={child.i} />)", async ({ task }) => {
      const code = `foo?.map(child => <Foo key={child.i} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: valid (index 29)\n\n--- Source code under test ---\nfoo?.map(child => <Foo key={child.i} />)\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: optional chaining\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: foo.map((bar, i) => <Foo key={i} />)", async ({ task }) => {
      const code = `foo.map((bar, i) => <Foo key={i} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 0)\n\n--- Source code under test ---\nfoo.map((bar, i) => <Foo key={i} />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[1]: [{}, {}].map((bar, i) => <Foo key={i} />)", async ({ task }) => {
      const code = `[{}, {}].map((bar, i) => <Foo key={i} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 1)\n\n--- Source code under test ---\n[{}, {}].map((bar, i) => <Foo key={i} />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[2]: foo.map((bar, anything) => <Foo key={anything} />)", async ({ task }) => {
      const code = `foo.map((bar, anything) => <Foo key={anything} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 2)\n\n--- Source code under test ---\nfoo.map((bar, anything) => <Foo key={anything} />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[3]: foo.map((bar, i) => <Foo key={`foo-${i}`} />)", async ({ task }) => {
      const code = `foo.map((bar, i) => <Foo key={\`foo-\${i}\`} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 3)\n\n--- Source code under test ---\nfoo.map((bar, i) => <Foo key={`foo-${i}`} />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[4]: foo.map((bar, i) => <Foo key={'foo-' + i} />)", async ({ task }) => {
      const code = `foo.map((bar, i) => <Foo key={'foo-' + i} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 4)\n\n--- Source code under test ---\nfoo.map((bar, i) => <Foo key={'foo-' + i} />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[5]: foo.map((bar, i) => <Foo key={'foo-' + i + '-bar'} />)", async ({ task }) => {
      const code = `foo.map((bar, i) => <Foo key={'foo-' + i + '-bar'} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 5)\n\n--- Source code under test ---\nfoo.map((bar, i) => <Foo key={'foo-' + i + '-bar'} />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[6]: foo.map((baz, i) => React.cloneElement(someChild, { ...so...", async ({ task }) => {
      const code = `foo.map((baz, i) => React.cloneElement(someChild, { ...someChild.props, key: i }))`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 6)\n\n--- Source code under test ---\nfoo.map((baz, i) => React.cloneElement(someChild, { ...someChild.props, key: i }))\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[7]: import { cloneElement } from 'react'; foo.map((baz, i) =>...", async ({ task }) => {
      const code = `
        import { cloneElement } from 'react';

        foo.map((baz, i) => cloneElement(someChild, { ...someChild.props, key: i }))
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        import { cloneElement } from 'react';\n\n        foo.map((baz, i) => cloneElement(someChild, { ...someChild.props, key: i }))\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[8]: foo.map((item, i) => { return React.cloneElement(someChil...", async ({ task }) => {
      const code = `
        foo.map((item, i) => {
          return React.cloneElement(someChild, {
            key: i
          })
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        foo.map((item, i) => {\n          return React.cloneElement(someChild, {\n            key: i\n          })\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[9]: import { cloneElement } from 'react'; foo.map((item, i) =...", async ({ task }) => {
      const code = `
        import { cloneElement } from 'react';

        foo.map((item, i) => {
          return cloneElement(someChild, {
            key: i
          })
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        import { cloneElement } from 'react';\n\n        foo.map((item, i) => {\n          return cloneElement(someChild, {\n            key: i\n          })\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[10]: foo.forEach((bar, i) => { baz.push(<Foo key={i} />); })", async ({ task }) => {
      const code = `foo.forEach((bar, i) => { baz.push(<Foo key={i} />); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 10)\n\n--- Source code under test ---\nfoo.forEach((bar, i) => { baz.push(<Foo key={i} />); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[11]: foo.filter((bar, i) => { baz.push(<Foo key={i} />); })", async ({ task }) => {
      const code = `foo.filter((bar, i) => { baz.push(<Foo key={i} />); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 11)\n\n--- Source code under test ---\nfoo.filter((bar, i) => { baz.push(<Foo key={i} />); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[12]: foo.some((bar, i) => { baz.push(<Foo key={i} />); })", async ({ task }) => {
      const code = `foo.some((bar, i) => { baz.push(<Foo key={i} />); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 12)\n\n--- Source code under test ---\nfoo.some((bar, i) => { baz.push(<Foo key={i} />); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[13]: foo.every((bar, i) => { baz.push(<Foo key={i} />); })", async ({ task }) => {
      const code = `foo.every((bar, i) => { baz.push(<Foo key={i} />); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 13)\n\n--- Source code under test ---\nfoo.every((bar, i) => { baz.push(<Foo key={i} />); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[14]: foo.find((bar, i) => { baz.push(<Foo key={i} />); })", async ({ task }) => {
      const code = `foo.find((bar, i) => { baz.push(<Foo key={i} />); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 14)\n\n--- Source code under test ---\nfoo.find((bar, i) => { baz.push(<Foo key={i} />); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[15]: foo.findIndex((bar, i) => { baz.push(<Foo key={i} />); })", async ({ task }) => {
      const code = `foo.findIndex((bar, i) => { baz.push(<Foo key={i} />); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 15)\n\n--- Source code under test ---\nfoo.findIndex((bar, i) => { baz.push(<Foo key={i} />); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[16]: foo.reduce((a, b, i) => a.concat(<Foo key={i} />), [])", async ({ task }) => {
      const code = `foo.reduce((a, b, i) => a.concat(<Foo key={i} />), [])`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 16)\n\n--- Source code under test ---\nfoo.reduce((a, b, i) => a.concat(<Foo key={i} />), [])\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[17]: foo.flatMap((a, i) => <Foo key={i} />)", async ({ task }) => {
      const code = `foo.flatMap((a, i) => <Foo key={i} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 17)\n\n--- Source code under test ---\nfoo.flatMap((a, i) => <Foo key={i} />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[18]: foo.reduceRight((a, b, i) => a.concat(<Foo key={i} />), [])", async ({ task }) => {
      const code = `foo.reduceRight((a, b, i) => a.concat(<Foo key={i} />), [])`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 18)\n\n--- Source code under test ---\nfoo.reduceRight((a, b, i) => a.concat(<Foo key={i} />), [])\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[19]: foo.map((bar, i) => React.createElement('Foo', { key: i }))", async ({ task }) => {
      const code = `foo.map((bar, i) => React.createElement('Foo', { key: i }))`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 19)\n\n--- Source code under test ---\nfoo.map((bar, i) => React.createElement('Foo', { key: i }))\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[20]: foo.map((bar, i) => React.createElement('Foo', { key: `fo...", async ({ task }) => {
      const code = `foo.map((bar, i) => React.createElement('Foo', { key: \`foo-\${i}\` }))`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 20)\n\n--- Source code under test ---\nfoo.map((bar, i) => React.createElement('Foo', { key: `foo-${i}` }))\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[21]: foo.map((bar, i) => React.createElement('Foo', { key: 'fo...", async ({ task }) => {
      const code = `foo.map((bar, i) => React.createElement('Foo', { key: 'foo-' + i }))`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 21)\n\n--- Source code under test ---\nfoo.map((bar, i) => React.createElement('Foo', { key: 'foo-' + i }))\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[22]: foo.map((bar, i) => React.createElement('Foo', { key: 'fo...", async ({ task }) => {
      const code = `foo.map((bar, i) => React.createElement('Foo', { key: 'foo-' + i + '-bar' }))`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 22)\n\n--- Source code under test ---\nfoo.map((bar, i) => React.createElement('Foo', { key: 'foo-' + i + '-bar' }))\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[23]: foo.forEach((bar, i) => { baz.push(React.createElement('F...", async ({ task }) => {
      const code = `foo.forEach((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 23)\n\n--- Source code under test ---\nfoo.forEach((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[24]: foo.filter((bar, i) => { baz.push(React.createElement('Fo...", async ({ task }) => {
      const code = `foo.filter((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 24)\n\n--- Source code under test ---\nfoo.filter((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[25]: foo.some((bar, i) => { baz.push(React.createElement('Foo'...", async ({ task }) => {
      const code = `foo.some((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 25)\n\n--- Source code under test ---\nfoo.some((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[26]: foo.every((bar, i) => { baz.push(React.createElement('Foo...", async ({ task }) => {
      const code = `foo.every((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 26)\n\n--- Source code under test ---\nfoo.every((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[27]: foo.find((bar, i) => { baz.push(React.createElement('Foo'...", async ({ task }) => {
      const code = `foo.find((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 27)\n\n--- Source code under test ---\nfoo.find((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[28]: foo.findIndex((bar, i) => { baz.push(React.createElement(...", async ({ task }) => {
      const code = `foo.findIndex((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 28)\n\n--- Source code under test ---\nfoo.findIndex((bar, i) => { baz.push(React.createElement('Foo', { key: i })); })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[29]: Children.map(this.props.children, (child, index) => { ret...", async ({ task }) => {
      const code = `
        Children.map(this.props.children, (child, index) => {
          return React.cloneElement(child, { key: index });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 29)\n\n--- Source code under test ---\n\n        Children.map(this.props.children, (child, index) => {\n          return React.cloneElement(child, { key: index });\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[30]: import { cloneElement } from 'react'; Children.map(this.p...", async ({ task }) => {
      const code = `
        import { cloneElement } from 'react';

        Children.map(this.props.children, (child, index) => {
          return cloneElement(child, { key: index });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 30)\n\n--- Source code under test ---\n\n        import { cloneElement } from 'react';\n\n        Children.map(this.props.children, (child, index) => {\n          return cloneElement(child, { key: index });\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[31]: React.Children.map(this.props.children, (child, index) =>...", async ({ task }) => {
      const code = `
        React.Children.map(this.props.children, (child, index) => {
          return React.cloneElement(child, { key: index });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 31)\n\n--- Source code under test ---\n\n        React.Children.map(this.props.children, (child, index) => {\n          return React.cloneElement(child, { key: index });\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[32]: import { cloneElement } from 'react'; React.Children.map(...", async ({ task }) => {
      const code = `
        import { cloneElement } from 'react';

        React.Children.map(this.props.children, (child, index) => {
          return cloneElement(child, { key: index });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 32)\n\n--- Source code under test ---\n\n        import { cloneElement } from 'react';\n\n        React.Children.map(this.props.children, (child, index) => {\n          return cloneElement(child, { key: index });\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[33]: Children.forEach(this.props.children, (child, index) => {...", async ({ task }) => {
      const code = `
        Children.forEach(this.props.children, (child, index) => {
          return React.cloneElement(child, { key: index });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 33)\n\n--- Source code under test ---\n\n        Children.forEach(this.props.children, (child, index) => {\n          return React.cloneElement(child, { key: index });\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[34]: import { cloneElement } from 'react'; Children.forEach(th...", async ({ task }) => {
      const code = `
        import { cloneElement } from 'react';

        Children.forEach(this.props.children, (child, index) => {
          return cloneElement(child, { key: index });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 34)\n\n--- Source code under test ---\n\n        import { cloneElement } from 'react';\n\n        Children.forEach(this.props.children, (child, index) => {\n          return cloneElement(child, { key: index });\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[35]: React.Children.forEach(this.props.children, (child, index...", async ({ task }) => {
      const code = `
        React.Children.forEach(this.props.children, (child, index) => {
          return React.cloneElement(child, { key: index });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 35)\n\n--- Source code under test ---\n\n        React.Children.forEach(this.props.children, (child, index) => {\n          return React.cloneElement(child, { key: index });\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[36]: import { cloneElement } from 'react'; React.Children.forE...", async ({ task }) => {
      const code = `
        import { cloneElement } from 'react';

        React.Children.forEach(this.props.children, (child, index) => {
          return cloneElement(child, { key: index });
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 36)\n\n--- Source code under test ---\n\n        import { cloneElement } from 'react';\n\n        React.Children.forEach(this.props.children, (child, index) => {\n          return cloneElement(child, { key: index });\n        })\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[37]: foo?.map((child, i) => <Foo key={i} />)", async ({ task }) => {
      const code = `foo?.map((child, i) => <Foo key={i} />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 37)\n\n--- Source code under test ---\nfoo?.map((child, i) => <Foo key={i} />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nFeatures: optional chaining\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[38]: foo.map((bar, index) => ( <Element key={index.toString()}...", async ({ task }) => {
      const code = `
        foo.map((bar, index) => (
          <Element key={index.toString()} bar={bar} />
        ))
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 38)\n\n--- Source code under test ---\n\n        foo.map((bar, index) => (\n          <Element key={index.toString()} bar={bar} />\n        ))\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[39]: foo.map((bar, index) => ( <Element key={String(index)} ba...", async ({ task }) => {
      const code = `
        foo.map((bar, index) => (
          <Element key={String(index)} bar={bar} />
        ))
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 39)\n\n--- Source code under test ---\n\n        foo.map((bar, index) => (\n          <Element key={String(index)} bar={bar} />\n        ))\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

    it("invalid[40]: foo.map((bar, index) => ( <Element key={index} bar={bar} ...", async ({ task }) => {
      const code = `
        foo.map((bar, index) => (
          <Element key={index} bar={bar} />
        ))
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-array-index-key\nType: invalid (index 40)\n\n--- Source code under test ---\n\n        foo.map((bar, index) => (\n          <Element key={index} bar={bar} />\n        ))\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noArrayIndex): Do not use Array index in keys\n\nRule message templates:\n  noArrayIndex: Do not use Array index in keys";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-array-index-key", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use Array index in keys");
    });

  });
});
