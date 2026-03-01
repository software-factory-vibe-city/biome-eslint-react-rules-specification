import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "async-server-action";
const VALID_COUNT = 52;

const RULE_MESSAGES = [
  "Server Actions must be async",
  "Make {{functionName}} an `async` function",
  "Make this function `async`",
];

const cases = [
  { code: `
        async function addToCart(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        async function requestUsername(formData) {
          'use server';
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        async function addToCart(data) {
          "use server";
        }
      `, filename: "test.jsx" },
  { code: `
        async function requestUsername(formData) {
          "use server";
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        function addToCart(data) {
          console.log("test");
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        function requestUsername(formData) {
          const username = formData.get('username');
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        function addToCart(data) {
          console.log("use server");
        }
      `, filename: "test.jsx" },
  { code: `
        function requestUsername(formData) {
          console.log("use server");
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = async (data) => {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = async (formData) => {
          'use server';
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = async (data) => {
          "use server";
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = async (formData) => {
          "use server";
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = (data) => {
          console.log("test");
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = (formData) => {
          const username = formData.get('username');
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = (data) => {
          console.log("use server");
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = (formData) => {
          console.log("use server");
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = async function (data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = async function (formData) {
          'use server';
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = async function (data) {
          "use server";
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = async function (formData) {
          "use server";
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = function (data) {
          console.log("test");
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = function (formData) {
          const username = formData.get('username');
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = function (data) {
          console.log("use server");
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = function (formData) {
          console.log("use server");
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        async function addToCart(data) {
          \`use server\`;
        }
      `, filename: "test.jsx" },
  { code: `
        function addToCart(data) {
          \`use server\`;
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = async (data) => {
          \`use server\`;
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = (data) => {
          \`use server\`;
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = async function (data) {
          \`use server\`;
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = function (data) {
          \`use server\`;
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = async function* (data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = async function* (data) {
          "use server";
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = function* (data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = function* (data) {
          "use server";
        }
      `, filename: "test.jsx" },
  { code: `
        function* addToCart(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        async function* addToCart(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        export async function addToCart(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        export default async function addToCart(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        export default async function (data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const obj = {
          async action() {
            'use server';
          }
        };
      `, filename: "test.jsx" },
  { code: `
        const obj = {
          async action() {
            'use server';
            const x = 1;
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Foo {
          async action() {
            'use server';
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo {
          static async action() {
            'use server';
          }
        }
      `, filename: "test.jsx" },
  { code: `
        function outer() {
          async function inner() {
            'use server';
          }
        }
      `, filename: "test.jsx" },
  { code: `
        const action = async function named(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        function addToCart(data) {
          'use strict';
          console.log('use server');
        }
      `, filename: "test.jsx" },
  { code: `
        function empty() {}
      `, filename: "test.jsx" },
  { code: `
        const fn = () => 'use server';
      `, filename: "test.jsx" },
  { code: `
        <form action={async () => { 'use server'; }} />
      `, filename: "test.jsx" },
  { code: `
        <button onClick={async () => { 'use server'; doSomething(); }} />
      `, filename: "test.jsx" },
  { code: `
        async function action() {
          'use strict';
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        function action() {
          'use strict';
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        function addToCart(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        function requestUsername(formData) {
          'use server';
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        function addToCart(data) {
          "use server";
        }
      `, filename: "test.jsx" },
  { code: `
        function requestUsername(formData) {
          "use server";
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = (data) => {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = (formData) => {
          'use server';
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = (data) => {
          "use server";
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = (formData) => {
          "use server";
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = function (data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = function (formData) {
          'use server';
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        const addToCart = function (data) {
          "use server";
        }
      `, filename: "test.jsx" },
  { code: `
        const requestUsername = function (formData) {
          "use server";
          const username = formData.get('username');
        }
      `, filename: "test.jsx" },
  { code: `
        export function addToCart(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        export default function addToCart(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        export default function (data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        const obj = {
          action() {
            'use server';
          }
        };
      `, filename: "test.jsx" },
  { code: `
        class Foo {
          action() {
            'use server';
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Foo {
          static action() {
            'use server';
          }
        }
      `, filename: "test.jsx" },
  { code: `
        function outer() {
          function inner() {
            'use server';
          }
        }
      `, filename: "test.jsx" },
  { code: `
        const action = function named(data) {
          'use server';
        }
      `, filename: "test.jsx" },
  { code: `
        <form action={() => { 'use server'; }} />
      `, filename: "test.jsx" },
  { code: `
        <form
          action={function () {
            'use server';
            doSomething();
          }}
        />
      `, filename: "test.jsx" },
];

describe("async-server-action", () => {
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
    it("valid[0]: async function addToCart(data) { 'use server'; }", ({ task }) => {
      const code = `
        async function addToCart(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 0)\n\n--- Source code under test ---\n\n        async function addToCart(data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: async function requestUsername(formData) { 'use server'; ...", ({ task }) => {
      const code = `
        async function requestUsername(formData) {
          'use server';
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 1)\n\n--- Source code under test ---\n\n        async function requestUsername(formData) {\n          'use server';\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: async function addToCart(data) { \"use server\"; }", ({ task }) => {
      const code = `
        async function addToCart(data) {
          "use server";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 2)\n\n--- Source code under test ---\n\n        async function addToCart(data) {\n          \"use server\";\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: async function requestUsername(formData) { \"use server\"; ...", ({ task }) => {
      const code = `
        async function requestUsername(formData) {
          "use server";
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 3)\n\n--- Source code under test ---\n\n        async function requestUsername(formData) {\n          \"use server\";\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: function addToCart(data) { console.log(\"test\"); 'use serv...", ({ task }) => {
      const code = `
        function addToCart(data) {
          console.log("test");
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 4)\n\n--- Source code under test ---\n\n        function addToCart(data) {\n          console.log(\"test\");\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: function requestUsername(formData) { const username = for...", ({ task }) => {
      const code = `
        function requestUsername(formData) {
          const username = formData.get('username');
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 5)\n\n--- Source code under test ---\n\n        function requestUsername(formData) {\n          const username = formData.get('username');\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: function addToCart(data) { console.log(\"use server\"); }", ({ task }) => {
      const code = `
        function addToCart(data) {
          console.log("use server");
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 6)\n\n--- Source code under test ---\n\n        function addToCart(data) {\n          console.log(\"use server\");\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: function requestUsername(formData) { console.log(\"use ser...", ({ task }) => {
      const code = `
        function requestUsername(formData) {
          console.log("use server");
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 7)\n\n--- Source code under test ---\n\n        function requestUsername(formData) {\n          console.log(\"use server\");\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: const addToCart = async (data) => { 'use server'; }", ({ task }) => {
      const code = `
        const addToCart = async (data) => {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 8)\n\n--- Source code under test ---\n\n        const addToCart = async (data) => {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const requestUsername = async (formData) => { 'use server...", ({ task }) => {
      const code = `
        const requestUsername = async (formData) => {
          'use server';
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 9)\n\n--- Source code under test ---\n\n        const requestUsername = async (formData) => {\n          'use server';\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: const addToCart = async (data) => { \"use server\"; }", ({ task }) => {
      const code = `
        const addToCart = async (data) => {
          "use server";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 10)\n\n--- Source code under test ---\n\n        const addToCart = async (data) => {\n          \"use server\";\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: const requestUsername = async (formData) => { \"use server...", ({ task }) => {
      const code = `
        const requestUsername = async (formData) => {
          "use server";
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 11)\n\n--- Source code under test ---\n\n        const requestUsername = async (formData) => {\n          \"use server\";\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: const addToCart = (data) => { console.log(\"test\"); 'use s...", ({ task }) => {
      const code = `
        const addToCart = (data) => {
          console.log("test");
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 12)\n\n--- Source code under test ---\n\n        const addToCart = (data) => {\n          console.log(\"test\");\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: const requestUsername = (formData) => { const username = ...", ({ task }) => {
      const code = `
        const requestUsername = (formData) => {
          const username = formData.get('username');
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 13)\n\n--- Source code under test ---\n\n        const requestUsername = (formData) => {\n          const username = formData.get('username');\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: const addToCart = (data) => { console.log(\"use server\"); }", ({ task }) => {
      const code = `
        const addToCart = (data) => {
          console.log("use server");
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 14)\n\n--- Source code under test ---\n\n        const addToCart = (data) => {\n          console.log(\"use server\");\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: const requestUsername = (formData) => { console.log(\"use ...", ({ task }) => {
      const code = `
        const requestUsername = (formData) => {
          console.log("use server");
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 15)\n\n--- Source code under test ---\n\n        const requestUsername = (formData) => {\n          console.log(\"use server\");\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: const addToCart = async function (data) { 'use server'; }", ({ task }) => {
      const code = `
        const addToCart = async function (data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 16)\n\n--- Source code under test ---\n\n        const addToCart = async function (data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: const requestUsername = async function (formData) { 'use ...", ({ task }) => {
      const code = `
        const requestUsername = async function (formData) {
          'use server';
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 17)\n\n--- Source code under test ---\n\n        const requestUsername = async function (formData) {\n          'use server';\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: const addToCart = async function (data) { \"use server\"; }", ({ task }) => {
      const code = `
        const addToCart = async function (data) {
          "use server";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 18)\n\n--- Source code under test ---\n\n        const addToCart = async function (data) {\n          \"use server\";\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: const requestUsername = async function (formData) { \"use ...", ({ task }) => {
      const code = `
        const requestUsername = async function (formData) {
          "use server";
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 19)\n\n--- Source code under test ---\n\n        const requestUsername = async function (formData) {\n          \"use server\";\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: const addToCart = function (data) { console.log(\"test\"); ...", ({ task }) => {
      const code = `
        const addToCart = function (data) {
          console.log("test");
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 20)\n\n--- Source code under test ---\n\n        const addToCart = function (data) {\n          console.log(\"test\");\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: const requestUsername = function (formData) { const usern...", ({ task }) => {
      const code = `
        const requestUsername = function (formData) {
          const username = formData.get('username');
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 21)\n\n--- Source code under test ---\n\n        const requestUsername = function (formData) {\n          const username = formData.get('username');\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: const addToCart = function (data) { console.log(\"use serv...", ({ task }) => {
      const code = `
        const addToCart = function (data) {
          console.log("use server");
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 22)\n\n--- Source code under test ---\n\n        const addToCart = function (data) {\n          console.log(\"use server\");\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: const requestUsername = function (formData) { console.log...", ({ task }) => {
      const code = `
        const requestUsername = function (formData) {
          console.log("use server");
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 23)\n\n--- Source code under test ---\n\n        const requestUsername = function (formData) {\n          console.log(\"use server\");\n          const username = formData.get('username');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: async function addToCart(data) { `use server`; }", ({ task }) => {
      const code = `
        async function addToCart(data) {
          \`use server\`;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 24)\n\n--- Source code under test ---\n\n        async function addToCart(data) {\n          `use server`;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: function addToCart(data) { `use server`; }", ({ task }) => {
      const code = `
        function addToCart(data) {
          \`use server\`;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 25)\n\n--- Source code under test ---\n\n        function addToCart(data) {\n          `use server`;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: const addToCart = async (data) => { `use server`; }", ({ task }) => {
      const code = `
        const addToCart = async (data) => {
          \`use server\`;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 26)\n\n--- Source code under test ---\n\n        const addToCart = async (data) => {\n          `use server`;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: const addToCart = (data) => { `use server`; }", ({ task }) => {
      const code = `
        const addToCart = (data) => {
          \`use server\`;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 27)\n\n--- Source code under test ---\n\n        const addToCart = (data) => {\n          `use server`;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: const addToCart = async function (data) { `use server`; }", ({ task }) => {
      const code = `
        const addToCart = async function (data) {
          \`use server\`;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 28)\n\n--- Source code under test ---\n\n        const addToCart = async function (data) {\n          `use server`;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: const addToCart = function (data) { `use server`; }", ({ task }) => {
      const code = `
        const addToCart = function (data) {
          \`use server\`;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 29)\n\n--- Source code under test ---\n\n        const addToCart = function (data) {\n          `use server`;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: const addToCart = async function* (data) { 'use server'; }", ({ task }) => {
      const code = `
        const addToCart = async function* (data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 30)\n\n--- Source code under test ---\n\n        const addToCart = async function* (data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: const addToCart = async function* (data) { \"use server\"; }", ({ task }) => {
      const code = `
        const addToCart = async function* (data) {
          "use server";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 31)\n\n--- Source code under test ---\n\n        const addToCart = async function* (data) {\n          \"use server\";\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: const addToCart = function* (data) { 'use server'; }", ({ task }) => {
      const code = `
        const addToCart = function* (data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 32)\n\n--- Source code under test ---\n\n        const addToCart = function* (data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: const addToCart = function* (data) { \"use server\"; }", ({ task }) => {
      const code = `
        const addToCart = function* (data) {
          "use server";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 33)\n\n--- Source code under test ---\n\n        const addToCart = function* (data) {\n          \"use server\";\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: function* addToCart(data) { 'use server'; }", ({ task }) => {
      const code = `
        function* addToCart(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 34)\n\n--- Source code under test ---\n\n        function* addToCart(data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: async function* addToCart(data) { 'use server'; }", ({ task }) => {
      const code = `
        async function* addToCart(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 35)\n\n--- Source code under test ---\n\n        async function* addToCart(data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: export async function addToCart(data) { 'use server'; }", ({ task }) => {
      const code = `
        export async function addToCart(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 36)\n\n--- Source code under test ---\n\n        export async function addToCart(data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[37]: export default async function addToCart(data) { 'use serv...", ({ task }) => {
      const code = `
        export default async function addToCart(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 37)\n\n--- Source code under test ---\n\n        export default async function addToCart(data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: export default async function (data) { 'use server'; }", ({ task }) => {
      const code = `
        export default async function (data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 38)\n\n--- Source code under test ---\n\n        export default async function (data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[39]: const obj = { async action() { 'use server'; } };", ({ task }) => {
      const code = `
        const obj = {
          async action() {
            'use server';
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 39)\n\n--- Source code under test ---\n\n        const obj = {\n          async action() {\n            'use server';\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[40]: const obj = { async action() { 'use server'; const x = 1;...", ({ task }) => {
      const code = `
        const obj = {
          async action() {
            'use server';
            const x = 1;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 40)\n\n--- Source code under test ---\n\n        const obj = {\n          async action() {\n            'use server';\n            const x = 1;\n          }\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[41]: class Foo { async action() { 'use server'; } }", ({ task }) => {
      const code = `
        class Foo {
          async action() {
            'use server';
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 41)\n\n--- Source code under test ---\n\n        class Foo {\n          async action() {\n            'use server';\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[42]: class Foo { static async action() { 'use server'; } }", ({ task }) => {
      const code = `
        class Foo {
          static async action() {
            'use server';
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 42)\n\n--- Source code under test ---\n\n        class Foo {\n          static async action() {\n            'use server';\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[43]: function outer() { async function inner() { 'use server';...", ({ task }) => {
      const code = `
        function outer() {
          async function inner() {
            'use server';
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 43)\n\n--- Source code under test ---\n\n        function outer() {\n          async function inner() {\n            'use server';\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[44]: const action = async function named(data) { 'use server'; }", ({ task }) => {
      const code = `
        const action = async function named(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 44)\n\n--- Source code under test ---\n\n        const action = async function named(data) {\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[45]: function addToCart(data) { 'use strict'; console.log('use...", ({ task }) => {
      const code = `
        function addToCart(data) {
          'use strict';
          console.log('use server');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 45)\n\n--- Source code under test ---\n\n        function addToCart(data) {\n          'use strict';\n          console.log('use server');\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[46]: function empty() {}", ({ task }) => {
      const code = `
        function empty() {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 46)\n\n--- Source code under test ---\n\n        function empty() {}\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[47]: const fn = () => 'use server';", ({ task }) => {
      const code = `
        const fn = () => 'use server';
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 47)\n\n--- Source code under test ---\n\n        const fn = () => 'use server';\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[48]: <form action={async () => { 'use server'; }} />", ({ task }) => {
      const code = `
        <form action={async () => { 'use server'; }} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 48)\n\n--- Source code under test ---\n\n        <form action={async () => { 'use server'; }} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[49]: <button onClick={async () => { 'use server'; doSomething(...", ({ task }) => {
      const code = `
        <button onClick={async () => { 'use server'; doSomething(); }} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 49)\n\n--- Source code under test ---\n\n        <button onClick={async () => { 'use server'; doSomething(); }} />\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[50]: async function action() { 'use strict'; 'use server'; }", ({ task }) => {
      const code = `
        async function action() {
          'use strict';
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 50)\n\n--- Source code under test ---\n\n        async function action() {\n          'use strict';\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[51]: function action() { 'use strict'; 'use server'; }", ({ task }) => {
      const code = `
        function action() {
          'use strict';
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: valid (index 51)\n\n--- Source code under test ---\n\n        function action() {\n          'use strict';\n          'use server';\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: function addToCart(data) { 'use server'; }", ({ task }) => {
      const code = `
        function addToCart(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        function addToCart(data) {\n          'use server';\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[52], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[1]: function requestUsername(formData) { 'use server'; const ...", ({ task }) => {
      const code = `
        function requestUsername(formData) {
          'use server';
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        function requestUsername(formData) {\n          'use server';\n          const username = formData.get('username');\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[53], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[2]: function addToCart(data) { \"use server\"; }", ({ task }) => {
      const code = `
        function addToCart(data) {
          "use server";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        function addToCart(data) {\n          \"use server\";\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[54], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[3]: function requestUsername(formData) { \"use server\"; const ...", ({ task }) => {
      const code = `
        function requestUsername(formData) {
          "use server";
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        function requestUsername(formData) {\n          \"use server\";\n          const username = formData.get('username');\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[55], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[4]: const addToCart = (data) => { 'use server'; }", ({ task }) => {
      const code = `
        const addToCart = (data) => {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        const addToCart = (data) => {\n          'use server';\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[56], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[5]: const requestUsername = (formData) => { 'use server'; con...", ({ task }) => {
      const code = `
        const requestUsername = (formData) => {
          'use server';
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        const requestUsername = (formData) => {\n          'use server';\n          const username = formData.get('username');\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[57], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[6]: const addToCart = (data) => { \"use server\"; }", ({ task }) => {
      const code = `
        const addToCart = (data) => {
          "use server";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        const addToCart = (data) => {\n          \"use server\";\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[58], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[7]: const requestUsername = (formData) => { \"use server\"; con...", ({ task }) => {
      const code = `
        const requestUsername = (formData) => {
          "use server";
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        const requestUsername = (formData) => {\n          \"use server\";\n          const username = formData.get('username');\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[59], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[8]: const addToCart = function (data) { 'use server'; }", ({ task }) => {
      const code = `
        const addToCart = function (data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        const addToCart = function (data) {\n          'use server';\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[60], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[9]: const requestUsername = function (formData) { 'use server...", ({ task }) => {
      const code = `
        const requestUsername = function (formData) {
          'use server';
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        const requestUsername = function (formData) {\n          'use server';\n          const username = formData.get('username');\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[61], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[10]: const addToCart = function (data) { \"use server\"; }", ({ task }) => {
      const code = `
        const addToCart = function (data) {
          "use server";
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        const addToCart = function (data) {\n          \"use server\";\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[62], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[11]: const requestUsername = function (formData) { \"use server...", ({ task }) => {
      const code = `
        const requestUsername = function (formData) {
          "use server";
          const username = formData.get('username');
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        const requestUsername = function (formData) {\n          \"use server\";\n          const username = formData.get('username');\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[63], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[12]: export function addToCart(data) { 'use server'; }", ({ task }) => {
      const code = `
        export function addToCart(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        export function addToCart(data) {\n          'use server';\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[64], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[13]: export default function addToCart(data) { 'use server'; }", ({ task }) => {
      const code = `
        export default function addToCart(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        export default function addToCart(data) {\n          'use server';\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[65], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[14]: export default function (data) { 'use server'; }", ({ task }) => {
      const code = `
        export default function (data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        export default function (data) {\n          'use server';\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[66], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[15]: const obj = { action() { 'use server'; } };", ({ task }) => {
      const code = `
        const obj = {
          action() {
            'use server';
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        const obj = {\n          action() {\n            'use server';\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[67], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[16]: class Foo { action() { 'use server'; } }", ({ task }) => {
      const code = `
        class Foo {
          action() {
            'use server';
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        class Foo {\n          action() {\n            'use server';\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[68], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[17]: class Foo { static action() { 'use server'; } }", ({ task }) => {
      const code = `
        class Foo {
          static action() {
            'use server';
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 17)\n\n--- Source code under test ---\n\n        class Foo {\n          static action() {\n            'use server';\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[69], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[18]: function outer() { function inner() { 'use server'; } }", ({ task }) => {
      const code = `
        function outer() {
          function inner() {
            'use server';
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        function outer() {\n          function inner() {\n            'use server';\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[70], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[19]: const action = function named(data) { 'use server'; }", ({ task }) => {
      const code = `
        const action = function named(data) {
          'use server';
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 19)\n\n--- Source code under test ---\n\n        const action = function named(data) {\n          'use server';\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[71], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[20]: <form action={() => { 'use server'; }} />", ({ task }) => {
      const code = `
        <form action={() => { 'use server'; }} />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 20)\n\n--- Source code under test ---\n\n        <form action={() => { 'use server'; }} />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[72], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

    it("invalid[21]: <form action={function () { 'use server'; doSomething(); ...", ({ task }) => {
      const code = `
        <form
          action={function () {
            'use server';
            doSomething();
          }}
        />
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: async-server-action\nType: invalid (index 21)\n\n--- Source code under test ---\n\n        <form\n          action={function () {\n            'use server';\n            doSomething();\n          }}\n        />\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Server Actions must be async\n\nRule message templates:\n  asyncServerAction: Server Actions must be async\n  suggestAsyncNamed: Make {{functionName}} an `async` function\n  suggestAsyncAnon: Make this function `async`";
      const matches = ruleErrors(results[73], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Server Actions must be async");
    });

  });
});
