import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "hook-use-state";
const VALID_COUNT = 19;

const RULE_MESSAGES = [
  "useState call is not destructured into value + setter pair",
  "useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)",
  "Destructure useState call into value + setter pair",
  "Replace useState call with useMemo",
];

const cases = [
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [color, setColor] = useState()
          return [color, setColor]
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useRGB() {
          const [rgb, setRGB] = useState()
          return [rgb, setRGB]
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useRGBValue() {
          const [rgbValue, setRGBValue] = useState()
          return [rgbValue, setRGBValue]
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useCustomColorValue() {
          const [customColorValue, setCustomColorValue] = useState()
          return [customColorValue, setCustomColorValue]
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [color, setColor] = useState('#ffffff')
          return [color, setColor]
        }
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'
        function useColor() {
          const [color, setColor] = React.useState()
          return [color, setColor]
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [color1, setColor1] = useState()
          return [color1, setColor1]
        }
      `, filename: "test.jsx" },
  { code: `useState()`, filename: "test.jsx" },
  { code: `const result = useState()`, filename: "test.jsx" },
  { code: `const [color, setFlavor] = useState()`, filename: "test.jsx" },
  { code: `
        import React from 'react'
        import useState from 'someOtherUseState'
        const [color, setFlavor] = useState()
      `, filename: "test.jsx" },
  { code: `
        import { useRef } from 'react'
        const result = useState()
      `, filename: "test.jsx" },
  { code: `
        import { useState as useStateAlternativeName } from 'react'
        function useColor() {
          const [color, setColor] = useStateAlternativeName()
          return [color, setColor]
        }
      `, filename: "test.jsx" },
  { code: `const result = React.useState()`, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          return useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          function useState() { // shadows React's useState
            return null
          }

          const result = useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'
        function useColor() {
          const React = {
            useState: () => {
              return null
            }
          }

          const result = React.useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react';
        function useColor() {
          const [color, setColor] = useState<string>()
          return [color, setColor]
        }
      `, filename: "test.tsx" },
  { code: `
        import { useState } from 'react';
        function useColor() {
          const [color, setColor] = useState<string>('#ffffff')
          return [color, setColor]
        }
      `, filename: "test.tsx" },
  { code: `
        import { useState } from 'react';
        const result = useState()
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react';
        function useColor() {
          const result = useState()
          return result
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState as useStateAlternativeName } from 'react'
        function useColor() {
          const result = useStateAlternativeName()
          return result
        }
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'
        function useColor() {
          const result = React.useState()
          return result
        }
      `, filename: "test.jsx" },
  { code: `
        import ReactAlternative from 'react'
        function useColor() {
          const result = ReactAlternative.useState()
          return result
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const result = useState()
          return result
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [, , extra1] = useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [, setColor] = useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const { color } = useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [] = useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [, , , ,] = useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [color] = useState()
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor(initialColor) {
          const [color] = useState(initialColor)
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState, useMemo as useMemoAlternative } from 'react'
        function useColor(initialColor) {
          const [color] = useState(initialColor)
        }
      `, filename: "test.jsx" },
  { code: `
        import React from 'react'
        function useColor(initialColor) {
          const [color] = React.useState(initialColor)
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [color, , extra1] = useState()
          return [color]
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [color, setColor, extra1, extra2, extra3] = useState()
          return [color, setColor]
        }
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        const [, makeColor] = useState()
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        const [color, setFlavor, extraneous] = useState()
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        const [color, setFlavor] = useState()
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react';

        const [{foo, bar, baz}, setFooBarBaz] = useState({foo: "bbb", bar: "aaa", baz: "qqq"})
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react';

        const [[index, value], setValueWithIndex] = useState([0, "hello"])
      `, filename: "test.jsx" },
  { code: `
        import { useState } from 'react'
        const [color, setFlavor] = useState<string>()
      `, filename: "test.tsx" },
  { code: `
        import { useState } from 'react'
        function useColor() {
          const [color, setFlavor] = useState<string>('#ffffff')
          return [color, setFlavor]
        }
      `, filename: "test.tsx" },
  { code: `
        import React from 'react'
        function useColor() {
          const [color, setFlavor] = React.useState<string>('#ffffff')
          return [color, setFlavor]
        }
      `, filename: "test.tsx" },
];

describe("hook-use-state", () => {
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
    it("valid[0]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [color, setColor] = useState()
          return [color, setColor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 0)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [color, setColor] = useState()\n          return [color, setColor]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: import { useState } from 'react' function useRGB() { cons...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useRGB() {
          const [rgb, setRGB] = useState()
          return [rgb, setRGB]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 1)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useRGB() {\n          const [rgb, setRGB] = useState()\n          return [rgb, setRGB]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: import { useState } from 'react' function useRGBValue() {...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useRGBValue() {
          const [rgbValue, setRGBValue] = useState()
          return [rgbValue, setRGBValue]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 2)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useRGBValue() {\n          const [rgbValue, setRGBValue] = useState()\n          return [rgbValue, setRGBValue]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: import { useState } from 'react' function useCustomColorV...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useCustomColorValue() {
          const [customColorValue, setCustomColorValue] = useState()
          return [customColorValue, setCustomColorValue]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 3)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useCustomColorValue() {\n          const [customColorValue, setCustomColorValue] = useState()\n          return [customColorValue, setCustomColorValue]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [color, setColor] = useState('#ffffff')
          return [color, setColor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 4)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [color, setColor] = useState('#ffffff')\n          return [color, setColor]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: import React from 'react' function useColor() { const [co...", ({ task }) => {
      const code = `
        import React from 'react'
        function useColor() {
          const [color, setColor] = React.useState()
          return [color, setColor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 5)\n\n--- Source code under test ---\n\n        import React from 'react'\n        function useColor() {\n          const [color, setColor] = React.useState()\n          return [color, setColor]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [color1, setColor1] = useState()
          return [color1, setColor1]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 6)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [color1, setColor1] = useState()\n          return [color1, setColor1]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: useState()", ({ task }) => {
      const code = `useState()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 7)\n\n--- Source code under test ---\nuseState()\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: const result = useState()", ({ task }) => {
      const code = `const result = useState()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 8)\n\n--- Source code under test ---\nconst result = useState()\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: const [color, setFlavor] = useState()", ({ task }) => {
      const code = `const [color, setFlavor] = useState()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 9)\n\n--- Source code under test ---\nconst [color, setFlavor] = useState()\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: import React from 'react' import useState from 'someOther...", ({ task }) => {
      const code = `
        import React from 'react'
        import useState from 'someOtherUseState'
        const [color, setFlavor] = useState()
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 10)\n\n--- Source code under test ---\n\n        import React from 'react'\n        import useState from 'someOtherUseState'\n        const [color, setFlavor] = useState()\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: import { useRef } from 'react' const result = useState()", ({ task }) => {
      const code = `
        import { useRef } from 'react'
        const result = useState()
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 11)\n\n--- Source code under test ---\n\n        import { useRef } from 'react'\n        const result = useState()\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: import { useState as useStateAlternativeName } from 'reac...", ({ task }) => {
      const code = `
        import { useState as useStateAlternativeName } from 'react'
        function useColor() {
          const [color, setColor] = useStateAlternativeName()
          return [color, setColor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 12)\n\n--- Source code under test ---\n\n        import { useState as useStateAlternativeName } from 'react'\n        function useColor() {\n          const [color, setColor] = useStateAlternativeName()\n          return [color, setColor]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: const result = React.useState()", ({ task }) => {
      const code = `const result = React.useState()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 13)\n\n--- Source code under test ---\nconst result = React.useState()\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: import { useState } from 'react' function useColor() { re...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          return useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 14)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          return useState()\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: import { useState } from 'react' function useColor() { fu...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          function useState() { // shadows React's useState
            return null
          }

          const result = useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 15)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          function useState() { // shadows React's useState\n            return null\n          }\n\n          const result = useState()\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: import React from 'react' function useColor() { const Rea...", ({ task }) => {
      const code = `
        import React from 'react'
        function useColor() {
          const React = {
            useState: () => {
              return null
            }
          }

          const result = React.useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 16)\n\n--- Source code under test ---\n\n        import React from 'react'\n        function useColor() {\n          const React = {\n            useState: () => {\n              return null\n            }\n          }\n\n          const result = React.useState()\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: import { useState } from 'react'; function useColor() { c...", ({ task }) => {
      const code = `
        import { useState } from 'react';
        function useColor() {
          const [color, setColor] = useState<string>()
          return [color, setColor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 17)\n\n--- Source code under test ---\n\n        import { useState } from 'react';\n        function useColor() {\n          const [color, setColor] = useState<string>()\n          return [color, setColor]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: import { useState } from 'react'; function useColor() { c...", ({ task }) => {
      const code = `
        import { useState } from 'react';
        function useColor() {
          const [color, setColor] = useState<string>('#ffffff')
          return [color, setColor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: valid (index 18)\n\n--- Source code under test ---\n\n        import { useState } from 'react';\n        function useColor() {\n          const [color, setColor] = useState<string>('#ffffff')\n          return [color, setColor]\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: ts\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: import { useState } from 'react'; const result = useState()", ({ task }) => {
      const code = `
        import { useState } from 'react';
        const result = useState()
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        import { useState } from 'react';\n        const result = useState()\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[1]: import { useState } from 'react'; function useColor() { c...", ({ task }) => {
      const code = `
        import { useState } from 'react';
        function useColor() {
          const result = useState()
          return result
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        import { useState } from 'react';\n        function useColor() {\n          const result = useState()\n          return result\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[2]: import { useState as useStateAlternativeName } from 'reac...", ({ task }) => {
      const code = `
        import { useState as useStateAlternativeName } from 'react'
        function useColor() {
          const result = useStateAlternativeName()
          return result
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        import { useState as useStateAlternativeName } from 'react'\n        function useColor() {\n          const result = useStateAlternativeName()\n          return result\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[3]: import React from 'react' function useColor() { const res...", ({ task }) => {
      const code = `
        import React from 'react'
        function useColor() {
          const result = React.useState()
          return result
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        import React from 'react'\n        function useColor() {\n          const result = React.useState()\n          return result\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[4]: import ReactAlternative from 'react' function useColor() ...", ({ task }) => {
      const code = `
        import ReactAlternative from 'react'
        function useColor() {
          const result = ReactAlternative.useState()
          return result
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        import ReactAlternative from 'react'\n        function useColor() {\n          const result = ReactAlternative.useState()\n          return result\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[5]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const result = useState()
          return result
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const result = useState()\n          return result\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[6]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [, , extra1] = useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [, , extra1] = useState()\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[7]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [, setColor] = useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [, setColor] = useState()\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[8]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const { color } = useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const { color } = useState()\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[9]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [] = useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [] = useState()\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[10]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [, , , ,] = useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [, , , ,] = useState()\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[11]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [color] = useState()
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [color] = useState()\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[12]: import { useState } from 'react' function useColor(initia...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor(initialColor) {
          const [color] = useState(initialColor)
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor(initialColor) {\n          const [color] = useState(initialColor)\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[13]: import { useState, useMemo as useMemoAlternative } from '...", ({ task }) => {
      const code = `
        import { useState, useMemo as useMemoAlternative } from 'react'
        function useColor(initialColor) {
          const [color] = useState(initialColor)
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        import { useState, useMemo as useMemoAlternative } from 'react'\n        function useColor(initialColor) {\n          const [color] = useState(initialColor)\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[14]: import React from 'react' function useColor(initialColor)...", ({ task }) => {
      const code = `
        import React from 'react'
        function useColor(initialColor) {
          const [color] = React.useState(initialColor)
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        import React from 'react'\n        function useColor(initialColor) {\n          const [color] = React.useState(initialColor)\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[15]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [color, , extra1] = useState()
          return [color]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [color, , extra1] = useState()\n          return [color]\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[16]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [color, setColor, extra1, extra2, extra3] = useState()
          return [color, setColor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [color, setColor, extra1, extra2, extra3] = useState()\n          return [color, setColor]\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[17]: import { useState } from 'react' const [, makeColor] = us...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        const [, makeColor] = useState()
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 17)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        const [, makeColor] = useState()\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[18]: import { useState } from 'react' const [color, setFlavor,...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        const [color, setFlavor, extraneous] = useState()
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        const [color, setFlavor, extraneous] = useState()\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[19]: import { useState } from 'react' const [color, setFlavor]...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        const [color, setFlavor] = useState()
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 19)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        const [color, setFlavor] = useState()\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[20]: import { useState } from 'react'; const [{foo, bar, baz},...", ({ task }) => {
      const code = `
        import { useState } from 'react';

        const [{foo, bar, baz}, setFooBarBaz] = useState({foo: "bbb", bar: "aaa", baz: "qqq"})
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 20)\n\n--- Source code under test ---\n\n        import { useState } from 'react';\n\n        const [{foo, bar, baz}, setFooBarBaz] = useState({foo: \"bbb\", bar: \"aaa\", baz: \"qqq\"})\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)");
    });

    it("invalid[21]: import { useState } from 'react'; const [[index, value], ...", ({ task }) => {
      const code = `
        import { useState } from 'react';

        const [[index, value], setValueWithIndex] = useState([0, "hello"])
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 21)\n\n--- Source code under test ---\n\n        import { useState } from 'react';\n\n        const [[index, value], setValueWithIndex] = useState([0, \"hello\"])\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)");
    });

    it("invalid[23]: import { useState } from 'react' const [color, setFlavor]...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        const [color, setFlavor] = useState<string>()
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 23)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        const [color, setFlavor] = useState<string>()\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[24]: import { useState } from 'react' function useColor() { co...", ({ task }) => {
      const code = `
        import { useState } from 'react'
        function useColor() {
          const [color, setFlavor] = useState<string>('#ffffff')
          return [color, setFlavor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        import { useState } from 'react'\n        function useColor() {\n          const [color, setFlavor] = useState<string>('#ffffff')\n          return [color, setFlavor]\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

    it("invalid[25]: import React from 'react' function useColor() { const [co...", ({ task }) => {
      const code = `
        import React from 'react'
        function useColor() {
          const [color, setFlavor] = React.useState<string>('#ffffff')
          return [color, setFlavor]
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: hook-use-state\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        import React from 'react'\n        function useColor() {\n          const [color, setFlavor] = React.useState<string>('#ffffff')\n          return [color, setFlavor]\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: useState call is not destructured into value + setter pair\n\nFeatures: ts, no-babel-old\n\nRule message templates:\n  useStateErrorMessage: useState call is not destructured into value + setter pair\n  useStateErrorMessageOrAddOption: useState call is not destructured into value + setter pair (you can allow destructuring by enabling \"allowDestructuredState\" option)\n  suggestPair: Destructure useState call into value + setter pair\n  suggestMemo: Replace useState call with useMemo";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("useState call is not destructured into value + setter pair");
    });

  });
});
