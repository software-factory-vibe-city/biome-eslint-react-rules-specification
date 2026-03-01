import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-no-leaked-render";
const VALID_COUNT = 9;

const RULE_MESSAGES = [
  "Potential leaked value that might cause unintentionally rendered values or rendering crashes",
];

const cases = [
  { code: `
        const Component = () => {
          return <div>{customTitle || defaultTitle}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements }) => {
          return <div>{elements}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements }) => {
          return <div>There are {elements.length} elements</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements, count }) => {
          return <div>{!count && 'No results found'}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements }) => {
          return <div>{!!elements.length && <List elements={elements}/>}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements }) => {
          return <div>{Boolean(elements.length) && <List elements={elements}/>}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements }) => {
          return <div>{elements.length > 0 && <List elements={elements}/>}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements }) => {
          return <div>{elements.length ? <List elements={elements}/> : null}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements, count }) => {
          return <div>{count ? <List elements={elements}/> : null}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ count, title }) => {
          return <div>{count && title}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ count }) => {
          return <div>{count && <span>There are {count} results</span>}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements }) => {
          return <div>{elements.length && <List elements={elements}/>}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ nestedCollection }) => {
          return <div>{nestedCollection.elements.length && <List elements={nestedCollection.elements}/>}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ elements }) => {
          return <div>{elements[0] && <List elements={elements}/>}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ numberA, numberB }) => {
          return <div>{(numberA || numberB) && <Results>{numberA+numberB}</Results>}</div>
        }
      `, filename: "test.jsx" },
  { code: `
        const Component = ({ enabled, checked }) => {
          return <CheckBox checked={enabled && checked} />
        }
      `, filename: "test.jsx" },
];

describe("jsx-no-leaked-render", () => {
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
    it("valid[0]: const Component = () => { return <div>{customTitle || def...", ({ task }) => {
      const code = `
        const Component = () => {
          return <div>{customTitle || defaultTitle}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 0)\n\n--- Source code under test ---\n\n        const Component = () => {\n          return <div>{customTitle || defaultTitle}</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: const Component = ({ elements }) => { return <div>{elemen...", ({ task }) => {
      const code = `
        const Component = ({ elements }) => {
          return <div>{elements}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 1)\n\n--- Source code under test ---\n\n        const Component = ({ elements }) => {\n          return <div>{elements}</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: const Component = ({ elements }) => { return <div>There a...", ({ task }) => {
      const code = `
        const Component = ({ elements }) => {
          return <div>There are {elements.length} elements</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 2)\n\n--- Source code under test ---\n\n        const Component = ({ elements }) => {\n          return <div>There are {elements.length} elements</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: const Component = ({ elements, count }) => { return <div>...", ({ task }) => {
      const code = `
        const Component = ({ elements, count }) => {
          return <div>{!count && 'No results found'}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 3)\n\n--- Source code under test ---\n\n        const Component = ({ elements, count }) => {\n          return <div>{!count && 'No results found'}</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: const Component = ({ elements }) => { return <div>{!!elem...", ({ task }) => {
      const code = `
        const Component = ({ elements }) => {
          return <div>{!!elements.length && <List elements={elements}/>}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 4)\n\n--- Source code under test ---\n\n        const Component = ({ elements }) => {\n          return <div>{!!elements.length && <List elements={elements}/>}</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: const Component = ({ elements }) => { return <div>{Boolea...", ({ task }) => {
      const code = `
        const Component = ({ elements }) => {
          return <div>{Boolean(elements.length) && <List elements={elements}/>}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 5)\n\n--- Source code under test ---\n\n        const Component = ({ elements }) => {\n          return <div>{Boolean(elements.length) && <List elements={elements}/>}</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: const Component = ({ elements }) => { return <div>{elemen...", ({ task }) => {
      const code = `
        const Component = ({ elements }) => {
          return <div>{elements.length > 0 && <List elements={elements}/>}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 6)\n\n--- Source code under test ---\n\n        const Component = ({ elements }) => {\n          return <div>{elements.length > 0 && <List elements={elements}/>}</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: const Component = ({ elements }) => { return <div>{elemen...", ({ task }) => {
      const code = `
        const Component = ({ elements }) => {
          return <div>{elements.length ? <List elements={elements}/> : null}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 7)\n\n--- Source code under test ---\n\n        const Component = ({ elements }) => {\n          return <div>{elements.length ? <List elements={elements}/> : null}</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: const Component = ({ elements, count }) => { return <div>...", ({ task }) => {
      const code = `
        const Component = ({ elements, count }) => {
          return <div>{count ? <List elements={elements}/> : null}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: valid (index 8)\n\n--- Source code under test ---\n\n        const Component = ({ elements, count }) => {\n          return <div>{count ? <List elements={elements}/> : null}</div>\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[2]: const Component = ({ count, title }) => { return <div>{co...", ({ task }) => {
      const code = `
        const Component = ({ count, title }) => {
          return <div>{count && title}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        const Component = ({ count, title }) => {\n          return <div>{count && title}</div>\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Potential leaked value that might cause unintentionally rendered values or rendering crashes\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Potential leaked value that might cause unintentionally rendered values or rendering crashes");
    });

    it("invalid[3]: const Component = ({ count }) => { return <div>{count && ...", ({ task }) => {
      const code = `
        const Component = ({ count }) => {
          return <div>{count && <span>There are {count} results</span>}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        const Component = ({ count }) => {\n          return <div>{count && <span>There are {count} results</span>}</div>\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Potential leaked value that might cause unintentionally rendered values or rendering crashes\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Potential leaked value that might cause unintentionally rendered values or rendering crashes");
    });

    it("invalid[4]: const Component = ({ elements }) => { return <div>{elemen...", ({ task }) => {
      const code = `
        const Component = ({ elements }) => {
          return <div>{elements.length && <List elements={elements}/>}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        const Component = ({ elements }) => {\n          return <div>{elements.length && <List elements={elements}/>}</div>\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Potential leaked value that might cause unintentionally rendered values or rendering crashes\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Potential leaked value that might cause unintentionally rendered values or rendering crashes");
    });

    it("invalid[5]: const Component = ({ nestedCollection }) => { return <div...", ({ task }) => {
      const code = `
        const Component = ({ nestedCollection }) => {
          return <div>{nestedCollection.elements.length && <List elements={nestedCollection.elements}/>}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        const Component = ({ nestedCollection }) => {\n          return <div>{nestedCollection.elements.length && <List elements={nestedCollection.elements}/>}</div>\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Potential leaked value that might cause unintentionally rendered values or rendering crashes\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Potential leaked value that might cause unintentionally rendered values or rendering crashes");
    });

    it("invalid[6]: const Component = ({ elements }) => { return <div>{elemen...", ({ task }) => {
      const code = `
        const Component = ({ elements }) => {
          return <div>{elements[0] && <List elements={elements}/>}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        const Component = ({ elements }) => {\n          return <div>{elements[0] && <List elements={elements}/>}</div>\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Potential leaked value that might cause unintentionally rendered values or rendering crashes\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Potential leaked value that might cause unintentionally rendered values or rendering crashes");
    });

    it("invalid[7]: const Component = ({ numberA, numberB }) => { return <div...", ({ task }) => {
      const code = `
        const Component = ({ numberA, numberB }) => {
          return <div>{(numberA || numberB) && <Results>{numberA+numberB}</Results>}</div>
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        const Component = ({ numberA, numberB }) => {\n          return <div>{(numberA || numberB) && <Results>{numberA+numberB}</Results>}</div>\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Potential leaked value that might cause unintentionally rendered values or rendering crashes\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Potential leaked value that might cause unintentionally rendered values or rendering crashes");
    });

    it("invalid[34]: const Component = ({ enabled, checked }) => { return <Che...", ({ task }) => {
      const code = `
        const Component = ({ enabled, checked }) => {
          return <CheckBox checked={enabled && checked} />
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-leaked-render\nType: invalid (index 34)\n\n--- Source code under test ---\n\n        const Component = ({ enabled, checked }) => {\n          return <CheckBox checked={enabled && checked} />\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Potential leaked value that might cause unintentionally rendered values or rendering crashes\n\nRule message templates:\n  noPotentialLeakedRender: Potential leaked value that might cause unintentionally rendered values or rendering crashes";
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Potential leaked value that might cause unintentionally rendered values or rendering crashes");
    });

  });
});
