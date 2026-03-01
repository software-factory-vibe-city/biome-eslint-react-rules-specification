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
package.json
biome.json
plugins/
  async-server-action.grit
  button-has-type.grit
  checked-requires-onchange-or-readonly.grit
  destructuring-assignment.grit
  display-name.grit
  forbid-component-props.grit
  forbid-foreign-prop-types.grit
  forbid-prop-types.grit
  forward-ref-uses-ref.grit
  hook-use-state.grit
  iframe-missing-sandbox.grit
  jsx-boolean-value.grit
  jsx-child-element-spacing.grit
  jsx-curly-brace-presence.grit
  jsx-curly-spacing.grit
  jsx-equals-spacing.grit
  jsx-handler-names.grit
  jsx-key.grit
  jsx-newline.grit
  jsx-no-bind.grit
  jsx-no-comment-textnodes.grit
  jsx-no-constructed-context-values.grit
  jsx-no-duplicate-props.grit
  jsx-no-leaked-render.grit
  jsx-no-literals.grit
  jsx-no-script-url.grit
  jsx-no-target-blank.grit
  jsx-no-useless-fragment.grit
  jsx-pascal-case.grit
  jsx-props-no-multi-spaces.grit
  jsx-props-no-spread-multi.grit
  jsx-props-no-spreading.grit
  jsx-space-before-closing.grit
  jsx-wrap-multilines.grit
  no-access-state-in-setstate.grit
  no-adjacent-inline-elements.grit
  no-array-index-key.grit
  no-arrow-function-lifecycle.grit
  no-children-prop.grit
  no-danger.grit
  no-danger-with-children.grit
  no-deprecated.grit
  no-did-mount-set-state.grit
  no-did-update-set-state.grit
  no-direct-mutation-state.grit
  no-find-dom-node.grit
  no-invalid-html-attribute.grit
  no-is-mounted.grit
  no-multi-comp.grit
  no-namespace.grit
  no-object-type-as-default-prop.grit
  no-redundant-should-component-update.grit
  no-render-return-value.grit
  no-set-state.grit
  no-this-in-sfc.grit
  no-typos.grit
  no-unescaped-entities.grit
  no-unknown-property.grit
  no-unstable-nested-components.grit
  no-will-update-set-state.grit
  prefer-es6-class.grit
  prefer-read-only-props.grit
  prefer-stateless-function.grit
  react-in-jsx-scope.grit
  require-optimization.grit
  require-render-return.grit
  self-closing-comp.grit
  state-in-constructor.grit
  static-property-placement.grit
  style-prop-object.grit
  void-dom-elements-no-children.grit
```

### `package.json`

```json
{
  "name": "biome-react-rules",
  "private": true,
  "devDependencies": {
    "@biomejs/biome": "2.4.4"
  }
}
```

Run `npm install` after creating it.

## 4. `biome.json` Configuration

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.4/schema.json",
  "linter": {
    "rules": {
      "recommended": false
    }
  },
  "plugins": [
    "./plugins/async-server-action.grit",
    "./plugins/button-has-type.grit",
    "./plugins/checked-requires-onchange-or-readonly.grit",
    "./plugins/destructuring-assignment.grit",
    "./plugins/display-name.grit",
    "./plugins/forbid-component-props.grit",
    "./plugins/forbid-foreign-prop-types.grit",
    "./plugins/forbid-prop-types.grit",
    "./plugins/forward-ref-uses-ref.grit",
    "./plugins/hook-use-state.grit",
    "./plugins/iframe-missing-sandbox.grit",
    "./plugins/jsx-boolean-value.grit",
    "./plugins/jsx-child-element-spacing.grit",
    "./plugins/jsx-curly-brace-presence.grit",
    "./plugins/jsx-curly-spacing.grit",
    "./plugins/jsx-equals-spacing.grit",
    "./plugins/jsx-handler-names.grit",
    "./plugins/jsx-key.grit",
    "./plugins/jsx-newline.grit",
    "./plugins/jsx-no-bind.grit",
    "./plugins/jsx-no-comment-textnodes.grit",
    "./plugins/jsx-no-constructed-context-values.grit",
    "./plugins/jsx-no-duplicate-props.grit",
    "./plugins/jsx-no-leaked-render.grit",
    "./plugins/jsx-no-literals.grit",
    "./plugins/jsx-no-script-url.grit",
    "./plugins/jsx-no-target-blank.grit",
    "./plugins/jsx-no-useless-fragment.grit",
    "./plugins/jsx-pascal-case.grit",
    "./plugins/jsx-props-no-multi-spaces.grit",
    "./plugins/jsx-props-no-spread-multi.grit",
    "./plugins/jsx-props-no-spreading.grit",
    "./plugins/jsx-space-before-closing.grit",
    "./plugins/jsx-wrap-multilines.grit",
    "./plugins/no-access-state-in-setstate.grit",
    "./plugins/no-adjacent-inline-elements.grit",
    "./plugins/no-array-index-key.grit",
    "./plugins/no-arrow-function-lifecycle.grit",
    "./plugins/no-children-prop.grit",
    "./plugins/no-danger.grit",
    "./plugins/no-danger-with-children.grit",
    "./plugins/no-deprecated.grit",
    "./plugins/no-did-mount-set-state.grit",
    "./plugins/no-did-update-set-state.grit",
    "./plugins/no-direct-mutation-state.grit",
    "./plugins/no-find-dom-node.grit",
    "./plugins/no-invalid-html-attribute.grit",
    "./plugins/no-is-mounted.grit",
    "./plugins/no-multi-comp.grit",
    "./plugins/no-namespace.grit",
    "./plugins/no-object-type-as-default-prop.grit",
    "./plugins/no-redundant-should-component-update.grit",
    "./plugins/no-render-return-value.grit",
    "./plugins/no-set-state.grit",
    "./plugins/no-this-in-sfc.grit",
    "./plugins/no-typos.grit",
    "./plugins/no-unescaped-entities.grit",
    "./plugins/no-unknown-property.grit",
    "./plugins/no-unstable-nested-components.grit",
    "./plugins/no-will-update-set-state.grit",
    "./plugins/prefer-es6-class.grit",
    "./plugins/prefer-read-only-props.grit",
    "./plugins/prefer-stateless-function.grit",
    "./plugins/react-in-jsx-scope.grit",
    "./plugins/require-optimization.grit",
    "./plugins/require-render-return.grit",
    "./plugins/self-closing-comp.grit",
    "./plugins/state-in-constructor.grit",
    "./plugins/static-property-placement.grit",
    "./plugins/style-prop-object.grit",
    "./plugins/void-dom-elements-no-children.grit"
  ]
}
```

Key points:
- `"recommended": false` suppresses all built-in Biome lint rules so only your plugins fire
- Each plugin path is relative to the project root
- The `$schema` ensures config validation against Biome 2.4.4

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
