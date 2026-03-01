import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "prefer-read-only-props";
const VALID_COUNT = 8;

const RULE_MESSAGES = [
  "Prop '{{name}}' should be read-only.",
  "Prop 'name' should be read-only.",
  "Prop 'firstName' should be read-only.",
  "Prop 'lastName' should be read-only.",
];

const cases = [
  { code: `
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.propTypes = {
          name: PropTypes.string,
        };
      `, filename: "test.jsx" },
  { code: `
        import React from "react";

        interface Props {
          readonly name: string;
        }

        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };

        export default MyComponent;
      `, filename: "test.tsx" },
  { code: `
        import React from "react";
        type Props = {
          readonly firstName: string;
          readonly lastName: string;
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `, filename: "test.tsx" },
  { code: `
        import React from "react";
        type Props = {
          readonly name: string;
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `, filename: "test.tsx" },
  { code: `
        import React from "react";
        type Props = {
          readonly name: string[];
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `, filename: "test.tsx" },
  { code: `
        import React from "react";
        type Props = {
          readonly name: string[];
        }
        const MyComponent: React.FC<Props> = async ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `, filename: "test.tsx" },
  { code: `
        import React from "react";
        type Props = {
          readonly person: {
            name: string;
          }
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `, filename: "test.tsx" },
  { code: `
        type Props = {
          name: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.tsx" },
  { code: `
        interface Props {
          name: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.tsx" },
  { code: `
        import React from "react";
        type Props = {
          name: string[];
        }
        const MyComponent: React.FC<Props> = async ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `, filename: "test.tsx" },
  { code: `
        type Props = {
          readonly firstName: string;
          lastName: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.tsx" },
];

describe("prefer-read-only-props", () => {
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
    it("valid[7]: class Hello extends React.Component { render () { return ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: valid (index 7)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render () {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: class Hello extends React.Component { render () { return ...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.propTypes = {
          name: PropTypes.string,
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: valid (index 8)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render () {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n        Hello.propTypes = {\n          name: PropTypes.string,\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: import React from \"react\"; interface Props { readonly nam...", ({ task }) => {
      const code = `
        import React from "react";

        interface Props {
          readonly name: string;
        }

        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };

        export default MyComponent;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: valid (index 11)\n\n--- Source code under test ---\n\n        import React from \"react\";\n\n        interface Props {\n          readonly name: string;\n        }\n\n        const MyComponent: React.FC<Props> = ({ name }) => {\n          return <div>{name}</div>;\n        };\n\n        export default MyComponent;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: import React from \"react\"; type Props = { readonly firstN...", ({ task }) => {
      const code = `
        import React from "react";
        type Props = {
          readonly firstName: string;
          readonly lastName: string;
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: valid (index 12)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        type Props = {\n          readonly firstName: string;\n          readonly lastName: string;\n        }\n        const MyComponent: React.FC<Props> = ({ name }) => {\n          return <div>{name}</div>;\n        };\n        export default MyComponent;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: import React from \"react\"; type Props = { readonly name: ...", ({ task }) => {
      const code = `
        import React from "react";
        type Props = {
          readonly name: string;
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: valid (index 13)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        type Props = {\n          readonly name: string;\n        }\n        const MyComponent: React.FC<Props> = ({ name }) => {\n          return <div>{name}</div>;\n        };\n        export default MyComponent;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: import React from \"react\"; type Props = { readonly name: ...", ({ task }) => {
      const code = `
        import React from "react";
        type Props = {
          readonly name: string[];
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: valid (index 14)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        type Props = {\n          readonly name: string[];\n        }\n        const MyComponent: React.FC<Props> = ({ name }) => {\n          return <div>{name}</div>;\n        };\n        export default MyComponent;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: import React from \"react\"; type Props = { readonly name: ...", ({ task }) => {
      const code = `
        import React from "react";
        type Props = {
          readonly name: string[];
        }
        const MyComponent: React.FC<Props> = async ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: valid (index 15)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        type Props = {\n          readonly name: string[];\n        }\n        const MyComponent: React.FC<Props> = async ({ name }) => {\n          return <div>{name}</div>;\n        };\n        export default MyComponent;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: import React from \"react\"; type Props = { readonly person...", ({ task }) => {
      const code = `
        import React from "react";
        type Props = {
          readonly person: {
            name: string;
          }
        }
        const MyComponent: React.FC<Props> = ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: valid (index 16)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        type Props = {\n          readonly person: {\n            name: string;\n          }\n        }\n        const MyComponent: React.FC<Props> = ({ name }) => {\n          return <div>{name}</div>;\n        };\n        export default MyComponent;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[8]: type Props = { name: string; } class Hello extends React....", ({ task }) => {
      const code = `
        type Props = {
          name: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        type Props = {\n          name: string;\n        }\n\n        class Hello extends React.Component<Props> {\n          render () {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: readOnlyProp): Prop 'name' should be read-only.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop 'name' should be read-only.");
    });

    it("invalid[9]: interface Props { name: string; } class Hello extends Rea...", ({ task }) => {
      const code = `
        interface Props {
          name: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        interface Props {\n          name: string;\n        }\n\n        class Hello extends React.Component<Props> {\n          render () {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: readOnlyProp): Prop 'name' should be read-only.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop 'name' should be read-only.");
    });

    it("invalid[10]: import React from \"react\"; type Props = { name: string[];...", ({ task }) => {
      const code = `
        import React from "react";
        type Props = {
          name: string[];
        }
        const MyComponent: React.FC<Props> = async ({ name }) => {
          return <div>{name}</div>;
        };
        export default MyComponent;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        import React from \"react\";\n        type Props = {\n          name: string[];\n        }\n        const MyComponent: React.FC<Props> = async ({ name }) => {\n          return <div>{name}</div>;\n        };\n        export default MyComponent;\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: readOnlyProp): Prop 'name' should be read-only.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop 'name' should be read-only.");
    });

    it("invalid[11]: type Props = { readonly firstName: string; lastName: stri...", ({ task }) => {
      const code = `
        type Props = {
          readonly firstName: string;
          lastName: string;
        }

        class Hello extends React.Component<Props> {
          render () {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: prefer-read-only-props\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        type Props = {\n          readonly firstName: string;\n          lastName: string;\n        }\n\n        class Hello extends React.Component<Props> {\n          render () {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: readOnlyProp): Prop 'lastName' should be read-only.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  readOnlyProp: Prop '{{name}}' should be read-only.";
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Prop 'lastName' should be read-only.");
    });

  });
});
