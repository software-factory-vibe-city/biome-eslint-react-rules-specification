# Biome React Linting Rules — GritQL Plugins

## 1. Overview

Build a Biome linter project where React linting rules from `eslint-plugin-react` are implemented as **GritQL plugins**. Each rule is a single `.grit` file in a `plugins/` directory. Biome runs these plugins via its native GritQL plugin system — no custom code, no JavaScript, just pattern files and configuration.

There are **71 rules** total. Each one:
- Lives at `plugins/<rule-name>.grit`
- Is registered in `biome.json`
- Produces diagnostics with **exact message strings** (the test harness checks with `.toBe()`)
- Targets JavaScript/JSX (the default GritQL language)

## 2. Documentation Sources

You may consult these references while building plugins. Use `curl` to fetch them:

| URL | What it covers |
|-----|---------------|
| `https://biomejs.dev/linter/plugins/` | Plugin setup, `register_diagnostic()` API, `biome.json` config |
| `https://biomejs.dev/reference/gritql/` | GritQL syntax in Biome: metavariables, where clauses, AST node matching |
| `https://docs.grit.io/language/syntax` | Full GritQL language reference: all operators, traversals, conditions |

These are your primary references. When a pattern isn't working, re-read the docs — don't guess at syntax.

## 3. Project Structure

```
package.json          # Already exists in the base project (includes @biomejs/biome)
biome.json            # You create this — see Section 4
plugins/              # You create this directory
  <rule-name>.grit    # One file per rule — add incrementally
```

The 71 rules to implement (each becomes `plugins/<name>.grit`):

`async-server-action`, `button-has-type`, `checked-requires-onchange-or-readonly`, `destructuring-assignment`, `display-name`, `forbid-component-props`, `forbid-foreign-prop-types`, `forbid-prop-types`, `forward-ref-uses-ref`, `hook-use-state`, `iframe-missing-sandbox`, `jsx-boolean-value`, `jsx-child-element-spacing`, `jsx-curly-brace-presence`, `jsx-curly-spacing`, `jsx-equals-spacing`, `jsx-handler-names`, `jsx-key`, `jsx-newline`, `jsx-no-bind`, `jsx-no-comment-textnodes`, `jsx-no-constructed-context-values`, `jsx-no-duplicate-props`, `jsx-no-leaked-render`, `jsx-no-literals`, `jsx-no-script-url`, `jsx-no-target-blank`, `jsx-no-useless-fragment`, `jsx-pascal-case`, `jsx-props-no-multi-spaces`, `jsx-props-no-spread-multi`, `jsx-props-no-spreading`, `jsx-space-before-closing`, `jsx-wrap-multilines`, `no-access-state-in-setstate`, `no-adjacent-inline-elements`, `no-array-index-key`, `no-arrow-function-lifecycle`, `no-children-prop`, `no-danger`, `no-danger-with-children`, `no-deprecated`, `no-did-mount-set-state`, `no-did-update-set-state`, `no-direct-mutation-state`, `no-find-dom-node`, `no-invalid-html-attribute`, `no-is-mounted`, `no-multi-comp`, `no-namespace`, `no-object-type-as-default-prop`, `no-redundant-should-component-update`, `no-render-return-value`, `no-set-state`, `no-this-in-sfc`, `no-typos`, `no-unescaped-entities`, `no-unknown-property`, `no-unstable-nested-components`, `no-will-update-set-state`, `prefer-es6-class`, `prefer-read-only-props`, `prefer-stateless-function`, `react-in-jsx-scope`, `require-optimization`, `require-render-return`, `self-closing-comp`, `state-in-constructor`, `static-property-placement`, `style-prop-object`, `void-dom-elements-no-children`

### `package.json`

The base project already includes `@biomejs/biome`. Do **not** overwrite `package.json`. If biome is not installed, add it:

```sh
npm install --save-dev @biomejs/biome@2.4.4
```

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

This is a concise primer. For full details, `curl` the documentation URLs in Section 2.

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

## 6. Reference Plugins

The `reference/` directory contains three working example plugins. Study these before writing your own:

### `reference/no-danger.grit` — Attribute Detection on DOM Elements

Demonstrates:
- Matching JSX attributes by name (`dangerouslySetInnerHTML`)
- Distinguishing DOM elements (lowercase) from components (uppercase) with regex
- Handling both self-closing and open/close element forms
- Producing a diagnostic with the attribute name in the message

### `reference/button-has-type.grit` — Missing/Invalid Attribute Detection

Demonstrates:
- Detecting a **missing** attribute with `not ... contains`
- Validating attribute values against an allowlist using `or`
- Multiple `or`-joined top-level patterns for different error cases
- Handling both self-closing and children-bearing forms

### `reference/self-closing-comp.grit` — Structural Pattern (Empty Elements)

Demonstrates:
- Matching elements with open/close tags but no children
- Using `as $element` to capture the full element for the diagnostic span
- A simple single-message rule

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

## 8. How Testing Works

The test harness validates your plugins by running `biome lint` on code snippets and checking the diagnostics.

### Test structure

Each rule has its own test file. Inside:
- `describe("<rule-name>")` — the suite name matches the plugin filename (without `.grit`)
- `describe("valid")` / `describe("invalid")` — two groups
- `it("valid[N]: ...")` / `it("invalid[N]: ...")` — individual cases

### What the harness does for each test

1. Writes the test code to a temporary `.jsx` file in your project directory
2. Runs `npx biome lint --reporter=json <file>`
3. Parses the JSON output for diagnostics
4. Filters diagnostics to only those matching the rule (by `category` containing the rule name, or by message text)
5. For **valid** tests: asserts `diagnostics.length === 0`
6. For **invalid** tests: asserts `diagnostics.length === N` and checks each `message` with `.toBe()`

### Rule matching

The harness filters diagnostics by checking if `diagnostic.category` contains the rule name. Biome plugin categories follow the format:

```
lint/plugin/<filename-without-extension>
```

So `plugins/no-danger.grit` produces diagnostics with category `lint/plugin/no-danger`. This is automatic — you don't configure it.

### Reading failure reports

When a test fails, the report includes:
- `name`: Full test path (e.g., `"no-danger > invalid > invalid[0]: <div dangerously..."`)
- `status`: `"failed"`
- `details`: The assertion error (expected vs. received)
- `source`: The source code that was tested
- `explanation`: Full context including expected diagnostic count and messages

Use the `explanation` to understand what your plugin should produce for that input.

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
