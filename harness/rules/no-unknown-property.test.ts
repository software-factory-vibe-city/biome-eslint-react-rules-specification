import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}",
  "Unknown property '{{name}}' found, use '{{standardName}}' instead",
  "Unknown property '{{name}}' found",
  "React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead",
  "Unknown property 'allowTransparency' found",
  "Unknown property 'hasOwnProperty' found",
  "Unknown property 'abc' found",
  "Unknown property 'aria-fake' found",
  "Unknown property 'someProp' found",
  "Unknown property 'class' found, use 'className' instead",
  "Unknown property 'for' found, use 'htmlFor' instead",
  "Unknown property 'accept-charset' found, use 'acceptCharset' instead",
  "Unknown property 'http-equiv' found, use 'httpEquiv' instead",
  "Unknown property 'accesskey' found, use 'accessKey' instead",
  "Unknown property 'onclick' found, use 'onClick' instead",
  "Unknown property 'onmousedown' found, use 'onMouseDown' instead",
  "Unknown property 'onMousedown' found, use 'onMouseDown' instead",
  "Unknown property 'xlink:href' found, use 'xlinkHref' instead",
  "Unknown property 'clip-path' found, use 'clipPath' instead",
  "Unknown property 'crossorigin' found, use 'crossOrigin' instead",
  "Unknown property 'nomodule' found, use 'noModule' instead",
  "Invalid property 'crossOrigin' found on tag 'div', but it is only allowed on: script, img, video, audio, link, image",
  "Invalid property 'as' found on tag 'div', but it is only allowed on: link",
  "Invalid property 'onAbort' found on tag 'div', but it is only allowed on: audio, video",
  "Invalid property 'onDurationChange' found on tag 'div', but it is only allowed on: audio, video",
  "Invalid property 'onEmptied' found on tag 'div', but it is only allowed on: audio, video",
  "Invalid property 'onEnded' found on tag 'div', but it is only allowed on: audio, video",
  "Invalid property 'onResize' found on tag 'div', but it is only allowed on: audio, video",
  "Invalid property 'onError' found on tag 'div', but it is only allowed on: audio, video, img, link, source, script, picture, iframe",
  "Invalid property 'onLoad' found on tag 'div', but it is only allowed on: script, img, link, picture, iframe, object, source, body",
  "Invalid property 'fill' found on tag 'div', but it is only allowed on: altGlyph, circle, ellipse, g, line, marker, mask, path, polygon, polyline, rect, svg, symbol, text, textPath, tref, tspan, use, animate, animateColor, animateMotion, animateTransform, set",
  "Invalid property 'controls' found on tag 'div', but it is only allowed on: audio, video",
  "Invalid property 'loop' found on tag 'div', but it is only allowed on: audio, video",
  "Invalid property 'muted' found on tag 'div', but it is only allowed on: audio, video",
  "Invalid property 'playsInline' found on tag 'div', but it is only allowed on: video",
  "Invalid property 'allowFullScreen' found on tag 'div', but it is only allowed on: iframe, video",
  "Invalid property 'download' found on tag 'div', but it is only allowed on: a, area",
  "Invalid property 'imageSrcSet' found on tag 'div', but it is only allowed on: link",
  "Invalid property 'imageSizes' found on tag 'div', but it is only allowed on: link",
  "Unknown property 'data-xml-anything' found",
  "React does not recognize data-* props with uppercase characters on a DOM element. Found 'data-testID', use 'data-testid' instead",
  "React does not recognize data-* props with uppercase characters on a DOM element. Found 'data-under_sCoRe', use 'data-under_score' instead",
  "Unknown property 'dataNotAnDataAttribute' found",
  "Invalid property 'abbr' found on tag 'div', but it is only allowed on: th, td",
  "Invalid property 'webkitDirectory' found on tag 'div', but it is only allowed on: input",
  "Invalid property 'webkitdirectory' found on tag 'div', but it is only allowed on: input",
  "Unknown property 'data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c' found",
];

describe("no-unknown-property", () => {
  describe("valid", () => {
    it("valid[0]: <App class=\"bar\" />;", async ({ task }) => {
      const code = `<App class="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 0)\n\n--- Source code under test ---\n<App class=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: <App for=\"bar\" />;", async ({ task }) => {
      const code = `<App for="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 1)\n\n--- Source code under test ---\n<App for=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: <App someProp=\"bar\" />;", async ({ task }) => {
      const code = `<App someProp="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 2)\n\n--- Source code under test ---\n<App someProp=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <Foo.bar for=\"bar\" />;", async ({ task }) => {
      const code = `<Foo.bar for="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 3)\n\n--- Source code under test ---\n<Foo.bar for=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: <App accept-charset=\"bar\" />;", async ({ task }) => {
      const code = `<App accept-charset="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 4)\n\n--- Source code under test ---\n<App accept-charset=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: <App http-equiv=\"bar\" />;", async ({ task }) => {
      const code = `<App http-equiv="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 5)\n\n--- Source code under test ---\n<App http-equiv=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: <App xlink:href=\"bar\" />;", async ({ task }) => {
      const code = `<App xlink:href="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 6)\n\n--- Source code under test ---\n<App xlink:href=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: jsx namespace\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: <App clip-path=\"bar\" />;", async ({ task }) => {
      const code = `<App clip-path="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 7)\n\n--- Source code under test ---\n<App clip-path=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: <div className=\"bar\"></div>;", async ({ task }) => {
      const code = `<div className="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 9)\n\n--- Source code under test ---\n<div className=\"bar\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: <div onMouseDown={this._onMouseDown}></div>;", async ({ task }) => {
      const code = `<div onMouseDown={this._onMouseDown}></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 10)\n\n--- Source code under test ---\n<div onMouseDown={this._onMouseDown}></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: <div onScrollEnd={this._onScrollEnd}></div>;", async ({ task }) => {
      const code = `<div onScrollEnd={this._onScrollEnd}></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 11)\n\n--- Source code under test ---\n<div onScrollEnd={this._onScrollEnd}></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: <div onScrollEndCapture={this._onScrollEndCapture}></div>;", async ({ task }) => {
      const code = `<div onScrollEndCapture={this._onScrollEndCapture}></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 12)\n\n--- Source code under test ---\n<div onScrollEndCapture={this._onScrollEndCapture}></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: <a href=\"someLink\" download=\"foo\">Read more</a>", async ({ task }) => {
      const code = `<a href="someLink" download="foo">Read more</a>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 13)\n\n--- Source code under test ---\n<a href=\"someLink\" download=\"foo\">Read more</a>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: <area download=\"foo\" />", async ({ task }) => {
      const code = `<area download="foo" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 14)\n\n--- Source code under test ---\n<area download=\"foo\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: <img src=\"cat_keyboard.jpeg\" alt=\"A cat sleeping on a key...", async ({ task }) => {
      const code = `<img src="cat_keyboard.jpeg" alt="A cat sleeping on a keyboard" align="top" fetchPriority="high" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 15)\n\n--- Source code under test ---\n<img src=\"cat_keyboard.jpeg\" alt=\"A cat sleeping on a keyboard\" align=\"top\" fetchPriority=\"high\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: <input type=\"password\" required />", async ({ task }) => {
      const code = `<input type="password" required />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 16)\n\n--- Source code under test ---\n<input type=\"password\" required />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: <input ref={this.input} type=\"radio\" />", async ({ task }) => {
      const code = `<input ref={this.input} type="radio" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 17)\n\n--- Source code under test ---\n<input ref={this.input} type=\"radio\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: <input type=\"file\" webkitdirectory=\"\" />", async ({ task }) => {
      const code = `<input type="file" webkitdirectory="" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 18)\n\n--- Source code under test ---\n<input type=\"file\" webkitdirectory=\"\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: <input type=\"file\" webkitDirectory=\"\" />", async ({ task }) => {
      const code = `<input type="file" webkitDirectory="" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 19)\n\n--- Source code under test ---\n<input type=\"file\" webkitDirectory=\"\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <div inert children=\"anything\" />", async ({ task }) => {
      const code = `<div inert children="anything" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 20)\n\n--- Source code under test ---\n<div inert children=\"anything\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <iframe scrolling=\"?\" onLoad={a} onError={b} align=\"top\" />", async ({ task }) => {
      const code = `<iframe scrolling="?" onLoad={a} onError={b} align="top" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 21)\n\n--- Source code under test ---\n<iframe scrolling=\"?\" onLoad={a} onError={b} align=\"top\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: <input key=\"bar\" type=\"radio\" />", async ({ task }) => {
      const code = `<input key="bar" type="radio" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 22)\n\n--- Source code under test ---\n<input key=\"bar\" type=\"radio\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: <button disabled>You cannot click me</button>;", async ({ task }) => {
      const code = `<button disabled>You cannot click me</button>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 23)\n\n--- Source code under test ---\n<button disabled>You cannot click me</button>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: <svg key=\"lock\" viewBox=\"box\" fill={10} d=\"d\" stroke={1} ...", async ({ task }) => {
      const code = `<svg key="lock" viewBox="box" fill={10} d="d" stroke={1} strokeWidth={2} strokeLinecap={3} strokeLinejoin={4} transform="something" clipRule="else" x1={5} x2="6" y1="7" y2="8"></svg>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 24)\n\n--- Source code under test ---\n<svg key=\"lock\" viewBox=\"box\" fill={10} d=\"d\" stroke={1} strokeWidth={2} strokeLinecap={3} strokeLinejoin={4} transform=\"something\" clipRule=\"else\" x1={5} x2=\"6\" y1=\"7\" y2=\"8\"></svg>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: <g fill=\"#7B82A0\" fillRule=\"evenodd\"></g>", async ({ task }) => {
      const code = `<g fill="#7B82A0" fillRule="evenodd"></g>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 25)\n\n--- Source code under test ---\n<g fill=\"#7B82A0\" fillRule=\"evenodd\"></g>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: <mask fill=\"#7B82A0\"></mask>", async ({ task }) => {
      const code = `<mask fill="#7B82A0"></mask>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 26)\n\n--- Source code under test ---\n<mask fill=\"#7B82A0\"></mask>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: <symbol fill=\"#7B82A0\"></symbol>", async ({ task }) => {
      const code = `<symbol fill="#7B82A0"></symbol>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 27)\n\n--- Source code under test ---\n<symbol fill=\"#7B82A0\"></symbol>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: <meta property=\"og:type\" content=\"website\" />", async ({ task }) => {
      const code = `<meta property="og:type" content="website" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 28)\n\n--- Source code under test ---\n<meta property=\"og:type\" content=\"website\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: <input type=\"checkbox\" checked={checked} disabled={disabl...", async ({ task }) => {
      const code = `<input type="checkbox" checked={checked} disabled={disabled} id={id} onChange={onChange} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 29)\n\n--- Source code under test ---\n<input type=\"checkbox\" checked={checked} disabled={disabled} id={id} onChange={onChange} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: <video playsInline />", async ({ task }) => {
      const code = `<video playsInline />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 30)\n\n--- Source code under test ---\n<video playsInline />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: <img onError={foo} onLoad={bar} />", async ({ task }) => {
      const code = `<img onError={foo} onLoad={bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 31)\n\n--- Source code under test ---\n<img onError={foo} onLoad={bar} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: <picture inert={false} onError={foo} onLoad={bar} />", async ({ task }) => {
      const code = `<picture inert={false} onError={foo} onLoad={bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 32)\n\n--- Source code under test ---\n<picture inert={false} onError={foo} onLoad={bar} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: <iframe onError={foo} onLoad={bar} />", async ({ task }) => {
      const code = `<iframe onError={foo} onLoad={bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 33)\n\n--- Source code under test ---\n<iframe onError={foo} onLoad={bar} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: <script onLoad={bar} onError={foo} />", async ({ task }) => {
      const code = `<script onLoad={bar} onError={foo} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 34)\n\n--- Source code under test ---\n<script onLoad={bar} onError={foo} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: <source onLoad={bar} onError={foo} />", async ({ task }) => {
      const code = `<source onLoad={bar} onError={foo} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 35)\n\n--- Source code under test ---\n<source onLoad={bar} onError={foo} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: <link onLoad={bar} onError={foo} />", async ({ task }) => {
      const code = `<link onLoad={bar} onError={foo} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 36)\n\n--- Source code under test ---\n<link onLoad={bar} onError={foo} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[37]: <link rel=\"preload\" as=\"image\" href=\"someHref\" imageSrcSe...", async ({ task }) => {
      const code = `<link rel="preload" as="image" href="someHref" imageSrcSet="someImageSrcSet" imageSizes="someImageSizes" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 37)\n\n--- Source code under test ---\n<link rel=\"preload\" as=\"image\" href=\"someHref\" imageSrcSet=\"someImageSrcSet\" imageSizes=\"someImageSizes\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: <object onLoad={bar} />", async ({ task }) => {
      const code = `<object onLoad={bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 38)\n\n--- Source code under test ---\n<object onLoad={bar} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[39]: <body onLoad={bar} />", async ({ task }) => {
      const code = `<body onLoad={bar} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 39)\n\n--- Source code under test ---\n<body onLoad={bar} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[40]: <video allowFullScreen webkitAllowFullScreen mozAllowFull...", async ({ task }) => {
      const code = `<video allowFullScreen webkitAllowFullScreen mozAllowFullScreen />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 40)\n\n--- Source code under test ---\n<video allowFullScreen webkitAllowFullScreen mozAllowFullScreen />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[41]: <iframe allowFullScreen webkitAllowFullScreen mozAllowFul...", async ({ task }) => {
      const code = `<iframe allowFullScreen webkitAllowFullScreen mozAllowFullScreen />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 41)\n\n--- Source code under test ---\n<iframe allowFullScreen webkitAllowFullScreen mozAllowFullScreen />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[42]: <table border=\"1\" />", async ({ task }) => {
      const code = `<table border="1" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 42)\n\n--- Source code under test ---\n<table border=\"1\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[43]: <th abbr=\"abbr\" />", async ({ task }) => {
      const code = `<th abbr="abbr" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 43)\n\n--- Source code under test ---\n<th abbr=\"abbr\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[44]: <td abbr=\"abbr\" />", async ({ task }) => {
      const code = `<td abbr="abbr" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 44)\n\n--- Source code under test ---\n<td abbr=\"abbr\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[45]: <template shadowrootmode=\"open\" shadowrootclonable shadow...", async ({ task }) => {
      const code = `<template shadowrootmode="open" shadowrootclonable shadowrootdelegatesfocus shadowrootserializable />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 45)\n\n--- Source code under test ---\n<template shadowrootmode=\"open\" shadowrootclonable shadowrootdelegatesfocus shadowrootserializable />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[47]: <div onPointerDown={this.onDown} onPointerUp={this.onUp} />", async ({ task }) => {
      const code = `<div onPointerDown={this.onDown} onPointerUp={this.onUp} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 47)\n\n--- Source code under test ---\n<div onPointerDown={this.onDown} onPointerUp={this.onUp} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[48]: <input type=\"checkbox\" defaultChecked={this.state.checkbo...", async ({ task }) => {
      const code = `<input type="checkbox" defaultChecked={this.state.checkbox} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 48)\n\n--- Source code under test ---\n<input type=\"checkbox\" defaultChecked={this.state.checkbox} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[49]: <div onTouchStart={this.startAnimation} onTouchEnd={this....", async ({ task }) => {
      const code = `<div onTouchStart={this.startAnimation} onTouchEnd={this.stopAnimation} onTouchCancel={this.cancel} onTouchMove={this.move} onMouseMoveCapture={this.capture} onTouchCancelCapture={this.log} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 49)\n\n--- Source code under test ---\n<div onTouchStart={this.startAnimation} onTouchEnd={this.stopAnimation} onTouchCancel={this.cancel} onTouchMove={this.move} onMouseMoveCapture={this.capture} onTouchCancelCapture={this.log} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[51]: <meta charset=\"utf-8\" />;", async ({ task }) => {
      const code = `<meta charset="utf-8" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 51)\n\n--- Source code under test ---\n<meta charset=\"utf-8\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[52]: <meta charSet=\"utf-8\" />;", async ({ task }) => {
      const code = `<meta charSet="utf-8" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 52)\n\n--- Source code under test ---\n<meta charSet=\"utf-8\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[53]: <div class=\"foo\" is=\"my-elem\"></div>;", async ({ task }) => {
      const code = `<div class="foo" is="my-elem"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 53)\n\n--- Source code under test ---\n<div class=\"foo\" is=\"my-elem\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[54]: <div {...this.props} class=\"foo\" is=\"my-elem\"></div>;", async ({ task }) => {
      const code = `<div {...this.props} class="foo" is="my-elem"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 54)\n\n--- Source code under test ---\n<div {...this.props} class=\"foo\" is=\"my-elem\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[55]: <atom-panel class=\"foo\"></atom-panel>;", async ({ task }) => {
      const code = `<atom-panel class="foo"></atom-panel>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 55)\n\n--- Source code under test ---\n<atom-panel class=\"foo\"></atom-panel>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[56]: <div data-foo=\"bar\"></div>;", async ({ task }) => {
      const code = `<div data-foo="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 56)\n\n--- Source code under test ---\n<div data-foo=\"bar\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[57]: <div data-foo-bar=\"baz\"></div>;", async ({ task }) => {
      const code = `<div data-foo-bar="baz"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 57)\n\n--- Source code under test ---\n<div data-foo-bar=\"baz\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[58]: <div data-parent=\"parent\"></div>;", async ({ task }) => {
      const code = `<div data-parent="parent"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 58)\n\n--- Source code under test ---\n<div data-parent=\"parent\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[59]: <div data-index-number=\"1234\"></div>;", async ({ task }) => {
      const code = `<div data-index-number="1234"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 59)\n\n--- Source code under test ---\n<div data-index-number=\"1234\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[60]: <div data-e2e-id=\"5678\"></div>;", async ({ task }) => {
      const code = `<div data-e2e-id="5678"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 60)\n\n--- Source code under test ---\n<div data-e2e-id=\"5678\"></div>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[61]: <div data-testID=\"bar\" data-under_sCoRe=\"bar\" />;", async ({ task }) => {
      const code = `<div data-testID="bar" data-under_sCoRe="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 61)\n\n--- Source code under test ---\n<div data-testID=\"bar\" data-under_sCoRe=\"bar\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[66]: <button aria-haspopup=\"true\">Click me to open pop up</but...", async ({ task }) => {
      const code = `<button aria-haspopup="true">Click me to open pop up</button>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 66)\n\n--- Source code under test ---\n<button aria-haspopup=\"true\">Click me to open pop up</button>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[67]: <button aria-label=\"Close\" onClick={someThing.close} />;", async ({ task }) => {
      const code = `<button aria-label="Close" onClick={someThing.close} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 67)\n\n--- Source code under test ---\n<button aria-label=\"Close\" onClick={someThing.close} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[68]: <script crossOrigin noModule />", async ({ task }) => {
      const code = `<script crossOrigin noModule />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 68)\n\n--- Source code under test ---\n<script crossOrigin noModule />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[69]: <audio crossOrigin />", async ({ task }) => {
      const code = `<audio crossOrigin />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 69)\n\n--- Source code under test ---\n<audio crossOrigin />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[70]: <svg focusable><image crossOrigin /></svg>", async ({ task }) => {
      const code = `<svg focusable><image crossOrigin /></svg>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 70)\n\n--- Source code under test ---\n<svg focusable><image crossOrigin /></svg>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[71]: <details onToggle={this.onToggle}>Some details</details>", async ({ task }) => {
      const code = `<details onToggle={this.onToggle}>Some details</details>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 71)\n\n--- Source code under test ---\n<details onToggle={this.onToggle}>Some details</details>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[72]: <path fill=\"pink\" d=\"M 10,30 A 20,20 0,0,1 50,30 A 20,20 ...", async ({ task }) => {
      const code = `<path fill="pink" d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z"></path>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 72)\n\n--- Source code under test ---\n<path fill=\"pink\" d=\"M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z\"></path>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[73]: <line fill=\"pink\" x1=\"0\" y1=\"80\" x2=\"100\" y2=\"20\"></line>", async ({ task }) => {
      const code = `<line fill="pink" x1="0" y1="80" x2="100" y2="20"></line>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 73)\n\n--- Source code under test ---\n<line fill=\"pink\" x1=\"0\" y1=\"80\" x2=\"100\" y2=\"20\"></line>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[74]: <link as=\"audio\">Audio content</link>", async ({ task }) => {
      const code = `<link as="audio">Audio content</link>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 74)\n\n--- Source code under test ---\n<link as=\"audio\">Audio content</link>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[75]: <video controlsList=\"nodownload\" controls={this.controls}...", async ({ task }) => {
      const code = `<video controlsList="nodownload" controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsInline={true} onResize={this.onResize}></video>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 75)\n\n--- Source code under test ---\n<video controlsList=\"nodownload\" controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsInline={true} onResize={this.onResize}></video>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[76]: <audio controlsList=\"nodownload\" controls={this.controls}...", async ({ task }) => {
      const code = `<audio controlsList="nodownload" controls={this.controls} crossOrigin="anonymous" disableRemotePlayback loop muted preload="none" src="something" onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onError={this.error} onResize={this.onResize}></audio>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 76)\n\n--- Source code under test ---\n<audio controlsList=\"nodownload\" controls={this.controls} crossOrigin=\"anonymous\" disableRemotePlayback loop muted preload=\"none\" src=\"something\" onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onError={this.error} onResize={this.onResize}></audio>\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[77]: <marker id={markerId} viewBox=\"0 0 2 2\" refX=\"1\" refY=\"1\"...", async ({ task }) => {
      const code = `<marker id={markerId} viewBox="0 0 2 2" refX="1" refY="1" markerWidth="1" markerHeight="1" orient="auto" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 77)\n\n--- Source code under test ---\n<marker id={markerId} viewBox=\"0 0 2 2\" refX=\"1\" refY=\"1\" markerWidth=\"1\" markerHeight=\"1\" orient=\"auto\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[78]: <pattern id=\"pattern\" viewBox=\"0,0,10,10\" width=\"10%\" hei...", async ({ task }) => {
      const code = `<pattern id="pattern" viewBox="0,0,10,10" width="10%" height="10%" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 78)\n\n--- Source code under test ---\n<pattern id=\"pattern\" viewBox=\"0,0,10,10\" width=\"10%\" height=\"10%\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[79]: <symbol id=\"myDot\" width=\"10\" height=\"10\" viewBox=\"0 0 2 ...", async ({ task }) => {
      const code = `<symbol id="myDot" width="10" height="10" viewBox="0 0 2 2" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 79)\n\n--- Source code under test ---\n<symbol id=\"myDot\" width=\"10\" height=\"10\" viewBox=\"0 0 2 2\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[80]: <view id=\"one\" viewBox=\"0 0 100 100\" />", async ({ task }) => {
      const code = `<view id="one" viewBox="0 0 100 100" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 80)\n\n--- Source code under test ---\n<view id=\"one\" viewBox=\"0 0 100 100\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[81]: <hr align=\"top\" />", async ({ task }) => {
      const code = `<hr align="top" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 81)\n\n--- Source code under test ---\n<hr align=\"top\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[82]: <applet align=\"top\" />", async ({ task }) => {
      const code = `<applet align="top" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 82)\n\n--- Source code under test ---\n<applet align=\"top\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[83]: <marker fill=\"#000\" />", async ({ task }) => {
      const code = `<marker fill="#000" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 83)\n\n--- Source code under test ---\n<marker fill=\"#000\" />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[84]: <dialog closedby=\"something\" onClose={handler} open id=\"d...", async ({ task }) => {
      const code = `<dialog closedby="something" onClose={handler} open id="dialog" returnValue="something" onCancel={handler2} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 84)\n\n--- Source code under test ---\n<dialog closedby=\"something\" onClose={handler} open id=\"dialog\" returnValue=\"something\" onCancel={handler2} />\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[85]: <table align=\"top\"> <caption align=\"top\">Table Caption</c...", async ({ task }) => {
      const code = `
        <table align="top">
          <caption align="top">Table Caption</caption>
          <colgroup valign="top" align="top">
            <col valign="top" align="top"/>
          </colgroup>
          <thead valign="top" align="top">
            <tr valign="top" align="top">
              <th valign="top" align="top">Header</th>
              <td valign="top" align="top">Cell</td>
            </tr>
          </thead>
          <tbody valign="top" align="top" />
          <tfoot valign="top" align="top" />
        </table>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 85)\n\n--- Source code under test ---\n\n        <table align=\"top\">\n          <caption align=\"top\">Table Caption</caption>\n          <colgroup valign=\"top\" align=\"top\">\n            <col valign=\"top\" align=\"top\"/>\n          </colgroup>\n          <thead valign=\"top\" align=\"top\">\n            <tr valign=\"top\" align=\"top\">\n              <th valign=\"top\" align=\"top\">Header</th>\n              <td valign=\"top\" align=\"top\">Cell</td>\n            </tr>\n          </thead>\n          <tbody valign=\"top\" align=\"top\" />\n          <tfoot valign=\"top\" align=\"top\" />\n        </table>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[86]: <fbt desc=\"foo\" doNotExtract />;", async ({ task }) => {
      const code = `<fbt desc="foo" doNotExtract />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 86)\n\n--- Source code under test ---\n<fbt desc=\"foo\" doNotExtract />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[87]: <fbs desc=\"foo\" doNotExtract />;", async ({ task }) => {
      const code = `<fbs desc="foo" doNotExtract />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 87)\n\n--- Source code under test ---\n<fbs desc=\"foo\" doNotExtract />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[88]: <math displaystyle=\"true\" />;", async ({ task }) => {
      const code = `<math displaystyle="true" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 88)\n\n--- Source code under test ---\n<math displaystyle=\"true\" />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[89]: <div className=\"App\" data-crash-crash-crash-crash-crash-c...", async ({ task }) => {
      const code = `
        <div className="App" data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash="customValue">
          Hello, world!
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 89)\n\n--- Source code under test ---\n\n        <div className=\"App\" data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash=\"customValue\">\n          Hello, world!\n        </div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[90]: <div> <button popovertarget=\"my-popover\" popovertargetact...", async ({ task }) => {
      const code = `
        <div>
          <button popovertarget="my-popover" popovertargetaction="toggle">Open Popover</button>

          <div popover id="my-popover">Greetings, one and all!</div>
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 90)\n\n--- Source code under test ---\n\n        <div>\n          <button popovertarget=\"my-popover\" popovertargetaction=\"toggle\">Open Popover</button>\n\n          <div popover id=\"my-popover\">Greetings, one and all!</div>\n        </div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[91]: <div> <button popoverTarget=\"my-popover\" popoverTargetAct...", async ({ task }) => {
      const code = `
        <div>
          <button popoverTarget="my-popover" popoverTargetAction="toggle">Open Popover</button>

          <div id="my-popover" onBeforeToggle={this.onBeforeToggle} popover>Greetings, one and all!</div>
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: valid (index 91)\n\n--- Source code under test ---\n\n        <div>\n          <button popoverTarget=\"my-popover\" popoverTargetAction=\"toggle\">Open Popover</button>\n\n          <div id=\"my-popover\" onBeforeToggle={this.onBeforeToggle} popover>Greetings, one and all!</div>\n        </div>\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[1]: <div hasOwnProperty=\"should not be allowed property\"></div>;", async ({ task }) => {
      const code = `<div hasOwnProperty="should not be allowed property"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 1)\n\n--- Source code under test ---\n<div hasOwnProperty=\"should not be allowed property\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownProp): Unknown property 'hasOwnProperty' found\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'hasOwnProperty' found");
    });

    it("invalid[2]: <div abc=\"should not be allowed property\"></div>;", async ({ task }) => {
      const code = `<div abc="should not be allowed property"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 2)\n\n--- Source code under test ---\n<div abc=\"should not be allowed property\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownProp): Unknown property 'abc' found\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'abc' found");
    });

    it("invalid[3]: <div aria-fake=\"should not be allowed property\"></div>;", async ({ task }) => {
      const code = `<div aria-fake="should not be allowed property"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 3)\n\n--- Source code under test ---\n<div aria-fake=\"should not be allowed property\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownProp): Unknown property 'aria-fake' found\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'aria-fake' found");
    });

    it("invalid[4]: <div someProp=\"bar\"></div>;", async ({ task }) => {
      const code = `<div someProp="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 4)\n\n--- Source code under test ---\n<div someProp=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownProp): Unknown property 'someProp' found\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'someProp' found");
    });

    it("invalid[5]: <div class=\"bar\"></div>;", async ({ task }) => {
      const code = `<div class="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 5)\n\n--- Source code under test ---\n<div class=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'class' found, use 'className' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'class' found, use 'className' instead");
    });

    it("invalid[6]: <div for=\"bar\"></div>;", async ({ task }) => {
      const code = `<div for="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 6)\n\n--- Source code under test ---\n<div for=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'for' found, use 'htmlFor' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'for' found, use 'htmlFor' instead");
    });

    it("invalid[7]: <div accept-charset=\"bar\"></div>;", async ({ task }) => {
      const code = `<div accept-charset="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 7)\n\n--- Source code under test ---\n<div accept-charset=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'accept-charset' found, use 'acceptCharset' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'accept-charset' found, use 'acceptCharset' instead");
    });

    it("invalid[8]: <div http-equiv=\"bar\"></div>;", async ({ task }) => {
      const code = `<div http-equiv="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 8)\n\n--- Source code under test ---\n<div http-equiv=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'http-equiv' found, use 'httpEquiv' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'http-equiv' found, use 'httpEquiv' instead");
    });

    it("invalid[9]: <div accesskey=\"bar\"></div>;", async ({ task }) => {
      const code = `<div accesskey="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 9)\n\n--- Source code under test ---\n<div accesskey=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'accesskey' found, use 'accessKey' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'accesskey' found, use 'accessKey' instead");
    });

    it("invalid[10]: <div onclick=\"bar\"></div>;", async ({ task }) => {
      const code = `<div onclick="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 10)\n\n--- Source code under test ---\n<div onclick=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'onclick' found, use 'onClick' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'onclick' found, use 'onClick' instead");
    });

    it("invalid[11]: <div onmousedown=\"bar\"></div>;", async ({ task }) => {
      const code = `<div onmousedown="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 11)\n\n--- Source code under test ---\n<div onmousedown=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'onmousedown' found, use 'onMouseDown' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'onmousedown' found, use 'onMouseDown' instead");
    });

    it("invalid[12]: <div onMousedown=\"bar\"></div>;", async ({ task }) => {
      const code = `<div onMousedown="bar"></div>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 12)\n\n--- Source code under test ---\n<div onMousedown=\"bar\"></div>;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'onMousedown' found, use 'onMouseDown' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'onMousedown' found, use 'onMouseDown' instead");
    });

    it("invalid[13]: <use xlink:href=\"bar\" />;", async ({ task }) => {
      const code = `<use xlink:href="bar" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 13)\n\n--- Source code under test ---\n<use xlink:href=\"bar\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'xlink:href' found, use 'xlinkHref' instead\n\nFeatures: jsx namespace\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'xlink:href' found, use 'xlinkHref' instead");
    });

    it("invalid[14]: <rect clip-path=\"bar\" transform-origin=\"center\" />;", async ({ task }) => {
      const code = `<rect clip-path="bar" transform-origin="center" />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 14)\n\n--- Source code under test ---\n<rect clip-path=\"bar\" transform-origin=\"center\" />;\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'clip-path' found, use 'clipPath' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'clip-path' found, use 'clipPath' instead");
    });

    it("invalid[15]: <script crossorigin nomodule />", async ({ task }) => {
      const code = `<script crossorigin nomodule />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 15)\n\n--- Source code under test ---\n<script crossorigin nomodule />\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'crossorigin' found, use 'crossOrigin' instead\n  [1] (messageId: unknownPropWithStandardName): Unknown property 'nomodule' found, use 'noModule' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Unknown property 'crossorigin' found, use 'crossOrigin' instead");
      expect(matches[1].message).toBe("Unknown property 'nomodule' found, use 'noModule' instead");
    });

    it("invalid[16]: <div crossorigin />", async ({ task }) => {
      const code = `<div crossorigin />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 16)\n\n--- Source code under test ---\n<div crossorigin />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownPropWithStandardName): Unknown property 'crossorigin' found, use 'crossOrigin' instead\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'crossorigin' found, use 'crossOrigin' instead");
    });

    it("invalid[17]: <div crossOrigin />", async ({ task }) => {
      const code = `<div crossOrigin />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 17)\n\n--- Source code under test ---\n<div crossOrigin />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'crossOrigin' found on tag 'div', but it is only allowed on: script, img, video, audio, link, image\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'crossOrigin' found on tag 'div', but it is only allowed on: script, img, video, audio, link, image");
    });

    it("invalid[18]: <div as=\"audio\" />", async ({ task }) => {
      const code = `<div as="audio" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 18)\n\n--- Source code under test ---\n<div as=\"audio\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'as' found on tag 'div', but it is only allowed on: link\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'as' found on tag 'div', but it is only allowed on: link");
    });

    it("invalid[19]: <div onAbort={this.abort} onDurationChange={this.duration...", async ({ task }) => {
      const code = `<div onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onResize={this.resize} onError={this.error} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 19)\n\n--- Source code under test ---\n<div onAbort={this.abort} onDurationChange={this.durationChange} onEmptied={this.emptied} onEnded={this.end} onResize={this.resize} onError={this.error} />\n\nThis code is INVALID — the rule should produce 6 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'onAbort' found on tag 'div', but it is only allowed on: audio, video\n  [1] (messageId: invalidPropOnTag): Invalid property 'onDurationChange' found on tag 'div', but it is only allowed on: audio, video\n  [2] (messageId: invalidPropOnTag): Invalid property 'onEmptied' found on tag 'div', but it is only allowed on: audio, video\n  [3] (messageId: invalidPropOnTag): Invalid property 'onEnded' found on tag 'div', but it is only allowed on: audio, video\n  [4] (messageId: invalidPropOnTag): Invalid property 'onResize' found on tag 'div', but it is only allowed on: audio, video\n  [5] (messageId: invalidPropOnTag): Invalid property 'onError' found on tag 'div', but it is only allowed on: audio, video, img, link, source, script, picture, iframe\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(6);
      expect(matches[0].message).toBe("Invalid property 'onAbort' found on tag 'div', but it is only allowed on: audio, video");
      expect(matches[1].message).toBe("Invalid property 'onDurationChange' found on tag 'div', but it is only allowed on: audio, video");
      expect(matches[2].message).toBe("Invalid property 'onEmptied' found on tag 'div', but it is only allowed on: audio, video");
      expect(matches[3].message).toBe("Invalid property 'onEnded' found on tag 'div', but it is only allowed on: audio, video");
      expect(matches[4].message).toBe("Invalid property 'onResize' found on tag 'div', but it is only allowed on: audio, video");
      expect(matches[5].message).toBe("Invalid property 'onError' found on tag 'div', but it is only allowed on: audio, video, img, link, source, script, picture, iframe");
    });

    it("invalid[20]: <div onLoad={this.load} />", async ({ task }) => {
      const code = `<div onLoad={this.load} />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 20)\n\n--- Source code under test ---\n<div onLoad={this.load} />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'onLoad' found on tag 'div', but it is only allowed on: script, img, link, picture, iframe, object, source, body\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'onLoad' found on tag 'div', but it is only allowed on: script, img, link, picture, iframe, object, source, body");
    });

    it("invalid[21]: <div fill=\"pink\" />", async ({ task }) => {
      const code = `<div fill="pink" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 21)\n\n--- Source code under test ---\n<div fill=\"pink\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'fill' found on tag 'div', but it is only allowed on: altGlyph, circle, ellipse, g, line, marker, mask, path, polygon, polyline, rect, svg, symbol, text, textPath, tref, tspan, use, animate, animateColor, animateMotion, animateTransform, set\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'fill' found on tag 'div', but it is only allowed on: altGlyph, circle, ellipse, g, line, marker, mask, path, polygon, polyline, rect, svg, symbol, text, textPath, tref, tspan, use, animate, animateColor, animateMotion, animateTransform, set");
    });

    it("invalid[22]: <div controls={this.controls} loop={true} muted={false} s...", async ({ task }) => {
      const code = `<div controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsInline={true} allowFullScreen></div>`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 22)\n\n--- Source code under test ---\n<div controls={this.controls} loop={true} muted={false} src={this.videoSrc} playsInline={true} allowFullScreen></div>\n\nThis code is INVALID — the rule should produce 5 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'controls' found on tag 'div', but it is only allowed on: audio, video\n  [1] (messageId: invalidPropOnTag): Invalid property 'loop' found on tag 'div', but it is only allowed on: audio, video\n  [2] (messageId: invalidPropOnTag): Invalid property 'muted' found on tag 'div', but it is only allowed on: audio, video\n  [3] (messageId: invalidPropOnTag): Invalid property 'playsInline' found on tag 'div', but it is only allowed on: video\n  [4] (messageId: invalidPropOnTag): Invalid property 'allowFullScreen' found on tag 'div', but it is only allowed on: iframe, video\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(5);
      expect(matches[0].message).toBe("Invalid property 'controls' found on tag 'div', but it is only allowed on: audio, video");
      expect(matches[1].message).toBe("Invalid property 'loop' found on tag 'div', but it is only allowed on: audio, video");
      expect(matches[2].message).toBe("Invalid property 'muted' found on tag 'div', but it is only allowed on: audio, video");
      expect(matches[3].message).toBe("Invalid property 'playsInline' found on tag 'div', but it is only allowed on: video");
      expect(matches[4].message).toBe("Invalid property 'allowFullScreen' found on tag 'div', but it is only allowed on: iframe, video");
    });

    it("invalid[23]: <div download=\"foo\" />", async ({ task }) => {
      const code = `<div download="foo" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 23)\n\n--- Source code under test ---\n<div download=\"foo\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'download' found on tag 'div', but it is only allowed on: a, area\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'download' found on tag 'div', but it is only allowed on: a, area");
    });

    it("invalid[24]: <div imageSrcSet=\"someImageSrcSet\" />", async ({ task }) => {
      const code = `<div imageSrcSet="someImageSrcSet" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 24)\n\n--- Source code under test ---\n<div imageSrcSet=\"someImageSrcSet\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'imageSrcSet' found on tag 'div', but it is only allowed on: link\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'imageSrcSet' found on tag 'div', but it is only allowed on: link");
    });

    it("invalid[25]: <div imageSizes=\"someImageSizes\" />", async ({ task }) => {
      const code = `<div imageSizes="someImageSizes" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 25)\n\n--- Source code under test ---\n<div imageSizes=\"someImageSizes\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'imageSizes' found on tag 'div', but it is only allowed on: link\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'imageSizes' found on tag 'div', but it is only allowed on: link");
    });

    it("invalid[26]: <div data-xml-anything=\"invalid\" />", async ({ task }) => {
      const code = `<div data-xml-anything="invalid" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 26)\n\n--- Source code under test ---\n<div data-xml-anything=\"invalid\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownProp): Unknown property 'data-xml-anything' found\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'data-xml-anything' found");
    });

    it("invalid[29]: <div abbr=\"abbr\" />", async ({ task }) => {
      const code = `<div abbr="abbr" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 29)\n\n--- Source code under test ---\n<div abbr=\"abbr\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'abbr' found on tag 'div', but it is only allowed on: th, td\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'abbr' found on tag 'div', but it is only allowed on: th, td");
    });

    it("invalid[30]: <div webkitDirectory=\"\" />", async ({ task }) => {
      const code = `<div webkitDirectory="" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 30)\n\n--- Source code under test ---\n<div webkitDirectory=\"\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'webkitDirectory' found on tag 'div', but it is only allowed on: input\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'webkitDirectory' found on tag 'div', but it is only allowed on: input");
    });

    it("invalid[31]: <div webkitdirectory=\"\" />", async ({ task }) => {
      const code = `<div webkitdirectory="" />`;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 31)\n\n--- Source code under test ---\n<div webkitdirectory=\"\" />\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: invalidPropOnTag): Invalid property 'webkitdirectory' found on tag 'div', but it is only allowed on: input\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Invalid property 'webkitdirectory' found on tag 'div', but it is only allowed on: input");
    });

    it("invalid[32]: <div className=\"App\" data-crash-crash-crash-crash-crash-c...", async ({ task }) => {
      const code = `
        <div className="App" data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c="customValue">
          Hello, world!
        </div>
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unknown-property\nType: invalid (index 32)\n\n--- Source code under test ---\n\n        <div className=\"App\" data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c=\"customValue\">\n          Hello, world!\n        </div>\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: unknownProp): Unknown property 'data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c' found\n\nFeatures: no-ts\n\nRule message templates:\n  invalidPropOnTag: Invalid property '{{name}}' found on tag '{{tagName}}', but it is only allowed on: {{allowedTags}}\n  unknownPropWithStandardName: Unknown property '{{name}}' found, use '{{standardName}}' instead\n  unknownProp: Unknown property '{{name}}' found\n  dataLowercaseRequired: React does not recognize data-* props with uppercase characters on a DOM element. Found '{{name}}', use '{{lowerCaseName}}' instead";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-unknown-property", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Unknown property 'data-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash-crash:c' found");
    });

  });
});
