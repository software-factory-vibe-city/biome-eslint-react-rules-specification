import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-no-target-blank";
const VALID_COUNT = 44;

const RULE_MESSAGES = [
  "Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations",
  "Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations",
];

const cases = [
  { code: `<a href="foobar"></a>`, filename: "test.jsx" },
  { code: `<a randomTag></a>`, filename: "test.jsx" },
  { code: `<a target />`, filename: "test.jsx" },
  { code: `<a href="foobar" target="_blank" rel="noopener noreferrer"></a>`, filename: "test.jsx" },
  { code: `<a href="foobar" target="_blank" rel="noreferrer"></a>`, filename: "test.jsx" },
  { code: `<a href="foobar" target="_blank" rel={"noopener noreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a href="foobar" target="_blank" rel={"noreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a href={"foobar"} target={"_blank"} rel={"noopener noreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a href={"foobar"} target={"_blank"} rel={"noreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a href={'foobar'} target={'_blank'} rel={'noopener noreferrer'}></a>`, filename: "test.jsx" },
  { code: `<a href={'foobar'} target={'_blank'} rel={'noreferrer'}></a>`, filename: "test.jsx" },
  { code: `<a href={\`foobar\`} target={\`_blank\`} rel={\`noopener noreferrer\`}></a>`, filename: "test.jsx" },
  { code: `<a href={\`foobar\`} target={\`_blank\`} rel={\`noreferrer\`}></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" {...spreadProps} rel="noopener noreferrer"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" {...spreadProps} rel="noreferrer"></a>`, filename: "test.jsx" },
  { code: `<a {...spreadProps} target="_blank" rel="noopener noreferrer" href="https://example.com">s</a>`, filename: "test.jsx" },
  { code: `<a {...spreadProps} target="_blank" rel="noreferrer" href="https://example.com">s</a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel="noopener noreferrer" {...spreadProps}></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel="noreferrer" {...spreadProps}></a>`, filename: "test.jsx" },
  { code: `<p target="_blank"></p>`, filename: "test.jsx" },
  { code: `<a href="foobar" target="_BLANK" rel="NOOPENER noreferrer"></a>`, filename: "test.jsx" },
  { code: `<a href="foobar" target="_BLANK" rel="NOREFERRER"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel={relValue}></a>`, filename: "test.jsx" },
  { code: `<a target={targetValue} rel="noopener noreferrer"></a>`, filename: "test.jsx" },
  { code: `<a target={targetValue} rel="noreferrer"></a>`, filename: "test.jsx" },
  { code: `<a target={targetValue} rel={"noopener noreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a target={targetValue} rel={"noreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a target={targetValue} href="relative/path"></a>`, filename: "test.jsx" },
  { code: `<a target={targetValue} href="/absolute/path"></a>`, filename: "test.jsx" },
  { code: `<a target={'targetValue'} href="/absolute/path"></a>`, filename: "test.jsx" },
  { code: `<a target={"targetValue"} href="/absolute/path"></a>`, filename: "test.jsx" },
  { code: `<a target={null} href="//example.com"></a>`, filename: "test.jsx" },
  { code: `<a target={3} />`, filename: "test.jsx" },
  { code: `<a href="some-link" {...otherProps} target="some-non-blank-target"></a>`, filename: "test.jsx" },
  { code: `<a href="some-link" target="some-non-blank-target" {...otherProps}></a>`, filename: "test.jsx" },
  { code: `<form action="https://example.com" target="_blank"></form>`, filename: "test.jsx" },
  { code: `<a href target="_blank"/>`, filename: "test.jsx" },
  { code: `<a href={href} target={isExternal ? "_blank" : undefined} rel="noopener noreferrer" />`, filename: "test.jsx" },
  { code: `<a href={href} target={isExternal ? undefined : "_blank"} rel={isExternal ? "noreferrer" : "noopener noreferrer"} />`, filename: "test.jsx" },
  { code: `<a href={href} target={isExternal ? undefined : "_blank"} rel={isExternal ? "noreferrer noopener" : "noreferrer"} />`, filename: "test.jsx" },
  { code: `<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} />`, filename: "test.jsx" },
  { code: `<a href={href} target={isSelf ? "_self" : "_blank"} rel={isSelf ? undefined : "noreferrer"} />`, filename: "test.jsx" },
  { code: `<a href={href} target={isSelf ? "_self" : ""} rel={isSelf ? undefined : ""} />`, filename: "test.jsx" },
  { code: `<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} />`, filename: "test.jsx" },
  { code: `<a target="_blank" href="https://example.com/1"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel="" href="https://example.com/2"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel={0} href="https://example.com/3"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel={1} href="https://example.com/3"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel={false} href="https://example.com/4"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel={null} href="https://example.com/5"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel="noopenernoreferrer" href="https://example.com/6"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" rel="no referrer" href="https://example.com/7"></a>`, filename: "test.jsx" },
  { code: `<a target="_BLANK" href="https://example.com/8"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" href="//example.com/9"></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" href="//example.com/10" rel={true}></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" href="//example.com/11" rel={3}></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" href="//example.com/12" rel={null}></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" href="//example.com/13" rel={getRel()}></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" href="//example.com/14" rel={"noopenernoreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a target={"_blank"} href={"//example.com/15"} rel={"noopenernoreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a target={"_blank"} href={"//example.com/16"} rel={"noopenernoreferrernoreferrernoreferrernoreferrernoreferrer"}></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" href="//example.com/17" rel></a>`, filename: "test.jsx" },
  { code: `<a target="_blank" href={ dynamicLink }></a>`, filename: "test.jsx" },
  { code: `<a target={'_blank'} href="//example.com/18"></a>`, filename: "test.jsx" },
  { code: `<a target={"_blank"} href="//example.com/19"></a>`, filename: "test.jsx" },
  { code: `<a href={href} target="_blank" rel={isExternal ? "undefined" : "undefined"} />`, filename: "test.jsx" },
  { code: `<a href={href} target="_blank" rel={isExternal ? "noopener" : undefined} />`, filename: "test.jsx" },
  { code: `<a href={href} target="_blank" rel={isExternal ? "undefined" : "noopener"} />`, filename: "test.jsx" },
  { code: `<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? undefined : "noopener noreferrer"} />`, filename: "test.jsx" },
  { code: `<a href={href} target="_blank" rel={isExternal ? 3 : "noopener noreferrer"} />`, filename: "test.jsx" },
  { code: `<a href={href} target="_blank" rel={isExternal ? "noopener noreferrer" : "3"} />`, filename: "test.jsx" },
];

describe("jsx-no-target-blank", () => {
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
    it("valid[0]: <a href=\"foobar\"></a>", ({ task }) => {
      const code = `<a href="foobar"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 0)\n\n--- Source code under test ---\n<a href=\"foobar\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <a randomTag></a>", ({ task }) => {
      const code = `<a randomTag></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 1)\n\n--- Source code under test ---\n<a randomTag></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <a target />", ({ task }) => {
      const code = `<a target />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 2)\n\n--- Source code under test ---\n<a target />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <a href=\"foobar\" target=\"_blank\" rel=\"noopener noreferrer...", ({ task }) => {
      const code = `<a href="foobar" target="_blank" rel="noopener noreferrer"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 3)\n\n--- Source code under test ---\n<a href=\"foobar\" target=\"_blank\" rel=\"noopener noreferrer\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <a href=\"foobar\" target=\"_blank\" rel=\"noreferrer\"></a>", ({ task }) => {
      const code = `<a href="foobar" target="_blank" rel="noreferrer"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 4)\n\n--- Source code under test ---\n<a href=\"foobar\" target=\"_blank\" rel=\"noreferrer\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <a href=\"foobar\" target=\"_blank\" rel={\"noopener noreferre...", ({ task }) => {
      const code = `<a href="foobar" target="_blank" rel={"noopener noreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 5)\n\n--- Source code under test ---\n<a href=\"foobar\" target=\"_blank\" rel={\"noopener noreferrer\"}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <a href=\"foobar\" target=\"_blank\" rel={\"noreferrer\"}></a>", ({ task }) => {
      const code = `<a href="foobar" target="_blank" rel={"noreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 6)\n\n--- Source code under test ---\n<a href=\"foobar\" target=\"_blank\" rel={\"noreferrer\"}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <a href={\"foobar\"} target={\"_blank\"} rel={\"noopener noref...", ({ task }) => {
      const code = `<a href={"foobar"} target={"_blank"} rel={"noopener noreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 7)\n\n--- Source code under test ---\n<a href={\"foobar\"} target={\"_blank\"} rel={\"noopener noreferrer\"}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: <a href={\"foobar\"} target={\"_blank\"} rel={\"noreferrer\"}></a>", ({ task }) => {
      const code = `<a href={"foobar"} target={"_blank"} rel={"noreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 8)\n\n--- Source code under test ---\n<a href={\"foobar\"} target={\"_blank\"} rel={\"noreferrer\"}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <a href={'foobar'} target={'_blank'} rel={'noopener noref...", ({ task }) => {
      const code = `<a href={'foobar'} target={'_blank'} rel={'noopener noreferrer'}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 9)\n\n--- Source code under test ---\n<a href={'foobar'} target={'_blank'} rel={'noopener noreferrer'}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <a href={'foobar'} target={'_blank'} rel={'noreferrer'}></a>", ({ task }) => {
      const code = `<a href={'foobar'} target={'_blank'} rel={'noreferrer'}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 10)\n\n--- Source code under test ---\n<a href={'foobar'} target={'_blank'} rel={'noreferrer'}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <a href={`foobar`} target={`_blank`} rel={`noopener noref...", ({ task }) => {
      const code = `<a href={\`foobar\`} target={\`_blank\`} rel={\`noopener noreferrer\`}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 11)\n\n--- Source code under test ---\n<a href={`foobar`} target={`_blank`} rel={`noopener noreferrer`}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <a href={`foobar`} target={`_blank`} rel={`noreferrer`}></a>", ({ task }) => {
      const code = `<a href={\`foobar\`} target={\`_blank\`} rel={\`noreferrer\`}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 12)\n\n--- Source code under test ---\n<a href={`foobar`} target={`_blank`} rel={`noreferrer`}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <a target=\"_blank\" {...spreadProps} rel=\"noopener norefer...", ({ task }) => {
      const code = `<a target="_blank" {...spreadProps} rel="noopener noreferrer"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 13)\n\n--- Source code under test ---\n<a target=\"_blank\" {...spreadProps} rel=\"noopener noreferrer\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <a target=\"_blank\" {...spreadProps} rel=\"noreferrer\"></a>", ({ task }) => {
      const code = `<a target="_blank" {...spreadProps} rel="noreferrer"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 14)\n\n--- Source code under test ---\n<a target=\"_blank\" {...spreadProps} rel=\"noreferrer\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <a {...spreadProps} target=\"_blank\" rel=\"noopener norefer...", ({ task }) => {
      const code = `<a {...spreadProps} target="_blank" rel="noopener noreferrer" href="https://example.com">s</a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 15)\n\n--- Source code under test ---\n<a {...spreadProps} target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://example.com\">s</a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <a {...spreadProps} target=\"_blank\" rel=\"noreferrer\" href...", ({ task }) => {
      const code = `<a {...spreadProps} target="_blank" rel="noreferrer" href="https://example.com">s</a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 16)\n\n--- Source code under test ---\n<a {...spreadProps} target=\"_blank\" rel=\"noreferrer\" href=\"https://example.com\">s</a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <a target=\"_blank\" rel=\"noopener noreferrer\" {...spreadPr...", ({ task }) => {
      const code = `<a target="_blank" rel="noopener noreferrer" {...spreadProps}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 17)\n\n--- Source code under test ---\n<a target=\"_blank\" rel=\"noopener noreferrer\" {...spreadProps}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <a target=\"_blank\" rel=\"noreferrer\" {...spreadProps}></a>", ({ task }) => {
      const code = `<a target="_blank" rel="noreferrer" {...spreadProps}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 18)\n\n--- Source code under test ---\n<a target=\"_blank\" rel=\"noreferrer\" {...spreadProps}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <p target=\"_blank\"></p>", ({ task }) => {
      const code = `<p target="_blank"></p>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 19)\n\n--- Source code under test ---\n<p target=\"_blank\"></p>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <a href=\"foobar\" target=\"_BLANK\" rel=\"NOOPENER noreferrer...", ({ task }) => {
      const code = `<a href="foobar" target="_BLANK" rel="NOOPENER noreferrer"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 20)\n\n--- Source code under test ---\n<a href=\"foobar\" target=\"_BLANK\" rel=\"NOOPENER noreferrer\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <a href=\"foobar\" target=\"_BLANK\" rel=\"NOREFERRER\"></a>", ({ task }) => {
      const code = `<a href="foobar" target="_BLANK" rel="NOREFERRER"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 21)\n\n--- Source code under test ---\n<a href=\"foobar\" target=\"_BLANK\" rel=\"NOREFERRER\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: <a target=\"_blank\" rel={relValue}></a>", ({ task }) => {
      const code = `<a target="_blank" rel={relValue}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 22)\n\n--- Source code under test ---\n<a target=\"_blank\" rel={relValue}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: <a target={targetValue} rel=\"noopener noreferrer\"></a>", ({ task }) => {
      const code = `<a target={targetValue} rel="noopener noreferrer"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 23)\n\n--- Source code under test ---\n<a target={targetValue} rel=\"noopener noreferrer\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: <a target={targetValue} rel=\"noreferrer\"></a>", ({ task }) => {
      const code = `<a target={targetValue} rel="noreferrer"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 24)\n\n--- Source code under test ---\n<a target={targetValue} rel=\"noreferrer\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: <a target={targetValue} rel={\"noopener noreferrer\"}></a>", ({ task }) => {
      const code = `<a target={targetValue} rel={"noopener noreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 25)\n\n--- Source code under test ---\n<a target={targetValue} rel={\"noopener noreferrer\"}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: <a target={targetValue} rel={\"noreferrer\"}></a>", ({ task }) => {
      const code = `<a target={targetValue} rel={"noreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 26)\n\n--- Source code under test ---\n<a target={targetValue} rel={\"noreferrer\"}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: <a target={targetValue} href=\"relative/path\"></a>", ({ task }) => {
      const code = `<a target={targetValue} href="relative/path"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 27)\n\n--- Source code under test ---\n<a target={targetValue} href=\"relative/path\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: <a target={targetValue} href=\"/absolute/path\"></a>", ({ task }) => {
      const code = `<a target={targetValue} href="/absolute/path"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 28)\n\n--- Source code under test ---\n<a target={targetValue} href=\"/absolute/path\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: <a target={'targetValue'} href=\"/absolute/path\"></a>", ({ task }) => {
      const code = `<a target={'targetValue'} href="/absolute/path"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 29)\n\n--- Source code under test ---\n<a target={'targetValue'} href=\"/absolute/path\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: <a target={\"targetValue\"} href=\"/absolute/path\"></a>", ({ task }) => {
      const code = `<a target={"targetValue"} href="/absolute/path"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 30)\n\n--- Source code under test ---\n<a target={\"targetValue\"} href=\"/absolute/path\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: <a target={null} href=\"//example.com\"></a>", ({ task }) => {
      const code = `<a target={null} href="//example.com"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 31)\n\n--- Source code under test ---\n<a target={null} href=\"//example.com\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[44]: <a target={3} />", ({ task }) => {
      const code = `<a target={3} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 44)\n\n--- Source code under test ---\n<a target={3} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[45]: <a href=\"some-link\" {...otherProps} target=\"some-non-blan...", ({ task }) => {
      const code = `<a href="some-link" {...otherProps} target="some-non-blank-target"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 45)\n\n--- Source code under test ---\n<a href=\"some-link\" {...otherProps} target=\"some-non-blank-target\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[46]: <a href=\"some-link\" target=\"some-non-blank-target\" {...ot...", ({ task }) => {
      const code = `<a href="some-link" target="some-non-blank-target" {...otherProps}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 46)\n\n--- Source code under test ---\n<a href=\"some-link\" target=\"some-non-blank-target\" {...otherProps}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[49]: <form action=\"https://example.com\" target=\"_blank\"></form>", ({ task }) => {
      const code = `<form action="https://example.com" target="_blank"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 49)\n\n--- Source code under test ---\n<form action=\"https://example.com\" target=\"_blank\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[52]: <a href target=\"_blank\"/>", ({ task }) => {
      const code = `<a href target="_blank"/>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 52)\n\n--- Source code under test ---\n<a href target=\"_blank\"/>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[53]: <a href={href} target={isExternal ? \"_blank\" : undefined}...", ({ task }) => {
      const code = `<a href={href} target={isExternal ? "_blank" : undefined} rel="noopener noreferrer" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 53)\n\n--- Source code under test ---\n<a href={href} target={isExternal ? \"_blank\" : undefined} rel=\"noopener noreferrer\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[54]: <a href={href} target={isExternal ? undefined : \"_blank\"}...", ({ task }) => {
      const code = `<a href={href} target={isExternal ? undefined : "_blank"} rel={isExternal ? "noreferrer" : "noopener noreferrer"} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 54)\n\n--- Source code under test ---\n<a href={href} target={isExternal ? undefined : \"_blank\"} rel={isExternal ? \"noreferrer\" : \"noopener noreferrer\"} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[55]: <a href={href} target={isExternal ? undefined : \"_blank\"}...", ({ task }) => {
      const code = `<a href={href} target={isExternal ? undefined : "_blank"} rel={isExternal ? "noreferrer noopener" : "noreferrer"} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 55)\n\n--- Source code under test ---\n<a href={href} target={isExternal ? undefined : \"_blank\"} rel={isExternal ? \"noreferrer noopener\" : \"noreferrer\"} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[57]: <a href={href} target={isExternal ? \"_blank\" : undefined}...", ({ task }) => {
      const code = `<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noreferrer" : undefined} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 57)\n\n--- Source code under test ---\n<a href={href} target={isExternal ? \"_blank\" : undefined} rel={isExternal ? \"noreferrer\" : undefined} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[58]: <a href={href} target={isSelf ? \"_self\" : \"_blank\"} rel={...", ({ task }) => {
      const code = `<a href={href} target={isSelf ? "_self" : "_blank"} rel={isSelf ? undefined : "noreferrer"} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 58)\n\n--- Source code under test ---\n<a href={href} target={isSelf ? \"_self\" : \"_blank\"} rel={isSelf ? undefined : \"noreferrer\"} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[59]: <a href={href} target={isSelf ? \"_self\" : \"\"} rel={isSelf...", ({ task }) => {
      const code = `<a href={href} target={isSelf ? "_self" : ""} rel={isSelf ? undefined : ""} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 59)\n\n--- Source code under test ---\n<a href={href} target={isSelf ? \"_self\" : \"\"} rel={isSelf ? undefined : \"\"} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[60]: <a href={href} target={isExternal ? \"_blank\" : undefined}...", ({ task }) => {
      const code = `<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: valid (index 60)\n\n--- Source code under test ---\n<a href={href} target={isExternal ? \"_blank\" : undefined} rel={isExternal ? \"noopener noreferrer\" : undefined} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <a target=\"_blank\" href=\"https://example.com/1\"></a>", ({ task }) => {
      const code = `<a target="_blank" href="https://example.com/1"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 0)\n\n--- Source code under test ---\n<a target=\"_blank\" href=\"https://example.com/1\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[1]: <a target=\"_blank\" rel=\"\" href=\"https://example.com/2\"></a>", ({ task }) => {
      const code = `<a target="_blank" rel="" href="https://example.com/2"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 1)\n\n--- Source code under test ---\n<a target=\"_blank\" rel=\"\" href=\"https://example.com/2\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[2]: <a target=\"_blank\" rel={0} href=\"https://example.com/3\"></a>", ({ task }) => {
      const code = `<a target="_blank" rel={0} href="https://example.com/3"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 2)\n\n--- Source code under test ---\n<a target=\"_blank\" rel={0} href=\"https://example.com/3\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[3]: <a target=\"_blank\" rel={1} href=\"https://example.com/3\"></a>", ({ task }) => {
      const code = `<a target="_blank" rel={1} href="https://example.com/3"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 3)\n\n--- Source code under test ---\n<a target=\"_blank\" rel={1} href=\"https://example.com/3\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[4]: <a target=\"_blank\" rel={false} href=\"https://example.com/...", ({ task }) => {
      const code = `<a target="_blank" rel={false} href="https://example.com/4"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 4)\n\n--- Source code under test ---\n<a target=\"_blank\" rel={false} href=\"https://example.com/4\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[5]: <a target=\"_blank\" rel={null} href=\"https://example.com/5...", ({ task }) => {
      const code = `<a target="_blank" rel={null} href="https://example.com/5"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 5)\n\n--- Source code under test ---\n<a target=\"_blank\" rel={null} href=\"https://example.com/5\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[6]: <a target=\"_blank\" rel=\"noopenernoreferrer\" href=\"https:/...", ({ task }) => {
      const code = `<a target="_blank" rel="noopenernoreferrer" href="https://example.com/6"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 6)\n\n--- Source code under test ---\n<a target=\"_blank\" rel=\"noopenernoreferrer\" href=\"https://example.com/6\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[7]: <a target=\"_blank\" rel=\"no referrer\" href=\"https://exampl...", ({ task }) => {
      const code = `<a target="_blank" rel="no referrer" href="https://example.com/7"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 7)\n\n--- Source code under test ---\n<a target=\"_blank\" rel=\"no referrer\" href=\"https://example.com/7\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[8]: <a target=\"_BLANK\" href=\"https://example.com/8\"></a>", ({ task }) => {
      const code = `<a target="_BLANK" href="https://example.com/8"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 8)\n\n--- Source code under test ---\n<a target=\"_BLANK\" href=\"https://example.com/8\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[52], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[9]: <a target=\"_blank\" href=\"//example.com/9\"></a>", ({ task }) => {
      const code = `<a target="_blank" href="//example.com/9"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 9)\n\n--- Source code under test ---\n<a target=\"_blank\" href=\"//example.com/9\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[53], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[10]: <a target=\"_blank\" href=\"//example.com/10\" rel={true}></a>", ({ task }) => {
      const code = `<a target="_blank" href="//example.com/10" rel={true}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 10)\n\n--- Source code under test ---\n<a target=\"_blank\" href=\"//example.com/10\" rel={true}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[54], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[11]: <a target=\"_blank\" href=\"//example.com/11\" rel={3}></a>", ({ task }) => {
      const code = `<a target="_blank" href="//example.com/11" rel={3}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 11)\n\n--- Source code under test ---\n<a target=\"_blank\" href=\"//example.com/11\" rel={3}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[55], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[12]: <a target=\"_blank\" href=\"//example.com/12\" rel={null}></a>", ({ task }) => {
      const code = `<a target="_blank" href="//example.com/12" rel={null}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 12)\n\n--- Source code under test ---\n<a target=\"_blank\" href=\"//example.com/12\" rel={null}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[56], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[13]: <a target=\"_blank\" href=\"//example.com/13\" rel={getRel()}...", ({ task }) => {
      const code = `<a target="_blank" href="//example.com/13" rel={getRel()}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 13)\n\n--- Source code under test ---\n<a target=\"_blank\" href=\"//example.com/13\" rel={getRel()}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[57], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[14]: <a target=\"_blank\" href=\"//example.com/14\" rel={\"noopener...", ({ task }) => {
      const code = `<a target="_blank" href="//example.com/14" rel={"noopenernoreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 14)\n\n--- Source code under test ---\n<a target=\"_blank\" href=\"//example.com/14\" rel={\"noopenernoreferrer\"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[58], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[15]: <a target={\"_blank\"} href={\"//example.com/15\"} rel={\"noop...", ({ task }) => {
      const code = `<a target={"_blank"} href={"//example.com/15"} rel={"noopenernoreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 15)\n\n--- Source code under test ---\n<a target={\"_blank\"} href={\"//example.com/15\"} rel={\"noopenernoreferrer\"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[59], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[16]: <a target={\"_blank\"} href={\"//example.com/16\"} rel={\"noop...", ({ task }) => {
      const code = `<a target={"_blank"} href={"//example.com/16"} rel={"noopenernoreferrernoreferrernoreferrernoreferrernoreferrer"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 16)\n\n--- Source code under test ---\n<a target={\"_blank\"} href={\"//example.com/16\"} rel={\"noopenernoreferrernoreferrernoreferrernoreferrernoreferrer\"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[60], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[17]: <a target=\"_blank\" href=\"//example.com/17\" rel></a>", ({ task }) => {
      const code = `<a target="_blank" href="//example.com/17" rel></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 17)\n\n--- Source code under test ---\n<a target=\"_blank\" href=\"//example.com/17\" rel></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[61], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[18]: <a target=\"_blank\" href={ dynamicLink }></a>", ({ task }) => {
      const code = `<a target="_blank" href={ dynamicLink }></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 18)\n\n--- Source code under test ---\n<a target=\"_blank\" href={ dynamicLink }></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[62], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[19]: <a target={'_blank'} href=\"//example.com/18\"></a>", ({ task }) => {
      const code = `<a target={'_blank'} href="//example.com/18"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 19)\n\n--- Source code under test ---\n<a target={'_blank'} href=\"//example.com/18\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[63], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[20]: <a target={\"_blank\"} href=\"//example.com/19\"></a>", ({ task }) => {
      const code = `<a target={"_blank"} href="//example.com/19"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 20)\n\n--- Source code under test ---\n<a target={\"_blank\"} href=\"//example.com/19\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[64], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[40]: <a href={href} target=\"_blank\" rel={isExternal ? \"undefin...", ({ task }) => {
      const code = `<a href={href} target="_blank" rel={isExternal ? "undefined" : "undefined"} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 40)\n\n--- Source code under test ---\n<a href={href} target=\"_blank\" rel={isExternal ? \"undefined\" : \"undefined\"} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[65], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[41]: <a href={href} target=\"_blank\" rel={isExternal ? \"noopene...", ({ task }) => {
      const code = `<a href={href} target="_blank" rel={isExternal ? "noopener" : undefined} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 41)\n\n--- Source code under test ---\n<a href={href} target=\"_blank\" rel={isExternal ? \"noopener\" : undefined} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[66], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[42]: <a href={href} target=\"_blank\" rel={isExternal ? \"undefin...", ({ task }) => {
      const code = `<a href={href} target="_blank" rel={isExternal ? "undefined" : "noopener"} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 42)\n\n--- Source code under test ---\n<a href={href} target=\"_blank\" rel={isExternal ? \"undefined\" : \"noopener\"} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[67], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[43]: <a href={href} target={isExternal ? \"_blank\" : undefined}...", ({ task }) => {
      const code = `<a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? undefined : "noopener noreferrer"} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 43)\n\n--- Source code under test ---\n<a href={href} target={isExternal ? \"_blank\" : undefined} rel={isExternal ? undefined : \"noopener noreferrer\"} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[68], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[44]: <a href={href} target=\"_blank\" rel={isExternal ? 3 : \"noo...", ({ task }) => {
      const code = `<a href={href} target="_blank" rel={isExternal ? 3 : "noopener noreferrer"} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 44)\n\n--- Source code under test ---\n<a href={href} target=\"_blank\" rel={isExternal ? 3 : \"noopener noreferrer\"} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[69], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

    it("invalid[45]: <a href={href} target=\"_blank\" rel={isExternal ? \"noopene...", ({ task }) => {
      const code = `<a href={href} target="_blank" rel={isExternal ? "noopener noreferrer" : "3"} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-no-target-blank\nType: invalid (index 45)\n\n--- Source code under test ---\n<a href={href} target=\"_blank\" rel={isExternal ? \"noopener noreferrer\" : \"3\"} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noTargetBlankWithoutNoreferrer): Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n\nRule message templates:\n  noTargetBlankWithoutNoreferrer: Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations\n  noTargetBlankWithoutNoopener: Using target=\"_blank\" without rel=\"noreferrer\" or rel=\"noopener\" (the former implies the latter and is preferred due to wider support) is a security risk: see https://mathiasbynens.github.io/rel-noopener/#recommendations";
      const matches = ruleErrors(results[70], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Using target=\"_blank\" without rel=\"noreferrer\" (which implies rel=\"noopener\") is a security risk in older browsers: see https://mathiasbynens.github.io/rel-noopener/#recommendations");
    });

  });
});
