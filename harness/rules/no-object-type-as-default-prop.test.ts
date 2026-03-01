import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-object-type-as-default-prop";
const VALID_COUNT = 9;

const RULE_MESSAGES = [
  "{{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.",
  "a has a/an object literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of object literal.",
  "b has a/an array literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of array literal.",
  "c has a/an regex literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of regex literal.",
  "d has a/an arrow function as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of arrow function.",
  "e has a/an function expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of function expression.",
  "f has a/an class expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of class expression.",
  "g has a/an construction expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of construction expression.",
  "h has a/an JSX element as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of JSX element.",
  "i has a/an Symbol literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of Symbol literal.",
];

const cases = [
  { code: `
      function Foo({
        bar = emptyFunction,
      }) {
        return null;
      }
    `, filename: "test.jsx" },
  { code: `
      function Foo({
        bar = emptyFunction,
        ...rest
      }) {
        return null;
      }
    `, filename: "test.jsx" },
  { code: `
      function Foo({
        bar = 1,
        baz = 'hello',
      }) {
        return null;
      }
    `, filename: "test.jsx" },
  { code: `
      function Foo(props) {
        return null;
      }
    `, filename: "test.jsx" },
  { code: `
      function Foo(props) {
        return null;
      }

      Foo.defaultProps = {
        bar: () => {}
      }
    `, filename: "test.jsx" },
  { code: `
      const Foo = () => {
        return null;
      };
    `, filename: "test.jsx" },
  { code: `
      const Foo = ({bar = 1}) => {
        return null;
      };
    `, filename: "test.jsx" },
  { code: `
      const Foo = ({bar = 1}, context) => {
        return null;
      };
    `, filename: "test.jsx" },
  { code: `
      export default function NotAComponent({foo = {}}) {}
    `, filename: "test.jsx" },
  { code: `
        function Foo({
          a = {},
          b = ['one', 'two'],
          c = /regex/i,
          d = () => {},
          e = function() {},
          f = class {},
          g = new Thing(),
          h = <Thing />,
          i = Symbol('foo')
        }) {
          return null;
        }
      `, filename: "test.jsx" },
  { code: `
        const Foo = ({
          a = {},
          b = ['one', 'two'],
          c = /regex/i,
          d = () => {},
          e = function() {},
          f = class {},
          g = new Thing(),
          h = <Thing />,
          i = Symbol('foo')
        }) => {
          return null;
        }
      `, filename: "test.jsx" },
  { code: `
        const Foo = ({
          a = {},
          b = ['one', 'two'],
          c = /regex/i,
          d = () => {},
          e = function() {},
          f = class {},
          g = new Thing(),
          h = <Thing />,
          i = Symbol('foo')
        }, context) => {
          return null;
        }
      `, filename: "test.jsx" },
];

describe("no-object-type-as-default-prop", () => {
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
    it("valid[0]: function Foo({ bar = emptyFunction, }) { return null; }", ({ task }) => {
      const code = `
      function Foo({
        bar = emptyFunction,
      }) {
        return null;
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 0)\n\n--- Source code under test ---\n\n      function Foo({\n        bar = emptyFunction,\n      }) {\n        return null;\n      }\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: function Foo({ bar = emptyFunction, ...rest }) { return n...", ({ task }) => {
      const code = `
      function Foo({
        bar = emptyFunction,
        ...rest
      }) {
        return null;
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 1)\n\n--- Source code under test ---\n\n      function Foo({\n        bar = emptyFunction,\n        ...rest\n      }) {\n        return null;\n      }\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: function Foo({ bar = 1, baz = 'hello', }) { return null; }", ({ task }) => {
      const code = `
      function Foo({
        bar = 1,
        baz = 'hello',
      }) {
        return null;
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 2)\n\n--- Source code under test ---\n\n      function Foo({\n        bar = 1,\n        baz = 'hello',\n      }) {\n        return null;\n      }\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: function Foo(props) { return null; }", ({ task }) => {
      const code = `
      function Foo(props) {
        return null;
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 3)\n\n--- Source code under test ---\n\n      function Foo(props) {\n        return null;\n      }\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: function Foo(props) { return null; } Foo.defaultProps = {...", ({ task }) => {
      const code = `
      function Foo(props) {
        return null;
      }

      Foo.defaultProps = {
        bar: () => {}
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 4)\n\n--- Source code under test ---\n\n      function Foo(props) {\n        return null;\n      }\n\n      Foo.defaultProps = {\n        bar: () => {}\n      }\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: const Foo = () => { return null; };", ({ task }) => {
      const code = `
      const Foo = () => {
        return null;
      };
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 5)\n\n--- Source code under test ---\n\n      const Foo = () => {\n        return null;\n      };\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: const Foo = ({bar = 1}) => { return null; };", ({ task }) => {
      const code = `
      const Foo = ({bar = 1}) => {
        return null;
      };
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 6)\n\n--- Source code under test ---\n\n      const Foo = ({bar = 1}) => {\n        return null;\n      };\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: const Foo = ({bar = 1}, context) => { return null; };", ({ task }) => {
      const code = `
      const Foo = ({bar = 1}, context) => {
        return null;
      };
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 7)\n\n--- Source code under test ---\n\n      const Foo = ({bar = 1}, context) => {\n        return null;\n      };\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: export default function NotAComponent({foo = {}}) {}", ({ task }) => {
      const code = `
      export default function NotAComponent({foo = {}}) {}
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: valid (index 8)\n\n--- Source code under test ---\n\n      export default function NotAComponent({foo = {}}) {}\n    \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: function Foo({ a = {}, b = ['one', 'two'], c = /regex/i, ...", ({ task }) => {
      const code = `
        function Foo({
          a = {},
          b = ['one', 'two'],
          c = /regex/i,
          d = () => {},
          e = function() {},
          f = class {},
          g = new Thing(),
          h = <Thing />,
          i = Symbol('foo')
        }) {
          return null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        function Foo({\n          a = {},\n          b = ['one', 'two'],\n          c = /regex/i,\n          d = () => {},\n          e = function() {},\n          f = class {},\n          g = new Thing(),\n          h = <Thing />,\n          i = Symbol('foo')\n        }) {\n          return null;\n        }\n      \n\nThis code is INVALID — the rule should produce 9 diagnostic(s):\n  [0] (messageId: forbiddenTypeDefaultParam): a has a/an object literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of object literal.\n  [1] (messageId: forbiddenTypeDefaultParam): b has a/an array literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of array literal.\n  [2] (messageId: forbiddenTypeDefaultParam): c has a/an regex literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of regex literal.\n  [3] (messageId: forbiddenTypeDefaultParam): d has a/an arrow function as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of arrow function.\n  [4] (messageId: forbiddenTypeDefaultParam): e has a/an function expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of function expression.\n  [5] (messageId: forbiddenTypeDefaultParam): f has a/an class expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of class expression.\n  [6] (messageId: forbiddenTypeDefaultParam): g has a/an construction expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of construction expression.\n  [7] (messageId: forbiddenTypeDefaultParam): h has a/an JSX element as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of JSX element.\n  [8] (messageId: forbiddenTypeDefaultParam): i has a/an Symbol literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of Symbol literal.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(9);
      expect(matches[0].message).toBe("a has a/an object literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of object literal.");
      expect(matches[1].message).toBe("b has a/an array literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of array literal.");
      expect(matches[2].message).toBe("c has a/an regex literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of regex literal.");
      expect(matches[3].message).toBe("d has a/an arrow function as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of arrow function.");
      expect(matches[4].message).toBe("e has a/an function expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of function expression.");
      expect(matches[5].message).toBe("f has a/an class expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of class expression.");
      expect(matches[6].message).toBe("g has a/an construction expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of construction expression.");
      expect(matches[7].message).toBe("h has a/an JSX element as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of JSX element.");
      expect(matches[8].message).toBe("i has a/an Symbol literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of Symbol literal.");
    });

    it("invalid[1]: const Foo = ({ a = {}, b = ['one', 'two'], c = /regex/i, ...", ({ task }) => {
      const code = `
        const Foo = ({
          a = {},
          b = ['one', 'two'],
          c = /regex/i,
          d = () => {},
          e = function() {},
          f = class {},
          g = new Thing(),
          h = <Thing />,
          i = Symbol('foo')
        }) => {
          return null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        const Foo = ({\n          a = {},\n          b = ['one', 'two'],\n          c = /regex/i,\n          d = () => {},\n          e = function() {},\n          f = class {},\n          g = new Thing(),\n          h = <Thing />,\n          i = Symbol('foo')\n        }) => {\n          return null;\n        }\n      \n\nThis code is INVALID — the rule should produce 9 diagnostic(s):\n  [0] (messageId: forbiddenTypeDefaultParam): a has a/an object literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of object literal.\n  [1] (messageId: forbiddenTypeDefaultParam): b has a/an array literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of array literal.\n  [2] (messageId: forbiddenTypeDefaultParam): c has a/an regex literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of regex literal.\n  [3] (messageId: forbiddenTypeDefaultParam): d has a/an arrow function as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of arrow function.\n  [4] (messageId: forbiddenTypeDefaultParam): e has a/an function expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of function expression.\n  [5] (messageId: forbiddenTypeDefaultParam): f has a/an class expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of class expression.\n  [6] (messageId: forbiddenTypeDefaultParam): g has a/an construction expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of construction expression.\n  [7] (messageId: forbiddenTypeDefaultParam): h has a/an JSX element as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of JSX element.\n  [8] (messageId: forbiddenTypeDefaultParam): i has a/an Symbol literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of Symbol literal.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(9);
      expect(matches[0].message).toBe("a has a/an object literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of object literal.");
      expect(matches[1].message).toBe("b has a/an array literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of array literal.");
      expect(matches[2].message).toBe("c has a/an regex literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of regex literal.");
      expect(matches[3].message).toBe("d has a/an arrow function as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of arrow function.");
      expect(matches[4].message).toBe("e has a/an function expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of function expression.");
      expect(matches[5].message).toBe("f has a/an class expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of class expression.");
      expect(matches[6].message).toBe("g has a/an construction expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of construction expression.");
      expect(matches[7].message).toBe("h has a/an JSX element as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of JSX element.");
      expect(matches[8].message).toBe("i has a/an Symbol literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of Symbol literal.");
    });

    it("invalid[2]: const Foo = ({ a = {}, b = ['one', 'two'], c = /regex/i, ...", ({ task }) => {
      const code = `
        const Foo = ({
          a = {},
          b = ['one', 'two'],
          c = /regex/i,
          d = () => {},
          e = function() {},
          f = class {},
          g = new Thing(),
          h = <Thing />,
          i = Symbol('foo')
        }, context) => {
          return null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-object-type-as-default-prop\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        const Foo = ({\n          a = {},\n          b = ['one', 'two'],\n          c = /regex/i,\n          d = () => {},\n          e = function() {},\n          f = class {},\n          g = new Thing(),\n          h = <Thing />,\n          i = Symbol('foo')\n        }, context) => {\n          return null;\n        }\n      \n\nThis code is INVALID — the rule should produce 9 diagnostic(s):\n  [0] (messageId: forbiddenTypeDefaultParam): a has a/an object literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of object literal.\n  [1] (messageId: forbiddenTypeDefaultParam): b has a/an array literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of array literal.\n  [2] (messageId: forbiddenTypeDefaultParam): c has a/an regex literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of regex literal.\n  [3] (messageId: forbiddenTypeDefaultParam): d has a/an arrow function as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of arrow function.\n  [4] (messageId: forbiddenTypeDefaultParam): e has a/an function expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of function expression.\n  [5] (messageId: forbiddenTypeDefaultParam): f has a/an class expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of class expression.\n  [6] (messageId: forbiddenTypeDefaultParam): g has a/an construction expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of construction expression.\n  [7] (messageId: forbiddenTypeDefaultParam): h has a/an JSX element as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of JSX element.\n  [8] (messageId: forbiddenTypeDefaultParam): i has a/an Symbol literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of Symbol literal.\n\nRule message templates:\n  forbiddenTypeDefaultParam: {{propName}} has a/an {{forbiddenType}} as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of {{forbiddenType}}.";
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(9);
      expect(matches[0].message).toBe("a has a/an object literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of object literal.");
      expect(matches[1].message).toBe("b has a/an array literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of array literal.");
      expect(matches[2].message).toBe("c has a/an regex literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of regex literal.");
      expect(matches[3].message).toBe("d has a/an arrow function as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of arrow function.");
      expect(matches[4].message).toBe("e has a/an function expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of function expression.");
      expect(matches[5].message).toBe("f has a/an class expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of class expression.");
      expect(matches[6].message).toBe("g has a/an construction expression as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of construction expression.");
      expect(matches[7].message).toBe("h has a/an JSX element as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of JSX element.");
      expect(matches[8].message).toBe("i has a/an Symbol literal as default prop. This could lead to potential infinite render loop in React. Use a variable reference instead of Symbol literal.");
    });

  });
});
