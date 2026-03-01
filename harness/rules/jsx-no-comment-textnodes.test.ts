import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Comments inside children section of tag should be placed inside braces",
];

describe("jsx-no-comment-textnodes", () => {
  describe("valid", () => {
    it("valid[0]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {/* valid */}
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 0)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                {/* valid */}\n              </div>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: class Comp1 extends Component { render() { return ( <> {/...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <>
                {/* valid */}
              </>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 1)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <>\n                {/* valid */}\n              </>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: class Comp1 extends Component { render() { return (<div>{...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<div>{/* valid */}</div>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 2)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<div>{/* valid */}</div>);\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: class Comp1 extends Component { render() { const bar = (<...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            const bar = (<div>{/* valid */}</div>);
            return bar;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 3)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            const bar = (<div>{/* valid */}</div>);\n            return bar;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: var Hello = createReactClass({ foo: (<div>{/* valid */}</...", async ({ task }) => {
      const code = `
        var Hello = createReactClass({
          foo: (<div>{/* valid */}</div>),
          render() {
            return this.foo;
          },
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 4)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          foo: (<div>{/* valid */}</div>),\n          render() {\n            return this.foo;\n          },\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {/* valid */}
                {/* valid 2 */}
                {/* valid 3 */}
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                {/* valid */}\n                {/* valid 2 */}\n                {/* valid 3 */}\n              </div>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 6)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n              </div>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: var foo = require('foo');", async ({ task }) => {
      const code = `
        var foo = require('foo');
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 7)\n\n--- Source code under test ---\n\n        var foo = require('foo');\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <Foo bar='test'> {/* valid */} </Foo>", async ({ task }) => {
      const code = `
        <Foo bar='test'>
          {/* valid */}
        </Foo>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 8)\n\n--- Source code under test ---\n\n        <Foo bar='test'>\n          {/* valid */}\n        </Foo>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <strong> &nbsp;https://www.example.com/attachment/downloa...", async ({ task }) => {
      const code = `
        <strong>
          &nbsp;https://www.example.com/attachment/download/1
        </strong>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 9)\n\n--- Source code under test ---\n\n        <strong>\n          &nbsp;https://www.example.com/attachment/download/1\n        </strong>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <Foo /* valid */ placeholder={'foo'}/>", async ({ task }) => {
      const code = `
        <Foo /* valid */ placeholder={'foo'}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 10)\n\n--- Source code under test ---\n\n        <Foo /* valid */ placeholder={'foo'}/>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: </* valid */></>", async ({ task }) => {
      const code = `
        </* valid */></>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 11)\n\n--- Source code under test ---\n\n        </* valid */></>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <></* valid *//>", async ({ task }) => {
      const code = `
        <></* valid *//>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 12)\n\n--- Source code under test ---\n\n        <></* valid *//>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment, no-ts\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <Foo title={'foo' /* valid */}/>", async ({ task }) => {
      const code = `
        <Foo title={'foo' /* valid */}/>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 13)\n\n--- Source code under test ---\n\n        <Foo title={'foo' /* valid */}/>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <pre>&#x2F;&#x2F; TODO: Write perfect code</pre>", async ({ task }) => {
      const code = `<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 14)\n\n--- Source code under test ---\n<pre>&#x2F;&#x2F; TODO: Write perfect code</pre>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>", async ({ task }) => {
      const code = `<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 15)\n\n--- Source code under test ---\n<pre>&#x2F;&#42; TODO: Write perfect code &#42;&#x2F;</pre>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <div> <span className=\"pl-c\"><span className=\"pl-c\">&#47;...", async ({ task }) => {
      const code = `
        <div>
          <span className="pl-c"><span className="pl-c">&#47;&#47;</span> ...</span><br />
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: valid (index 16)\n\n--- Source code under test ---\n\n        <div>\n          <span className=\"pl-c\"><span className=\"pl-c\">&#47;&#47;</span> ...</span><br />\n        </div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: class Comp1 extends Component { render() { return (<div>/...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<div>// invalid</div>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<div>// invalid</div>);\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: putCommentInBraces): Comments inside children section of tag should be placed inside braces\n\nFeatures: no-ts-old\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Comments inside children section of tag should be placed inside braces");
    });

    it("invalid[1]: class Comp1 extends Component { render() { return (<>// i...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<>// invalid</>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<>// invalid</>);\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: putCommentInBraces): Comments inside children section of tag should be placed inside braces\n\nFeatures: fragment, no-ts-old\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Comments inside children section of tag should be placed inside braces");
    });

    it("invalid[2]: class Comp1 extends Component { render() { return (<div>/...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (<div>/* invalid */</div>);
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (<div>/* invalid */</div>);\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: putCommentInBraces): Comments inside children section of tag should be placed inside braces\n\nFeatures: no-ts-old\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Comments inside children section of tag should be placed inside braces");
    });

    it("invalid[3]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                // invalid
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                // invalid\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: putCommentInBraces): Comments inside children section of tag should be placed inside braces\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Comments inside children section of tag should be placed inside braces");
    });

    it("invalid[4]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                asdjfl
                /* invalid */
                foo
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                asdjfl\n                /* invalid */\n                foo\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: putCommentInBraces): Comments inside children section of tag should be placed inside braces\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Comments inside children section of tag should be placed inside braces");
    });

    it("invalid[5]: class Comp1 extends Component { render() { return ( <div>...", async ({ task }) => {
      const code = `
        class Comp1 extends Component {
          render() {
            return (
              <div>
                {'asdjfl'}
                // invalid
                {'foo'}
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        class Comp1 extends Component {\n          render() {\n            return (\n              <div>\n                {'asdjfl'}\n                // invalid\n                {'foo'}\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: putCommentInBraces): Comments inside children section of tag should be placed inside braces\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Comments inside children section of tag should be placed inside braces");
    });

    it("invalid[6]: const Component2 = () => { return <span>/*</span>; };", async ({ task }) => {
      const code = `
        const Component2 = () => {
          return <span>/*</span>;
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-comment-textnodes\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        const Component2 = () => {\n          return <span>/*</span>;\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: putCommentInBraces): Comments inside children section of tag should be placed inside braces\n\nFeatures: no-ts-old\n\nRule message templates:\n  putCommentInBraces: Comments inside children section of tag should be placed inside braces";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-no-comment-textnodes", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Comments inside children section of tag should be placed inside braces");
    });

  });
});
