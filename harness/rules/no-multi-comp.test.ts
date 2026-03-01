import { describe, it, expect } from "vitest";
import { lint, ruleErrors } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_MESSAGES = [
  "Declare only one React component per file",
];

describe("no-multi-comp", () => {
  describe("valid", () => {
    it("valid[0]: var Hello = require('./components/Hello'); var HelloJohn ...", async ({ task }) => {
      const code = `
        var Hello = require('./components/Hello');
        var HelloJohn = createReactClass({
          render: function() {
            return <Hello name="John" />;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: valid (index 0)\n\n--- Source code under test ---\n\n        var Hello = require('./components/Hello');\n        var HelloJohn = createReactClass({\n          render: function() {\n            return <Hello name=\"John\" />;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: class Hello extends React.Component { render() { return <...", async ({ task }) => {
      const code = `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: valid (index 1)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: var Heading = createReactClass({ render: function() { ret...", async ({ task }) => {
      const code = `
        var Heading = createReactClass({
          render: function() {
            return (
              <div>
                {this.props.buttons.map(function(button, index) {
                  return <Button {...button} key={index}/>;
                })}
              </div>
            );
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: valid (index 2)\n\n--- Source code under test ---\n\n        var Heading = createReactClass({\n          render: function() {\n            return (\n              <div>\n                {this.props.buttons.map(function(button, index) {\n                  return <Button {...button} key={index}/>;\n                })}\n              </div>\n            );\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: import React, { createElement } from \"react\" const helper...", async ({ task }) => {
      const code = `
        import React, { createElement } from "react"
        const helperFoo = () => {
          return true;
        };
        function helperBar() {
          return false;
        };
        function RealComponent() {
          return createElement("img");
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: valid (index 5)\n\n--- Source code under test ---\n\n        import React, { createElement } from \"react\"\n        const helperFoo = () => {\n          return true;\n        };\n        function helperBar() {\n          return false;\n        };\n        function RealComponent() {\n          return createElement(\"img\");\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: import React from 'react'; function memo() { var outOfSco...", async ({ task }) => {
      const code = `
        import React from 'react';
        function memo() {
          var outOfScope = "hello"
          return null;
        }
        class ComponentY extends React.Component {
          memoCities = memo((cities) => cities.map((v) => ({ label: v })));
          render() {
            return (
              <div>
                <div>Counter</div>
              </div>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: valid (index 13)\n\n--- Source code under test ---\n\n        import React from 'react';\n        function memo() {\n          var outOfScope = \"hello\"\n          return null;\n        }\n        class ComponentY extends React.Component {\n          memoCities = memo((cities) => cities.map((v) => ({ label: v })));\n          render() {\n            return (\n              <div>\n                <div>Counter</div>\n              </div>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: const MenuList = forwardRef(({onClose, ...props}, ref) =>...", async ({ task }) => {
      const code = `
        const MenuList = forwardRef(({onClose, ...props}, ref) => {
          const {t} = useTranslation();
          const handleLogout = useLogoutHandler();

          const onLogout = useCallback(() => {
            onClose();
            handleLogout();
          }, [onClose, handleLogout]);

          return (
            <MuiMenuList ref={ref} {...props}>
              <MuiMenuItem key="logout" onClick={onLogout}>
                {t('global-logout')}
              </MuiMenuItem>
            </MuiMenuList>
          );
        });

        MenuList.displayName = 'MenuList';

        MenuList.propTypes = {
          onClose: PropTypes.func,
        };

        MenuList.defaultProps = {
          onClose: () => null,
        };

        export default MenuList;
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: valid (index 14)\n\n--- Source code under test ---\n\n        const MenuList = forwardRef(({onClose, ...props}, ref) => {\n          const {t} = useTranslation();\n          const handleLogout = useLogoutHandler();\n\n          const onLogout = useCallback(() => {\n            onClose();\n            handleLogout();\n          }, [onClose, handleLogout]);\n\n          return (\n            <MuiMenuList ref={ref} {...props}>\n              <MuiMenuItem key=\"logout\" onClick={onLogout}>\n                {t('global-logout')}\n              </MuiMenuItem>\n            </MuiMenuList>\n          );\n        });\n\n        MenuList.displayName = 'MenuList';\n\n        MenuList.propTypes = {\n          onClose: PropTypes.func,\n        };\n\n        MenuList.defaultProps = {\n          onClose: () => null,\n        };\n\n        export default MenuList;\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: const MenuList = forwardRef(({ onClose, ...props }, ref) ...", async ({ task }) => {
      const code = `
        const MenuList = forwardRef(({ onClose, ...props }, ref) => {
          const onLogout = useCallback(() => {
            onClose()
          }, [onClose])

          return (
            <BlnMenuList ref={ref} {...props}>
              <BlnMenuItem key="logout" onClick={onLogout}>
                Logout
              </BlnMenuItem>
            </BlnMenuList>
          )
        })

        MenuList.displayName = 'MenuList'

        MenuList.propTypes = {
          onClose: PropTypes.func
        }

        MenuList.defaultProps = {
          onClose: () => null
        }

        export default MenuList
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: valid (index 15)\n\n--- Source code under test ---\n\n        const MenuList = forwardRef(({ onClose, ...props }, ref) => {\n          const onLogout = useCallback(() => {\n            onClose()\n          }, [onClose])\n\n          return (\n            <BlnMenuList ref={ref} {...props}>\n              <BlnMenuItem key=\"logout\" onClick={onLogout}>\n                Logout\n              </BlnMenuItem>\n            </BlnMenuList>\n          )\n        })\n\n        MenuList.displayName = 'MenuList'\n\n        MenuList.propTypes = {\n          onClose: PropTypes.func\n        }\n\n        MenuList.defaultProps = {\n          onClose: () => null\n        }\n\n        export default MenuList\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: var Hello = createReactClass({ render: function() { retur...", async ({ task }) => {
      const code = `        var Hello = createReactClass({          render: function() {            return <div>Hello {this.props.name}</div>;          }        });        var HelloJohn = createReactClass({          render: function() {            return <Hello name="John" />;          }        });      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: invalid (index 0)\n\n--- Source code under test ---\n\r        var Hello = createReactClass({\r          render: function() {\r            return <div>Hello {this.props.name}</div>;\r          }\r        });\r        var HelloJohn = createReactClass({\r          render: function() {\r            return <Hello name=\"John\" />;\r          }\r        });\r      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneComponent): Declare only one React component per file\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Declare only one React component per file");
    });

    it("invalid[1]: class Hello extends React.Component { render() { return <...", async ({ task }) => {
      const code = `        class Hello extends React.Component {          render() {            return <div>Hello {this.props.name}</div>;          }        }        class HelloJohn extends React.Component {          render() {            return <Hello name="John" />;          }        }        class HelloJohnny extends React.Component {          render() {            return <Hello name="Johnny" />;          }        }      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: invalid (index 1)\n\n--- Source code under test ---\n\r        class Hello extends React.Component {\r          render() {\r            return <div>Hello {this.props.name}</div>;\r          }\r        }\r        class HelloJohn extends React.Component {\r          render() {\r            return <Hello name=\"John\" />;\r          }\r        }\r        class HelloJohnny extends React.Component {\r          render() {\r            return <Hello name=\"Johnny\" />;\r          }\r        }\r      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: onlyOneComponent): Declare only one React component per file\n  [1] (messageId: onlyOneComponent): Declare only one React component per file\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Declare only one React component per file");
      expect(matches[1].message).toBe("Declare only one React component per file");
    });

    it("invalid[2]: function Hello(props) { return <div>Hello {props.name}</d...", async ({ task }) => {
      const code = `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        function HelloAgain(props) {
          return <div>Hello again {props.name}</div>;
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        function Hello(props) {\n          return <div>Hello {props.name}</div>;\n        }\n        function HelloAgain(props) {\n          return <div>Hello again {props.name}</div>;\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneComponent): Declare only one React component per file\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Declare only one React component per file");
    });

    it("invalid[3]: function Hello(props) { return <div>Hello {props.name}</d...", async ({ task }) => {
      const code = `
        function Hello(props) {
          return <div>Hello {props.name}</div>;
        }
        class HelloJohn extends React.Component {
          render() {
            return <Hello name="John" />;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        function Hello(props) {\n          return <div>Hello {props.name}</div>;\n        }\n        class HelloJohn extends React.Component {\n          render() {\n            return <Hello name=\"John\" />;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneComponent): Declare only one React component per file\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Declare only one React component per file");
    });

    it("invalid[4]: export default { RenderHello(props) { let {name} = props;...", async ({ task }) => {
      const code = `
        export default {
          RenderHello(props) {
            let {name} = props;
            return <div>{name}</div>;
          },
          RenderHello2(props) {
            let {name} = props;
            return <div>{name}</div>;
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        export default {\n          RenderHello(props) {\n            let {name} = props;\n            return <div>{name}</div>;\n          },\n          RenderHello2(props) {\n            let {name} = props;\n            return <div>{name}</div>;\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneComponent): Declare only one React component per file\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Declare only one React component per file");
    });

    it("invalid[5]: exports.Foo = function Foo() { return <></> } exports.cre...", async ({ task }) => {
      const code = `
        exports.Foo = function Foo() {
          return <></>
        }

        exports.createSomeComponent = function createSomeComponent(opts) {
          return function Foo() {
            return <>{opts.a}</>
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-multi-comp\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        exports.Foo = function Foo() {\n          return <></>\n        }\n\n        exports.createSomeComponent = function createSomeComponent(opts) {\n          return function Foo() {\n            return <>{opts.a}</>\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: onlyOneComponent): Declare only one React component per file\n\nFeatures: fragment\n\nRule message templates:\n  onlyOneComponent: Declare only one React component per file";
      const diags = await lint(PROJECT_DIR, code, "test.jsx");
      const matches = ruleErrors(diags, "no-multi-comp", RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Declare only one React component per file");
    });

  });
});
