import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Whitespace is forbidden between `/` and `>`; write `/>`",
  "Whitespace is required between `/` and `>`; write `/ >`",
  "Whitespace is forbidden between `<` and `/`; write `</`",
  "Whitespace is required between `<` and `/`; write `< /`",
  "A space is forbidden before closing bracket",
  "A space is required before closing bracket",
  "A newline is required before closing bracket",
  "A space is forbidden after opening bracket",
  "A space is required after opening bracket",
  "Whitespace is required before closing bracket",
];

describe("jsx-tag-spacing", () => {
  describe("valid", () => {
    it("valid[0]: <App />", async ({ task }) => {
      const code = `<App />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-tag-spacing\nType: valid (index 0)\n\n--- Source code under test ---\n<App />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  selfCloseSlashNoSpace: Whitespace is forbidden between `/` and `>`; write `/>`\n  selfCloseSlashNeedSpace: Whitespace is required between `/` and `>`; write `/ >`\n  closeSlashNoSpace: Whitespace is forbidden between `<` and `/`; write `</`\n  closeSlashNeedSpace: Whitespace is required between `<` and `/`; write `< /`\n  beforeSelfCloseNoSpace: A space is forbidden before closing bracket\n  beforeSelfCloseNeedSpace: A space is required before closing bracket\n  beforeSelfCloseNeedNewline: A newline is required before closing bracket\n  afterOpenNoSpace: A space is forbidden after opening bracket\n  afterOpenNeedSpace: A space is required after opening bracket\n  beforeCloseNoSpace: A space is forbidden before closing bracket\n  beforeCloseNeedSpace: Whitespace is required before closing bracket\n  beforeCloseNeedNewline: A newline is required before closing bracket";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "jsx-tag-spacing", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

});
