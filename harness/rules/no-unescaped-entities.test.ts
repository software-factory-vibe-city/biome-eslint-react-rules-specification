import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "HTML entity, `{{entity}}` , must be escaped.",
  "`{{entity}}` can be escaped with {{alts}}.",
  "Replace with `{{alt}}`.",
  "`>` can be escaped with `&gt;`.",
  "`'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.",
  "`}` can be escaped with `&#125;`.",
  "HTML entity, `&` , must be escaped.",
  "`&` can be escaped with `&amp;`.",
  "`\"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.",
];

describe("no-unescaped-entities", () => {
  describe("valid", () => {
    it("valid[0]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return (
              <div/>
            );
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return (\n              <div/>\n            );\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Here is some text!</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Here is some text!</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>first line is ok
            so is second
            and here are some escaped entities: &gt; &lt; &amp;</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: valid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>first line is ok\n            so is second\n            and here are some escaped entities: &gt; &lt; &amp;</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>{">" + "<" + "&" + '"'}</div>;
          },
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: valid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>{\">\" + \"<\" + \"&\" + '\"'}</div>;\n          },\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <>Here is some text!</>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: valid (index 5)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <>Here is some text!</>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: valid (index 6)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <>I&rsquo;ve escaped some entities: &gt; &lt; &amp;</>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <>{">" + "<" + "&" + '"'}</>;
          },
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: valid (index 7)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <>{\">\" + \"<\" + \"&\" + '\"'}</>;\n          },\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <>> babel-eslint</>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <>> babel-eslint</>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unescapedEntityAlts): `>` can be escaped with `&gt;`.\n\nFeatures: fragment, no-ts, no-default\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`>` can be escaped with `&gt;`.");
    });

    it("invalid[1]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <>first line is ok
            so is second
            and here are some bad entities: ></>
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <>first line is ok\n            so is second\n            and here are some bad entities: ></>\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unescapedEntityAlts): `>` can be escaped with `&gt;`.\n\nFeatures: fragment, no-ts, no-default\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`>` can be escaped with `&gt;`.");
    });

    it("invalid[2]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>'</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>'</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unescapedEntityAlts): `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.");
    });

    it("invalid[3]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <>{"Unbalanced braces - babel-eslint"}}</>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <>{\"Unbalanced braces - babel-eslint\"}}</>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unescapedEntityAlts): `}` can be escaped with `&#125;`.\n\nFeatures: fragment, no-ts, no-default\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`}` can be escaped with `&#125;`.");
    });

    it("invalid[7]: <script>window.foo = \"bar\"</script>", async ({ task }) => {
      const code = `
        <script>window.foo = "bar"</script>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unescaped-entities\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        <script>window.foo = \"bar\"</script>\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: unescapedEntityAlts): `\"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.\n  [1] (messageId: unescapedEntityAlts): `\"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.\n\nRule message templates:\n  unescapedEntity: HTML entity, `{{entity}}` , must be escaped.\n  unescapedEntityAlts: `{{entity}}` can be escaped with {{alts}}.\n  replaceWithAlt: Replace with `{{alt}}`.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unescaped-entities", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("`\"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.");
      expect(matches[1].message).toBe("`\"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.");
    });

  });
});
