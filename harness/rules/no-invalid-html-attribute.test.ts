import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "An empty “{{attributeName}}” attribute is meaningless.",
  "“{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.",
  "The ”{{attributeName}}“ attribute cannot be a method.",
  "“{{reportingValue}}” must be directly followed by “{{missingValue}}”.",
  "“{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.",
  "“{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.",
  "The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}",
  "“{{attributeName}}” attribute only supports strings.",
  "”{{attributeName}}“ attribute values should be space delimited.",
  "\"remove {{attributeName}}\"",
  "\"remove empty attribute {{attributeName}}\"",
  "“remove invalid attribute {{reportingValue}}”",
  "remove whitespaces in “{{attributeName}}”",
  "remove non-string value in “{{attributeName}}”",
  "“alternatex” is never a valid “rel” attribute value.",
  "“alternatex alternate” is never a valid “rel” attribute value.",
  "“alternate alternatex” is never a valid “rel” attribute value.",
  "The ”rel“ attribute only has meaning on the tags: \"<link>\", \"<a>\", \"<area>\", \"<form>\"",
  "An empty “rel” attribute is meaningless.",
  "“1” is never a valid “rel” attribute value.",
  "The ”rel“ attribute cannot be a method.",
  "“rel” attribute only supports strings.",
  "“foobar” is never a valid “rel” attribute value.",
  "”rel“ attribute values should be space delimited.",
  "“batgo” is never a valid “rel” attribute value.",
  "“canonical” is not a valid “rel” attribute value for <a>.",
  "“dns-prefetch” is not a valid “rel” attribute value for <a>.",
  "“icon” is not a valid “rel” attribute value for <a>.",
  "“shortcut” must be directly followed by “icon”.",
  "“foo” is never a valid “rel” attribute value.",
  "“shortcut” can not be directly followed by “foo” without “icon”.",
  "“manifest” is not a valid “rel” attribute value for <a>.",
  "“modulepreload” is not a valid “rel” attribute value for <a>.",
  "“pingback” is not a valid “rel” attribute value for <a>.",
  "“preconnect” is not a valid “rel” attribute value for <a>.",
  "“prefetch” is not a valid “rel” attribute value for <a>.",
  "“preload” is not a valid “rel” attribute value for <a>.",
  "“prerender” is not a valid “rel” attribute value for <a>.",
  "“stylesheet” is not a valid “rel” attribute value for <a>.",
  "“canonical” is not a valid “rel” attribute value for <area>.",
  "“dns-prefetch” is not a valid “rel” attribute value for <area>.",
  "“icon” is not a valid “rel” attribute value for <area>.",
  "“manifest” is not a valid “rel” attribute value for <area>.",
  "“modulepreload” is not a valid “rel” attribute value for <area>.",
  "“pingback” is not a valid “rel” attribute value for <area>.",
  "“preconnect” is not a valid “rel” attribute value for <area>.",
  "“prefetch” is not a valid “rel” attribute value for <area>.",
  "“preload” is not a valid “rel” attribute value for <area>.",
  "“prerender” is not a valid “rel” attribute value for <area>.",
  "“stylesheet” is not a valid “rel” attribute value for <area>.",
  "“bookmark” is not a valid “rel” attribute value for <link>.",
  "“external” is not a valid “rel” attribute value for <link>.",
  "“nofollow” is not a valid “rel” attribute value for <link>.",
  "“noopener” is not a valid “rel” attribute value for <link>.",
  "“noreferrer” is not a valid “rel” attribute value for <link>.",
  "“opener” is not a valid “rel” attribute value for <link>.",
  "“tag” is not a valid “rel” attribute value for <link>.",
  "“alternate” is not a valid “rel” attribute value for <form>.",
  "“author” is not a valid “rel” attribute value for <form>.",
  "“bookmark” is not a valid “rel” attribute value for <form>.",
  "“canonical” is not a valid “rel” attribute value for <form>.",
  "“dns-prefetch” is not a valid “rel” attribute value for <form>.",
  "“icon” is not a valid “rel” attribute value for <form>.",
  "“manifest” is not a valid “rel” attribute value for <form>.",
  "“modulepreload” is not a valid “rel” attribute value for <form>.",
  "“pingback” is not a valid “rel” attribute value for <form>.",
  "“preconnect” is not a valid “rel” attribute value for <form>.",
  "“prefetch” is not a valid “rel” attribute value for <form>.",
  "“preload” is not a valid “rel” attribute value for <form>.",
  "“prerender” is not a valid “rel” attribute value for <form>.",
  "“stylesheet” is not a valid “rel” attribute value for <form>.",
  "“tag” is not a valid “rel” attribute value for <form>.",
];

describe("no-invalid-html-attribute", () => {
  describe("valid", () => {
    it("valid[0]: <a rel=\"alternate\"></a>", async ({ task }) => {
      const code = `<a rel="alternate"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 0)\n\n--- Source code under test ---\n<a rel=\"alternate\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: React.createElement(\"a\", { rel: \"alternate\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "alternate" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 1)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"alternate\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: React.createElement(\"a\", { rel: [\"alternate\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["alternate"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 2)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"alternate\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <a rel=\"author\"></a>", async ({ task }) => {
      const code = `<a rel="author"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 3)\n\n--- Source code under test ---\n<a rel=\"author\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: React.createElement(\"a\", { rel: \"author\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "author" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 4)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"author\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: React.createElement(\"a\", { rel: [\"author\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["author"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"author\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <a rel=\"bookmark\"></a>", async ({ task }) => {
      const code = `<a rel="bookmark"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 6)\n\n--- Source code under test ---\n<a rel=\"bookmark\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: React.createElement(\"a\", { rel: \"bookmark\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "bookmark" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"bookmark\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: React.createElement(\"a\", { rel: [\"bookmark\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["bookmark"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 8)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"bookmark\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <a rel=\"external\"></a>", async ({ task }) => {
      const code = `<a rel="external"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 9)\n\n--- Source code under test ---\n<a rel=\"external\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: React.createElement(\"a\", { rel: \"external\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "external" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 10)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"external\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: React.createElement(\"a\", { rel: [\"external\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["external"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 11)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"external\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <a rel=\"help\"></a>", async ({ task }) => {
      const code = `<a rel="help"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 12)\n\n--- Source code under test ---\n<a rel=\"help\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: React.createElement(\"a\", { rel: \"help\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "help" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"help\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: React.createElement(\"a\", { rel: [\"help\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["help"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 14)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"help\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <a rel=\"license\"></a>", async ({ task }) => {
      const code = `<a rel="license"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 15)\n\n--- Source code under test ---\n<a rel=\"license\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: React.createElement(\"a\", { rel: \"license\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "license" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 16)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"license\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: React.createElement(\"a\", { rel: [\"license\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["license"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 17)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"license\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <a rel=\"next\"></a>", async ({ task }) => {
      const code = `<a rel="next"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 18)\n\n--- Source code under test ---\n<a rel=\"next\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: React.createElement(\"a\", { rel: \"next\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "next" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 19)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"next\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: React.createElement(\"a\", { rel: [\"next\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["next"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 20)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"next\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <a rel=\"nofollow\"></a>", async ({ task }) => {
      const code = `<a rel="nofollow"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 21)\n\n--- Source code under test ---\n<a rel=\"nofollow\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: React.createElement(\"a\", { rel: \"nofollow\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "nofollow" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 22)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"nofollow\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: React.createElement(\"a\", { rel: [\"nofollow\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["nofollow"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 23)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"nofollow\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: <a rel=\"noopener\"></a>", async ({ task }) => {
      const code = `<a rel="noopener"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 24)\n\n--- Source code under test ---\n<a rel=\"noopener\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: React.createElement(\"a\", { rel: \"noopener\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "noopener" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 25)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"noopener\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: React.createElement(\"a\", { rel: [\"noopener\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["noopener"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 26)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"noopener\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: <a rel=\"noreferrer\"></a>", async ({ task }) => {
      const code = `<a rel="noreferrer"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 27)\n\n--- Source code under test ---\n<a rel=\"noreferrer\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: React.createElement(\"a\", { rel: \"noreferrer\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "noreferrer" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 28)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"noreferrer\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: React.createElement(\"a\", { rel: [\"noreferrer\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["noreferrer"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 29)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"noreferrer\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: <a rel=\"opener\"></a>", async ({ task }) => {
      const code = `<a rel="opener"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 30)\n\n--- Source code under test ---\n<a rel=\"opener\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: React.createElement(\"a\", { rel: \"opener\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "opener" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 31)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"opener\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: React.createElement(\"a\", { rel: [\"opener\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["opener"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 32)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"opener\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: <a rel=\"prev\"></a>", async ({ task }) => {
      const code = `<a rel="prev"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 33)\n\n--- Source code under test ---\n<a rel=\"prev\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: React.createElement(\"a\", { rel: \"prev\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "prev" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 34)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"prev\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: React.createElement(\"a\", { rel: [\"prev\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["prev"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 35)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"prev\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: <a rel=\"search\"></a>", async ({ task }) => {
      const code = `<a rel="search"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 36)\n\n--- Source code under test ---\n<a rel=\"search\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[37]: React.createElement(\"a\", { rel: \"search\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "search" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 37)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"search\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: React.createElement(\"a\", { rel: [\"search\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["search"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 38)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"search\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[39]: <a rel=\"tag\"></a>", async ({ task }) => {
      const code = `<a rel="tag"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 39)\n\n--- Source code under test ---\n<a rel=\"tag\"></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[40]: React.createElement(\"a\", { rel: \"tag\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "tag" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 40)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"tag\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[41]: React.createElement(\"a\", { rel: [\"tag\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["tag"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 41)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"tag\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[42]: <area rel=\"alternate\"></area>", async ({ task }) => {
      const code = `<area rel="alternate"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 42)\n\n--- Source code under test ---\n<area rel=\"alternate\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[43]: React.createElement(\"area\", { rel: \"alternate\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "alternate" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 43)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"alternate\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[44]: React.createElement(\"area\", { rel: [\"alternate\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["alternate"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 44)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"alternate\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[45]: <area rel=\"author\"></area>", async ({ task }) => {
      const code = `<area rel="author"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 45)\n\n--- Source code under test ---\n<area rel=\"author\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[46]: React.createElement(\"area\", { rel: \"author\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "author" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 46)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"author\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[47]: React.createElement(\"area\", { rel: [\"author\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["author"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 47)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"author\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[48]: <area rel=\"bookmark\"></area>", async ({ task }) => {
      const code = `<area rel="bookmark"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 48)\n\n--- Source code under test ---\n<area rel=\"bookmark\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[49]: React.createElement(\"area\", { rel: \"bookmark\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "bookmark" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 49)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"bookmark\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[50]: React.createElement(\"area\", { rel: [\"bookmark\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["bookmark"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 50)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"bookmark\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[51]: <area rel=\"external\"></area>", async ({ task }) => {
      const code = `<area rel="external"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 51)\n\n--- Source code under test ---\n<area rel=\"external\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[52]: React.createElement(\"area\", { rel: \"external\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "external" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 52)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"external\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[53]: React.createElement(\"area\", { rel: [\"external\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["external"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 53)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"external\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[54]: <area rel=\"help\"></area>", async ({ task }) => {
      const code = `<area rel="help"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 54)\n\n--- Source code under test ---\n<area rel=\"help\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[55]: React.createElement(\"area\", { rel: \"help\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "help" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 55)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"help\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[56]: React.createElement(\"area\", { rel: [\"help\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["help"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 56)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"help\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[57]: <area rel=\"license\"></area>", async ({ task }) => {
      const code = `<area rel="license"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 57)\n\n--- Source code under test ---\n<area rel=\"license\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[58]: React.createElement(\"area\", { rel: \"license\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "license" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 58)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"license\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[59]: React.createElement(\"area\", { rel: [\"license\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["license"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 59)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"license\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[60]: <area rel=\"next\"></area>", async ({ task }) => {
      const code = `<area rel="next"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 60)\n\n--- Source code under test ---\n<area rel=\"next\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[61]: React.createElement(\"area\", { rel: \"next\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "next" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 61)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"next\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[62]: React.createElement(\"area\", { rel: [\"next\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["next"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 62)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"next\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[63]: <area rel=\"nofollow\"></area>", async ({ task }) => {
      const code = `<area rel="nofollow"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 63)\n\n--- Source code under test ---\n<area rel=\"nofollow\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[64]: React.createElement(\"area\", { rel: \"nofollow\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "nofollow" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 64)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"nofollow\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[65]: React.createElement(\"area\", { rel: [\"nofollow\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["nofollow"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 65)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"nofollow\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[66]: <area rel=\"noopener\"></area>", async ({ task }) => {
      const code = `<area rel="noopener"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 66)\n\n--- Source code under test ---\n<area rel=\"noopener\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[67]: React.createElement(\"area\", { rel: \"noopener\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "noopener" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 67)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"noopener\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[68]: React.createElement(\"area\", { rel: [\"noopener\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["noopener"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 68)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"noopener\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[69]: <area rel=\"noreferrer\"></area>", async ({ task }) => {
      const code = `<area rel="noreferrer"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 69)\n\n--- Source code under test ---\n<area rel=\"noreferrer\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[70]: React.createElement(\"area\", { rel: \"noreferrer\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "noreferrer" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 70)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"noreferrer\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[71]: React.createElement(\"area\", { rel: [\"noreferrer\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["noreferrer"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 71)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"noreferrer\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[72]: <area rel=\"opener\"></area>", async ({ task }) => {
      const code = `<area rel="opener"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 72)\n\n--- Source code under test ---\n<area rel=\"opener\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[73]: React.createElement(\"area\", { rel: \"opener\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "opener" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 73)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"opener\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[74]: React.createElement(\"area\", { rel: [\"opener\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["opener"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 74)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"opener\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[75]: <area rel=\"prev\"></area>", async ({ task }) => {
      const code = `<area rel="prev"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 75)\n\n--- Source code under test ---\n<area rel=\"prev\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[76]: React.createElement(\"area\", { rel: \"prev\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "prev" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 76)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"prev\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[77]: React.createElement(\"area\", { rel: [\"prev\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["prev"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 77)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"prev\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[78]: <area rel=\"search\"></area>", async ({ task }) => {
      const code = `<area rel="search"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 78)\n\n--- Source code under test ---\n<area rel=\"search\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[79]: React.createElement(\"area\", { rel: \"search\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "search" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 79)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"search\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[80]: React.createElement(\"area\", { rel: [\"search\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["search"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 80)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"search\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[81]: <area rel=\"tag\"></area>", async ({ task }) => {
      const code = `<area rel="tag"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 81)\n\n--- Source code under test ---\n<area rel=\"tag\"></area>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[82]: React.createElement(\"area\", { rel: \"tag\" })", async ({ task }) => {
      const code = `React.createElement("area", { rel: "tag" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 82)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: \"tag\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[83]: React.createElement(\"area\", { rel: [\"tag\"] })", async ({ task }) => {
      const code = `React.createElement("area", { rel: ["tag"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 83)\n\n--- Source code under test ---\nReact.createElement(\"area\", { rel: [\"tag\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[84]: <link rel=\"alternate\"></link>", async ({ task }) => {
      const code = `<link rel="alternate"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 84)\n\n--- Source code under test ---\n<link rel=\"alternate\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[85]: React.createElement(\"link\", { rel: \"alternate\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "alternate" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 85)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"alternate\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[86]: React.createElement(\"link\", { rel: [\"alternate\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["alternate"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 86)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"alternate\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[87]: <link rel=\"author\"></link>", async ({ task }) => {
      const code = `<link rel="author"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 87)\n\n--- Source code under test ---\n<link rel=\"author\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[88]: React.createElement(\"link\", { rel: \"author\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "author" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 88)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"author\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[89]: React.createElement(\"link\", { rel: [\"author\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["author"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 89)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"author\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[90]: <link rel=\"canonical\"></link>", async ({ task }) => {
      const code = `<link rel="canonical"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 90)\n\n--- Source code under test ---\n<link rel=\"canonical\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[91]: React.createElement(\"link\", { rel: \"canonical\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "canonical" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 91)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"canonical\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[92]: React.createElement(\"link\", { rel: [\"canonical\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["canonical"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 92)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"canonical\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[93]: <link rel=\"dns-prefetch\"></link>", async ({ task }) => {
      const code = `<link rel="dns-prefetch"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 93)\n\n--- Source code under test ---\n<link rel=\"dns-prefetch\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[94]: React.createElement(\"link\", { rel: \"dns-prefetch\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "dns-prefetch" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 94)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"dns-prefetch\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[95]: React.createElement(\"link\", { rel: [\"dns-prefetch\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["dns-prefetch"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 95)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"dns-prefetch\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[96]: <link rel=\"help\"></link>", async ({ task }) => {
      const code = `<link rel="help"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 96)\n\n--- Source code under test ---\n<link rel=\"help\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[97]: React.createElement(\"link\", { rel: \"help\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "help" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 97)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"help\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[98]: React.createElement(\"link\", { rel: [\"help\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["help"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 98)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"help\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[99]: <link rel=\"icon\"></link>", async ({ task }) => {
      const code = `<link rel="icon"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 99)\n\n--- Source code under test ---\n<link rel=\"icon\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[100]: React.createElement(\"link\", { rel: \"icon\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "icon" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 100)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"icon\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[101]: React.createElement(\"link\", { rel: [\"icon\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["icon"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 101)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"icon\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[102]: <link rel=\"shortcut icon\"></link>", async ({ task }) => {
      const code = `<link rel="shortcut icon"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 102)\n\n--- Source code under test ---\n<link rel=\"shortcut icon\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[103]: React.createElement(\"link\", { rel: \"shortcut icon\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "shortcut icon" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 103)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"shortcut icon\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[104]: React.createElement(\"link\", { rel: [\"shortcut icon\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["shortcut icon"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 104)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"shortcut icon\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[105]: <link rel=\"license\"></link>", async ({ task }) => {
      const code = `<link rel="license"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 105)\n\n--- Source code under test ---\n<link rel=\"license\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[106]: React.createElement(\"link\", { rel: \"license\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "license" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 106)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"license\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[107]: React.createElement(\"link\", { rel: [\"license\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["license"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 107)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"license\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[108]: <link rel=\"manifest\"></link>", async ({ task }) => {
      const code = `<link rel="manifest"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 108)\n\n--- Source code under test ---\n<link rel=\"manifest\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[109]: React.createElement(\"link\", { rel: \"manifest\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "manifest" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 109)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"manifest\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[110]: React.createElement(\"link\", { rel: [\"manifest\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["manifest"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 110)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"manifest\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[111]: <link rel=\"modulepreload\"></link>", async ({ task }) => {
      const code = `<link rel="modulepreload"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 111)\n\n--- Source code under test ---\n<link rel=\"modulepreload\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[112]: React.createElement(\"link\", { rel: \"modulepreload\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "modulepreload" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 112)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"modulepreload\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[113]: React.createElement(\"link\", { rel: [\"modulepreload\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["modulepreload"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 113)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"modulepreload\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[114]: <link rel=\"next\"></link>", async ({ task }) => {
      const code = `<link rel="next"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 114)\n\n--- Source code under test ---\n<link rel=\"next\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[115]: React.createElement(\"link\", { rel: \"next\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "next" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 115)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"next\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[116]: React.createElement(\"link\", { rel: [\"next\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["next"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 116)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"next\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[117]: <link rel=\"pingback\"></link>", async ({ task }) => {
      const code = `<link rel="pingback"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 117)\n\n--- Source code under test ---\n<link rel=\"pingback\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[118]: React.createElement(\"link\", { rel: \"pingback\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "pingback" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 118)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"pingback\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[119]: React.createElement(\"link\", { rel: [\"pingback\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["pingback"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 119)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"pingback\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[120]: <link rel=\"preconnect\"></link>", async ({ task }) => {
      const code = `<link rel="preconnect"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 120)\n\n--- Source code under test ---\n<link rel=\"preconnect\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[121]: React.createElement(\"link\", { rel: \"preconnect\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "preconnect" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 121)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"preconnect\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[122]: React.createElement(\"link\", { rel: [\"preconnect\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["preconnect"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 122)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"preconnect\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[123]: <link rel=\"prefetch\"></link>", async ({ task }) => {
      const code = `<link rel="prefetch"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 123)\n\n--- Source code under test ---\n<link rel=\"prefetch\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[124]: React.createElement(\"link\", { rel: \"prefetch\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "prefetch" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 124)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"prefetch\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[125]: React.createElement(\"link\", { rel: [\"prefetch\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["prefetch"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 125)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"prefetch\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[126]: <link rel=\"preload\"></link>", async ({ task }) => {
      const code = `<link rel="preload"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 126)\n\n--- Source code under test ---\n<link rel=\"preload\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[127]: React.createElement(\"link\", { rel: \"preload\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "preload" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 127)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"preload\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[128]: React.createElement(\"link\", { rel: [\"preload\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["preload"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 128)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"preload\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[129]: <link rel=\"prerender\"></link>", async ({ task }) => {
      const code = `<link rel="prerender"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 129)\n\n--- Source code under test ---\n<link rel=\"prerender\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[130]: React.createElement(\"link\", { rel: \"prerender\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "prerender" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 130)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"prerender\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[131]: React.createElement(\"link\", { rel: [\"prerender\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["prerender"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 131)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"prerender\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[132]: <link rel=\"prev\"></link>", async ({ task }) => {
      const code = `<link rel="prev"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 132)\n\n--- Source code under test ---\n<link rel=\"prev\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[133]: React.createElement(\"link\", { rel: \"prev\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "prev" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 133)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"prev\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[134]: React.createElement(\"link\", { rel: [\"prev\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["prev"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 134)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"prev\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[135]: <link rel=\"search\"></link>", async ({ task }) => {
      const code = `<link rel="search"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 135)\n\n--- Source code under test ---\n<link rel=\"search\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[136]: React.createElement(\"link\", { rel: \"search\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "search" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 136)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"search\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[137]: React.createElement(\"link\", { rel: [\"search\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["search"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 137)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"search\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[138]: <link rel=\"stylesheet\"></link>", async ({ task }) => {
      const code = `<link rel="stylesheet"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 138)\n\n--- Source code under test ---\n<link rel=\"stylesheet\"></link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[139]: React.createElement(\"link\", { rel: \"stylesheet\" })", async ({ task }) => {
      const code = `React.createElement("link", { rel: "stylesheet" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 139)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: \"stylesheet\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[140]: React.createElement(\"link\", { rel: [\"stylesheet\"] })", async ({ task }) => {
      const code = `React.createElement("link", { rel: ["stylesheet"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 140)\n\n--- Source code under test ---\nReact.createElement(\"link\", { rel: [\"stylesheet\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[141]: <form rel=\"external\"></form>", async ({ task }) => {
      const code = `<form rel="external"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 141)\n\n--- Source code under test ---\n<form rel=\"external\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[142]: React.createElement(\"form\", { rel: \"external\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "external" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 142)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"external\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[143]: React.createElement(\"form\", { rel: [\"external\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["external"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 143)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"external\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[144]: <form rel=\"help\"></form>", async ({ task }) => {
      const code = `<form rel="help"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 144)\n\n--- Source code under test ---\n<form rel=\"help\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[145]: React.createElement(\"form\", { rel: \"help\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "help" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 145)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"help\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[146]: React.createElement(\"form\", { rel: [\"help\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["help"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 146)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"help\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[147]: <form rel=\"license\"></form>", async ({ task }) => {
      const code = `<form rel="license"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 147)\n\n--- Source code under test ---\n<form rel=\"license\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[148]: React.createElement(\"form\", { rel: \"license\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "license" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 148)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"license\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[149]: React.createElement(\"form\", { rel: [\"license\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["license"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 149)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"license\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[150]: <form rel=\"next\"></form>", async ({ task }) => {
      const code = `<form rel="next"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 150)\n\n--- Source code under test ---\n<form rel=\"next\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[151]: React.createElement(\"form\", { rel: \"next\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "next" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 151)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"next\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[152]: React.createElement(\"form\", { rel: [\"next\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["next"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 152)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"next\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[153]: <form rel=\"nofollow\"></form>", async ({ task }) => {
      const code = `<form rel="nofollow"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 153)\n\n--- Source code under test ---\n<form rel=\"nofollow\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[154]: React.createElement(\"form\", { rel: \"nofollow\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "nofollow" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 154)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"nofollow\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[155]: React.createElement(\"form\", { rel: [\"nofollow\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["nofollow"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 155)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"nofollow\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[156]: <form rel=\"noopener\"></form>", async ({ task }) => {
      const code = `<form rel="noopener"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 156)\n\n--- Source code under test ---\n<form rel=\"noopener\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[157]: React.createElement(\"form\", { rel: \"noopener\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "noopener" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 157)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"noopener\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[158]: React.createElement(\"form\", { rel: [\"noopener\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["noopener"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 158)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"noopener\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[159]: <form rel=\"noreferrer\"></form>", async ({ task }) => {
      const code = `<form rel="noreferrer"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 159)\n\n--- Source code under test ---\n<form rel=\"noreferrer\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[160]: React.createElement(\"form\", { rel: \"noreferrer\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "noreferrer" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 160)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"noreferrer\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[161]: React.createElement(\"form\", { rel: [\"noreferrer\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["noreferrer"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 161)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"noreferrer\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[162]: <form rel=\"opener\"></form>", async ({ task }) => {
      const code = `<form rel="opener"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 162)\n\n--- Source code under test ---\n<form rel=\"opener\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[163]: React.createElement(\"form\", { rel: \"opener\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "opener" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 163)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"opener\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[164]: React.createElement(\"form\", { rel: [\"opener\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["opener"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 164)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"opener\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[165]: <form rel=\"prev\"></form>", async ({ task }) => {
      const code = `<form rel="prev"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 165)\n\n--- Source code under test ---\n<form rel=\"prev\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[166]: React.createElement(\"form\", { rel: \"prev\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "prev" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 166)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"prev\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[167]: React.createElement(\"form\", { rel: [\"prev\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["prev"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 167)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"prev\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[168]: <form rel=\"search\"></form>", async ({ task }) => {
      const code = `<form rel="search"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 168)\n\n--- Source code under test ---\n<form rel=\"search\"></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[169]: React.createElement(\"form\", { rel: \"search\" })", async ({ task }) => {
      const code = `React.createElement("form", { rel: "search" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 169)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: \"search\" })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[170]: React.createElement(\"form\", { rel: [\"search\"] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: ["search"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 170)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [\"search\"] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[171]: <form rel={callFoo()}></form>", async ({ task }) => {
      const code = `<form rel={callFoo()}></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 171)\n\n--- Source code under test ---\n<form rel={callFoo()}></form>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[172]: React.createElement(\"form\", { rel: callFoo() })", async ({ task }) => {
      const code = `React.createElement("form", { rel: callFoo() })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 172)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: callFoo() })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[173]: React.createElement(\"form\", { rel: [callFoo()] })", async ({ task }) => {
      const code = `React.createElement("form", { rel: [callFoo()] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 173)\n\n--- Source code under test ---\nReact.createElement(\"form\", { rel: [callFoo()] })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[174]: <a rel={{a: \"noreferrer\"}[\"a\"]}></a>", async ({ task }) => {
      const code = `<a rel={{a: "noreferrer"}["a"]}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 174)\n\n--- Source code under test ---\n<a rel={{a: \"noreferrer\"}[\"a\"]}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[175]: <a rel={{a: \"noreferrer\"}[\"b\"]}></a>", async ({ task }) => {
      const code = `<a rel={{a: "noreferrer"}["b"]}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 175)\n\n--- Source code under test ---\n<a rel={{a: \"noreferrer\"}[\"b\"]}></a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[176]: <Foo rel></Foo>", async ({ task }) => {
      const code = `<Foo rel></Foo>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 176)\n\n--- Source code under test ---\n<Foo rel></Foo>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[177]: React.createElement(\"Foo\", { rel: true })", async ({ task }) => {
      const code = `React.createElement("Foo", { rel: true })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 177)\n\n--- Source code under test ---\nReact.createElement(\"Foo\", { rel: true })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[178]: React.createElement('a', { ...rest, href: to, })", async ({ task }) => {
      const code = `
        React.createElement('a', {
          ...rest,
          href: to,
        })
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 178)\n\n--- Source code under test ---\n\n        React.createElement('a', {\n          ...rest,\n          href: to,\n        })\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[179]: <link rel=\"apple-touch-icon\" sizes=\"60x60\" href=\"apple-to...", async ({ task }) => {
      const code = `<link rel="apple-touch-icon" sizes="60x60" href="apple-touch-icon-60x60.png" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 179)\n\n--- Source code under test ---\n<link rel=\"apple-touch-icon\" sizes=\"60x60\" href=\"apple-touch-icon-60x60.png\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[180]: <link rel=\"apple-touch-icon\" sizes=\"76x76\" href=\"apple-to...", async ({ task }) => {
      const code = `<link rel="apple-touch-icon" sizes="76x76" href="apple-touch-icon-76x76.png" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 180)\n\n--- Source code under test ---\n<link rel=\"apple-touch-icon\" sizes=\"76x76\" href=\"apple-touch-icon-76x76.png\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[181]: <link rel=\"apple-touch-icon\" sizes=\"120x120\" href=\"apple-...", async ({ task }) => {
      const code = `<link rel="apple-touch-icon" sizes="120x120" href="apple-touch-icon-120x120.png" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 181)\n\n--- Source code under test ---\n<link rel=\"apple-touch-icon\" sizes=\"120x120\" href=\"apple-touch-icon-120x120.png\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[182]: <link rel=\"apple-touch-icon\" sizes=\"152x152\" href=\"apple-...", async ({ task }) => {
      const code = `<link rel="apple-touch-icon" sizes="152x152" href="apple-touch-icon-152x152.png" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 182)\n\n--- Source code under test ---\n<link rel=\"apple-touch-icon\" sizes=\"152x152\" href=\"apple-touch-icon-152x152.png\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[183]: <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"apple-...", async ({ task }) => {
      const code = `<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon-180x180.png" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 183)\n\n--- Source code under test ---\n<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"apple-touch-icon-180x180.png\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[184]: <link rel=\"apple-touch-startup-image\" href=\"launch.png\" />", async ({ task }) => {
      const code = `<link rel="apple-touch-startup-image" href="launch.png" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 184)\n\n--- Source code under test ---\n<link rel=\"apple-touch-startup-image\" href=\"launch.png\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[185]: <link rel=\"apple-touch-startup-image\" href=\"iphone5.png\" ...", async ({ task }) => {
      const code = `<link rel="apple-touch-startup-image" href="iphone5.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 185)\n\n--- Source code under test ---\n<link rel=\"apple-touch-startup-image\" href=\"iphone5.png\" media=\"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[186]: <link rel=\"mask-icon\" href=\"/safari-pinned-tab.svg\" color...", async ({ task }) => {
      const code = `<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fff" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: valid (index 186)\n\n--- Source code under test ---\n<link rel=\"mask-icon\" href=\"/safari-pinned-tab.svg\" color=\"#fff\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: <a rel=\"alternatex\"></a>", async ({ task }) => {
      const code = `<a rel="alternatex"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 0)\n\n--- Source code under test ---\n<a rel=\"alternatex\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternatex” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternatex” is never a valid “rel” attribute value.");
    });

    it("invalid[1]: React.createElement(\"a\", { rel: \"alternatex\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "alternatex" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 1)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"alternatex\" })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternatex” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternatex” is never a valid “rel” attribute value.");
    });

    it("invalid[2]: React.createElement(\"a\", { rel: [\"alternatex\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["alternatex"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 2)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"alternatex\"] })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternatex” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternatex” is never a valid “rel” attribute value.");
    });

    it("invalid[3]: <a rel=\"alternatex alternate\"></a>", async ({ task }) => {
      const code = `<a rel="alternatex alternate"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 3)\n\n--- Source code under test ---\n<a rel=\"alternatex alternate\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternatex” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternatex” is never a valid “rel” attribute value.");
    });

    it("invalid[4]: React.createElement(\"a\", { rel: \"alternatex alternate\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "alternatex alternate" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 4)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"alternatex alternate\" })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternatex alternate” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternatex alternate” is never a valid “rel” attribute value.");
    });

    it("invalid[5]: React.createElement(\"a\", { rel: [\"alternatex alternate\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["alternatex alternate"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 5)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"alternatex alternate\"] })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternatex alternate” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternatex alternate” is never a valid “rel” attribute value.");
    });

    it("invalid[6]: <a rel=\"alternate alternatex\"></a>", async ({ task }) => {
      const code = `<a rel="alternate alternatex"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 6)\n\n--- Source code under test ---\n<a rel=\"alternate alternatex\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternatex” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternatex” is never a valid “rel” attribute value.");
    });

    it("invalid[7]: React.createElement(\"a\", { rel: \"alternate alternatex\" })", async ({ task }) => {
      const code = `React.createElement("a", { rel: "alternate alternatex" })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 7)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: \"alternate alternatex\" })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternate alternatex” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternate alternatex” is never a valid “rel” attribute value.");
    });

    it("invalid[8]: React.createElement(\"a\", { rel: [\"alternate alternatex\"] })", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["alternate alternatex"] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 8)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"alternate alternatex\"] })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “alternate alternatex” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternate alternatex” is never a valid “rel” attribute value.");
    });

    it("invalid[9]: <html rel></html>", async ({ task }) => {
      const code = `<html rel></html>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 9)\n\n--- Source code under test ---\n<html rel></html>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyMeaningfulFor): The ”rel“ attribute only has meaning on the tags: \"<link>\", \"<a>\", \"<area>\", \"<form>\"\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The ”rel“ attribute only has meaning on the tags: \"<link>\", \"<a>\", \"<area>\", \"<form>\"");
    });

    it("invalid[10]: React.createElement(\"html\", { rel: 1 })", async ({ task }) => {
      const code = `React.createElement("html", { rel: 1 })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 10)\n\n--- Source code under test ---\nReact.createElement(\"html\", { rel: 1 })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyMeaningfulFor): The ”rel“ attribute only has meaning on the tags: \"<link>\", \"<a>\", \"<area>\", \"<form>\"\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The ”rel“ attribute only has meaning on the tags: \"<link>\", \"<a>\", \"<area>\", \"<form>\"");
    });

    it("invalid[11]: <a rel></a>", async ({ task }) => {
      const code = `<a rel></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 11)\n\n--- Source code under test ---\n<a rel></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: emptyIsMeaningless): An empty “rel” attribute is meaningless.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An empty “rel” attribute is meaningless.");
    });

    it("invalid[12]: React.createElement(\"a\", { rel: 1 })", async ({ task }) => {
      const code = `React.createElement("a", { rel: 1 })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 12)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: 1 })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “1” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“1” is never a valid “rel” attribute value.");
    });

    it("invalid[13]: React.createElement(\"a\", { rel() { return 1; } })", async ({ task }) => {
      const code = `React.createElement("a", { rel() { return 1; } })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 13)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel() { return 1; } })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noMethod): The ”rel“ attribute cannot be a method.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The ”rel“ attribute cannot be a method.");
    });

    it("invalid[14]: <span rel></span>", async ({ task }) => {
      const code = `<span rel></span>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 14)\n\n--- Source code under test ---\n<span rel></span>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyMeaningfulFor): The ”rel“ attribute only has meaning on the tags: \"<link>\", \"<a>\", \"<area>\", \"<form>\"\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("The ”rel“ attribute only has meaning on the tags: \"<link>\", \"<a>\", \"<area>\", \"<form>\"");
    });

    it("invalid[15]: <a rel={null}></a>", async ({ task }) => {
      const code = `<a rel={null}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 15)\n\n--- Source code under test ---\n<a rel={null}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyStrings): “rel” attribute only supports strings.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“rel” attribute only supports strings.");
    });

    it("invalid[16]: <a rel={5}></a>", async ({ task }) => {
      const code = `<a rel={5}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 16)\n\n--- Source code under test ---\n<a rel={5}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyStrings): “rel” attribute only supports strings.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“rel” attribute only supports strings.");
    });

    it("invalid[17]: <a rel={true}></a>", async ({ task }) => {
      const code = `<a rel={true}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 17)\n\n--- Source code under test ---\n<a rel={true}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyStrings): “rel” attribute only supports strings.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“rel” attribute only supports strings.");
    });

    it("invalid[18]: <a rel={{}}></a>", async ({ task }) => {
      const code = `<a rel={{}}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 18)\n\n--- Source code under test ---\n<a rel={{}}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyStrings): “rel” attribute only supports strings.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“rel” attribute only supports strings.");
    });

    it("invalid[19]: <a rel={undefined}></a>", async ({ task }) => {
      const code = `<a rel={undefined}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 19)\n\n--- Source code under test ---\n<a rel={undefined}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyStrings): “rel” attribute only supports strings.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“rel” attribute only supports strings.");
    });

    it("invalid[20]: <a rel=\"noreferrer noopener foobar\"></a>", async ({ task }) => {
      const code = `<a rel="noreferrer noopener foobar"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 20)\n\n--- Source code under test ---\n<a rel=\"noreferrer noopener foobar\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “foobar” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“foobar” is never a valid “rel” attribute value.");
    });

    it("invalid[21]: <a rel=\"noreferrer noopener \"></a>", async ({ task }) => {
      const code = `<a rel="noreferrer noopener   "></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 21)\n\n--- Source code under test ---\n<a rel=\"noreferrer noopener   \"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[22]: <a rel=\"noreferrer noopener\"></a>", async ({ task }) => {
      const code = `<a rel="noreferrer        noopener"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 22)\n\n--- Source code under test ---\n<a rel=\"noreferrer        noopener\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[23]: <a rel=\"noreferrer noopener\"></a>", async ({ task }) => {
      const code = `<a rel="noreferrer  noopener"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 23)\n\n--- Source code under test ---\n<a rel=\"noreferrer  noopener\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[24]: <a rel={\"noreferrer noopener foobar\"}></a>", async ({ task }) => {
      const code = `<a rel={"noreferrer noopener foobar"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 24)\n\n--- Source code under test ---\n<a rel={\"noreferrer noopener foobar\"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “foobar” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“foobar” is never a valid “rel” attribute value.");
    });

    it("invalid[25]: React.createElement(\"a\", { rel: [\"noreferrer\", \"noopener\"...", async ({ task }) => {
      const code = `React.createElement("a", { rel: ["noreferrer", "noopener", "foobar" ] })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 25)\n\n--- Source code under test ---\nReact.createElement(\"a\", { rel: [\"noreferrer\", \"noopener\", \"foobar\" ] })\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “foobar” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“foobar” is never a valid “rel” attribute value.");
    });

    it("invalid[26]: <a rel={\"foobar noreferrer noopener\"}></a>", async ({ task }) => {
      const code = `<a rel={"foobar noreferrer noopener"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 26)\n\n--- Source code under test ---\n<a rel={\"foobar noreferrer noopener\"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “foobar” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“foobar” is never a valid “rel” attribute value.");
    });

    it("invalid[27]: <a rel={\"foobar batgo noopener\"}></a>", async ({ task }) => {
      const code = `<a rel={"foobar batgo       noopener"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 27)\n\n--- Source code under test ---\n<a rel={\"foobar batgo       noopener\"}></a>\n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: neverValid): “foobar” is never a valid “rel” attribute value.\n  [1] (messageId: neverValid): “batgo” is never a valid “rel” attribute value.\n  [2] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("“foobar” is never a valid “rel” attribute value.");
      expect(matches[1].message).toBe("“batgo” is never a valid “rel” attribute value.");
      expect(matches[2].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[28]: <a rel={\" noopener\"}></a>", async ({ task }) => {
      const code = `<a rel={"        noopener"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 28)\n\n--- Source code under test ---\n<a rel={\"        noopener\"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[29]: <a rel={\"noopener \"}></a>", async ({ task }) => {
      const code = `<a rel={"noopener        "}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 29)\n\n--- Source code under test ---\n<a rel={\"noopener        \"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[30]: <a rel={\" batgo noopener\"}></a>", async ({ task }) => {
      const code = `<a rel={" batgo noopener"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 30)\n\n--- Source code under test ---\n<a rel={\" batgo noopener\"}></a>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: neverValid): “batgo” is never a valid “rel” attribute value.\n  [1] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("“batgo” is never a valid “rel” attribute value.");
      expect(matches[1].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[31]: <a rel={\"batgo noopener\"}></a>", async ({ task }) => {
      const code = `<a rel={"batgo noopener"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 31)\n\n--- Source code under test ---\n<a rel={\"batgo noopener\"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: neverValid): “batgo” is never a valid “rel” attribute value.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“batgo” is never a valid “rel” attribute value.");
    });

    it("invalid[32]: <a rel={\" noopener\"}></a>", async ({ task }) => {
      const code = `<a rel={" noopener"}></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 32)\n\n--- Source code under test ---\n<a rel={\" noopener\"}></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[33]: <a rel=\"canonical\"></a>", async ({ task }) => {
      const code = `<a rel="canonical"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 33)\n\n--- Source code under test ---\n<a rel=\"canonical\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “canonical” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“canonical” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[34]: <a rel=\"dns-prefetch\"></a>", async ({ task }) => {
      const code = `<a rel="dns-prefetch"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 34)\n\n--- Source code under test ---\n<a rel=\"dns-prefetch\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “dns-prefetch” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“dns-prefetch” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[35]: <a rel=\"icon\"></a>", async ({ task }) => {
      const code = `<a rel="icon"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 35)\n\n--- Source code under test ---\n<a rel=\"icon\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “icon” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“icon” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[36]: <link rel=\"shortcut\"></link>", async ({ task }) => {
      const code = `<link rel="shortcut"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 36)\n\n--- Source code under test ---\n<link rel=\"shortcut\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notAlone): “shortcut” must be directly followed by “icon”.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“shortcut” must be directly followed by “icon”.");
    });

    it("invalid[37]: <link rel=\"shortcut foo\"></link>", async ({ task }) => {
      const code = `<link rel="shortcut foo"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 37)\n\n--- Source code under test ---\n<link rel=\"shortcut foo\"></link>\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: neverValid): “foo” is never a valid “rel” attribute value.\n  [1] (messageId: notPaired): “shortcut” can not be directly followed by “foo” without “icon”.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("“foo” is never a valid “rel” attribute value.");
      expect(matches[1].message).toBe("“shortcut” can not be directly followed by “foo” without “icon”.");
    });

    it("invalid[38]: <link rel=\"shortcut icon\"></link>", async ({ task }) => {
      const code = `<link rel="shortcut  icon"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 38)\n\n--- Source code under test ---\n<link rel=\"shortcut  icon\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[39]: <link rel=\"shortcut foo\"></link>", async ({ task }) => {
      const code = `<link rel="shortcut  foo"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 39)\n\n--- Source code under test ---\n<link rel=\"shortcut  foo\"></link>\n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: neverValid): “foo” is never a valid “rel” attribute value.\n  [1] (messageId: notAlone): “shortcut” must be directly followed by “icon”.\n  [2] (messageId: spaceDelimited): ”rel“ attribute values should be space delimited.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("“foo” is never a valid “rel” attribute value.");
      expect(matches[1].message).toBe("“shortcut” must be directly followed by “icon”.");
      expect(matches[2].message).toBe("”rel“ attribute values should be space delimited.");
    });

    it("invalid[40]: <a rel=\"manifest\"></a>", async ({ task }) => {
      const code = `<a rel="manifest"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 40)\n\n--- Source code under test ---\n<a rel=\"manifest\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “manifest” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“manifest” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[41]: <a rel=\"modulepreload\"></a>", async ({ task }) => {
      const code = `<a rel="modulepreload"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 41)\n\n--- Source code under test ---\n<a rel=\"modulepreload\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “modulepreload” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“modulepreload” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[42]: <a rel=\"pingback\"></a>", async ({ task }) => {
      const code = `<a rel="pingback"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 42)\n\n--- Source code under test ---\n<a rel=\"pingback\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “pingback” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“pingback” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[43]: <a rel=\"preconnect\"></a>", async ({ task }) => {
      const code = `<a rel="preconnect"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 43)\n\n--- Source code under test ---\n<a rel=\"preconnect\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “preconnect” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“preconnect” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[44]: <a rel=\"prefetch\"></a>", async ({ task }) => {
      const code = `<a rel="prefetch"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 44)\n\n--- Source code under test ---\n<a rel=\"prefetch\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “prefetch” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“prefetch” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[45]: <a rel=\"preload\"></a>", async ({ task }) => {
      const code = `<a rel="preload"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 45)\n\n--- Source code under test ---\n<a rel=\"preload\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “preload” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“preload” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[46]: <a rel=\"prerender\"></a>", async ({ task }) => {
      const code = `<a rel="prerender"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 46)\n\n--- Source code under test ---\n<a rel=\"prerender\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “prerender” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“prerender” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[47]: <a rel=\"stylesheet\"></a>", async ({ task }) => {
      const code = `<a rel="stylesheet"></a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 47)\n\n--- Source code under test ---\n<a rel=\"stylesheet\"></a>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “stylesheet” is not a valid “rel” attribute value for <a>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“stylesheet” is not a valid “rel” attribute value for <a>.");
    });

    it("invalid[48]: <area rel=\"canonical\"></area>", async ({ task }) => {
      const code = `<area rel="canonical"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 48)\n\n--- Source code under test ---\n<area rel=\"canonical\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “canonical” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“canonical” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[49]: <area rel=\"dns-prefetch\"></area>", async ({ task }) => {
      const code = `<area rel="dns-prefetch"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 49)\n\n--- Source code under test ---\n<area rel=\"dns-prefetch\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “dns-prefetch” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“dns-prefetch” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[50]: <area rel=\"icon\"></area>", async ({ task }) => {
      const code = `<area rel="icon"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 50)\n\n--- Source code under test ---\n<area rel=\"icon\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “icon” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“icon” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[51]: <area rel=\"manifest\"></area>", async ({ task }) => {
      const code = `<area rel="manifest"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 51)\n\n--- Source code under test ---\n<area rel=\"manifest\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “manifest” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“manifest” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[52]: <area rel=\"modulepreload\"></area>", async ({ task }) => {
      const code = `<area rel="modulepreload"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 52)\n\n--- Source code under test ---\n<area rel=\"modulepreload\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “modulepreload” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“modulepreload” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[53]: <area rel=\"pingback\"></area>", async ({ task }) => {
      const code = `<area rel="pingback"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 53)\n\n--- Source code under test ---\n<area rel=\"pingback\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “pingback” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“pingback” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[54]: <area rel=\"preconnect\"></area>", async ({ task }) => {
      const code = `<area rel="preconnect"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 54)\n\n--- Source code under test ---\n<area rel=\"preconnect\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “preconnect” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“preconnect” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[55]: <area rel=\"prefetch\"></area>", async ({ task }) => {
      const code = `<area rel="prefetch"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 55)\n\n--- Source code under test ---\n<area rel=\"prefetch\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “prefetch” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“prefetch” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[56]: <area rel=\"preload\"></area>", async ({ task }) => {
      const code = `<area rel="preload"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 56)\n\n--- Source code under test ---\n<area rel=\"preload\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “preload” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“preload” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[57]: <area rel=\"prerender\"></area>", async ({ task }) => {
      const code = `<area rel="prerender"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 57)\n\n--- Source code under test ---\n<area rel=\"prerender\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “prerender” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“prerender” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[58]: <area rel=\"stylesheet\"></area>", async ({ task }) => {
      const code = `<area rel="stylesheet"></area>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 58)\n\n--- Source code under test ---\n<area rel=\"stylesheet\"></area>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “stylesheet” is not a valid “rel” attribute value for <area>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“stylesheet” is not a valid “rel” attribute value for <area>.");
    });

    it("invalid[59]: <link rel=\"bookmark\"></link>", async ({ task }) => {
      const code = `<link rel="bookmark"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 59)\n\n--- Source code under test ---\n<link rel=\"bookmark\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “bookmark” is not a valid “rel” attribute value for <link>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“bookmark” is not a valid “rel” attribute value for <link>.");
    });

    it("invalid[60]: <link rel=\"external\"></link>", async ({ task }) => {
      const code = `<link rel="external"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 60)\n\n--- Source code under test ---\n<link rel=\"external\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “external” is not a valid “rel” attribute value for <link>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“external” is not a valid “rel” attribute value for <link>.");
    });

    it("invalid[61]: <link rel=\"nofollow\"></link>", async ({ task }) => {
      const code = `<link rel="nofollow"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 61)\n\n--- Source code under test ---\n<link rel=\"nofollow\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “nofollow” is not a valid “rel” attribute value for <link>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“nofollow” is not a valid “rel” attribute value for <link>.");
    });

    it("invalid[62]: <link rel=\"noopener\"></link>", async ({ task }) => {
      const code = `<link rel="noopener"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 62)\n\n--- Source code under test ---\n<link rel=\"noopener\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “noopener” is not a valid “rel” attribute value for <link>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“noopener” is not a valid “rel” attribute value for <link>.");
    });

    it("invalid[63]: <link rel=\"noreferrer\"></link>", async ({ task }) => {
      const code = `<link rel="noreferrer"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 63)\n\n--- Source code under test ---\n<link rel=\"noreferrer\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “noreferrer” is not a valid “rel” attribute value for <link>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“noreferrer” is not a valid “rel” attribute value for <link>.");
    });

    it("invalid[64]: <link rel=\"opener\"></link>", async ({ task }) => {
      const code = `<link rel="opener"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 64)\n\n--- Source code under test ---\n<link rel=\"opener\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “opener” is not a valid “rel” attribute value for <link>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“opener” is not a valid “rel” attribute value for <link>.");
    });

    it("invalid[65]: <link rel=\"tag\"></link>", async ({ task }) => {
      const code = `<link rel="tag"></link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 65)\n\n--- Source code under test ---\n<link rel=\"tag\"></link>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “tag” is not a valid “rel” attribute value for <link>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“tag” is not a valid “rel” attribute value for <link>.");
    });

    it("invalid[66]: <form rel=\"alternate\"></form>", async ({ task }) => {
      const code = `<form rel="alternate"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 66)\n\n--- Source code under test ---\n<form rel=\"alternate\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “alternate” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“alternate” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[67]: <form rel=\"author\"></form>", async ({ task }) => {
      const code = `<form rel="author"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 67)\n\n--- Source code under test ---\n<form rel=\"author\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “author” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“author” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[68]: <form rel=\"bookmark\"></form>", async ({ task }) => {
      const code = `<form rel="bookmark"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 68)\n\n--- Source code under test ---\n<form rel=\"bookmark\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “bookmark” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“bookmark” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[69]: <form rel=\"canonical\"></form>", async ({ task }) => {
      const code = `<form rel="canonical"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 69)\n\n--- Source code under test ---\n<form rel=\"canonical\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “canonical” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“canonical” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[70]: <form rel=\"dns-prefetch\"></form>", async ({ task }) => {
      const code = `<form rel="dns-prefetch"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 70)\n\n--- Source code under test ---\n<form rel=\"dns-prefetch\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “dns-prefetch” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“dns-prefetch” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[71]: <form rel=\"icon\"></form>", async ({ task }) => {
      const code = `<form rel="icon"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 71)\n\n--- Source code under test ---\n<form rel=\"icon\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “icon” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“icon” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[72]: <form rel=\"manifest\"></form>", async ({ task }) => {
      const code = `<form rel="manifest"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 72)\n\n--- Source code under test ---\n<form rel=\"manifest\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “manifest” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“manifest” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[73]: <form rel=\"modulepreload\"></form>", async ({ task }) => {
      const code = `<form rel="modulepreload"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 73)\n\n--- Source code under test ---\n<form rel=\"modulepreload\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “modulepreload” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“modulepreload” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[74]: <form rel=\"pingback\"></form>", async ({ task }) => {
      const code = `<form rel="pingback"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 74)\n\n--- Source code under test ---\n<form rel=\"pingback\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “pingback” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“pingback” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[75]: <form rel=\"preconnect\"></form>", async ({ task }) => {
      const code = `<form rel="preconnect"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 75)\n\n--- Source code under test ---\n<form rel=\"preconnect\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “preconnect” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“preconnect” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[76]: <form rel=\"prefetch\"></form>", async ({ task }) => {
      const code = `<form rel="prefetch"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 76)\n\n--- Source code under test ---\n<form rel=\"prefetch\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “prefetch” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“prefetch” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[77]: <form rel=\"preload\"></form>", async ({ task }) => {
      const code = `<form rel="preload"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 77)\n\n--- Source code under test ---\n<form rel=\"preload\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “preload” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“preload” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[78]: <form rel=\"prerender\"></form>", async ({ task }) => {
      const code = `<form rel="prerender"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 78)\n\n--- Source code under test ---\n<form rel=\"prerender\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “prerender” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“prerender” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[79]: <form rel=\"stylesheet\"></form>", async ({ task }) => {
      const code = `<form rel="stylesheet"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 79)\n\n--- Source code under test ---\n<form rel=\"stylesheet\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “stylesheet” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“stylesheet” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[80]: <form rel=\"tag\"></form>", async ({ task }) => {
      const code = `<form rel="tag"></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 80)\n\n--- Source code under test ---\n<form rel=\"tag\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: notValidFor): “tag” is not a valid “rel” attribute value for <form>.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("“tag” is not a valid “rel” attribute value for <form>.");
    });

    it("invalid[81]: <form rel=\"\"></form>", async ({ task }) => {
      const code = `<form rel=""></form>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-invalid-html-attribute\nType: invalid (index 81)\n\n--- Source code under test ---\n<form rel=\"\"></form>\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noEmpty): An empty “rel” attribute is meaningless.\n\nRule message templates:\n  emptyIsMeaningless: An empty “{{attributeName}}” attribute is meaningless.\n  neverValid: “{{reportingValue}}” is never a valid “{{attributeName}}” attribute value.\n  noEmpty: An empty “{{attributeName}}” attribute is meaningless.\n  noMethod: The ”{{attributeName}}“ attribute cannot be a method.\n  notAlone: “{{reportingValue}}” must be directly followed by “{{missingValue}}”.\n  notPaired: “{{reportingValue}}” can not be directly followed by “{{secondValue}}” without “{{missingValue}}”.\n  notValidFor: “{{reportingValue}}” is not a valid “{{attributeName}}” attribute value for <{{elementName}}>.\n  onlyMeaningfulFor: The ”{{attributeName}}“ attribute only has meaning on the tags: {{tagNames}}\n  onlyStrings: “{{attributeName}}” attribute only supports strings.\n  spaceDelimited: ”{{attributeName}}“ attribute values should be space delimited.\n  suggestRemoveDefault: \"remove {{attributeName}}\"\n  suggestRemoveEmpty: \"remove empty attribute {{attributeName}}\"\n  suggestRemoveInvalid: “remove invalid attribute {{reportingValue}}”\n  suggestRemoveWhitespaces: remove whitespaces in “{{attributeName}}”\n  suggestRemoveNonString: remove non-string value in “{{attributeName}}”";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-invalid-html-attribute", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("An empty “rel” attribute is meaningless.");
    });

  });
});
