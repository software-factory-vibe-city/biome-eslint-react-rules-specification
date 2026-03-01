import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-wrap-multilines";
const VALID_COUNT = 22;

const RULE_MESSAGES = [
  "Missing parentheses around multilines JSX",
  "Expected no parentheses around multilines JSX",
  "Parentheses around JSX should be on separate lines",
];

const cases = [
  { code: `
  var Hello = createReactClass({
    render: function() {
      return <p>Hello {this.props.name}</p>;
    }
  });
`, filename: "test.jsx" },
  { code: `
  var Hello = createReactClass({
    render: function() {
      return <>Hello {this.props.name}</>;
    }
  });
`, filename: "test.jsx" },
  { code: `
  var Hello = createReactClass({
    render: function() {
      return (<div>
        <p>Hello {this.props.name}</p>
      </div>);
    }
  });
`, filename: "test.jsx" },
  { code: `var hello = foo ? <p>Hello</p> : <p>Hi</p>;`, filename: "test.jsx" },
  { code: `var hello = foo ? <>Hello</> : <>Hi</>;`, filename: "test.jsx" },
  { code: `
  var hello = foo ? (<div>
    <p>Hello</p>
  </div>) : (<div>
    <p>Hi</p>
  </div>);
`, filename: "test.jsx" },
  { code: `var hello; hello = foo ? <p>Hello</p> : <p>Hi</p>;`, filename: "test.jsx" },
  { code: `
  var hello;
  hello = foo ? (<div>
    <p>Hello</p>
  </div>) : (<div>
    <p>Hi</p>
  </div>);
`, filename: "test.jsx" },
  { code: `var hello = <p>Hello</p>;`, filename: "test.jsx" },
  { code: `
  var hello = (<div>
    <p>Hello</p>
  </div>);
`, filename: "test.jsx" },
  { code: `
  var hello = (<>
    <p>Hello</p>
  </>);
`, filename: "test.jsx" },
  { code: `
  var hello;
  hello = (<div>
    <p>Hello</p>
  </div>);
`, filename: "test.jsx" },
  { code: `
  var hello;
  hello = (<>
    <p>Hello</p>
  </>);
`, filename: "test.jsx" },
  { code: `
  var hello = () => (<div>
    <p>Hello</p>
  </div>);
`, filename: "test.jsx" },
  { code: `
  var hello = () => (<>
    <p>Hello</p>
  </>);
`, filename: "test.jsx" },
  { code: `var hello = () => <p>Hello</p>;`, filename: "test.jsx" },
  { code: `foo ? <p>Hello</p> : null;`, filename: "test.jsx" },
  { code: `
  <div>
    {foo ? <div>
        <p>Hello</p>
      </div> : null}
  </div>
`, filename: "test.jsx" },
  { code: `foo && <p>Hello</p>;`, filename: "test.jsx" },
  { code: `
  <div>
    {foo &&
      <div>
        <p>Hello World</p>
      </div>
    }
  </div>
`, filename: "test.jsx" },
  { code: `<div prop={<p>Hello</p>}></div>`, filename: "test.jsx" },
  { code: `
  <div prop={
    <div>
      <p>Hello</p>
    </div>
  }>
    <p>Hello</p>
  </div>
`, filename: "test.jsx" },
  { code: `
  var Hello = createReactClass({
    render: function() {
      return <div>
        <p>Hello {this.props.name}</p>
      </div>;
    }
  });
`, filename: "test.jsx" },
  { code: `
  var Hello = createReactClass({
    render: function() {
      return <>
        <p>Hello {this.props.name}</p>
      </>;
    }
  });
`, filename: "test.jsx" },
  { code: `
  var hello = foo ? <div>
    <p>Hello</p>
  </div> : <div>
    <p>Hi</p>
  </div>;
`, filename: "test.jsx" },
  { code: `
  var hello = foo ? <>
    <p>Hello</p>
  </> : <>
    <p>Hi</p>
  </>;
`, filename: "test.jsx" },
  { code: `
  var hello;
  hello = foo ? <div>
    <p>Hello</p>
  </div> : <div>
    <p>Hi</p>
  </div>;
`, filename: "test.jsx" },
  { code: `
  var hello;
  hello = foo ? <>
    <p>Hello</p>
  </> : <>
    <p>Hi</p>
  </>;
`, filename: "test.jsx" },
  { code: `
  var hello = <div>
    <p>Hello</p>
  </div>;
`, filename: "test.jsx" },
  { code: `
  var hello = <>
    <p>Hello</p>
  </>;
`, filename: "test.jsx" },
  { code: `
  var hello;
  hello = <div>
    <p>Hello</p>
  </div>;
`, filename: "test.jsx" },
  { code: `
  var hello;
  hello = <>
    <p>Hello</p>
  </>;
`, filename: "test.jsx" },
  { code: `
  var hello = () => <div>
    <p>Hello</p>
  </div>;
`, filename: "test.jsx" },
  { code: `
  var hello = () => <>
    <p>Hello</p>
  </>;
`, filename: "test.jsx" },
];

describe("jsx-wrap-multilines", () => {
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
    it("valid[0]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
  var Hello = createReactClass({
    render: function() {
      return <p>Hello {this.props.name}</p>;
    }
  });
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 0)\n\n--- Source code under test ---\n\n  var Hello = createReactClass({\n    render: function() {\n      return <p>Hello {this.props.name}</p>;\n    }\n  });\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
  var Hello = createReactClass({
    render: function() {
      return <>Hello {this.props.name}</>;
    }
  });
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 2)\n\n--- Source code under test ---\n\n  var Hello = createReactClass({\n    render: function() {\n      return <>Hello {this.props.name}</>;\n    }\n  });\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
  var Hello = createReactClass({
    render: function() {
      return (<div>
        <p>Hello {this.props.name}</p>
      </div>);
    }
  });
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 4)\n\n--- Source code under test ---\n\n  var Hello = createReactClass({\n    render: function() {\n      return (<div>\n        <p>Hello {this.props.name}</p>\n      </div>);\n    }\n  });\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: var hello = foo ? <p>Hello</p> : <p>Hi</p>;", ({ task }) => {
      const code = `var hello = foo ? <p>Hello</p> : <p>Hi</p>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 11)\n\n--- Source code under test ---\nvar hello = foo ? <p>Hello</p> : <p>Hi</p>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: var hello = foo ? <>Hello</> : <>Hi</>;", ({ task }) => {
      const code = `var hello = foo ? <>Hello</> : <>Hi</>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 13)\n\n--- Source code under test ---\nvar hello = foo ? <>Hello</> : <>Hi</>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: var hello = foo ? (<div> <p>Hello</p> </div>) : (<div> <p...", ({ task }) => {
      const code = `
  var hello = foo ? (<div>
    <p>Hello</p>
  </div>) : (<div>
    <p>Hi</p>
  </div>);
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 14)\n\n--- Source code under test ---\n\n  var hello = foo ? (<div>\n    <p>Hello</p>\n  </div>) : (<div>\n    <p>Hi</p>\n  </div>);\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: var hello; hello = foo ? <p>Hello</p> : <p>Hi</p>;", ({ task }) => {
      const code = `var hello; hello = foo ? <p>Hello</p> : <p>Hi</p>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 20)\n\n--- Source code under test ---\nvar hello; hello = foo ? <p>Hello</p> : <p>Hi</p>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: var hello; hello = foo ? (<div> <p>Hello</p> </div>) : (<...", ({ task }) => {
      const code = `
  var hello;
  hello = foo ? (<div>
    <p>Hello</p>
  </div>) : (<div>
    <p>Hi</p>
  </div>);
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 22)\n\n--- Source code under test ---\n\n  var hello;\n  hello = foo ? (<div>\n    <p>Hello</p>\n  </div>) : (<div>\n    <p>Hi</p>\n  </div>);\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: var hello = <p>Hello</p>;", ({ task }) => {
      const code = `var hello = <p>Hello</p>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 28)\n\n--- Source code under test ---\nvar hello = <p>Hello</p>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: var hello = (<div> <p>Hello</p> </div>);", ({ task }) => {
      const code = `
  var hello = (<div>
    <p>Hello</p>
  </div>);
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 30)\n\n--- Source code under test ---\n\n  var hello = (<div>\n    <p>Hello</p>\n  </div>);\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: var hello = (<> <p>Hello</p> </>);", ({ task }) => {
      const code = `
  var hello = (<>
    <p>Hello</p>
  </>);
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 31)\n\n--- Source code under test ---\n\n  var hello = (<>\n    <p>Hello</p>\n  </>);\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[42]: var hello; hello = (<div> <p>Hello</p> </div>);", ({ task }) => {
      const code = `
  var hello;
  hello = (<div>
    <p>Hello</p>
  </div>);
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 42)\n\n--- Source code under test ---\n\n  var hello;\n  hello = (<div>\n    <p>Hello</p>\n  </div>);\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[43]: var hello; hello = (<> <p>Hello</p> </>);", ({ task }) => {
      const code = `
  var hello;
  hello = (<>
    <p>Hello</p>
  </>);
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 43)\n\n--- Source code under test ---\n\n  var hello;\n  hello = (<>\n    <p>Hello</p>\n  </>);\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[50]: var hello = () => (<div> <p>Hello</p> </div>);", ({ task }) => {
      const code = `
  var hello = () => (<div>
    <p>Hello</p>
  </div>);
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 50)\n\n--- Source code under test ---\n\n  var hello = () => (<div>\n    <p>Hello</p>\n  </div>);\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[51]: var hello = () => (<> <p>Hello</p> </>);", ({ task }) => {
      const code = `
  var hello = () => (<>
    <p>Hello</p>
  </>);
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 51)\n\n--- Source code under test ---\n\n  var hello = () => (<>\n    <p>Hello</p>\n  </>);\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[52]: var hello = () => <p>Hello</p>;", ({ task }) => {
      const code = `var hello = () => <p>Hello</p>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 52)\n\n--- Source code under test ---\nvar hello = () => <p>Hello</p>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[60]: foo ? <p>Hello</p> : null;", ({ task }) => {
      const code = `foo ? <p>Hello</p> : null;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 60)\n\n--- Source code under test ---\nfoo ? <p>Hello</p> : null;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[63]: <div> {foo ? <div> <p>Hello</p> </div> : null} </div>", ({ task }) => {
      const code = `
  <div>
    {foo ? <div>
        <p>Hello</p>
      </div> : null}
  </div>
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 63)\n\n--- Source code under test ---\n\n  <div>\n    {foo ? <div>\n        <p>Hello</p>\n      </div> : null}\n  </div>\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[67]: foo && <p>Hello</p>;", ({ task }) => {
      const code = `foo && <p>Hello</p>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 67)\n\n--- Source code under test ---\nfoo && <p>Hello</p>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[69]: <div> {foo && <div> <p>Hello World</p> </div> } </div>", ({ task }) => {
      const code = `
  <div>
    {foo &&
      <div>
        <p>Hello World</p>
      </div>
    }
  </div>
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 69)\n\n--- Source code under test ---\n\n  <div>\n    {foo &&\n      <div>\n        <p>Hello World</p>\n      </div>\n    }\n  </div>\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[73]: <div prop={<p>Hello</p>}></div>", ({ task }) => {
      const code = `<div prop={<p>Hello</p>}></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 73)\n\n--- Source code under test ---\n<div prop={<p>Hello</p>}></div>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[75]: <div prop={ <div> <p>Hello</p> </div> }> <p>Hello</p> </div>", ({ task }) => {
      const code = `
  <div prop={
    <div>
      <p>Hello</p>
    </div>
  }>
    <p>Hello</p>
  </div>
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: valid (index 75)\n\n--- Source code under test ---\n\n  <div prop={\n    <div>\n      <p>Hello</p>\n    </div>\n  }>\n    <p>Hello</p>\n  </div>\n\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[1]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
  var Hello = createReactClass({
    render: function() {
      return <div>
        <p>Hello {this.props.name}</p>
      </div>;
    }
  });
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 1)\n\n--- Source code under test ---\n\n  var Hello = createReactClass({\n    render: function() {\n      return <div>\n        <p>Hello {this.props.name}</p>\n      </div>;\n    }\n  });\n\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[2]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
  var Hello = createReactClass({
    render: function() {
      return <>
        <p>Hello {this.props.name}</p>
      </>;
    }
  });
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 2)\n\n--- Source code under test ---\n\n  var Hello = createReactClass({\n    render: function() {\n      return <>\n        <p>Hello {this.props.name}</p>\n      </>;\n    }\n  });\n\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[6]: var hello = foo ? <div> <p>Hello</p> </div> : <div> <p>Hi...", ({ task }) => {
      const code = `
  var hello = foo ? <div>
    <p>Hello</p>
  </div> : <div>
    <p>Hi</p>
  </div>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 6)\n\n--- Source code under test ---\n\n  var hello = foo ? <div>\n    <p>Hello</p>\n  </div> : <div>\n    <p>Hi</p>\n  </div>;\n\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n  [1] (messageId: missingParens): Missing parentheses around multilines JSX\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
      expect(matches[1].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[8]: var hello = foo ? <> <p>Hello</p> </> : <> <p>Hi</p> </>;", ({ task }) => {
      const code = `
  var hello = foo ? <>
    <p>Hello</p>
  </> : <>
    <p>Hi</p>
  </>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 8)\n\n--- Source code under test ---\n\n  var hello = foo ? <>\n    <p>Hello</p>\n  </> : <>\n    <p>Hi</p>\n  </>;\n\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n  [1] (messageId: missingParens): Missing parentheses around multilines JSX\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
      expect(matches[1].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[12]: var hello; hello = foo ? <div> <p>Hello</p> </div> : <div...", ({ task }) => {
      const code = `
  var hello;
  hello = foo ? <div>
    <p>Hello</p>
  </div> : <div>
    <p>Hi</p>
  </div>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 12)\n\n--- Source code under test ---\n\n  var hello;\n  hello = foo ? <div>\n    <p>Hello</p>\n  </div> : <div>\n    <p>Hi</p>\n  </div>;\n\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n  [1] (messageId: missingParens): Missing parentheses around multilines JSX\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
      expect(matches[1].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[14]: var hello; hello = foo ? <> <p>Hello</p> </> : <> <p>Hi</...", ({ task }) => {
      const code = `
  var hello;
  hello = foo ? <>
    <p>Hello</p>
  </> : <>
    <p>Hi</p>
  </>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 14)\n\n--- Source code under test ---\n\n  var hello;\n  hello = foo ? <>\n    <p>Hello</p>\n  </> : <>\n    <p>Hi</p>\n  </>;\n\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n  [1] (messageId: missingParens): Missing parentheses around multilines JSX\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
      expect(matches[1].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[18]: var hello = <div> <p>Hello</p> </div>;", ({ task }) => {
      const code = `
  var hello = <div>
    <p>Hello</p>
  </div>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 18)\n\n--- Source code under test ---\n\n  var hello = <div>\n    <p>Hello</p>\n  </div>;\n\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[20]: var hello = <> <p>Hello</p> </>;", ({ task }) => {
      const code = `
  var hello = <>
    <p>Hello</p>
  </>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 20)\n\n--- Source code under test ---\n\n  var hello = <>\n    <p>Hello</p>\n  </>;\n\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[23]: var hello; hello = <div> <p>Hello</p> </div>;", ({ task }) => {
      const code = `
  var hello;
  hello = <div>
    <p>Hello</p>
  </div>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 23)\n\n--- Source code under test ---\n\n  var hello;\n  hello = <div>\n    <p>Hello</p>\n  </div>;\n\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[24]: var hello; hello = <> <p>Hello</p> </>;", ({ task }) => {
      const code = `
  var hello;
  hello = <>
    <p>Hello</p>
  </>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 24)\n\n--- Source code under test ---\n\n  var hello;\n  hello = <>\n    <p>Hello</p>\n  </>;\n\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[27]: var hello = () => <div> <p>Hello</p> </div>;", ({ task }) => {
      const code = `
  var hello = () => <div>
    <p>Hello</p>
  </div>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 27)\n\n--- Source code under test ---\n\n  var hello = () => <div>\n    <p>Hello</p>\n  </div>;\n\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
    });

    it("invalid[29]: var hello = () => <> <p>Hello</p> </>;", ({ task }) => {
      const code = `
  var hello = () => <>
    <p>Hello</p>
  </>;
`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-wrap-multilines\nType: invalid (index 29)\n\n--- Source code under test ---\n\n  var hello = () => <>\n    <p>Hello</p>\n  </>;\n\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingParens): Missing parentheses around multilines JSX\n\nFeatures: fragment\n\nRule message templates:\n  missingParens: Missing parentheses around multilines JSX\n  extraParens: Expected no parentheses around multilines JSX\n  parensOnNewLines: Parentheses around JSX should be on separate lines";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing parentheses around multilines JSX");
    });

  });
});
