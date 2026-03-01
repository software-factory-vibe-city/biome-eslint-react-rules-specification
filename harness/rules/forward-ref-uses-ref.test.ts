import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "forward-ref-uses-ref";
const VALID_COUNT = 10;

const RULE_MESSAGES = [
  "forwardRef is used with this component but no ref parameter is set",
  "Add a ref parameter",
  "Remove forwardRef wrapper",
];

const cases = [
  { code: `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => null);
      `, filename: "test.jsx" },
  { code: `
        import { forwardRef } from 'react'
        forwardRef(function (props, ref) {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import { forwardRef } from 'react'
        forwardRef(function Component(props, ref) {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import * as React from 'react'
        React.forwardRef((props, ref) => {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import * as React from 'react'
        React.forwardRef((props, ref) => null);
      `, filename: "test.jsx" },
  { code: `
        import * as React from 'react'
        React.forwardRef(function (props, ref) {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import * as React from 'react'
        React.forwardRef(function Component(props, ref) {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import * as React from 'react'
        function Component(props) {
          return null;
        };
      `, filename: "test.jsx" },
  { code: `
        import * as React from 'react'
        (props) => null;
      `, filename: "test.jsx" },
  { code: `
        import { forwardRef } from 'react'
        forwardRef((props) => {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import { forwardRef } from 'react'
        forwardRef(props => {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import * as React from 'react'
        React.forwardRef((props) => null);
      `, filename: "test.jsx" },
  { code: `
        import { forwardRef } from 'react'
        const Component = forwardRef(function (props) {
          return null;
        });
      `, filename: "test.jsx" },
  { code: `
        import * as React from 'react'
        React.forwardRef(function Component(props) {
          return null;
        });
      `, filename: "test.jsx" },
];

describe("forward-ref-uses-ref", () => {
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
    it("valid[0]: import { forwardRef } from 'react' forwardRef((props, ref...", ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 0)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef((props, ref) => {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: import { forwardRef } from 'react' forwardRef((props, ref...", ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => null);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 1)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef((props, ref) => null);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: import { forwardRef } from 'react' forwardRef(function (p...", ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef(function (props, ref) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 2)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef(function (props, ref) {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: import { forwardRef } from 'react' forwardRef(function Co...", ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef(function Component(props, ref) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 3)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef(function Component(props, ref) {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: import * as React from 'react' React.forwardRef((props, r...", ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef((props, ref) => {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 4)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef((props, ref) => {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: import * as React from 'react' React.forwardRef((props, r...", ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef((props, ref) => null);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 5)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef((props, ref) => null);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: import * as React from 'react' React.forwardRef(function ...", ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef(function (props, ref) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 6)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef(function (props, ref) {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: import * as React from 'react' React.forwardRef(function ...", ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef(function Component(props, ref) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 7)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef(function Component(props, ref) {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: import * as React from 'react' function Component(props) ...", ({ task }) => {
      const code = `
        import * as React from 'react'
        function Component(props) {
          return null;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 8)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        function Component(props) {\n          return null;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: import * as React from 'react' (props) => null;", ({ task }) => {
      const code = `
        import * as React from 'react'
        (props) => null;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 9)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        (props) => null;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: import { forwardRef } from 'react' forwardRef((props) => ...", ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef((props) => {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef((props) => {\n          return null;\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

    it("invalid[1]: import { forwardRef } from 'react' forwardRef(props => { ...", ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef(props => {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef(props => {\n          return null;\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

    it("invalid[2]: import * as React from 'react' React.forwardRef((props) =...", ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef((props) => null);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef((props) => null);\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

    it("invalid[3]: import { forwardRef } from 'react' const Component = forw...", ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        const Component = forwardRef(function (props) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        const Component = forwardRef(function (props) {\n          return null;\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

    it("invalid[4]: import * as React from 'react' React.forwardRef(function ...", ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef(function Component(props) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef(function Component(props) {\n          return null;\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

  });
});
