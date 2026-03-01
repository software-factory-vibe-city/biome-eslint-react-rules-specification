import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-unstable-nested-components";
const VALID_COUNT = 33;

const RULE_MESSAGES = [
  "Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.",
  "Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component and pass data as props.",
  "Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.",
];

const cases = [
  { code: `
        function ParentComponent() {
          return (
            <div>
              <OutsideDefinedFunctionComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return React.createElement(
            "div",
            null,
            React.createElement(OutsideDefinedFunctionComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return (
            <SomeComponent
              footer={<OutsideDefinedComponent />}
              header={<div />}
              />
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return React.createElement(SomeComponent, {
            footer: React.createElement(OutsideDefinedComponent, null),
            header: React.createElement("div", null)
          });
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const MemoizedNestedComponent = React.useCallback(() => <div />, []);

          return (
            <div>
              <MemoizedNestedComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const MemoizedNestedComponent = React.useCallback(
            () => React.createElement("div", null),
            []
          );

          return React.createElement(
            "div",
            null,
            React.createElement(MemoizedNestedComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const MemoizedNestedFunctionComponent = React.useCallback(
            function () {
              return <div />;
            },
            []
          );

          return (
            <div>
              <MemoizedNestedFunctionComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const MemoizedNestedFunctionComponent = React.useCallback(
            function () {
              return React.createElement("div", null);
            },
            []
          );

          return React.createElement(
            "div",
            null,
            React.createElement(MemoizedNestedFunctionComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent(props) {
          // Should not interfere handler declarations
          function onClick(event) {
            props.onClick(event.target.value);
          }

          const onKeyPress = () => null;

          function getOnHover() {
            return function onHover(event) {
              props.onHover(event.target);
            }
          }

          return (
            <div>
              <button
                onClick={onClick}
                onKeyPress={onKeyPress}
                onHover={getOnHover()}

                // These should not be considered as components
                maybeComponentOrHandlerNull={() => null}
                maybeComponentOrHandlerUndefined={() => undefined}
                maybeComponentOrHandlerBlank={() => ''}
                maybeComponentOrHandlerString={() => 'hello-world'}
                maybeComponentOrHandlerNumber={() => 42}
                maybeComponentOrHandlerArray={() => []}
                maybeComponentOrHandlerObject={() => {}} />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          function getComponent() {
            return <div />;
          }

          return (
            <div>
              {getComponent()}
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          function getComponent() {
            return React.createElement("div", null);
          }

          return React.createElement("div", null, getComponent());
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
            return (
              <RenderPropComponent>
                {() => <div />}
              </RenderPropComponent>
            );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
            return (
              <RenderPropComponent children={() => <div />} />
            );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return (
            <ComplexRenderPropComponent
              listRenderer={data.map((items, index) => (
                <ul>
                  {items[index].map((item) =>
                    <li>
                      {item}
                    </li>
                  )}
                </ul>
              ))
              }
            />
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return React.createElement(
              RenderPropComponent,
              null,
              () => React.createElement("div", null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent(props) {
          return (
            <ul>
              {props.items.map(item => (
                <li key={item.id}>
                  {item.name}
                </li>
              ))}
            </ul>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent(props) {
          return (
            <List items={props.items.map(item => {
              return (
                <li key={item.id}>
                  {item.name}
                </li>
              );
            })}
            />
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent(props) {
          return React.createElement(
            "ul",
            null,
            props.items.map(() =>
              React.createElement(
                "li",
                { key: item.id },
                item.name
              )
            )
          )
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent(props) {
          return (
            <ul>
              {props.items.map(function Item(item) {
                return (
                  <li key={item.id}>
                    {item.name}
                  </li>
                );
              })}
            </ul>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent(props) {
          return React.createElement(
            "ul",
            null,
            props.items.map(function Item() {
              return React.createElement(
                "li",
                { key: item.id },
                item.name
              );
            })
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function createTestComponent(props) {
          return (
            <div />
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function createTestComponent(props) {
          return React.createElement("div", null);
        }
      `, filename: "test.jsx" },
  { code: `
      function ParentComponent() {
        return (
          <SomeComponent>
            {
              thing.match({
                renderLoading: () => <div />,
                renderSuccess: () => <div />,
                renderFailure: () => <div />,
              })
            }
          </SomeComponent>
        )
      }
      `, filename: "test.jsx" },
  { code: `
      function ParentComponent() {
        const thingElement = thing.match({
          renderLoading: () => <div />,
          renderSuccess: () => <div />,
          renderFailure: () => <div />,
        });
        return (
          <SomeComponent>
            {thingElement}
          </SomeComponent>
        )
      }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return (
            <ComponentForProps renderFooter={() => <div />} />
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return React.createElement(ComponentForProps, {
            renderFooter: () => React.createElement("div", null)
          });
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          useEffect(() => {
            return () => null;
          });

          return <div />;
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return (
            <SomeComponent renderers={{ Header: () => <div /> }} />
          )
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return (
            <SomeComponent renderMenu={() => (
              <RenderPropComponent>
                {items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </RenderPropComponent>
            )} />
          )
        }
      `, filename: "test.jsx" },
  { code: `
        const ParentComponent = () => (
          <SomeComponent
            components={[
              <ul>
                {list.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>,
            ]}
          />
        );
     `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const rows = [
            {
              name: 'A',
              render: (props) => <Row {...props} />
            },
          ];

          return <Table rows={rows} />;
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return <SomeComponent renderers={{ notComponent: () => null }} />;
        }
      `, filename: "test.jsx" },
  { code: `
        const ParentComponent = createReactClass({
          displayName: "ParentComponent",
          statics: {
            getSnapshotBeforeUpdate: function () {
              return null;
            },
          },
          render() {
            return <div />;
          },
        });
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const UnstableNestedVariableComponent = () => {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedVariableComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const UnstableNestedVariableComponent = () => {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedVariableComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        const ParentComponent = () => {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        const ParentComponent = () => {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        export default () => {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        export default () => {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        };
      `, filename: "test.jsx" },
  { code: `
        const ParentComponent = () => {
          const UnstableNestedVariableComponent = () => {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedVariableComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        const ParentComponent = () => {
          const UnstableNestedVariableComponent = () => {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedVariableComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          class UnstableNestedClassComponent extends React.Component {
            render() {
              return <div />;
            }
          };

          return (
            <div>
              <UnstableNestedClassComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          class UnstableNestedClassComponent extends React.Component {
            render() {
              return React.createElement("div", null);
            }
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedClassComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        class ParentComponent extends React.Component {
          render() {
            class UnstableNestedClassComponent extends React.Component {
              render() {
                return <div />;
              }
            };

            return (
              <div>
                <UnstableNestedClassComponent />
              </div>
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class ParentComponent extends React.Component {
          render() {
            class UnstableNestedClassComponent extends React.Component {
              render() {
                return React.createElement("div", null);
              }
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class ParentComponent extends React.Component {
          render() {
            function UnstableNestedFunctionComponent() {
              return <div />;
            }

            return (
              <div>
                <UnstableNestedFunctionComponent />
              </div>
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class ParentComponent extends React.Component {
          render() {
            function UnstableNestedClassComponent() {
              return React.createElement("div", null);
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class ParentComponent extends React.Component {
          render() {
            const UnstableNestedVariableComponent = () => {
              return <div />;
            }

            return (
              <div>
                <UnstableNestedVariableComponent />
              </div>
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class ParentComponent extends React.Component {
          render() {
            const UnstableNestedClassComponent = () => {
              return React.createElement("div", null);
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          function getComponent() {
            function NestedUnstableFunctionComponent() {
              return <div />;
            };

            return <NestedUnstableFunctionComponent />;
          }

          return (
            <div>
              {getComponent()}
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          function getComponent() {
            function NestedUnstableFunctionComponent() {
              return React.createElement("div", null);
            }

            return React.createElement(NestedUnstableFunctionComponent, null);
          }

          return React.createElement("div", null, getComponent());
        }
      `, filename: "test.jsx" },
  { code: `
        function ComponentWithProps(props) {
          return <div />;
        }

        function ParentComponent() {
          return (
            <ComponentWithProps
              footer={
                function SomeFooter() {
                  return <div />;
                }
              } />
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ComponentWithProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentWithProps, {
            footer: function SomeFooter() {
              return React.createElement("div", null);
            }
          });
        }
      `, filename: "test.jsx" },
  { code: `
        function ComponentWithProps(props) {
          return <div />;
        }

        function ParentComponent() {
            return (
              <ComponentWithProps footer={() => <div />} />
            );
        }
      `, filename: "test.jsx" },
  { code: `
        function ComponentWithProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentWithProps, {
            footer: () => React.createElement("div", null)
          });
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
            return (
              <RenderPropComponent>
                {() => {
                  function UnstableNestedComponent() {
                    return <div />;
                  }

                  return (
                    <div>
                      <UnstableNestedComponent />
                    </div>
                  );
                }}
              </RenderPropComponent>
            );
        }
      `, filename: "test.jsx" },
  { code: `
        function RenderPropComponent(props) {
          return props.render({});
        }

        function ParentComponent() {
          return React.createElement(
            RenderPropComponent,
            null,
            () => {
              function UnstableNestedComponent() {
                return React.createElement("div", null);
              }

              return React.createElement(
                "div",
                null,
                React.createElement(UnstableNestedComponent, null)
              );
            }
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ComponentForProps(props) {
          return <div />;
        }

        function ParentComponent() {
          return (
            <ComponentForProps notPrefixedWithRender={() => <div />} />
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ComponentForProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentForProps, {
            notPrefixedWithRender: () => React.createElement("div", null)
          });
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          return (
            <ComponentForProps someMap={{ Header: () => <div /> }} />
          );
        }
      `, filename: "test.jsx" },
  { code: `
        class ParentComponent extends React.Component {
          render() {
            const List = (props) => {
              const items = props.items
                .map((item) => (
                  <li key={item.key}>
                    <span>{item.name}</span>
                  </li>
                ));

              return <ul>{items}</ul>;
            };

            return <List {...this.props} />;
          }
        }
      `, filename: "test.jsx" },
  { code: `
      function ParentComponent() {
        return (
          <SomeComponent>
            {
              thing.match({
                loading: () => <div />,
                success: () => <div />,
                failure: () => <div />,
              })
            }
          </SomeComponent>
        )
      }
      `, filename: "test.jsx" },
  { code: `
      function ParentComponent() {
        const thingElement = thing.match({
          loading: () => <div />,
          success: () => <div />,
          failure: () => <div />,
        });
        return (
          <SomeComponent>
            {thingElement}
          </SomeComponent>
        )
      }
      `, filename: "test.jsx" },
  { code: `
      function ParentComponent() {
        const rows = [
          {
            name: 'A',
            notPrefixedWithRender: (props) => <Row {...props} />
          },
        ];

        return <Table rows={rows} />;
      }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const UnstableNestedComponent = React.memo(() => {
            return <div />;
          });

          return (
            <div>
              <UnstableNestedComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const UnstableNestedComponent = React.memo(
            () => React.createElement("div", null),
          );

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedComponent, null)
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const UnstableNestedComponent = React.memo(
            function () {
              return <div />;
            }
          );

          return (
            <div>
              <UnstableNestedComponent />
            </div>
          );
        }
      `, filename: "test.jsx" },
  { code: `
        function ParentComponent() {
          const UnstableNestedComponent = React.memo(
            function () {
              return React.createElement("div", null);
            }
          );

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedComponent, null)
          );
        }
      `, filename: "test.jsx" },
];

describe("no-unstable-nested-components", () => {
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
    it("valid[0]: function ParentComponent() { return ( <div> <OutsideDefin...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return (
            <div>
              <OutsideDefinedFunctionComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 0)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return (\n            <div>\n              <OutsideDefinedFunctionComponent />\n            </div>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: function ParentComponent() { return React.createElement( ...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return React.createElement(
            "div",
            null,
            React.createElement(OutsideDefinedFunctionComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 1)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(OutsideDefinedFunctionComponent, null)\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: function ParentComponent() { return ( <SomeComponent foot...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return (
            <SomeComponent
              footer={<OutsideDefinedComponent />}
              header={<div />}
              />
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 2)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return (\n            <SomeComponent\n              footer={<OutsideDefinedComponent />}\n              header={<div />}\n              />\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: function ParentComponent() { return React.createElement(S...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return React.createElement(SomeComponent, {
            footer: React.createElement(OutsideDefinedComponent, null),
            header: React.createElement("div", null)
          });
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 3)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return React.createElement(SomeComponent, {\n            footer: React.createElement(OutsideDefinedComponent, null),\n            header: React.createElement(\"div\", null)\n          });\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: function ParentComponent() { const MemoizedNestedComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const MemoizedNestedComponent = React.useCallback(() => <div />, []);

          return (
            <div>
              <MemoizedNestedComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 4)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const MemoizedNestedComponent = React.useCallback(() => <div />, []);\n\n          return (\n            <div>\n              <MemoizedNestedComponent />\n            </div>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: function ParentComponent() { const MemoizedNestedComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const MemoizedNestedComponent = React.useCallback(
            () => React.createElement("div", null),
            []
          );

          return React.createElement(
            "div",
            null,
            React.createElement(MemoizedNestedComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 5)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const MemoizedNestedComponent = React.useCallback(\n            () => React.createElement(\"div\", null),\n            []\n          );\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(MemoizedNestedComponent, null)\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: function ParentComponent() { const MemoizedNestedFunction...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const MemoizedNestedFunctionComponent = React.useCallback(
            function () {
              return <div />;
            },
            []
          );

          return (
            <div>
              <MemoizedNestedFunctionComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 6)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const MemoizedNestedFunctionComponent = React.useCallback(\n            function () {\n              return <div />;\n            },\n            []\n          );\n\n          return (\n            <div>\n              <MemoizedNestedFunctionComponent />\n            </div>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: function ParentComponent() { const MemoizedNestedFunction...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const MemoizedNestedFunctionComponent = React.useCallback(
            function () {
              return React.createElement("div", null);
            },
            []
          );

          return React.createElement(
            "div",
            null,
            React.createElement(MemoizedNestedFunctionComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 7)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const MemoizedNestedFunctionComponent = React.useCallback(\n            function () {\n              return React.createElement(\"div\", null);\n            },\n            []\n          );\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(MemoizedNestedFunctionComponent, null)\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: function ParentComponent(props) { // Should not interfere...", ({ task }) => {
      const code = `
        function ParentComponent(props) {
          // Should not interfere handler declarations
          function onClick(event) {
            props.onClick(event.target.value);
          }

          const onKeyPress = () => null;

          function getOnHover() {
            return function onHover(event) {
              props.onHover(event.target);
            }
          }

          return (
            <div>
              <button
                onClick={onClick}
                onKeyPress={onKeyPress}
                onHover={getOnHover()}

                // These should not be considered as components
                maybeComponentOrHandlerNull={() => null}
                maybeComponentOrHandlerUndefined={() => undefined}
                maybeComponentOrHandlerBlank={() => ''}
                maybeComponentOrHandlerString={() => 'hello-world'}
                maybeComponentOrHandlerNumber={() => 42}
                maybeComponentOrHandlerArray={() => []}
                maybeComponentOrHandlerObject={() => {}} />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 8)\n\n--- Source code under test ---\n\n        function ParentComponent(props) {\n          // Should not interfere handler declarations\n          function onClick(event) {\n            props.onClick(event.target.value);\n          }\n\n          const onKeyPress = () => null;\n\n          function getOnHover() {\n            return function onHover(event) {\n              props.onHover(event.target);\n            }\n          }\n\n          return (\n            <div>\n              <button\n                onClick={onClick}\n                onKeyPress={onKeyPress}\n                onHover={getOnHover()}\n\n                // These should not be considered as components\n                maybeComponentOrHandlerNull={() => null}\n                maybeComponentOrHandlerUndefined={() => undefined}\n                maybeComponentOrHandlerBlank={() => ''}\n                maybeComponentOrHandlerString={() => 'hello-world'}\n                maybeComponentOrHandlerNumber={() => 42}\n                maybeComponentOrHandlerArray={() => []}\n                maybeComponentOrHandlerObject={() => {}} />\n            </div>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: function ParentComponent() { function getComponent() { re...", ({ task }) => {
      const code = `
        function ParentComponent() {
          function getComponent() {
            return <div />;
          }

          return (
            <div>
              {getComponent()}
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 9)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          function getComponent() {\n            return <div />;\n          }\n\n          return (\n            <div>\n              {getComponent()}\n            </div>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: function ParentComponent() { function getComponent() { re...", ({ task }) => {
      const code = `
        function ParentComponent() {
          function getComponent() {
            return React.createElement("div", null);
          }

          return React.createElement("div", null, getComponent());
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 10)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          function getComponent() {\n            return React.createElement(\"div\", null);\n          }\n\n          return React.createElement(\"div\", null, getComponent());\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: function ParentComponent() { return ( <RenderPropComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
            return (
              <RenderPropComponent>
                {() => <div />}
              </RenderPropComponent>
            );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 11)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n            return (\n              <RenderPropComponent>\n                {() => <div />}\n              </RenderPropComponent>\n            );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: function ParentComponent() { return ( <RenderPropComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
            return (
              <RenderPropComponent children={() => <div />} />
            );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 12)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n            return (\n              <RenderPropComponent children={() => <div />} />\n            );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: function ParentComponent() { return ( <ComplexRenderPropC...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return (
            <ComplexRenderPropComponent
              listRenderer={data.map((items, index) => (
                <ul>
                  {items[index].map((item) =>
                    <li>
                      {item}
                    </li>
                  )}
                </ul>
              ))
              }
            />
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 13)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return (\n            <ComplexRenderPropComponent\n              listRenderer={data.map((items, index) => (\n                <ul>\n                  {items[index].map((item) =>\n                    <li>\n                      {item}\n                    </li>\n                  )}\n                </ul>\n              ))\n              }\n            />\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: function ParentComponent() { return React.createElement( ...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return React.createElement(
              RenderPropComponent,
              null,
              () => React.createElement("div", null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 14)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return React.createElement(\n              RenderPropComponent,\n              null,\n              () => React.createElement(\"div\", null)\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: function ParentComponent(props) { return ( <ul> {props.it...", ({ task }) => {
      const code = `
        function ParentComponent(props) {
          return (
            <ul>
              {props.items.map(item => (
                <li key={item.id}>
                  {item.name}
                </li>
              ))}
            </ul>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 15)\n\n--- Source code under test ---\n\n        function ParentComponent(props) {\n          return (\n            <ul>\n              {props.items.map(item => (\n                <li key={item.id}>\n                  {item.name}\n                </li>\n              ))}\n            </ul>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: function ParentComponent(props) { return ( <List items={p...", ({ task }) => {
      const code = `
        function ParentComponent(props) {
          return (
            <List items={props.items.map(item => {
              return (
                <li key={item.id}>
                  {item.name}
                </li>
              );
            })}
            />
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 16)\n\n--- Source code under test ---\n\n        function ParentComponent(props) {\n          return (\n            <List items={props.items.map(item => {\n              return (\n                <li key={item.id}>\n                  {item.name}\n                </li>\n              );\n            })}\n            />\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: function ParentComponent(props) { return React.createElem...", ({ task }) => {
      const code = `
        function ParentComponent(props) {
          return React.createElement(
            "ul",
            null,
            props.items.map(() =>
              React.createElement(
                "li",
                { key: item.id },
                item.name
              )
            )
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 17)\n\n--- Source code under test ---\n\n        function ParentComponent(props) {\n          return React.createElement(\n            \"ul\",\n            null,\n            props.items.map(() =>\n              React.createElement(\n                \"li\",\n                { key: item.id },\n                item.name\n              )\n            )\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: function ParentComponent(props) { return ( <ul> {props.it...", ({ task }) => {
      const code = `
        function ParentComponent(props) {
          return (
            <ul>
              {props.items.map(function Item(item) {
                return (
                  <li key={item.id}>
                    {item.name}
                  </li>
                );
              })}
            </ul>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 18)\n\n--- Source code under test ---\n\n        function ParentComponent(props) {\n          return (\n            <ul>\n              {props.items.map(function Item(item) {\n                return (\n                  <li key={item.id}>\n                    {item.name}\n                  </li>\n                );\n              })}\n            </ul>\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: function ParentComponent(props) { return React.createElem...", ({ task }) => {
      const code = `
        function ParentComponent(props) {
          return React.createElement(
            "ul",
            null,
            props.items.map(function Item() {
              return React.createElement(
                "li",
                { key: item.id },
                item.name
              );
            })
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 19)\n\n--- Source code under test ---\n\n        function ParentComponent(props) {\n          return React.createElement(\n            \"ul\",\n            null,\n            props.items.map(function Item() {\n              return React.createElement(\n                \"li\",\n                { key: item.id },\n                item.name\n              );\n            })\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: function createTestComponent(props) { return ( <div /> ); }", ({ task }) => {
      const code = `
        function createTestComponent(props) {
          return (
            <div />
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 20)\n\n--- Source code under test ---\n\n        function createTestComponent(props) {\n          return (\n            <div />\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: function createTestComponent(props) { return React.create...", ({ task }) => {
      const code = `
        function createTestComponent(props) {
          return React.createElement("div", null);
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 21)\n\n--- Source code under test ---\n\n        function createTestComponent(props) {\n          return React.createElement(\"div\", null);\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: function ParentComponent() { return ( <SomeComponent> { t...", ({ task }) => {
      const code = `
      function ParentComponent() {
        return (
          <SomeComponent>
            {
              thing.match({
                renderLoading: () => <div />,
                renderSuccess: () => <div />,
                renderFailure: () => <div />,
              })
            }
          </SomeComponent>
        )
      }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 25)\n\n--- Source code under test ---\n\n      function ParentComponent() {\n        return (\n          <SomeComponent>\n            {\n              thing.match({\n                renderLoading: () => <div />,\n                renderSuccess: () => <div />,\n                renderFailure: () => <div />,\n              })\n            }\n          </SomeComponent>\n        )\n      }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: function ParentComponent() { const thingElement = thing.m...", ({ task }) => {
      const code = `
      function ParentComponent() {
        const thingElement = thing.match({
          renderLoading: () => <div />,
          renderSuccess: () => <div />,
          renderFailure: () => <div />,
        });
        return (
          <SomeComponent>
            {thingElement}
          </SomeComponent>
        )
      }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 26)\n\n--- Source code under test ---\n\n      function ParentComponent() {\n        const thingElement = thing.match({\n          renderLoading: () => <div />,\n          renderSuccess: () => <div />,\n          renderFailure: () => <div />,\n        });\n        return (\n          <SomeComponent>\n            {thingElement}\n          </SomeComponent>\n        )\n      }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: function ParentComponent() { return ( <ComponentForProps ...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return (
            <ComponentForProps renderFooter={() => <div />} />
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 29)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return (\n            <ComponentForProps renderFooter={() => <div />} />\n          );\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: function ParentComponent() { return React.createElement(C...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return React.createElement(ComponentForProps, {
            renderFooter: () => React.createElement("div", null)
          });
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 30)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return React.createElement(ComponentForProps, {\n            renderFooter: () => React.createElement(\"div\", null)\n          });\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: function ParentComponent() { useEffect(() => { return () ...", ({ task }) => {
      const code = `
        function ParentComponent() {
          useEffect(() => {
            return () => null;
          });

          return <div />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 31)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          useEffect(() => {\n            return () => null;\n          });\n\n          return <div />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: function ParentComponent() { return ( <SomeComponent rend...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return (
            <SomeComponent renderers={{ Header: () => <div /> }} />
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 32)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return (\n            <SomeComponent renderers={{ Header: () => <div /> }} />\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: function ParentComponent() { return ( <SomeComponent rend...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return (
            <SomeComponent renderMenu={() => (
              <RenderPropComponent>
                {items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </RenderPropComponent>
            )} />
          )
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 33)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return (\n            <SomeComponent renderMenu={() => (\n              <RenderPropComponent>\n                {items.map(item => (\n                  <li key={item}>{item}</li>\n                ))}\n              </RenderPropComponent>\n            )} />\n          )\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: const ParentComponent = () => ( <SomeComponent components...", ({ task }) => {
      const code = `
        const ParentComponent = () => (
          <SomeComponent
            components={[
              <ul>
                {list.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>,
            ]}
          />
        );
     `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 34)\n\n--- Source code under test ---\n\n        const ParentComponent = () => (\n          <SomeComponent\n            components={[\n              <ul>\n                {list.map(item => (\n                  <li key={item}>{item}</li>\n                ))}\n              </ul>,\n            ]}\n          />\n        );\n     \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: function ParentComponent() { const rows = [ { name: 'A', ...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const rows = [
            {
              name: 'A',
              render: (props) => <Row {...props} />
            },
          ];

          return <Table rows={rows} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 35)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const rows = [\n            {\n              name: 'A',\n              render: (props) => <Row {...props} />\n            },\n          ];\n\n          return <Table rows={rows} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: function ParentComponent() { return <SomeComponent render...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return <SomeComponent renderers={{ notComponent: () => null }} />;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 36)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return <SomeComponent renderers={{ notComponent: () => null }} />;\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[37]: const ParentComponent = createReactClass({ displayName: \"...", ({ task }) => {
      const code = `
        const ParentComponent = createReactClass({
          displayName: "ParentComponent",
          statics: {
            getSnapshotBeforeUpdate: function () {
              return null;
            },
          },
          render() {
            return <div />;
          },
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: valid (index 37)\n\n--- Source code under test ---\n\n        const ParentComponent = createReactClass({\n          displayName: \"ParentComponent\",\n          statics: {\n            getSnapshotBeforeUpdate: function () {\n              return null;\n            },\n          },\n          render() {\n            return <div />;\n          },\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: function ParentComponent() { function UnstableNestedFunct...", ({ task }) => {
      const code = `
        function ParentComponent() {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          function UnstableNestedFunctionComponent() {\n            return <div />;\n          }\n\n          return (\n            <div>\n              <UnstableNestedFunctionComponent />\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[1]: function ParentComponent() { function UnstableNestedFunct...", ({ task }) => {
      const code = `
        function ParentComponent() {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          function UnstableNestedFunctionComponent() {\n            return React.createElement(\"div\", null);\n          }\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(UnstableNestedFunctionComponent, null)\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[2]: function ParentComponent() { const UnstableNestedVariable...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const UnstableNestedVariableComponent = () => {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedVariableComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const UnstableNestedVariableComponent = () => {\n            return <div />;\n          }\n\n          return (\n            <div>\n              <UnstableNestedVariableComponent />\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[3]: function ParentComponent() { const UnstableNestedVariable...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const UnstableNestedVariableComponent = () => {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedVariableComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const UnstableNestedVariableComponent = () => {\n            return React.createElement(\"div\", null);\n          }\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(UnstableNestedVariableComponent, null)\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[4]: const ParentComponent = () => { function UnstableNestedFu...", ({ task }) => {
      const code = `
        const ParentComponent = () => {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        const ParentComponent = () => {\n          function UnstableNestedFunctionComponent() {\n            return <div />;\n          }\n\n          return (\n            <div>\n              <UnstableNestedFunctionComponent />\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[5]: const ParentComponent = () => { function UnstableNestedFu...", ({ task }) => {
      const code = `
        const ParentComponent = () => {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        const ParentComponent = () => {\n          function UnstableNestedFunctionComponent() {\n            return React.createElement(\"div\", null);\n          }\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(UnstableNestedFunctionComponent, null)\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[6]: export default () => { function UnstableNestedFunctionCom...", ({ task }) => {
      const code = `
        export default () => {
          function UnstableNestedFunctionComponent() {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedFunctionComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        export default () => {\n          function UnstableNestedFunctionComponent() {\n            return <div />;\n          }\n\n          return (\n            <div>\n              <UnstableNestedFunctionComponent />\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component and pass data as props.";
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component and pass data as props.");
    });

    it("invalid[7]: export default () => { function UnstableNestedFunctionCom...", ({ task }) => {
      const code = `
        export default () => {
          function UnstableNestedFunctionComponent() {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedFunctionComponent, null)
          );
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        export default () => {\n          function UnstableNestedFunctionComponent() {\n            return React.createElement(\"div\", null);\n          }\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(UnstableNestedFunctionComponent, null)\n          );\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component and pass data as props.";
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component and pass data as props.");
    });

    it("invalid[8]: const ParentComponent = () => { const UnstableNestedVaria...", ({ task }) => {
      const code = `
        const ParentComponent = () => {
          const UnstableNestedVariableComponent = () => {
            return <div />;
          }

          return (
            <div>
              <UnstableNestedVariableComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        const ParentComponent = () => {\n          const UnstableNestedVariableComponent = () => {\n            return <div />;\n          }\n\n          return (\n            <div>\n              <UnstableNestedVariableComponent />\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[9]: const ParentComponent = () => { const UnstableNestedVaria...", ({ task }) => {
      const code = `
        const ParentComponent = () => {
          const UnstableNestedVariableComponent = () => {
            return React.createElement("div", null);
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedVariableComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        const ParentComponent = () => {\n          const UnstableNestedVariableComponent = () => {\n            return React.createElement(\"div\", null);\n          }\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(UnstableNestedVariableComponent, null)\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[10]: function ParentComponent() { class UnstableNestedClassCom...", ({ task }) => {
      const code = `
        function ParentComponent() {
          class UnstableNestedClassComponent extends React.Component {
            render() {
              return <div />;
            }
          };

          return (
            <div>
              <UnstableNestedClassComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          class UnstableNestedClassComponent extends React.Component {\n            render() {\n              return <div />;\n            }\n          };\n\n          return (\n            <div>\n              <UnstableNestedClassComponent />\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[11]: function ParentComponent() { class UnstableNestedClassCom...", ({ task }) => {
      const code = `
        function ParentComponent() {
          class UnstableNestedClassComponent extends React.Component {
            render() {
              return React.createElement("div", null);
            }
          }

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedClassComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          class UnstableNestedClassComponent extends React.Component {\n            render() {\n              return React.createElement(\"div\", null);\n            }\n          }\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(UnstableNestedClassComponent, null)\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[12]: class ParentComponent extends React.Component { render() ...", ({ task }) => {
      const code = `
        class ParentComponent extends React.Component {
          render() {
            class UnstableNestedClassComponent extends React.Component {
              render() {
                return <div />;
              }
            };

            return (
              <div>
                <UnstableNestedClassComponent />
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        class ParentComponent extends React.Component {\n          render() {\n            class UnstableNestedClassComponent extends React.Component {\n              render() {\n                return <div />;\n              }\n            };\n\n            return (\n              <div>\n                <UnstableNestedClassComponent />\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[13]: class ParentComponent extends React.Component { render() ...", ({ task }) => {
      const code = `
        class ParentComponent extends React.Component {
          render() {
            class UnstableNestedClassComponent extends React.Component {
              render() {
                return React.createElement("div", null);
              }
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        class ParentComponent extends React.Component {\n          render() {\n            class UnstableNestedClassComponent extends React.Component {\n              render() {\n                return React.createElement(\"div\", null);\n              }\n            }\n\n            return React.createElement(\n              \"div\",\n              null,\n              React.createElement(UnstableNestedClassComponent, null)\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[14]: class ParentComponent extends React.Component { render() ...", ({ task }) => {
      const code = `
        class ParentComponent extends React.Component {
          render() {
            function UnstableNestedFunctionComponent() {
              return <div />;
            }

            return (
              <div>
                <UnstableNestedFunctionComponent />
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        class ParentComponent extends React.Component {\n          render() {\n            function UnstableNestedFunctionComponent() {\n              return <div />;\n            }\n\n            return (\n              <div>\n                <UnstableNestedFunctionComponent />\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[15]: class ParentComponent extends React.Component { render() ...", ({ task }) => {
      const code = `
        class ParentComponent extends React.Component {
          render() {
            function UnstableNestedClassComponent() {
              return React.createElement("div", null);
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        class ParentComponent extends React.Component {\n          render() {\n            function UnstableNestedClassComponent() {\n              return React.createElement(\"div\", null);\n            }\n\n            return React.createElement(\n              \"div\",\n              null,\n              React.createElement(UnstableNestedClassComponent, null)\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[16]: class ParentComponent extends React.Component { render() ...", ({ task }) => {
      const code = `
        class ParentComponent extends React.Component {
          render() {
            const UnstableNestedVariableComponent = () => {
              return <div />;
            }

            return (
              <div>
                <UnstableNestedVariableComponent />
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        class ParentComponent extends React.Component {\n          render() {\n            const UnstableNestedVariableComponent = () => {\n              return <div />;\n            }\n\n            return (\n              <div>\n                <UnstableNestedVariableComponent />\n              </div>\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[17]: class ParentComponent extends React.Component { render() ...", ({ task }) => {
      const code = `
        class ParentComponent extends React.Component {
          render() {
            const UnstableNestedClassComponent = () => {
              return React.createElement("div", null);
            }

            return React.createElement(
              "div",
              null,
              React.createElement(UnstableNestedClassComponent, null)
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 17)\n\n--- Source code under test ---\n\n        class ParentComponent extends React.Component {\n          render() {\n            const UnstableNestedClassComponent = () => {\n              return React.createElement(\"div\", null);\n            }\n\n            return React.createElement(\n              \"div\",\n              null,\n              React.createElement(UnstableNestedClassComponent, null)\n            );\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[18]: function ParentComponent() { function getComponent() { fu...", ({ task }) => {
      const code = `
        function ParentComponent() {
          function getComponent() {
            function NestedUnstableFunctionComponent() {
              return <div />;
            };

            return <NestedUnstableFunctionComponent />;
          }

          return (
            <div>
              {getComponent()}
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          function getComponent() {\n            function NestedUnstableFunctionComponent() {\n              return <div />;\n            };\n\n            return <NestedUnstableFunctionComponent />;\n          }\n\n          return (\n            <div>\n              {getComponent()}\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[19]: function ParentComponent() { function getComponent() { fu...", ({ task }) => {
      const code = `
        function ParentComponent() {
          function getComponent() {
            function NestedUnstableFunctionComponent() {
              return React.createElement("div", null);
            }

            return React.createElement(NestedUnstableFunctionComponent, null);
          }

          return React.createElement("div", null, getComponent());
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 19)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          function getComponent() {\n            function NestedUnstableFunctionComponent() {\n              return React.createElement(\"div\", null);\n            }\n\n            return React.createElement(NestedUnstableFunctionComponent, null);\n          }\n\n          return React.createElement(\"div\", null, getComponent());\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[52], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[20]: function ComponentWithProps(props) { return <div />; } fu...", ({ task }) => {
      const code = `
        function ComponentWithProps(props) {
          return <div />;
        }

        function ParentComponent() {
          return (
            <ComponentWithProps
              footer={
                function SomeFooter() {
                  return <div />;
                }
              } />
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 20)\n\n--- Source code under test ---\n\n        function ComponentWithProps(props) {\n          return <div />;\n        }\n\n        function ParentComponent() {\n          return (\n            <ComponentWithProps\n              footer={\n                function SomeFooter() {\n                  return <div />;\n                }\n              } />\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[53], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[21]: function ComponentWithProps(props) { return React.createE...", ({ task }) => {
      const code = `
        function ComponentWithProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentWithProps, {
            footer: function SomeFooter() {
              return React.createElement("div", null);
            }
          });
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 21)\n\n--- Source code under test ---\n\n        function ComponentWithProps(props) {\n          return React.createElement(\"div\", null);\n        }\n\n        function ParentComponent() {\n          return React.createElement(ComponentWithProps, {\n            footer: function SomeFooter() {\n              return React.createElement(\"div\", null);\n            }\n          });\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[54], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[22]: function ComponentWithProps(props) { return <div />; } fu...", ({ task }) => {
      const code = `
        function ComponentWithProps(props) {
          return <div />;
        }

        function ParentComponent() {
            return (
              <ComponentWithProps footer={() => <div />} />
            );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 22)\n\n--- Source code under test ---\n\n        function ComponentWithProps(props) {\n          return <div />;\n        }\n\n        function ParentComponent() {\n            return (\n              <ComponentWithProps footer={() => <div />} />\n            );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[55], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[23]: function ComponentWithProps(props) { return React.createE...", ({ task }) => {
      const code = `
        function ComponentWithProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentWithProps, {
            footer: () => React.createElement("div", null)
          });
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 23)\n\n--- Source code under test ---\n\n        function ComponentWithProps(props) {\n          return React.createElement(\"div\", null);\n        }\n\n        function ParentComponent() {\n          return React.createElement(ComponentWithProps, {\n            footer: () => React.createElement(\"div\", null)\n          });\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[56], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[24]: function ParentComponent() { return ( <RenderPropComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
            return (
              <RenderPropComponent>
                {() => {
                  function UnstableNestedComponent() {
                    return <div />;
                  }

                  return (
                    <div>
                      <UnstableNestedComponent />
                    </div>
                  );
                }}
              </RenderPropComponent>
            );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n            return (\n              <RenderPropComponent>\n                {() => {\n                  function UnstableNestedComponent() {\n                    return <div />;\n                  }\n\n                  return (\n                    <div>\n                      <UnstableNestedComponent />\n                    </div>\n                  );\n                }}\n              </RenderPropComponent>\n            );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[57], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[25]: function RenderPropComponent(props) { return props.render...", ({ task }) => {
      const code = `
        function RenderPropComponent(props) {
          return props.render({});
        }

        function ParentComponent() {
          return React.createElement(
            RenderPropComponent,
            null,
            () => {
              function UnstableNestedComponent() {
                return React.createElement("div", null);
              }

              return React.createElement(
                "div",
                null,
                React.createElement(UnstableNestedComponent, null)
              );
            }
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        function RenderPropComponent(props) {\n          return props.render({});\n        }\n\n        function ParentComponent() {\n          return React.createElement(\n            RenderPropComponent,\n            null,\n            () => {\n              function UnstableNestedComponent() {\n                return React.createElement(\"div\", null);\n              }\n\n              return React.createElement(\n                \"div\",\n                null,\n                React.createElement(UnstableNestedComponent, null)\n              );\n            }\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[58], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[26]: function ComponentForProps(props) { return <div />; } fun...", ({ task }) => {
      const code = `
        function ComponentForProps(props) {
          return <div />;
        }

        function ParentComponent() {
          return (
            <ComponentForProps notPrefixedWithRender={() => <div />} />
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        function ComponentForProps(props) {\n          return <div />;\n        }\n\n        function ParentComponent() {\n          return (\n            <ComponentForProps notPrefixedWithRender={() => <div />} />\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[59], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[27]: function ComponentForProps(props) { return React.createEl...", ({ task }) => {
      const code = `
        function ComponentForProps(props) {
          return React.createElement("div", null);
        }

        function ParentComponent() {
          return React.createElement(ComponentForProps, {
            notPrefixedWithRender: () => React.createElement("div", null)
          });
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 27)\n\n--- Source code under test ---\n\n        function ComponentForProps(props) {\n          return React.createElement(\"div\", null);\n        }\n\n        function ParentComponent() {\n          return React.createElement(ComponentForProps, {\n            notPrefixedWithRender: () => React.createElement(\"div\", null)\n          });\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[60], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[28]: function ParentComponent() { return ( <ComponentForProps ...", ({ task }) => {
      const code = `
        function ParentComponent() {
          return (
            <ComponentForProps someMap={{ Header: () => <div /> }} />
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 28)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          return (\n            <ComponentForProps someMap={{ Header: () => <div /> }} />\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[61], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[29]: class ParentComponent extends React.Component { render() ...", ({ task }) => {
      const code = `
        class ParentComponent extends React.Component {
          render() {
            const List = (props) => {
              const items = props.items
                .map((item) => (
                  <li key={item.key}>
                    <span>{item.name}</span>
                  </li>
                ));

              return <ul>{items}</ul>;
            };

            return <List {...this.props} />;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 29)\n\n--- Source code under test ---\n\n        class ParentComponent extends React.Component {\n          render() {\n            const List = (props) => {\n              const items = props.items\n                .map((item) => (\n                  <li key={item.key}>\n                    <span>{item.name}</span>\n                  </li>\n                ));\n\n              return <ul>{items}</ul>;\n            };\n\n            return <List {...this.props} />;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[62], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[30]: function ParentComponent() { return ( <SomeComponent> { t...", ({ task }) => {
      const code = `
      function ParentComponent() {
        return (
          <SomeComponent>
            {
              thing.match({
                loading: () => <div />,
                success: () => <div />,
                failure: () => <div />,
              })
            }
          </SomeComponent>
        )
      }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 30)\n\n--- Source code under test ---\n\n      function ParentComponent() {\n        return (\n          <SomeComponent>\n            {\n              thing.match({\n                loading: () => <div />,\n                success: () => <div />,\n                failure: () => <div />,\n              })\n            }\n          </SomeComponent>\n        )\n      }\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.\n  [1]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.\n  [2]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[63], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
      expect(matches[1].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
      expect(matches[2].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[31]: function ParentComponent() { const thingElement = thing.m...", ({ task }) => {
      const code = `
      function ParentComponent() {
        const thingElement = thing.match({
          loading: () => <div />,
          success: () => <div />,
          failure: () => <div />,
        });
        return (
          <SomeComponent>
            {thingElement}
          </SomeComponent>
        )
      }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 31)\n\n--- Source code under test ---\n\n      function ParentComponent() {\n        const thingElement = thing.match({\n          loading: () => <div />,\n          success: () => <div />,\n          failure: () => <div />,\n        });\n        return (\n          <SomeComponent>\n            {thingElement}\n          </SomeComponent>\n        )\n      }\n      \n\nThis code is INVALID — the rule should produce 3 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.\n  [1]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.\n  [2]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[64], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(3);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
      expect(matches[1].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
      expect(matches[2].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[32]: function ParentComponent() { const rows = [ { name: 'A', ...", ({ task }) => {
      const code = `
      function ParentComponent() {
        const rows = [
          {
            name: 'A',
            notPrefixedWithRender: (props) => <Row {...props} />
          },
        ];

        return <Table rows={rows} />;
      }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 32)\n\n--- Source code under test ---\n\n      function ParentComponent() {\n        const rows = [\n          {\n            name: 'A',\n            notPrefixedWithRender: (props) => <Row {...props} />\n          },\n        ];\n\n        return <Table rows={rows} />;\n      }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.";
      const matches = ruleErrors(results[65], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props. If you want to allow component creation in props, set allowAsProps option to true.");
    });

    it("invalid[33]: function ParentComponent() { const UnstableNestedComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const UnstableNestedComponent = React.memo(() => {
            return <div />;
          });

          return (
            <div>
              <UnstableNestedComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 33)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const UnstableNestedComponent = React.memo(() => {\n            return <div />;\n          });\n\n          return (\n            <div>\n              <UnstableNestedComponent />\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[66], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[34]: function ParentComponent() { const UnstableNestedComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const UnstableNestedComponent = React.memo(
            () => React.createElement("div", null),
          );

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 34)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const UnstableNestedComponent = React.memo(\n            () => React.createElement(\"div\", null),\n          );\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(UnstableNestedComponent, null)\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[67], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[35]: function ParentComponent() { const UnstableNestedComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const UnstableNestedComponent = React.memo(
            function () {
              return <div />;
            }
          );

          return (
            <div>
              <UnstableNestedComponent />
            </div>
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 35)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const UnstableNestedComponent = React.memo(\n            function () {\n              return <div />;\n            }\n          );\n\n          return (\n            <div>\n              <UnstableNestedComponent />\n            </div>\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[68], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

    it("invalid[36]: function ParentComponent() { const UnstableNestedComponen...", ({ task }) => {
      const code = `
        function ParentComponent() {
          const UnstableNestedComponent = React.memo(
            function () {
              return React.createElement("div", null);
            }
          );

          return React.createElement(
            "div",
            null,
            React.createElement(UnstableNestedComponent, null)
          );
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-unstable-nested-components\nType: invalid (index 36)\n\n--- Source code under test ---\n\n        function ParentComponent() {\n          const UnstableNestedComponent = React.memo(\n            function () {\n              return React.createElement(\"div\", null);\n            }\n          );\n\n          return React.createElement(\n            \"div\",\n            null,\n            React.createElement(UnstableNestedComponent, null)\n          );\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0]: Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.";
      const matches = ruleErrors(results[69], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://reactjs.org/docs/reconciliation.html#elements-of-different-types). Instead, move this component definition out of the parent component “ParentComponent” and pass data as props.");
    });

  });
});
