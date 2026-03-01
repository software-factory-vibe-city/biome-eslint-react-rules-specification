import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "jsx-key";
const VALID_COUNT = 31;

const RULE_MESSAGES = [
  "Missing \"key\" prop for element in iterator",
  "Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead",
  "Missing \"key\" prop for element in array",
  "Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead",
  "`key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`",
  "`key` prop must be unique",
  "Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use Act.Frag instead",
  "Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use Act.Frag instead",
];

const cases = [
  { code: `
        [1, 2, 3].map((item) => {
         return item === 'bar' ? <div key={item}>{item}</div> : <span key={item}>{item}</span>;
        })`, filename: "test.jsx" },
  { code: `fn()`, filename: "test.jsx" },
  { code: `[1, 2, 3].map(function () {})`, filename: "test.jsx" },
  { code: `<App />;`, filename: "test.jsx" },
  { code: `[<App key={0} />, <App key={1} />];`, filename: "test.jsx" },
  { code: `[1, 2, 3].map(function(x) { return <App key={x} /> });`, filename: "test.jsx" },
  { code: `[1, 2, 3].map(x => <App key={x} />);`, filename: "test.jsx" },
  { code: `[1, 2 ,3].map(x => x && <App x={x} key={x} />);`, filename: "test.jsx" },
  { code: `[1, 2 ,3].map(x => x ? <App x={x} key="1" /> : <OtherApp x={x} key="2" />);`, filename: "test.jsx" },
  { code: `[1, 2, 3].map(x => { return <App key={x} /> });`, filename: "test.jsx" },
  { code: `Array.from([1, 2, 3], function(x) { return <App key={x} /> });`, filename: "test.jsx" },
  { code: `Array.from([1, 2, 3], (x => <App key={x} />));`, filename: "test.jsx" },
  { code: `Array.from([1, 2, 3], (x => {return <App key={x} />}));`, filename: "test.jsx" },
  { code: `Array.from([1, 2, 3], someFn);`, filename: "test.jsx" },
  { code: `Array.from([1, 2, 3]);`, filename: "test.jsx" },
  { code: `[1, 2, 3].foo(x => <App />);`, filename: "test.jsx" },
  { code: `var App = () => <div />;`, filename: "test.jsx" },
  { code: `[1, 2, 3].map(function(x) { return; });`, filename: "test.jsx" },
  { code: `foo(() => <div />);`, filename: "test.jsx" },
  { code: `foo(() => <></>);`, filename: "test.jsx" },
  { code: `<></>;`, filename: "test.jsx" },
  { code: `<App {...{}} />;`, filename: "test.jsx" },
  { code: `
        const spans = [
          <span key="notunique"/>,
          <span key="notunique"/>,
        ];
      `, filename: "test.jsx" },
  { code: `
        function Component(props) {
          return hasPayment ? (
            <div className="stuff">
              <BookingDetailSomething {...props} />
              {props.modal && props.calculatedPrice && (
                <SomeOtherThing items={props.something} discount={props.discount} />
              )}
            </div>
          ) : null;
        }
      `, filename: "test.jsx" },
  { code: `
        import React, { FC, useRef, useState } from 'react';

        import './ResourceVideo.sass';
        import VimeoVideoPlayInModal from '../vimeoVideoPlayInModal/VimeoVideoPlayInModal';

        type Props = {
          videoUrl: string;
          videoTitle: string;
        };
        const ResourceVideo: FC<Props> = ({
          videoUrl,
          videoTitle,
        }: Props): JSX.Element => {
          return (
            <div className="resource-video">
              <VimeoVideoPlayInModal videoUrl={videoUrl} />
              <h3>{videoTitle}</h3>
            </div>
          );
        };

        export default ResourceVideo;
      `, filename: "test.tsx" },
  { code: `
        // testrule.jsx
        const trackLink = () => {};
        const getAnalyticsUiElement = () => {};

        const onTextButtonClick = (e, item) => trackLink([, getAnalyticsUiElement(item), item.name], e);
      `, filename: "test.jsx" },
  { code: `
        function Component({ allRatings }) {
          return (
            <RatingDetailsStyles>
              {Object.entries(allRatings)?.map(([key, value], index) => {
                const rate = value?.split(/(?=[%, /])/);

                if (!rate) return null;

                return (
                  <li key={\`\${entertainment.tmdbId}\${index}\`}>
                    <img src={\`/assets/rating/\${key}.png\`} />
                    <span className="rating-details--rate">{rate?.[0]}</span>
                    <span className="rating-details--rate-suffix">{rate?.[1]}</span>
                  </li>
                );
              })}
            </RatingDetailsStyles>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        const baz = foo?.bar?.()?.[1] ?? 'qux';

        qux()?.map()

        const directiveRanges = comments?.map(tryParseTSDirective)
      `, filename: "test.jsx" },
  { code: `
        import { observable } from "mobx";

        export interface ClusterFrameInfo {
          frameId: number;
          processId: number;
        }

        export const clusterFrameMap = observable.map<string, ClusterFrameInfo>();
      `, filename: "test.tsx" },
  { code: `React.Children.toArray([1, 2 ,3].map(x => <App />));`, filename: "test.jsx" },
  { code: `
        import { Children } from "react";
        Children.toArray([1, 2 ,3].map(x => <App />));
      `, filename: "test.jsx" },
  { code: `
        [1, 2, 3].map((item) => {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`, filename: "test.jsx" },
  { code: `
        [1, 2, 3].map(function(item) {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`, filename: "test.jsx" },
  { code: `
        Array.from([1, 2, 3], (item) => {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`, filename: "test.jsx" },
  { code: `
        import { Fragment } from 'react';

        const ITEMS = ['bar', 'foo'];

        export default function BugIssue() {
          return (
            <Fragment>
              {ITEMS.map((item) => {
                return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
              })}
            </Fragment>
          );
        }
      `, filename: "test.jsx" },
  { code: `[<App />];`, filename: "test.jsx" },
  { code: `[<App {...key} />];`, filename: "test.jsx" },
  { code: `[<App key={0}/>, <App />];`, filename: "test.jsx" },
  { code: `[1, 2 ,3].map(function(x) { return <App /> });`, filename: "test.jsx" },
  { code: `[1, 2 ,3].map(x => <App />);`, filename: "test.jsx" },
  { code: `[1, 2 ,3].map(x => x && <App x={x} />);`, filename: "test.jsx" },
  { code: `[1, 2 ,3].map(x => x ? <App x={x} key="1" /> : <OtherApp x={x} />);`, filename: "test.jsx" },
  { code: `[1, 2 ,3].map(x => x ? <App x={x} /> : <OtherApp x={x} key="2" />);`, filename: "test.jsx" },
  { code: `[1, 2 ,3].map(x => { return <App /> });`, filename: "test.jsx" },
  { code: `Array.from([1, 2 ,3], function(x) { return <App /> });`, filename: "test.jsx" },
  { code: `Array.from([1, 2 ,3], (x => { return <App /> }));`, filename: "test.jsx" },
  { code: `Array.from([1, 2 ,3], (x => <App />));`, filename: "test.jsx" },
  { code: `[1, 2, 3]?.map(x => <BabelEslintApp />)`, filename: "test.jsx" },
  { code: `[1, 2, 3]?.map(x => <TypescriptEslintApp />)`, filename: "test.tsx" },
  { code: `
        const Test = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) {
                  return <div>{item}</div>;
                }

                return <div />;
              })}
            </div>
          );
        };
      `, filename: "test.jsx" },
  { code: `
        const TestO = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) {
                  return <div>{item}</div>;
                } else if (item < 5) {
                  return <div></div>
                }  else {
                  return <div></div>
                }

                return <div />;
              })}
            </div>
          );
        };
      `, filename: "test.jsx" },
  { code: `
        const TestCase = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) return <div>{item}</div>;
                else if (item < 5) return <div />;
                else return <div />;
              })}
            </div>
          );
        };
      `, filename: "test.jsx" },
];

describe("jsx-key", () => {
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
    it("valid[0]: [1, 2, 3].map((item) => { return item === 'bar' ? <div ke...", ({ task }) => {
      const code = `
        [1, 2, 3].map((item) => {
         return item === 'bar' ? <div key={item}>{item}</div> : <span key={item}>{item}</span>;
        })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 0)\n\n--- Source code under test ---\n\n        [1, 2, 3].map((item) => {\n         return item === 'bar' ? <div key={item}>{item}</div> : <span key={item}>{item}</span>;\n        })\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: fn()", ({ task }) => {
      const code = `fn()`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 1)\n\n--- Source code under test ---\nfn()\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: [1, 2, 3].map(function () {})", ({ task }) => {
      const code = `[1, 2, 3].map(function () {})`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 2)\n\n--- Source code under test ---\n[1, 2, 3].map(function () {})\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: <App />;", ({ task }) => {
      const code = `<App />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 3)\n\n--- Source code under test ---\n<App />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: [<App key={0} />, <App key={1} />];", ({ task }) => {
      const code = `[<App key={0} />, <App key={1} />];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 4)\n\n--- Source code under test ---\n[<App key={0} />, <App key={1} />];\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: [1, 2, 3].map(function(x) { return <App key={x} /> });", ({ task }) => {
      const code = `[1, 2, 3].map(function(x) { return <App key={x} /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 5)\n\n--- Source code under test ---\n[1, 2, 3].map(function(x) { return <App key={x} /> });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: [1, 2, 3].map(x => <App key={x} />);", ({ task }) => {
      const code = `[1, 2, 3].map(x => <App key={x} />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 6)\n\n--- Source code under test ---\n[1, 2, 3].map(x => <App key={x} />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: [1, 2 ,3].map(x => x && <App x={x} key={x} />);", ({ task }) => {
      const code = `[1, 2 ,3].map(x => x && <App x={x} key={x} />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 7)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x && <App x={x} key={x} />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: [1, 2 ,3].map(x => x ? <App x={x} key=\"1\" /> : <OtherApp ...", ({ task }) => {
      const code = `[1, 2 ,3].map(x => x ? <App x={x} key="1" /> : <OtherApp x={x} key="2" />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 8)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x ? <App x={x} key=\"1\" /> : <OtherApp x={x} key=\"2\" />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: [1, 2, 3].map(x => { return <App key={x} /> });", ({ task }) => {
      const code = `[1, 2, 3].map(x => { return <App key={x} /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 9)\n\n--- Source code under test ---\n[1, 2, 3].map(x => { return <App key={x} /> });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: Array.from([1, 2, 3], function(x) { return <App key={x} /...", ({ task }) => {
      const code = `Array.from([1, 2, 3], function(x) { return <App key={x} /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 10)\n\n--- Source code under test ---\nArray.from([1, 2, 3], function(x) { return <App key={x} /> });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: Array.from([1, 2, 3], (x => <App key={x} />));", ({ task }) => {
      const code = `Array.from([1, 2, 3], (x => <App key={x} />));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 11)\n\n--- Source code under test ---\nArray.from([1, 2, 3], (x => <App key={x} />));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: Array.from([1, 2, 3], (x => {return <App key={x} />}));", ({ task }) => {
      const code = `Array.from([1, 2, 3], (x => {return <App key={x} />}));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 12)\n\n--- Source code under test ---\nArray.from([1, 2, 3], (x => {return <App key={x} />}));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: Array.from([1, 2, 3], someFn);", ({ task }) => {
      const code = `Array.from([1, 2, 3], someFn);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 13)\n\n--- Source code under test ---\nArray.from([1, 2, 3], someFn);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: Array.from([1, 2, 3]);", ({ task }) => {
      const code = `Array.from([1, 2, 3]);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 14)\n\n--- Source code under test ---\nArray.from([1, 2, 3]);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: [1, 2, 3].foo(x => <App />);", ({ task }) => {
      const code = `[1, 2, 3].foo(x => <App />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 15)\n\n--- Source code under test ---\n[1, 2, 3].foo(x => <App />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: var App = () => <div />;", ({ task }) => {
      const code = `var App = () => <div />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 16)\n\n--- Source code under test ---\nvar App = () => <div />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: [1, 2, 3].map(function(x) { return; });", ({ task }) => {
      const code = `[1, 2, 3].map(function(x) { return; });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 17)\n\n--- Source code under test ---\n[1, 2, 3].map(function(x) { return; });\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: foo(() => <div />);", ({ task }) => {
      const code = `foo(() => <div />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 18)\n\n--- Source code under test ---\nfoo(() => <div />);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: foo(() => <></>);", ({ task }) => {
      const code = `foo(() => <></>);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 19)\n\n--- Source code under test ---\nfoo(() => <></>);\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: <></>;", ({ task }) => {
      const code = `<></>;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 20)\n\n--- Source code under test ---\n<></>;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: fragment\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: <App {...{}} />;", ({ task }) => {
      const code = `<App {...{}} />;`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 21)\n\n--- Source code under test ---\n<App {...{}} />;\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: const spans = [ <span key=\"notunique\"/>, <span key=\"notun...", ({ task }) => {
      const code = `
        const spans = [
          <span key="notunique"/>,
          <span key="notunique"/>,
        ];
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 24)\n\n--- Source code under test ---\n\n        const spans = [\n          <span key=\"notunique\"/>,\n          <span key=\"notunique\"/>,\n        ];\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: function Component(props) { return hasPayment ? ( <div cl...", ({ task }) => {
      const code = `
        function Component(props) {
          return hasPayment ? (
            <div className="stuff">
              <BookingDetailSomething {...props} />
              {props.modal && props.calculatedPrice && (
                <SomeOtherThing items={props.something} discount={props.discount} />
              )}
            </div>
          ) : null;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 25)\n\n--- Source code under test ---\n\n        function Component(props) {\n          return hasPayment ? (\n            <div className=\"stuff\">\n              <BookingDetailSomething {...props} />\n              {props.modal && props.calculatedPrice && (\n                <SomeOtherThing items={props.something} discount={props.discount} />\n              )}\n            </div>\n          ) : null;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: import React, { FC, useRef, useState } from 'react'; impo...", ({ task }) => {
      const code = `
        import React, { FC, useRef, useState } from 'react';

        import './ResourceVideo.sass';
        import VimeoVideoPlayInModal from '../vimeoVideoPlayInModal/VimeoVideoPlayInModal';

        type Props = {
          videoUrl: string;
          videoTitle: string;
        };
        const ResourceVideo: FC<Props> = ({
          videoUrl,
          videoTitle,
        }: Props): JSX.Element => {
          return (
            <div className="resource-video">
              <VimeoVideoPlayInModal videoUrl={videoUrl} />
              <h3>{videoTitle}</h3>
            </div>
          );
        };

        export default ResourceVideo;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 26)\n\n--- Source code under test ---\n\n        import React, { FC, useRef, useState } from 'react';\n\n        import './ResourceVideo.sass';\n        import VimeoVideoPlayInModal from '../vimeoVideoPlayInModal/VimeoVideoPlayInModal';\n\n        type Props = {\n          videoUrl: string;\n          videoTitle: string;\n        };\n        const ResourceVideo: FC<Props> = ({\n          videoUrl,\n          videoTitle,\n        }: Props): JSX.Element => {\n          return (\n            <div className=\"resource-video\">\n              <VimeoVideoPlayInModal videoUrl={videoUrl} />\n              <h3>{videoTitle}</h3>\n            </div>\n          );\n        };\n\n        export default ResourceVideo;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: // testrule.jsx const trackLink = () => {}; const getAnal...", ({ task }) => {
      const code = `
        // testrule.jsx
        const trackLink = () => {};
        const getAnalyticsUiElement = () => {};

        const onTextButtonClick = (e, item) => trackLink([, getAnalyticsUiElement(item), item.name], e);
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 27)\n\n--- Source code under test ---\n\n        // testrule.jsx\n        const trackLink = () => {};\n        const getAnalyticsUiElement = () => {};\n\n        const onTextButtonClick = (e, item) => trackLink([, getAnalyticsUiElement(item), item.name], e);\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: function Component({ allRatings }) { return ( <RatingDeta...", ({ task }) => {
      const code = `
        function Component({ allRatings }) {
          return (
            <RatingDetailsStyles>
              {Object.entries(allRatings)?.map(([key, value], index) => {
                const rate = value?.split(/(?=[%, /])/);

                if (!rate) return null;

                return (
                  <li key={\`\${entertainment.tmdbId}\${index}\`}>
                    <img src={\`/assets/rating/\${key}.png\`} />
                    <span className="rating-details--rate">{rate?.[0]}</span>
                    <span className="rating-details--rate-suffix">{rate?.[1]}</span>
                  </li>
                );
              })}
            </RatingDetailsStyles>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 28)\n\n--- Source code under test ---\n\n        function Component({ allRatings }) {\n          return (\n            <RatingDetailsStyles>\n              {Object.entries(allRatings)?.map(([key, value], index) => {\n                const rate = value?.split(/(?=[%, /])/);\n\n                if (!rate) return null;\n\n                return (\n                  <li key={`${entertainment.tmdbId}${index}`}>\n                    <img src={`/assets/rating/${key}.png`} />\n                    <span className=\"rating-details--rate\">{rate?.[0]}</span>\n                    <span className=\"rating-details--rate-suffix\">{rate?.[1]}</span>\n                  </li>\n                );\n              })}\n            </RatingDetailsStyles>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: optional chaining\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: const baz = foo?.bar?.()?.[1] ?? 'qux'; qux()?.map() cons...", ({ task }) => {
      const code = `
        const baz = foo?.bar?.()?.[1] ?? 'qux';

        qux()?.map()

        const directiveRanges = comments?.map(tryParseTSDirective)
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 29)\n\n--- Source code under test ---\n\n        const baz = foo?.bar?.()?.[1] ?? 'qux';\n\n        qux()?.map()\n\n        const directiveRanges = comments?.map(tryParseTSDirective)\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: optional chaining, nullish coalescing\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: import { observable } from \"mobx\"; export interface Clust...", ({ task }) => {
      const code = `
        import { observable } from "mobx";

        export interface ClusterFrameInfo {
          frameId: number;
          processId: number;
        }

        export const clusterFrameMap = observable.map<string, ClusterFrameInfo>();
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 30)\n\n--- Source code under test ---\n\n        import { observable } from \"mobx\";\n\n        export interface ClusterFrameInfo {\n          frameId: number;\n          processId: number;\n        }\n\n        export const clusterFrameMap = observable.map<string, ClusterFrameInfo>();\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: types, no-babel-old\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: React.Children.toArray([1, 2 ,3].map(x => <App />));", ({ task }) => {
      const code = `React.Children.toArray([1, 2 ,3].map(x => <App />));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 31)\n\n--- Source code under test ---\nReact.Children.toArray([1, 2 ,3].map(x => <App />));\n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: import { Children } from \"react\"; Children.toArray([1, 2 ...", ({ task }) => {
      const code = `
        import { Children } from "react";
        Children.toArray([1, 2 ,3].map(x => <App />));
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: valid (index 32)\n\n--- Source code under test ---\n\n        import { Children } from \"react\";\n        Children.toArray([1, 2 ,3].map(x => <App />));\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: [1, 2, 3].map((item) => { return item === 'bar' ? <div>{i...", ({ task }) => {
      const code = `
        [1, 2, 3].map((item) => {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        [1, 2, 3].map((item) => {\n          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;\n        })\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[1]: [1, 2, 3].map(function(item) { return item === 'bar' ? <d...", ({ task }) => {
      const code = `
        [1, 2, 3].map(function(item) {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        [1, 2, 3].map(function(item) {\n          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;\n        })\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[2]: Array.from([1, 2, 3], (item) => { return item === 'bar' ?...", ({ task }) => {
      const code = `
        Array.from([1, 2, 3], (item) => {
          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
        })`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        Array.from([1, 2, 3], (item) => {\n          return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;\n        })\n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[3]: import { Fragment } from 'react'; const ITEMS = ['bar', '...", ({ task }) => {
      const code = `
        import { Fragment } from 'react';

        const ITEMS = ['bar', 'foo'];

        export default function BugIssue() {
          return (
            <Fragment>
              {ITEMS.map((item) => {
                return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;
              })}
            </Fragment>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        import { Fragment } from 'react';\n\n        const ITEMS = ['bar', 'foo'];\n\n        export default function BugIssue() {\n          return (\n            <Fragment>\n              {ITEMS.map((item) => {\n                return item === 'bar' ? <div>{item}</div> : <span>{item}</span>;\n              })}\n            </Fragment>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[4]: [<App />];", ({ task }) => {
      const code = `[<App />];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 4)\n\n--- Source code under test ---\n[<App />];\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingArrayKey): Missing \"key\" prop for element in array\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in array");
    });

    it("invalid[5]: [<App {...key} />];", ({ task }) => {
      const code = `[<App {...key} />];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 5)\n\n--- Source code under test ---\n[<App {...key} />];\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingArrayKey): Missing \"key\" prop for element in array\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in array");
    });

    it("invalid[6]: [<App key={0}/>, <App />];", ({ task }) => {
      const code = `[<App key={0}/>, <App />];`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 6)\n\n--- Source code under test ---\n[<App key={0}/>, <App />];\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingArrayKey): Missing \"key\" prop for element in array\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in array");
    });

    it("invalid[7]: [1, 2 ,3].map(function(x) { return <App /> });", ({ task }) => {
      const code = `[1, 2 ,3].map(function(x) { return <App /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 7)\n\n--- Source code under test ---\n[1, 2 ,3].map(function(x) { return <App /> });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[8]: [1, 2 ,3].map(x => <App />);", ({ task }) => {
      const code = `[1, 2 ,3].map(x => <App />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 8)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => <App />);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[9]: [1, 2 ,3].map(x => x && <App x={x} />);", ({ task }) => {
      const code = `[1, 2 ,3].map(x => x && <App x={x} />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 9)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x && <App x={x} />);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[10]: [1, 2 ,3].map(x => x ? <App x={x} key=\"1\" /> : <OtherApp ...", ({ task }) => {
      const code = `[1, 2 ,3].map(x => x ? <App x={x} key="1" /> : <OtherApp x={x} />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 10)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x ? <App x={x} key=\"1\" /> : <OtherApp x={x} />);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[11]: [1, 2 ,3].map(x => x ? <App x={x} /> : <OtherApp x={x} ke...", ({ task }) => {
      const code = `[1, 2 ,3].map(x => x ? <App x={x} /> : <OtherApp x={x} key="2" />);`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 11)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => x ? <App x={x} /> : <OtherApp x={x} key=\"2\" />);\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[12]: [1, 2 ,3].map(x => { return <App /> });", ({ task }) => {
      const code = `[1, 2 ,3].map(x => { return <App /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 12)\n\n--- Source code under test ---\n[1, 2 ,3].map(x => { return <App /> });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[13]: Array.from([1, 2 ,3], function(x) { return <App /> });", ({ task }) => {
      const code = `Array.from([1, 2 ,3], function(x) { return <App /> });`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 13)\n\n--- Source code under test ---\nArray.from([1, 2 ,3], function(x) { return <App /> });\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[14]: Array.from([1, 2 ,3], (x => { return <App /> }));", ({ task }) => {
      const code = `Array.from([1, 2 ,3], (x => { return <App /> }));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 14)\n\n--- Source code under test ---\nArray.from([1, 2 ,3], (x => { return <App /> }));\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[15]: Array.from([1, 2 ,3], (x => <App />));", ({ task }) => {
      const code = `Array.from([1, 2 ,3], (x => <App />));`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 15)\n\n--- Source code under test ---\nArray.from([1, 2 ,3], (x => <App />));\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[16]: [1, 2, 3]?.map(x => <BabelEslintApp />)", ({ task }) => {
      const code = `[1, 2, 3]?.map(x => <BabelEslintApp />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 16)\n\n--- Source code under test ---\n[1, 2, 3]?.map(x => <BabelEslintApp />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nFeatures: no-default\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[17]: [1, 2, 3]?.map(x => <TypescriptEslintApp />)", ({ task }) => {
      const code = `[1, 2, 3]?.map(x => <TypescriptEslintApp />)`;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 17)\n\n--- Source code under test ---\n[1, 2, 3]?.map(x => <TypescriptEslintApp />)\n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nFeatures: ts\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[24]: const Test = () => { const list = [1, 2, 3, 4, 5]; return...", ({ task }) => {
      const code = `
        const Test = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) {
                  return <div>{item}</div>;
                }

                return <div />;
              })}
            </div>
          );
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        const Test = () => {\n          const list = [1, 2, 3, 4, 5];\n\n          return (\n            <div>\n              {list.map(item => {\n                if (item < 2) {\n                  return <div>{item}</div>;\n                }\n\n                return <div />;\n              })}\n            </div>\n          );\n        };\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[25]: const TestO = () => { const list = [1, 2, 3, 4, 5]; retur...", ({ task }) => {
      const code = `
        const TestO = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) {
                  return <div>{item}</div>;
                } else if (item < 5) {
                  return <div></div>
                }  else {
                  return <div></div>
                }

                return <div />;
              })}
            </div>
          );
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        const TestO = () => {\n          const list = [1, 2, 3, 4, 5];\n\n          return (\n            <div>\n              {list.map(item => {\n                if (item < 2) {\n                  return <div>{item}</div>;\n                } else if (item < 5) {\n                  return <div></div>\n                }  else {\n                  return <div></div>\n                }\n\n                return <div />;\n              })}\n            </div>\n          );\n        };\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [2] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [3] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[2].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[3].message).toBe("Missing \"key\" prop for element in iterator");
    });

    it("invalid[26]: const TestCase = () => { const list = [1, 2, 3, 4, 5]; re...", ({ task }) => {
      const code = `
        const TestCase = () => {
          const list = [1, 2, 3, 4, 5];

          return (
            <div>
              {list.map(item => {
                if (item < 2) return <div>{item}</div>;
                else if (item < 5) return <div />;
                else return <div />;
              })}
            </div>
          );
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: jsx-key\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        const TestCase = () => {\n          const list = [1, 2, 3, 4, 5];\n\n          return (\n            <div>\n              {list.map(item => {\n                if (item < 2) return <div>{item}</div>;\n                else if (item < 5) return <div />;\n                else return <div />;\n              })}\n            </div>\n          );\n        };\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [1] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n  [2] (messageId: missingIterKey): Missing \"key\" prop for element in iterator\n\nRule message templates:\n  missingIterKey: Missing \"key\" prop for element in iterator\n  missingIterKeyUsePrag: Missing \"key\" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  missingArrayKey: Missing \"key\" prop for element in array\n  missingArrayKeyUsePrag: Missing \"key\" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead\n  keyBeforeSpread: `key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`\n  nonUniqueKeys: `key` prop must be unique";
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[1].message).toBe("Missing \"key\" prop for element in iterator");
      expect(matches[2].message).toBe("Missing \"key\" prop for element in iterator");
    });

  });
});
