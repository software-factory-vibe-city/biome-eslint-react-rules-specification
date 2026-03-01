import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-redundant-should-component-update";
const VALID_COUNT = 3;

const RULE_MESSAGES = [
  "{{component}} does not need shouldComponentUpdate when extending React.PureComponent.",
  "Foo does not need shouldComponentUpdate when extending React.PureComponent.",
  "Bar does not need shouldComponentUpdate when extending React.PureComponent.",
];

const cases = [
  { code: `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return true;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.Component {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        function Foo() {
          return class Bar extends React.Component {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo extends React.PureComponent {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        function Foo() {
          return class Bar extends React.PureComponent {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `, filename: "test.jsx" },
  { code: `
        function Foo() {
          return class Bar extends PureComponent {
            shouldComponentUpdate() {
              return true;
            }
          };
        }
      `, filename: "test.jsx" },
  { code: `
        var Foo = class extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `, filename: "test.jsx" },
];

describe("no-redundant-should-component-update", () => {
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
    it("valid[0]: class Foo extends React.Component { shouldComponentUpdate...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          shouldComponentUpdate() {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          shouldComponentUpdate() {\n            return true;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: class Foo extends React.Component { shouldComponentUpdate...", ({ task }) => {
      const code = `
        class Foo extends React.Component {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: valid (index 1)\n\n--- Source code under test ---\n\n        class Foo extends React.Component {\n          shouldComponentUpdate = () => {\n            return true;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: function Foo() { return class Bar extends React.Component...", ({ task }) => {
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
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: class Foo extends React.PureComponent { shouldComponentUp...", ({ task }) => {
      const code = `
        class Foo extends React.PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        class Foo extends React.PureComponent {\n          shouldComponentUpdate() {\n            return true;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Foo does not need shouldComponentUpdate when extending React.PureComponent.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[1]: class Foo extends PureComponent { shouldComponentUpdate()...", ({ task }) => {
      const code = `
        class Foo extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Foo extends PureComponent {\n          shouldComponentUpdate() {\n            return true;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Foo does not need shouldComponentUpdate when extending React.PureComponent.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[2]: class Foo extends React.PureComponent { shouldComponentUp...", ({ task }) => {
      const code = `
        class Foo extends React.PureComponent {
          shouldComponentUpdate = () => {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Foo extends React.PureComponent {\n          shouldComponentUpdate = () => {\n            return true;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Foo does not need shouldComponentUpdate when extending React.PureComponent.\n\nFeatures: class fields\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[3]: function Foo() { return class Bar extends React.PureCompo...", ({ task }) => {
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
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Bar does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[4]: function Foo() { return class Bar extends PureComponent {...", ({ task }) => {
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
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Bar does not need shouldComponentUpdate when extending React.PureComponent.");
    });

    it("invalid[5]: var Foo = class extends PureComponent { shouldComponentUp...", ({ task }) => {
      const code = `
        var Foo = class extends PureComponent {
          shouldComponentUpdate() {
            return true;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-redundant-should-component-update\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        var Foo = class extends PureComponent {\n          shouldComponentUpdate() {\n            return true;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noShouldCompUpdate): Foo does not need shouldComponentUpdate when extending React.PureComponent.\n\nRule message templates:\n  noShouldCompUpdate: {{component}} does not need shouldComponentUpdate when extending React.PureComponent.";
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Foo does not need shouldComponentUpdate when extending React.PureComponent.");
    });

  });
});
