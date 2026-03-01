# Biome React Linting Rules — GritQL Plugins

## 1. Overview

Build a Biome linter project where React linting rules from `eslint-plugin-react` are implemented as **GritQL plugins**. Each rule is a single `.grit` file in a `plugins/` directory. Biome runs these plugins via its native GritQL plugin system — no custom code, no JavaScript, just pattern files and configuration.

There are **71 rules** total. Each one:
- Lives at `plugins/<rule-name>.grit`
- Is registered in `biome.json`
- Produces diagnostics with **exact message strings** (the test harness checks with `.toBe()`)
- Targets JavaScript/JSX (the default GritQL language)

## 2. Documentation Sources

The `reference/` directory contains local documentation covering GritQL and Biome's plugin system. Read these before writing your own plugins:

| File | What it covers |
|------|---------------|
| `reference/plugins.md` | Biome plugin setup, `register_diagnostic()` API, target languages |
| `reference/example.grit` | Working example plugin — reports `Object.assign()` usage, demonstrates basic pattern matching and `register_diagnostic()` |
| `reference/config.md` | `.grit/grit.yaml` configuration, markdown pattern spec, ignoring patterns |
| `reference/patterns.md` | Custom pattern definitions, predicate definitions, `.grit` file conventions |
| `reference/react.md` | Matching and transforming React/JSX components |
| `reference/testing.md` | Testing GritQL patterns with `grit patterns test`, YAML test samples |
| `reference/imports.md` | `ensure_import_from` and import management patterns |
| `reference/duplicating.md` | Using `text()` to duplicate/preserve code during rewrites |
| `reference/sharing.md` | Publishing and importing patterns across repositories |

These are your primary references. When a pattern isn't working, re-read the docs — don't guess at syntax.

**Additional external references** (if you need more detail beyond the local docs):
- `https://docs.grit.io/language/syntax` — Full GritQL language reference
- `https://biomejs.dev/linter/plugins/` — Biome plugin docs (upstream)
- `https://biomejs.dev/reference/gritql/` — Biome GritQL reference (upstream)

## 3. Project Structure

```
package.json          # You create this — see below
tsconfig.json         # You create this — see below
vitest.config.ts      # You create this — see below
biome.json            # You create this — see Section 4
plugins/              # You create this directory
  <rule-name>.grit    # One file per rule — add incrementally
src/
  test-helpers.ts     # Lint utility for tests — see Section 8
  rules/
    <rule-name>.test.ts  # One test file per rule
```

The 71 rules to implement (each becomes `plugins/<name>.grit`):

`async-server-action`, `button-has-type`, `checked-requires-onchange-or-readonly`, `destructuring-assignment`, `display-name`, `forbid-component-props`, `forbid-foreign-prop-types`, `forbid-prop-types`, `forward-ref-uses-ref`, `hook-use-state`, `iframe-missing-sandbox`, `jsx-boolean-value`, `jsx-child-element-spacing`, `jsx-curly-brace-presence`, `jsx-curly-spacing`, `jsx-equals-spacing`, `jsx-handler-names`, `jsx-key`, `jsx-newline`, `jsx-no-bind`, `jsx-no-comment-textnodes`, `jsx-no-constructed-context-values`, `jsx-no-duplicate-props`, `jsx-no-leaked-render`, `jsx-no-literals`, `jsx-no-script-url`, `jsx-no-target-blank`, `jsx-no-useless-fragment`, `jsx-pascal-case`, `jsx-props-no-multi-spaces`, `jsx-props-no-spread-multi`, `jsx-props-no-spreading`, `jsx-space-before-closing`, `jsx-wrap-multilines`, `no-access-state-in-setstate`, `no-adjacent-inline-elements`, `no-array-index-key`, `no-arrow-function-lifecycle`, `no-children-prop`, `no-danger`, `no-danger-with-children`, `no-deprecated`, `no-did-mount-set-state`, `no-did-update-set-state`, `no-direct-mutation-state`, `no-find-dom-node`, `no-invalid-html-attribute`, `no-is-mounted`, `no-multi-comp`, `no-namespace`, `no-object-type-as-default-prop`, `no-redundant-should-component-update`, `no-render-return-value`, `no-set-state`, `no-this-in-sfc`, `no-typos`, `no-unescaped-entities`, `no-unknown-property`, `no-unstable-nested-components`, `no-will-update-set-state`, `prefer-es6-class`, `prefer-read-only-props`, `prefer-stateless-function`, `react-in-jsx-scope`, `require-optimization`, `require-render-return`, `self-closing-comp`, `state-in-constructor`, `static-property-placement`, `style-prop-object`, `void-dom-elements-no-children`

### `package.json`

Create this file at the project root:

```json
{
  "name": "biome-react-rules",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "biome lint"
  },
  "devDependencies": {
    "@biomejs/biome": "2.4.4",
    "vitest": "^3.1.4"
  }
}
```

Then run `npm install` to install dependencies.

### `tsconfig.json`

Create this file at the project root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

This is for type checking and IDE support only — vitest handles compilation.

### `vitest.config.ts`

Create this file at the project root to scope test discovery to `src/`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
```

This ensures `npx vitest run` only picks up the agent's tests in `src/rules/` and doesn't scan other directories.

## 4. `biome.json` Configuration

**Create `biome.json` before doing anything else.** This is critical — without it, biome uses all built-in recommended rules, which will fire on your code and produce confusing diagnostics unrelated to your plugins.

Start with an empty `plugins` array:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.4/schema.json",
  "linter": {
    "rules": {
      "recommended": false
    }
  },
  "plugins": []
}
```

### Adding plugins incrementally

**Biome validates every file in the `plugins` array on startup.** If any `.grit` file is missing or contains invalid GritQL, `biome lint` fails entirely — no diagnostics, just a plugin loading error. This means you cannot list all 71 plugins upfront.

The workflow for each rule:
1. Write the `.grit` file in `plugins/`
2. Add its path to the `plugins` array in `biome.json`
3. Test with `biome lint` — if the plugin has a syntax error, biome will tell you
4. Move on to the next rule

Example after implementing three rules:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.4/schema.json",
  "linter": {
    "rules": {
      "recommended": false
    }
  },
  "plugins": [
    "./plugins/no-danger.grit",
    "./plugins/no-find-dom-node.grit",
    "./plugins/no-is-mounted.grit"
  ]
}
```

Key points:
- `"recommended": false` must be at the path `linter.rules.recommended` (not `linter.recommended` — that is an invalid key and biome will error)
- This suppresses all built-in Biome lint rules so only your plugins fire
- Each plugin path is relative to the project root

## 5. GritQL Quick Reference

This is a concise primer. For full details, consult the reference documentation in the `reference/` directory (see Section 2).

### Language Declaration

Every `.grit` file targeting JSX should start with:

```gritql
language js
```

This is the default but makes intent explicit.

### Backtick Pattern Matching

GritQL matches code structurally (not textually) using backtick-delimited patterns:

```gritql
`console.log($msg)`
```

This matches `console.log("hello")`, `console.log(x)`, etc. regardless of whitespace or formatting.

### Metavariables

| Syntax | Meaning |
|--------|---------|
| `$name` | Captures a single AST node and binds it to `name` |
| `$_` | Matches any single node without binding |
| `$...name` | Matches zero or more nodes (spread/rest) |

### Where Clauses and Match Operator

Add conditions after a pattern with `where { ... }`. Use `<:` (match operator) to test values:

```gritql
`<$tag $...attrs />` where {
    $tag <: `button`
}
```

### Logical Operators

```gritql
// Match any of several patterns
$x <: or { `"button"`, `"submit"`, `"reset"` }

// All conditions must hold
$x <: and { r"^[a-z]"(), not `div` }

// Negation
not $attrs <: contains `type=$_`
```

### Traversal: `contains` and `within`

```gritql
// Search downward — does the node contain this pattern anywhere inside?
$attrs <: contains `dangerouslySetInnerHTML=$_`

// Search upward — is this node inside a matching ancestor?
$node <: within `<form>$...children</form>`
```

### `bubble` — Nested Scope Matching

Use `bubble` to match patterns inside nested structures (e.g., callback arguments, arrow functions). Without `bubble`, metavariables from the outer scope bleed in:

```gritql
`[$...elements]` where {
    $elements <: contains bubble `<$component />` where {
        not $component <: contains `key=$_`,
        register_diagnostic(
            span = $component,
            message = "Missing \"key\" prop for element in array"
        )
    }
}
```

### `register_diagnostic()`

This is how plugins report lint errors:

```gritql
register_diagnostic(
    span = $node,       // Required: AST node to highlight
    message = "..."     // Required: exact diagnostic message string
)
```

Optional: `severity = "warn"` (default is `"error"`). Use `severity = "warn"` for stylistic rules, `"error"` for correctness rules.

### JSX Patterns

```gritql
// Self-closing element
`<$tag $...attrs />`

// Element with children
`<$tag $...attrs>$...children</$tag>`

// Specific attribute with value
`<$tag $...attrs />` where { $attrs <: contains `href=$value` }

// Attribute without value (boolean attribute)
`<$tag $...attrs />` where { $attrs <: contains `disabled` }
```

### Regex Matching

```gritql
// Match lowercase element names (DOM elements)
$tag <: r"^[a-z]"()

// Match uppercase (React components)
$tag <: r"^[A-Z]"()
```

### Multiple Pattern Alternatives with `or`

When a rule needs to match several distinct code shapes, join top-level patterns with `or`:

```gritql
`pattern_one(...)` where { ... }

or

`pattern_two(...)` where { ... }
```

### Performance

- Use **specific top-level patterns** — don't start with a bare `$_` or wildcard
- Use `bubble` when descending into callbacks or nested structures
- Prefer matching the smallest relevant AST node

## 6. Reference Documentation

The `reference/` directory contains documentation covering GritQL and Biome's plugin system. Read these before writing your own plugins:

### `reference/plugins.md` — Biome Plugin System

The most important reference. Covers:
- How to write a GritQL plugin for Biome's linter
- The `register_diagnostic()` function (span, message, severity)
- Target language declaration (`language css;` etc.)
- How to enable plugins in `biome.json`

### `reference/example.grit` — Working Example Plugin

A complete, minimal GritQL plugin that reports on `Object.assign()` usage, suggesting object spread instead. Demonstrates:
- Backtick pattern matching with metavariable capture (`$fn`, `$args`)
- Using `<:` to match a specific function name
- Calling `register_diagnostic()` with `span` and `message`

This is the simplest possible plugin — study it as a starting template.

### `reference/patterns.md` — Custom Pattern Definitions

Covers:
- The `pattern` keyword and named pattern syntax
- Predicate definitions
- `.grit` file conventions and auto-loading from `.grit/patterns/`

### `reference/react.md` — React/JSX Patterns

Covers:
- Matching JSX elements (self-closing and with children)
- Handling `or` for both element forms
- Metavariable capture on tag names, props, and children

### `reference/config.md` — Grit Configuration

Covers:
- `.grit/grit.yaml` structure and pattern metadata fields
- Markdown pattern file spec
- Pattern suppression and `.gritignore`

### Other references

- `reference/testing.md` — Testing patterns with `grit patterns test` and YAML samples
- `reference/imports.md` — `ensure_import_from` pattern for managing imports
- `reference/duplicating.md` — `text()` function for preserving original code
- `reference/sharing.md` — Publishing and importing patterns across repos

## 7. Diagnostic Messages

**Messages must be exact strings.** The test harness compares with `.toBe()` — not `.toContain()`, not a regex. A single character difference causes a test failure.

### How to learn the required messages

Each test failure report includes an `explanation` field with:
1. The **source code** being tested
2. Whether it should be **valid** (0 diagnostics) or **invalid** (N diagnostics)
3. The **exact messages** expected, with template variables already resolved
4. The **message template** showing the pattern (e.g., `"Dangerous property '{{name}}' found"`)

Example explanation from a test failure:
```
Rule: no-danger
Type: invalid (index 0)

--- Source code under test ---
<div dangerouslySetInnerHTML={{ __html: "" }}></div>;

This code is INVALID — the rule should produce 1 diagnostic(s):
  [0] (messageId: dangerousProp): Dangerous property 'dangerouslySetInnerHTML' found

Rule message templates:
  dangerousProp: Dangerous property '{{name}}' found
```

From this you know:
- The diagnostic message must be exactly `Dangerous property 'dangerouslySetInnerHTML' found`
- The template is `Dangerous property '{{name}}' found` where `{{name}}` is the attribute name

### Template variables

Some messages contain `{{placeholders}}` in their templates. In the test assertions, these appear **already resolved** to concrete values. Your GritQL plugin must produce the resolved string. For example:

- Template: `"{{value}}" is an invalid value for button type attribute`
- Test expects: `"foo" is an invalid value for button type attribute`

Since GritQL message strings are static, you may need separate patterns for each concrete value that appears in the test cases, or use the matched node's text if GritQL supports interpolation in the `message` parameter.

## 8. Testing

Every rule must have a test file. Write tests as you go — after creating a `.grit` file and adding it to `biome.json`, write its test and run it before moving on.

### Test helper — `src/test-helpers.ts`

Create this file first. It provides a `lint()` function that runs biome on a code snippet and returns parsed diagnostics.

```ts
import { execFile } from "node:child_process";
import { mkdirSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const PROJECT_DIR = resolve(import.meta.dirname, "..");

export interface Diagnostic {
  message: string;
  severity: string;
  category?: string;
}

/**
 * Lint a code snippet by writing it to a temp file, running biome, and
 * parsing the JSON output. Returns all diagnostics for the file.
 */
export async function lint(code: string, filename = "test.jsx"): Promise<Diagnostic[]> {
  const fixturesDir = join(PROJECT_DIR, "__test_fixtures__");
  mkdirSync(fixturesDir, { recursive: true });

  const filePath = join(fixturesDir, filename);
  writeFileSync(filePath, code, "utf-8");

  try {
    const biome = join(PROJECT_DIR, "node_modules", ".bin", "biome");
    const { stdout } = await execFileAsync(
      biome,
      ["lint", "--reporter=json", filePath],
      { cwd: PROJECT_DIR, timeout: 30_000 }
    ).catch((error: any) => {
      if (error.stdout) return { stdout: error.stdout as string };
      throw error;
    });

    return parseDiagnostics(stdout);
  } finally {
    try { unlinkSync(filePath); } catch {}
  }
}

/**
 * Filter diagnostics to only those from a specific plugin rule.
 * Biome plugin categories look like "lint/plugin/<rule-name>".
 */
export function ruleDiagnostics(diagnostics: Diagnostic[], ruleName: string): Diagnostic[] {
  return diagnostics.filter((d) => d.category?.includes(ruleName));
}

function parseDiagnostics(stdout: string): Diagnostic[] {
  if (!stdout.trim()) return [];
  let parsed: any;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return [];
  }

  const items = Array.isArray(parsed) ? parsed : parsed.diagnostics ?? [];
  return items.map((item: any) => ({
    message: typeof item.description === "string"
      ? item.description
      : Array.isArray(item.description)
        ? item.description.map((p: any) => typeof p === "string" ? p : p.content ?? "").join("")
        : String(item.description ?? ""),
    severity: item.severity ?? "error",
    category: item.category,
  }));
}
```

### Test file structure

Each rule gets a test file at `src/rules/<rule-name>.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { lint, ruleDiagnostics } from "../test-helpers.ts";

describe("no-danger", () => {
  describe("valid", () => {
    it("allows dangerouslySetInnerHTML on components", async () => {
      const diags = await lint(`<App dangerouslySetInnerHTML={{ __html: "" }} />;`);
      expect(ruleDiagnostics(diags, "no-danger")).toHaveLength(0);
    });
  });

  describe("invalid", () => {
    it("reports dangerouslySetInnerHTML on DOM elements", async () => {
      const diags = await lint(`<div dangerouslySetInnerHTML={{ __html: "" }}></div>;`);
      const errors = ruleDiagnostics(diags, "no-danger");
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe("Dangerous property 'dangerouslySetInnerHTML' found");
    });
  });
});
```

### Key patterns

- **`lint(code)`** writes the snippet to a temp `.jsx` file, runs `biome lint --reporter=json`, and returns all diagnostics
- **`ruleDiagnostics(diags, "rule-name")`** filters to diagnostics from your plugin (category `lint/plugin/rule-name`)
- **Valid cases**: assert `toHaveLength(0)` — the rule should not fire
- **Invalid cases**: assert the expected count AND check each message with `.toBe()`
- Use `lint(code, "test.tsx")` for test cases that require TypeScript syntax

### Running tests

```sh
npx vitest run
```

Or run a single rule's tests:

```sh
npx vitest run src/rules/no-danger.test.ts
```

### Workflow

For each rule:
1. Write `plugins/<rule-name>.grit`
2. Add `"./plugins/<rule-name>.grit"` to the `plugins` array in `biome.json`
3. Write `src/rules/<rule-name>.test.ts` with valid and invalid cases
4. Run `npx vitest run src/rules/<rule-name>.test.ts`
5. Fix the plugin until tests pass, then move on

## 9. Constraints and Tips

### Hard constraints

- **GritQL plugins are diagnostic-only** — no autofix, no code transformation
- **No options/settings** — every rule uses its default behavior (no configurability)
- **Biome version: 2.4.4** — do not use features from other versions
- **Plugin category format**: `lint/plugin/<filename-without-extension>` (automatic from filename)
- **One rule per file** — each `.grit` file implements exactly one rule

### Practical tips

- **Start with the simplest rules.** Rules like `no-danger`, `no-find-dom-node`, `no-is-mounted`, `no-children-prop` match straightforward patterns. Get these working first.
- **Handle both JSX forms.** Most JSX rules need to match both `<Tag ... />` (self-closing) and `<Tag ...>children</Tag>` (with children). Use `or` to combine both forms.
- **DOM vs. Component distinction.** Many rules only apply to DOM elements (lowercase tags like `div`, `button`, `a`) and not custom components (uppercase like `MyButton`). Use `$tag <: r"^[a-z]"()` to filter.
- **Test iteratively.** After writing a plugin, check the test report. Fix failures one at a time. The `explanation` metadata tells you exactly what's expected.
- **Watch for false positives on valid cases.** If your pattern is too broad, it will fire on code that should be valid. The valid test cases are specifically designed to catch over-matching.
- **Whitespace in JSX children.** Biome's parser may treat whitespace-only children differently than empty children. Test both cases if the rule involves "empty" elements.

### Suggested implementation order

Work through rules in order of pattern complexity. Earlier rules build intuition for later ones.

**Start here — simple attribute/element detection:**
`no-danger`, `no-find-dom-node`, `no-is-mounted`, `no-render-return-value`, `no-children-prop`, `jsx-no-duplicate-props`, `jsx-no-script-url`, `self-closing-comp`, `void-dom-elements-no-children`, `no-danger-with-children`, `iframe-missing-sandbox`

**Then — attribute validation and element-specific logic:**
`button-has-type`, `jsx-no-target-blank`, `jsx-boolean-value`, `jsx-curly-brace-presence`, `jsx-key`, `jsx-props-no-spreading`, `jsx-no-comment-textnodes`, `no-unescaped-entities`, `style-prop-object`, `checked-requires-onchange-or-readonly`, `no-namespace`, `jsx-handler-names`, `no-adjacent-inline-elements`

**Then — structural and semantic patterns:**
`no-direct-mutation-state`, `no-access-state-in-setstate`, `no-set-state`, `no-did-mount-set-state`, `no-did-update-set-state`, `no-will-update-set-state`, `no-this-in-sfc`, `no-array-index-key`, `jsx-no-bind`, `jsx-no-constructed-context-values`, `no-unstable-nested-components`, `jsx-no-leaked-render`, `react-in-jsx-scope`, `jsx-pascal-case`, `no-multi-comp`, `no-deprecated`, `no-arrow-function-lifecycle`, `jsx-no-useless-fragment`

**Finally — harder patterns requiring creative use of GritQL:**
`display-name`, `require-render-return`, `prefer-es6-class`, `no-redundant-should-component-update`, `require-optimization`, `state-in-constructor`, `static-property-placement`, `destructuring-assignment`, `hook-use-state`, `forward-ref-uses-ref`, `no-typos`, `forbid-prop-types`, `forbid-component-props`, `forbid-foreign-prop-types`, `no-object-type-as-default-prop`, `prefer-read-only-props`, `no-invalid-html-attribute`, `no-unknown-property`, `async-server-action`, `prefer-stateless-function`, `jsx-no-literals`, `jsx-curly-spacing`, `jsx-equals-spacing`, `jsx-space-before-closing`, `jsx-wrap-multilines`, `jsx-newline`, `jsx-props-no-multi-spaces`, `jsx-props-no-spread-multi`, `jsx-child-element-spacing`
