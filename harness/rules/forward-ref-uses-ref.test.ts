import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "forwardRef is used with this component but no ref parameter is set",
  "Add a ref parameter",
  "Remove forwardRef wrapper",
];

describe("forward-ref-uses-ref", () => {
  describe("valid", () => {
    it("valid[0]: import { forwardRef } from 'react' forwardRef((props, ref...", async ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 0)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef((props, ref) => {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: import { forwardRef } from 'react' forwardRef((props, ref...", async ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef((props, ref) => null);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 1)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef((props, ref) => null);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: import { forwardRef } from 'react' forwardRef(function (p...", async ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef(function (props, ref) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 2)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef(function (props, ref) {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: import { forwardRef } from 'react' forwardRef(function Co...", async ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef(function Component(props, ref) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 3)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef(function Component(props, ref) {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: import * as React from 'react' React.forwardRef((props, r...", async ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef((props, ref) => {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 4)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef((props, ref) => {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: import * as React from 'react' React.forwardRef((props, r...", async ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef((props, ref) => null);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 5)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef((props, ref) => null);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: import * as React from 'react' React.forwardRef(function ...", async ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef(function (props, ref) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 6)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef(function (props, ref) {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: import * as React from 'react' React.forwardRef(function ...", async ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef(function Component(props, ref) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 7)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef(function Component(props, ref) {\n          return null;\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: import * as React from 'react' function Component(props) ...", async ({ task }) => {
      const code = `
        import * as React from 'react'
        function Component(props) {
          return null;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 8)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        function Component(props) {\n          return null;\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: import * as React from 'react' (props) => null;", async ({ task }) => {
      const code = `
        import * as React from 'react'
        (props) => null;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: valid (index 9)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        (props) => null;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: import { forwardRef } from 'react' forwardRef((props) => ...", async ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef((props) => {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef((props) => {\n          return null;\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

    it("invalid[1]: import { forwardRef } from 'react' forwardRef(props => { ...", async ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        forwardRef(props => {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        forwardRef(props => {\n          return null;\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

    it("invalid[2]: import * as React from 'react' React.forwardRef((props) =...", async ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef((props) => null);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef((props) => null);\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

    it("invalid[3]: import { forwardRef } from 'react' const Component = forw...", async ({ task }) => {
      const code = `
        import { forwardRef } from 'react'
        const Component = forwardRef(function (props) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        import { forwardRef } from 'react'\n        const Component = forwardRef(function (props) {\n          return null;\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

    it("invalid[4]: import * as React from 'react' React.forwardRef(function ...", async ({ task }) => {
      const code = `
        import * as React from 'react'
        React.forwardRef(function Component(props) {
          return null;
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: forward-ref-uses-ref\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        import * as React from 'react'\n        React.forwardRef(function Component(props) {\n          return null;\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: forwardRef is used with this component but no ref parameter is set\n\nRule message templates:\n  missingRefParameter: forwardRef is used with this component but no ref parameter is set\n  addRefParameter: Add a ref parameter\n  removeForwardRef: Remove forwardRef wrapper";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "forward-ref-uses-ref", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("forwardRef is used with this component but no ref parameter is set");
    });

  });
});
