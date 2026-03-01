import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "{{component}} does not need shouldComponentUpdate when extending React.PureComponent.",
  "Foo does not need shouldComponentUpdate when extending React.PureComponent.",
  "Bar does not need shouldComponentUpdate when extending React.PureComponent.",
];

describe("no-redundant-should-component-update", () => {
  describe("valid", () => {
    it("valid[0]: class Foo extends React.Component { shouldComponentUpdate...", async ({ task }) => {
      const code = `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          shouldComponentUpdate() {\n            return true;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: class Foo extends React.Component { shouldComponentUpdate...", async ({ task }) => {
      const code = `
        class Foo extends React.Component {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: valid (index 1)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          shouldComponentUpdate = () => {\n            return true;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: function Foo() { return class Bar extends React.Component...", async ({ task }) => {
      const code = `
        function Foo() {
          return class Bar extends React.Component {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: valid (index 2)\n\n--- Source code under test ---\n\n        function Foo() {\n          return class Bar extends React.Component {\n            shouldComponentUpdate() {\n              return true;\n            }\n          };\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: class Foo extends React.PureComponent { shouldComponentUp...", async ({ task }) => {
      const code = `
        class Foo extends React.PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        class Foo extends React.PureComponent {\n          shouldComponentUpdate() {\n            return true;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Foo does not need shouldComponentUpdate when extending React.PureComponent.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[1]: class Foo extends PureComponent { shouldComponentUpdate()...", async ({ task }) => {
      const code = `
        class Foo extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Foo extends PureComponent {\n          shouldComponentUpdate() {\n            return true;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Foo does not need shouldComponentUpdate when extending React.PureComponent.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[2]: class Foo extends React.PureComponent { shouldComponentUp...", async ({ task }) => {
      const code = `
        class Foo extends React.PureComponent {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Foo extends React.PureComponent {\n          shouldComponentUpdate = () => {\n            return true;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Foo does not need shouldComponentUpdate when extending React.PureComponent.\n\nFeatures: class fields\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[3]: function Foo() { return class Bar extends React.PureCompo...", async ({ task }) => {
      const code = `
        function Foo() {
          return class Bar extends React.PureComponent {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        function Foo() {\n          return class Bar extends React.PureComponent {\n            shouldComponentUpdate() {\n              return true;\n            }\n          };\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Bar does not need shouldComponentUpdate when extending React.PureComponent.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Bar does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[4]: function Foo() { return class Bar extends PureComponent {...", async ({ task }) => {
      const code = `
        function Foo() {
          return class Bar extends PureComponent {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        function Foo() {\n          return class Bar extends PureComponent {\n            shouldComponentUpdate() {\n              return true;\n            }\n          };\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Bar does not need shouldComponentUpdate when extending React.PureComponent.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Bar does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[5]: var Foo = class extends PureComponent { shouldComponentUp...", async ({ task }) => {
      const code = `
        var Foo = class extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        var Foo = class extends PureComponent {\n          shouldComponentUpdate() {\n            return true;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Foo does not need shouldComponentUpdate when extending React.PureComponent.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-redundant-should-component-update", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo does not need shouldComponentUpdate when extending React.PureComponent.");
    });

  });
});
