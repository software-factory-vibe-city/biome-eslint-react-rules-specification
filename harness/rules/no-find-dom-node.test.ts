import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-find-dom-node";
const VALID_COUNT = 4;

const RULE_MESSAGES = [
  "Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode",
];

const cases = [
  { code: `
        var Hello = function() {};
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidMount: function() {
            someNonMemberFunction(arg);
            this.someFunc = React.findDOMNode;
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidMount: function() {
            React.someFunc(this);
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidMount: function() {
            React.findDOMNode(this).scrollIntoView();
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        var Hello = createReactClass({
          componentDidMount: function() {
            ReactDOM.findDOMNode(this).scrollIntoView();
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          componentDidMount() {
            findDOMNode(this).scrollIntoView();
          }
          render() {
            return <div>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Hello extends Component {
          componentDidMount() {
            this.node = findDOMNode(this);
          }
          render() {
            return <div>Hello</div>;
          }
        };
      `, filename: "test.jsx" },
];

describe("no-find-dom-node", () => {
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
    it("valid[0]: var Hello = function() {};", ({ task }) => {
      const code = `
        var Hello = function() {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-find-dom-node\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = function() {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noFindDOMNode: Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: var Hello = createReactClass({ render: function() { retur...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-find-dom-node\nType: valid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noFindDOMNode: Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Hello = createReactClass({ componentDidMount: functio...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {
            someNonMemberFunction(arg);
            this.someFunc = React.findDOMNode;
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-find-dom-node\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {\n            someNonMemberFunction(arg);\n            this.someFunc = React.findDOMNode;\n          },\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noFindDOMNode: Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: var Hello = createReactClass({ componentDidMount: functio...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {
            React.someFunc(this);
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-find-dom-node\nType: valid (index 3)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {\n            React.someFunc(this);\n          },\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noFindDOMNode: Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ componentDidMount: functio...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {
            React.findDOMNode(this).scrollIntoView();
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-find-dom-node\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {\n            React.findDOMNode(this).scrollIntoView();\n          },\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noFindDOMNode): Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode\n\nRule message templates:\n  noFindDOMNode: Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode";
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode");
    });

    it("invalid[1]: var Hello = createReactClass({ componentDidMount: functio...", ({ task }) => {
      const code = `
        var Hello = createReactClass({
          componentDidMount: function() {
            ReactDOM.findDOMNode(this).scrollIntoView();
          },
          render: function() {
            return <div>Hello</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-find-dom-node\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        var Hello = createReactClass({\n          componentDidMount: function() {\n            ReactDOM.findDOMNode(this).scrollIntoView();\n          },\n          render: function() {\n            return <div>Hello</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noFindDOMNode): Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode\n\nRule message templates:\n  noFindDOMNode: Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode";
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode");
    });

    it("invalid[2]: class Hello extends Component { componentDidMount() { fin...", ({ task }) => {
      const code = `
        class Hello extends Component {
          componentDidMount() {
            findDOMNode(this).scrollIntoView();
          }
          render() {
            return <div>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-find-dom-node\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          componentDidMount() {\n            findDOMNode(this).scrollIntoView();\n          }\n          render() {\n            return <div>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noFindDOMNode): Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode\n\nRule message templates:\n  noFindDOMNode: Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode";
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode");
    });

    it("invalid[3]: class Hello extends Component { componentDidMount() { thi...", ({ task }) => {
      const code = `
        class Hello extends Component {
          componentDidMount() {
            this.node = findDOMNode(this);
          }
          render() {
            return <div>Hello</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-find-dom-node\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Hello extends Component {\n          componentDidMount() {\n            this.node = findDOMNode(this);\n          }\n          render() {\n            return <div>Hello</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noFindDOMNode): Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode\n\nRule message templates:\n  noFindDOMNode: Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode";
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not use findDOMNode. It doesn’t work with function components and is deprecated in StrictMode. See https://reactjs.org/docs/react-dom.html#finddomnode");
    });

  });
});
