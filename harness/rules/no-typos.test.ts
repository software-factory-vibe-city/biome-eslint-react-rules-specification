import { describe, it, expect, beforeAll } from "vitest";
import { batchLint, ruleErrors, type Diagnostic } from "../utils.ts";

const PROJECT_DIR = process.env["PROJECT_DIR"] ?? process.cwd();

const RULE_NAME = "no-typos";
const VALID_COUNT = 43;

const RULE_MESSAGES = [
  "Typo in prop type chain qualifier: {{name}}",
  "Typo in declared prop type: {{name}}",
  "Typo in static class property declaration",
  "Typo in property declaration",
  "Typo in component lifecycle method declaration: {{actual}} should be {{expected}}",
  "Lifecycle method should be static: {{method}}",
  "`'prop-types'` imported without a local `PropTypes` binding.",
  "`'react'` imported without a local `React` binding.",
  "Typo in component lifecycle method declaration: GetDerivedStateFromProps should be getDerivedStateFromProps",
  "Typo in component lifecycle method declaration: ComponentWillMount should be componentWillMount",
  "Typo in component lifecycle method declaration: UNSAFE_ComponentWillMount should be UNSAFE_componentWillMount",
  "Typo in component lifecycle method declaration: ComponentDidMount should be componentDidMount",
  "Typo in component lifecycle method declaration: ComponentWillReceiveProps should be componentWillReceiveProps",
  "Typo in component lifecycle method declaration: UNSAFE_ComponentWillReceiveProps should be UNSAFE_componentWillReceiveProps",
  "Typo in component lifecycle method declaration: ShouldComponentUpdate should be shouldComponentUpdate",
  "Typo in component lifecycle method declaration: ComponentWillUpdate should be componentWillUpdate",
  "Typo in component lifecycle method declaration: UNSAFE_ComponentWillUpdate should be UNSAFE_componentWillUpdate",
  "Typo in component lifecycle method declaration: GetSnapshotBeforeUpdate should be getSnapshotBeforeUpdate",
  "Typo in component lifecycle method declaration: ComponentDidUpdate should be componentDidUpdate",
  "Typo in component lifecycle method declaration: ComponentDidCatch should be componentDidCatch",
  "Typo in component lifecycle method declaration: ComponentWillUnmount should be componentWillUnmount",
  "Typo in component lifecycle method declaration: Getderivedstatefromprops should be getDerivedStateFromProps",
  "Typo in component lifecycle method declaration: Componentwillmount should be componentWillMount",
  "Typo in component lifecycle method declaration: UNSAFE_Componentwillmount should be UNSAFE_componentWillMount",
  "Typo in component lifecycle method declaration: Componentdidmount should be componentDidMount",
  "Typo in component lifecycle method declaration: Componentwillreceiveprops should be componentWillReceiveProps",
  "Typo in component lifecycle method declaration: UNSAFE_Componentwillreceiveprops should be UNSAFE_componentWillReceiveProps",
  "Typo in component lifecycle method declaration: Shouldcomponentupdate should be shouldComponentUpdate",
  "Typo in component lifecycle method declaration: Componentwillupdate should be componentWillUpdate",
  "Typo in component lifecycle method declaration: UNSAFE_Componentwillupdate should be UNSAFE_componentWillUpdate",
  "Typo in component lifecycle method declaration: Getsnapshotbeforeupdate should be getSnapshotBeforeUpdate",
  "Typo in component lifecycle method declaration: Componentdidupdate should be componentDidUpdate",
  "Typo in component lifecycle method declaration: Componentdidcatch should be componentDidCatch",
  "Typo in component lifecycle method declaration: Componentwillunmount should be componentWillUnmount",
  "Typo in component lifecycle method declaration: Render should be render",
  "Typo in component lifecycle method declaration: getderivedstatefromprops should be getDerivedStateFromProps",
  "Typo in component lifecycle method declaration: componentwillmount should be componentWillMount",
  "Typo in component lifecycle method declaration: unsafe_componentwillmount should be UNSAFE_componentWillMount",
  "Typo in component lifecycle method declaration: componentdidmount should be componentDidMount",
  "Typo in component lifecycle method declaration: componentwillreceiveprops should be componentWillReceiveProps",
  "Typo in component lifecycle method declaration: unsafe_componentwillreceiveprops should be UNSAFE_componentWillReceiveProps",
  "Typo in component lifecycle method declaration: shouldcomponentupdate should be shouldComponentUpdate",
  "Typo in component lifecycle method declaration: componentwillupdate should be componentWillUpdate",
  "Typo in component lifecycle method declaration: unsafe_componentwillupdate should be UNSAFE_componentWillUpdate",
  "Typo in component lifecycle method declaration: getsnapshotbeforeupdate should be getSnapshotBeforeUpdate",
  "Typo in component lifecycle method declaration: componentdidupdate should be componentDidUpdate",
  "Typo in component lifecycle method declaration: componentdidcatch should be componentDidCatch",
  "Typo in component lifecycle method declaration: componentwillunmount should be componentWillUnmount",
  "Typo in declared prop type: Number",
  "Typo in prop type chain qualifier: isrequired",
  "Typo in declared prop type: String",
  "Typo in declared prop type: bools",
  "Typo in declared prop type: Array",
  "Typo in declared prop type: function",
  "Typo in declared prop type: objectof",
  "Typo in component lifecycle method declaration: getdefaultProps should be getDefaultProps",
  "Typo in component lifecycle method declaration: getinitialState should be getInitialState",
  "Typo in component lifecycle method declaration: getChildcontext should be getChildContext",
  "Lifecycle method should be static: getDerivedStateFromProps",
  "Lifecycle method should be static: GetDerivedStateFromProps",
];

const cases = [
  { code: `
          import createReactClass from 'create-react-class'
          function hello (extra = {}) {
            return createReactClass({
              noteType: 'hello',
              renderItem () {
                return null
              },
              ...extra
            })
          }
      `, filename: "test.jsx" },
  { code: `
        class First {
          static PropTypes = {key: "myValue"};
          static ContextTypes = {key: "myValue"};
          static ChildContextTypes = {key: "myValue"};
          static DefaultProps = {key: "myValue"};
        }
      `, filename: "test.jsx" },
  { code: `
        class First {}
        First.PropTypes = {key: "myValue"};
        First.ContextTypes = {key: "myValue"};
        First.ChildContextTypes = {key: "myValue"};
        First.DefaultProps = {key: "myValue"};
      `, filename: "test.jsx" },
  { code: `
        class First extends React.Component {
          static propTypes = {key: "myValue"};
          static contextTypes = {key: "myValue"};
          static childContextTypes = {key: "myValue"};
          static defaultProps = {key: "myValue"};
        }
      `, filename: "test.jsx" },
  { code: `
        class First extends React.Component {}
        First.propTypes = {key: "myValue"};
        First.contextTypes = {key: "myValue"};
        First.childContextTypes = {key: "myValue"};
        First.defaultProps = {key: "myValue"};
      `, filename: "test.jsx" },
  { code: `
        class MyClass {
          propTypes = {key: "myValue"};
          contextTypes = {key: "myValue"};
          childContextTypes = {key: "myValue"};
          defaultProps = {key: "myValue"};
        }
      `, filename: "test.jsx" },
  { code: `
        class MyClass {
          PropTypes = {key: "myValue"};
          ContextTypes = {key: "myValue"};
          ChildContextTypes = {key: "myValue"};
          DefaultProps = {key: "myValue"};
        }
      `, filename: "test.jsx" },
  { code: `
        class MyClass {
          proptypes = {key: "myValue"};
          contexttypes = {key: "myValue"};
          childcontextypes = {key: "myValue"};
          defaultprops = {key: "myValue"};
        }
      `, filename: "test.jsx" },
  { code: `
        class MyClass {
          static PropTypes() {};
          static ContextTypes() {};
          static ChildContextTypes() {};
          static DefaultProps() {};
        }
      `, filename: "test.jsx" },
  { code: `
        class MyClass {
          static proptypes() {};
          static contexttypes() {};
          static childcontexttypes() {};
          static defaultprops() {};
        }
      `, filename: "test.jsx" },
  { code: `
        class MyClass {}
        MyClass.prototype.PropTypes = function() {};
        MyClass.prototype.ContextTypes = function() {};
        MyClass.prototype.ChildContextTypes = function() {};
        MyClass.prototype.DefaultProps = function() {};
      `, filename: "test.jsx" },
  { code: `
        class MyClass {}
        MyClass.PropTypes = function() {};
        MyClass.ContextTypes = function() {};
        MyClass.ChildContextTypes = function() {};
        MyClass.DefaultProps = function() {};
      `, filename: "test.jsx" },
  { code: `
        function MyRandomFunction() {}
        MyRandomFunction.PropTypes = {};
        MyRandomFunction.ContextTypes = {};
        MyRandomFunction.ChildContextTypes = {};
        MyRandomFunction.DefaultProps = {};
      `, filename: "test.jsx" },
  { code: `
        class First extends React.Component {}
        First["prop" + "Types"] = {};
        First["context" + "Types"] = {};
        First["childContext" + "Types"] = {};
        First["default" + "Props"] = {};
      `, filename: "test.jsx" },
  { code: `
        class First extends React.Component {}
        First["PROP" + "TYPES"] = {};
        First["CONTEXT" + "TYPES"] = {};
        First["CHILDCONTEXT" + "TYPES"] = {};
        First["DEFAULT" + "PROPS"] = {};
      `, filename: "test.jsx" },
  { code: `
        const propTypes = "PROPTYPES"
        const contextTypes = "CONTEXTTYPES"
        const childContextTypes = "CHILDCONTEXTTYPES"
        const defaultProps = "DEFAULTPROPS"

        class First extends React.Component {}
        First[propTypes] = {};
        First[contextTypes] = {};
        First[childContextTypes] = {};
        First[defaultProps] = {};
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          static getDerivedStateFromProps() { }
          componentWillMount() { }
          componentDidMount() { }
          componentWillReceiveProps() { }
          shouldComponentUpdate() { }
          componentWillUpdate() { }
          componentDidUpdate() { }
          componentWillUnmount() { }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          "componentDidMount"() { }
          "my-method"() { }
        }
      `, filename: "test.jsx" },
  { code: `
        class MyClass {
          componentWillMount() { }
          componentDidMount() { }
          componentWillReceiveProps() { }
          shouldComponentUpdate() { }
          componentWillUpdate() { }
          componentDidUpdate() { }
          componentWillUnmount() { }
          render() { }
        }
      `, filename: "test.jsx" },
  { code: `
        class MyClass {
          componentwillmount() { }
          componentdidmount() { }
          componentwillreceiveprops() { }
          shouldcomponentupdate() { }
          componentwillupdate() { }
          componentdidupdate() { }
          componentwillUnmount() { }
          render() { }
        }
      `, filename: "test.jsx" },
  { code: `
        class MyClass {
          Componentwillmount() { }
          Componentdidmount() { }
          Componentwillreceiveprops() { }
          Shouldcomponentupdate() { }
          Componentwillupdate() { }
          Componentdidupdate() { }
          ComponentwillUnmount() { }
          Render() { }
        }
      `, filename: "test.jsx" },
  { code: `
        function test(b) {
          return a.bind(b);
        }
        function a() {}
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.number.isRequired
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          e: PropTypes.shape({
            ea: PropTypes.string,
          })
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.string,
          b: PropTypes.string.isRequired,
          c: PropTypes.shape({
            d: PropTypes.string,
            e: PropTypes.number.isRequired,
          }).isRequired
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
          ])
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.oneOf([
            'hello',
            'hi'
          ])
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: PropTypes.string,
          b: PropTypes.string.isRequired,
          c: PropTypes.shape({
            d: PropTypes.string,
            e: PropTypes.number.isRequired,
          }).isRequired
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.contextTypes = {
          a: PropTypes.string,
          b: PropTypes.string.isRequired,
          c: PropTypes.shape({
            d: PropTypes.string,
            e: PropTypes.number.isRequired,
          }).isRequired
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from 'prop-types'
        import * as MyPropTypes from 'lib/my-prop-types'
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.string,
          b: MyPropTypes.MYSTRING,
          c: MyPropTypes.MYSTRING.isRequired,
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types"
        import * as MyPropTypes from 'lib/my-prop-types'
        class Component extends React.Component {};
        Component.propTypes = {
          b: PropTypes.string,
          a: MyPropTypes.MYSTRING,
        }
      `, filename: "test.jsx" },
  { code: `
        import CustomReact from "react"
        class Component extends React.Component {};
        Component.propTypes = {
          b: CustomReact.PropTypes.string,
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.shape(),
        };
        Component.contextTypes = {
          a: PropTypes.shape(),
        };
      `, filename: "test.jsx" },
  { code: `
        const fn = (err, res) => {
          const { body: data = {} } = { ...res };
          data.time = data.time || {};
        };
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {};
        Component.propTypes = {
          b: string.isRequired,
          c: PropTypes.shape({
            d: number.isRequired,
          }).isRequired
        }
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';
        import PropTypes from 'prop-types';
        const Component = React.createReactClass({
          propTypes: {
            a: PropTypes.string.isRequired,
            b: PropTypes.shape({
              c: PropTypes.number
            }).isRequired
          }
        });
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';
        import PropTypes from 'prop-types';
        const Component = React.createReactClass({
          childContextTypes: {
            a: PropTypes.bool,
            b: PropTypes.array,
            c: PropTypes.func,
            d: PropTypes.object,
          }
        });
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';
        const Component = React.createReactClass({
          propTypes: {},
          childContextTypes: {},
          contextTypes: {},
          componentWillMount() { },
          componentDidMount() { },
          componentWillReceiveProps() { },
          shouldComponentUpdate() { },
          componentWillUpdate() { },
          componentDidUpdate() { },
          componentWillUnmount() { },
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        import { string, element } from "prop-types";

        class Sample extends React.Component {
          render() { return null; }
        }

        Sample.propTypes = {
          title: string.isRequired,
          body: element.isRequired
        };
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';

        const A = { B: 'C' };

        export default class MyComponent extends React.Component {
          [A.B] () {
            return null
          }
        }
      `, filename: "test.jsx" },
  { code: `
        const MyComponent = React.forwardRef((props, ref) => <div />);
        MyComponent.defaultProps = { value: "" };
      `, filename: "test.jsx" },
  { code: `
        import styled from "styled-components";

        const MyComponent = styled.div;
        MyComponent.defaultProps = { value: "" };
      `, filename: "test.jsx" },
  { code: `
        class Editor extends React.Component {
            #somethingPrivate() {
              // ...
            }

            render() {
            const { value = '' } = this.props;

            return (
              <textarea>
                {value}
              </textarea>
            );
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {
          static PropTypes = {};
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {}
        Component.PropTypes = {}
      `, filename: "test.jsx" },
  { code: `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.PropTypes = {}
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {
          static proptypes = {};
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {}
        Component.proptypes = {}
      `, filename: "test.jsx" },
  { code: `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.proptypes = {}
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {
          static ContextTypes = {};
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {}
        Component.ContextTypes = {}
      `, filename: "test.jsx" },
  { code: `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.ContextTypes = {}
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {
          static contexttypes = {};
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {}
        Component.contexttypes = {}
      `, filename: "test.jsx" },
  { code: `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.contexttypes = {}
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {
          static ChildContextTypes = {};
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {}
        Component.ChildContextTypes = {}
      `, filename: "test.jsx" },
  { code: `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.ChildContextTypes = {}
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {
          static childcontexttypes = {};
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {}
        Component.childcontexttypes = {}
      `, filename: "test.jsx" },
  { code: `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.childcontexttypes = {}
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {
          static DefaultProps = {};
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {}
        Component.DefaultProps = {}
      `, filename: "test.jsx" },
  { code: `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.DefaultProps = {}
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {
          static defaultprops = {};
        }
      `, filename: "test.jsx" },
  { code: `
        class Component extends React.Component {}
        Component.defaultprops = {}
      `, filename: "test.jsx" },
  { code: `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.defaultprops = {}
      `, filename: "test.jsx" },
  { code: `
        Component.defaultprops = {}
        class Component extends React.Component {}
      `, filename: "test.jsx" },
  { code: `
        /** @extends React.Component */
        class MyComponent extends BaseComponent {}
        MyComponent.PROPTYPES = {}
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          static GetDerivedStateFromProps()  { }
          ComponentWillMount() { }
          UNSAFE_ComponentWillMount() { }
          ComponentDidMount() { }
          ComponentWillReceiveProps() { }
          UNSAFE_ComponentWillReceiveProps() { }
          ShouldComponentUpdate() { }
          ComponentWillUpdate() { }
          UNSAFE_ComponentWillUpdate() { }
          GetSnapshotBeforeUpdate() { }
          ComponentDidUpdate() { }
          ComponentDidCatch() { }
          ComponentWillUnmount() { }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          static Getderivedstatefromprops() { }
          Componentwillmount() { }
          UNSAFE_Componentwillmount() { }
          Componentdidmount() { }
          Componentwillreceiveprops() { }
          UNSAFE_Componentwillreceiveprops() { }
          Shouldcomponentupdate() { }
          Componentwillupdate() { }
          UNSAFE_Componentwillupdate() { }
          Getsnapshotbeforeupdate() { }
          Componentdidupdate() { }
          Componentdidcatch() { }
          Componentwillunmount() { }
          Render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          static getderivedstatefromprops() { }
          componentwillmount() { }
          unsafe_componentwillmount() { }
          componentdidmount() { }
          componentwillreceiveprops() { }
          unsafe_componentwillreceiveprops() { }
          shouldcomponentupdate() { }
          componentwillupdate() { }
          unsafe_componentwillupdate() { }
          getsnapshotbeforeupdate() { }
          componentdidupdate() { }
          componentdidcatch() { }
          componentwillunmount() { }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
            a: PropTypes.Number.isRequired
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
            a: PropTypes.number.isrequired
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.number.isrequired
          }
        };
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.Number
          }
        };
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
            a: PropTypes.Number
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.shape({
            b: PropTypes.String,
            c: PropTypes.number.isRequired,
          })
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.oneOfType([
            PropTypes.bools,
            PropTypes.number,
          ])
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from 'prop-types';
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      `, filename: "test.jsx" },
  { code: `
        import PropTypes from 'prop-types';
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.string.isrequired,
          b: PropTypes.shape({
            c: PropTypes.number
          }).isrequired
        }
      `, filename: "test.jsx" },
  { code: `
        import RealPropTypes from 'prop-types';
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: RealPropTypes.bools,
          b: RealPropTypes.Array,
          c: RealPropTypes.function,
          d: RealPropTypes.objectof,
        }
      `, filename: "test.jsx" },
  { code: `
      import React from 'react';
      class Component extends React.Component {};
      Component.propTypes = {
        a: React.PropTypes.string.isrequired,
        b: React.PropTypes.shape({
          c: React.PropTypes.number
        }).isrequired
      }
    `, filename: "test.jsx" },
  { code: `
        import React from 'react';
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: React.PropTypes.bools,
          b: React.PropTypes.Array,
          c: React.PropTypes.function,
          d: React.PropTypes.objectof,
        }
      `, filename: "test.jsx" },
  { code: `
      import { PropTypes } from 'react';
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string.isrequired,
        b: PropTypes.shape({
          c: PropTypes.number
        }).isrequired
      }
    `, filename: "test.jsx" },
  { code: `
      import 'react';
      class Component extends React.Component {};
    `, filename: "test.jsx" },
  { code: `
        import { PropTypes } from 'react';
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      `, filename: "test.jsx" },
  { code: `
      import PropTypes from 'prop-types';
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string.isrequired,
        b: PropTypes.shape({
          c: PropTypes.number
        }).isrequired
      }
      `, filename: "test.jsx" },
  { code: `
      import PropTypes from 'prop-types';
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string.isrequired,
        b: PropTypes.shape({
          c: PropTypes.number
        }).isrequired
      }
    `, filename: "test.jsx" },
  { code: `
        import React from 'react';
        import PropTypes from 'prop-types';
        const Component = React.createReactClass({
          propTypes: {
            a: PropTypes.string.isrequired,
            b: PropTypes.shape({
              c: PropTypes.number
            }).isrequired
          }
        });
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';
        import PropTypes from 'prop-types';
        const Component = React.createReactClass({
          childContextTypes: {
            a: PropTypes.bools,
            b: PropTypes.Array,
            c: PropTypes.function,
            d: PropTypes.objectof,
          }
        });
      `, filename: "test.jsx" },
  { code: `
        import React from 'react';
        const Component = React.createReactClass({
          proptypes: {},
          childcontexttypes: {},
          contexttypes: {},
          getdefaultProps() { },
          getinitialState() { },
          getChildcontext() { },
          ComponentWillMount() { },
          ComponentDidMount() { },
          ComponentWillReceiveProps() { },
          ShouldComponentUpdate() { },
          ComponentWillUpdate() { },
          ComponentDidUpdate() { },
          ComponentWillUnmount() { },
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          getDerivedStateFromProps() { }
        }
      `, filename: "test.jsx" },
  { code: `
        class Hello extends React.Component {
          GetDerivedStateFromProps() { }
        }
      `, filename: "test.jsx" },
  { code: `
        import 'prop-types'
      `, filename: "test.jsx" },
];

describe("no-typos", () => {
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
    it("valid[0]: import createReactClass from 'create-react-class' functio...", ({ task }) => {
      const code = `
          import createReactClass from 'create-react-class'
          function hello (extra = {}) {
            return createReactClass({
              noteType: 'hello',
              renderItem () {
                return null
              },
              ...extra
            })
          }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 0)\n\n--- Source code under test ---\n\n          import createReactClass from 'create-react-class'\n          function hello (extra = {}) {\n            return createReactClass({\n              noteType: 'hello',\n              renderItem () {\n                return null\n              },\n              ...extra\n            })\n          }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: no-babel\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[0], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[1]: class First { static PropTypes = {key: \"myValue\"}; static...", ({ task }) => {
      const code = `
        class First {
          static PropTypes = {key: "myValue"};
          static ContextTypes = {key: "myValue"};
          static ChildContextTypes = {key: "myValue"};
          static DefaultProps = {key: "myValue"};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 1)\n\n--- Source code under test ---\n\n        class First {\n          static PropTypes = {key: \"myValue\"};\n          static ContextTypes = {key: \"myValue\"};\n          static ChildContextTypes = {key: \"myValue\"};\n          static DefaultProps = {key: \"myValue\"};\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[1], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[2]: class First {} First.PropTypes = {key: \"myValue\"}; First....", ({ task }) => {
      const code = `
        class First {}
        First.PropTypes = {key: "myValue"};
        First.ContextTypes = {key: "myValue"};
        First.ChildContextTypes = {key: "myValue"};
        First.DefaultProps = {key: "myValue"};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 2)\n\n--- Source code under test ---\n\n        class First {}\n        First.PropTypes = {key: \"myValue\"};\n        First.ContextTypes = {key: \"myValue\"};\n        First.ChildContextTypes = {key: \"myValue\"};\n        First.DefaultProps = {key: \"myValue\"};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[2], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[3]: class First extends React.Component { static propTypes = ...", ({ task }) => {
      const code = `
        class First extends React.Component {
          static propTypes = {key: "myValue"};
          static contextTypes = {key: "myValue"};
          static childContextTypes = {key: "myValue"};
          static defaultProps = {key: "myValue"};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 3)\n\n--- Source code under test ---\n\n        class First extends React.Component {\n          static propTypes = {key: \"myValue\"};\n          static contextTypes = {key: \"myValue\"};\n          static childContextTypes = {key: \"myValue\"};\n          static defaultProps = {key: \"myValue\"};\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[3], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[4]: class First extends React.Component {} First.propTypes = ...", ({ task }) => {
      const code = `
        class First extends React.Component {}
        First.propTypes = {key: "myValue"};
        First.contextTypes = {key: "myValue"};
        First.childContextTypes = {key: "myValue"};
        First.defaultProps = {key: "myValue"};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 4)\n\n--- Source code under test ---\n\n        class First extends React.Component {}\n        First.propTypes = {key: \"myValue\"};\n        First.contextTypes = {key: \"myValue\"};\n        First.childContextTypes = {key: \"myValue\"};\n        First.defaultProps = {key: \"myValue\"};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[4], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[5]: class MyClass { propTypes = {key: \"myValue\"}; contextType...", ({ task }) => {
      const code = `
        class MyClass {
          propTypes = {key: "myValue"};
          contextTypes = {key: "myValue"};
          childContextTypes = {key: "myValue"};
          defaultProps = {key: "myValue"};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 5)\n\n--- Source code under test ---\n\n        class MyClass {\n          propTypes = {key: \"myValue\"};\n          contextTypes = {key: \"myValue\"};\n          childContextTypes = {key: \"myValue\"};\n          defaultProps = {key: \"myValue\"};\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[5], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[6]: class MyClass { PropTypes = {key: \"myValue\"}; ContextType...", ({ task }) => {
      const code = `
        class MyClass {
          PropTypes = {key: "myValue"};
          ContextTypes = {key: "myValue"};
          ChildContextTypes = {key: "myValue"};
          DefaultProps = {key: "myValue"};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 6)\n\n--- Source code under test ---\n\n        class MyClass {\n          PropTypes = {key: \"myValue\"};\n          ContextTypes = {key: \"myValue\"};\n          ChildContextTypes = {key: \"myValue\"};\n          DefaultProps = {key: \"myValue\"};\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[6], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[7]: class MyClass { proptypes = {key: \"myValue\"}; contexttype...", ({ task }) => {
      const code = `
        class MyClass {
          proptypes = {key: "myValue"};
          contexttypes = {key: "myValue"};
          childcontextypes = {key: "myValue"};
          defaultprops = {key: "myValue"};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 7)\n\n--- Source code under test ---\n\n        class MyClass {\n          proptypes = {key: \"myValue\"};\n          contexttypes = {key: \"myValue\"};\n          childcontextypes = {key: \"myValue\"};\n          defaultprops = {key: \"myValue\"};\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[7], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[8]: class MyClass { static PropTypes() {}; static ContextType...", ({ task }) => {
      const code = `
        class MyClass {
          static PropTypes() {};
          static ContextTypes() {};
          static ChildContextTypes() {};
          static DefaultProps() {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 8)\n\n--- Source code under test ---\n\n        class MyClass {\n          static PropTypes() {};\n          static ContextTypes() {};\n          static ChildContextTypes() {};\n          static DefaultProps() {};\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[8], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[9]: class MyClass { static proptypes() {}; static contexttype...", ({ task }) => {
      const code = `
        class MyClass {
          static proptypes() {};
          static contexttypes() {};
          static childcontexttypes() {};
          static defaultprops() {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 9)\n\n--- Source code under test ---\n\n        class MyClass {\n          static proptypes() {};\n          static contexttypes() {};\n          static childcontexttypes() {};\n          static defaultprops() {};\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[9], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[10]: class MyClass {} MyClass.prototype.PropTypes = function()...", ({ task }) => {
      const code = `
        class MyClass {}
        MyClass.prototype.PropTypes = function() {};
        MyClass.prototype.ContextTypes = function() {};
        MyClass.prototype.ChildContextTypes = function() {};
        MyClass.prototype.DefaultProps = function() {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 10)\n\n--- Source code under test ---\n\n        class MyClass {}\n        MyClass.prototype.PropTypes = function() {};\n        MyClass.prototype.ContextTypes = function() {};\n        MyClass.prototype.ChildContextTypes = function() {};\n        MyClass.prototype.DefaultProps = function() {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[10], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[11]: class MyClass {} MyClass.PropTypes = function() {}; MyCla...", ({ task }) => {
      const code = `
        class MyClass {}
        MyClass.PropTypes = function() {};
        MyClass.ContextTypes = function() {};
        MyClass.ChildContextTypes = function() {};
        MyClass.DefaultProps = function() {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 11)\n\n--- Source code under test ---\n\n        class MyClass {}\n        MyClass.PropTypes = function() {};\n        MyClass.ContextTypes = function() {};\n        MyClass.ChildContextTypes = function() {};\n        MyClass.DefaultProps = function() {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[11], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[12]: function MyRandomFunction() {} MyRandomFunction.PropTypes...", ({ task }) => {
      const code = `
        function MyRandomFunction() {}
        MyRandomFunction.PropTypes = {};
        MyRandomFunction.ContextTypes = {};
        MyRandomFunction.ChildContextTypes = {};
        MyRandomFunction.DefaultProps = {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 12)\n\n--- Source code under test ---\n\n        function MyRandomFunction() {}\n        MyRandomFunction.PropTypes = {};\n        MyRandomFunction.ContextTypes = {};\n        MyRandomFunction.ChildContextTypes = {};\n        MyRandomFunction.DefaultProps = {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[12], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[13]: class First extends React.Component {} First[\"prop\" + \"Ty...", ({ task }) => {
      const code = `
        class First extends React.Component {}
        First["prop" + "Types"] = {};
        First["context" + "Types"] = {};
        First["childContext" + "Types"] = {};
        First["default" + "Props"] = {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 13)\n\n--- Source code under test ---\n\n        class First extends React.Component {}\n        First[\"prop\" + \"Types\"] = {};\n        First[\"context\" + \"Types\"] = {};\n        First[\"childContext\" + \"Types\"] = {};\n        First[\"default\" + \"Props\"] = {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[13], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[14]: class First extends React.Component {} First[\"PROP\" + \"TY...", ({ task }) => {
      const code = `
        class First extends React.Component {}
        First["PROP" + "TYPES"] = {};
        First["CONTEXT" + "TYPES"] = {};
        First["CHILDCONTEXT" + "TYPES"] = {};
        First["DEFAULT" + "PROPS"] = {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 14)\n\n--- Source code under test ---\n\n        class First extends React.Component {}\n        First[\"PROP\" + \"TYPES\"] = {};\n        First[\"CONTEXT\" + \"TYPES\"] = {};\n        First[\"CHILDCONTEXT\" + \"TYPES\"] = {};\n        First[\"DEFAULT\" + \"PROPS\"] = {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[14], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[15]: const propTypes = \"PROPTYPES\" const contextTypes = \"CONTE...", ({ task }) => {
      const code = `
        const propTypes = "PROPTYPES"
        const contextTypes = "CONTEXTTYPES"
        const childContextTypes = "CHILDCONTEXTTYPES"
        const defaultProps = "DEFAULTPROPS"

        class First extends React.Component {}
        First[propTypes] = {};
        First[contextTypes] = {};
        First[childContextTypes] = {};
        First[defaultProps] = {};
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 15)\n\n--- Source code under test ---\n\n        const propTypes = \"PROPTYPES\"\n        const contextTypes = \"CONTEXTTYPES\"\n        const childContextTypes = \"CHILDCONTEXTTYPES\"\n        const defaultProps = \"DEFAULTPROPS\"\n\n        class First extends React.Component {}\n        First[propTypes] = {};\n        First[contextTypes] = {};\n        First[childContextTypes] = {};\n        First[defaultProps] = {};\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[15], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[16]: class Hello extends React.Component { static getDerivedSt...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          static getDerivedStateFromProps() { }
          componentWillMount() { }
          componentDidMount() { }
          componentWillReceiveProps() { }
          shouldComponentUpdate() { }
          componentWillUpdate() { }
          componentDidUpdate() { }
          componentWillUnmount() { }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 16)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          static getDerivedStateFromProps() { }\n          componentWillMount() { }\n          componentDidMount() { }\n          componentWillReceiveProps() { }\n          shouldComponentUpdate() { }\n          componentWillUpdate() { }\n          componentDidUpdate() { }\n          componentWillUnmount() { }\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[16], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[17]: class Hello extends React.Component { \"componentDidMount\"...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          "componentDidMount"() { }
          "my-method"() { }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 17)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          \"componentDidMount\"() { }\n          \"my-method\"() { }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[17], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[18]: class MyClass { componentWillMount() { } componentDidMoun...", ({ task }) => {
      const code = `
        class MyClass {
          componentWillMount() { }
          componentDidMount() { }
          componentWillReceiveProps() { }
          shouldComponentUpdate() { }
          componentWillUpdate() { }
          componentDidUpdate() { }
          componentWillUnmount() { }
          render() { }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 18)\n\n--- Source code under test ---\n\n        class MyClass {\n          componentWillMount() { }\n          componentDidMount() { }\n          componentWillReceiveProps() { }\n          shouldComponentUpdate() { }\n          componentWillUpdate() { }\n          componentDidUpdate() { }\n          componentWillUnmount() { }\n          render() { }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[18], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[19]: class MyClass { componentwillmount() { } componentdidmoun...", ({ task }) => {
      const code = `
        class MyClass {
          componentwillmount() { }
          componentdidmount() { }
          componentwillreceiveprops() { }
          shouldcomponentupdate() { }
          componentwillupdate() { }
          componentdidupdate() { }
          componentwillUnmount() { }
          render() { }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 19)\n\n--- Source code under test ---\n\n        class MyClass {\n          componentwillmount() { }\n          componentdidmount() { }\n          componentwillreceiveprops() { }\n          shouldcomponentupdate() { }\n          componentwillupdate() { }\n          componentdidupdate() { }\n          componentwillUnmount() { }\n          render() { }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[19], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[20]: class MyClass { Componentwillmount() { } Componentdidmoun...", ({ task }) => {
      const code = `
        class MyClass {
          Componentwillmount() { }
          Componentdidmount() { }
          Componentwillreceiveprops() { }
          Shouldcomponentupdate() { }
          Componentwillupdate() { }
          Componentdidupdate() { }
          ComponentwillUnmount() { }
          Render() { }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 20)\n\n--- Source code under test ---\n\n        class MyClass {\n          Componentwillmount() { }\n          Componentdidmount() { }\n          Componentwillreceiveprops() { }\n          Shouldcomponentupdate() { }\n          Componentwillupdate() { }\n          Componentdidupdate() { }\n          ComponentwillUnmount() { }\n          Render() { }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[20], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[21]: function test(b) { return a.bind(b); } function a() {}", ({ task }) => {
      const code = `
        function test(b) {
          return a.bind(b);
        }
        function a() {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 21)\n\n--- Source code under test ---\n\n        function test(b) {\n          return a.bind(b);\n        }\n        function a() {}\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[21], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[22]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.number.isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 22)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.number.isRequired\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[22], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[23]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          e: PropTypes.shape({
            ea: PropTypes.string,
          })
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 23)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          e: PropTypes.shape({\n            ea: PropTypes.string,\n          })\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[23], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[24]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.string,
          b: PropTypes.string.isRequired,
          c: PropTypes.shape({
            d: PropTypes.string,
            e: PropTypes.number.isRequired,
          }).isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 24)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.string,\n          b: PropTypes.string.isRequired,\n          c: PropTypes.shape({\n            d: PropTypes.string,\n            e: PropTypes.number.isRequired,\n          }).isRequired\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[24], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[25]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
          ])
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 25)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.oneOfType([\n            PropTypes.string,\n            PropTypes.number\n          ])\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[25], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[26]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.oneOf([
            'hello',
            'hi'
          ])
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 26)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.oneOf([\n            'hello',\n            'hi'\n          ])\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[26], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[27]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: PropTypes.string,
          b: PropTypes.string.isRequired,
          c: PropTypes.shape({
            d: PropTypes.string,
            e: PropTypes.number.isRequired,
          }).isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 27)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.childContextTypes = {\n          a: PropTypes.string,\n          b: PropTypes.string.isRequired,\n          c: PropTypes.shape({\n            d: PropTypes.string,\n            e: PropTypes.number.isRequired,\n          }).isRequired\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[27], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[28]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.contextTypes = {
          a: PropTypes.string,
          b: PropTypes.string.isRequired,
          c: PropTypes.shape({
            d: PropTypes.string,
            e: PropTypes.number.isRequired,
          }).isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 28)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.contextTypes = {\n          a: PropTypes.string,\n          b: PropTypes.string.isRequired,\n          c: PropTypes.shape({\n            d: PropTypes.string,\n            e: PropTypes.number.isRequired,\n          }).isRequired\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[28], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[29]: import PropTypes from 'prop-types' import * as MyPropType...", ({ task }) => {
      const code = `
        import PropTypes from 'prop-types'
        import * as MyPropTypes from 'lib/my-prop-types'
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.string,
          b: MyPropTypes.MYSTRING,
          c: MyPropTypes.MYSTRING.isRequired,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 29)\n\n--- Source code under test ---\n\n        import PropTypes from 'prop-types'\n        import * as MyPropTypes from 'lib/my-prop-types'\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.string,\n          b: MyPropTypes.MYSTRING,\n          c: MyPropTypes.MYSTRING.isRequired,\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[29], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[30]: import PropTypes from \"prop-types\" import * as MyPropType...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types"
        import * as MyPropTypes from 'lib/my-prop-types'
        class Component extends React.Component {};
        Component.propTypes = {
          b: PropTypes.string,
          a: MyPropTypes.MYSTRING,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 30)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\"\n        import * as MyPropTypes from 'lib/my-prop-types'\n        class Component extends React.Component {};\n        Component.propTypes = {\n          b: PropTypes.string,\n          a: MyPropTypes.MYSTRING,\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[30], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[31]: import CustomReact from \"react\" class Component extends R...", ({ task }) => {
      const code = `
        import CustomReact from "react"
        class Component extends React.Component {};
        Component.propTypes = {
          b: CustomReact.PropTypes.string,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 31)\n\n--- Source code under test ---\n\n        import CustomReact from \"react\"\n        class Component extends React.Component {};\n        Component.propTypes = {\n          b: CustomReact.PropTypes.string,\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[31], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[32]: class Component extends React.Component {}; Component.pro...", ({ task }) => {
      const code = `
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.shape(),
        };
        Component.contextTypes = {
          a: PropTypes.shape(),
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 32)\n\n--- Source code under test ---\n\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.shape(),\n        };\n        Component.contextTypes = {\n          a: PropTypes.shape(),\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[32], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[33]: const fn = (err, res) => { const { body: data = {} } = { ...", ({ task }) => {
      const code = `
        const fn = (err, res) => {
          const { body: data = {} } = { ...res };
          data.time = data.time || {};
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 33)\n\n--- Source code under test ---\n\n        const fn = (err, res) => {\n          const { body: data = {} } = { ...res };\n          data.time = data.time || {};\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[33], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[34]: class Component extends React.Component {}; Component.pro...", ({ task }) => {
      const code = `
        class Component extends React.Component {};
        Component.propTypes = {
          b: string.isRequired,
          c: PropTypes.shape({
            d: number.isRequired,
          }).isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 34)\n\n--- Source code under test ---\n\n        class Component extends React.Component {};\n        Component.propTypes = {\n          b: string.isRequired,\n          c: PropTypes.shape({\n            d: number.isRequired,\n          }).isRequired\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[34], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[35]: import React from 'react'; import PropTypes from 'prop-ty...", ({ task }) => {
      const code = `
        import React from 'react';
        import PropTypes from 'prop-types';
        const Component = React.createReactClass({
          propTypes: {
            a: PropTypes.string.isRequired,
            b: PropTypes.shape({
              c: PropTypes.number
            }).isRequired
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 35)\n\n--- Source code under test ---\n\n        import React from 'react';\n        import PropTypes from 'prop-types';\n        const Component = React.createReactClass({\n          propTypes: {\n            a: PropTypes.string.isRequired,\n            b: PropTypes.shape({\n              c: PropTypes.number\n            }).isRequired\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[35], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[36]: import React from 'react'; import PropTypes from 'prop-ty...", ({ task }) => {
      const code = `
        import React from 'react';
        import PropTypes from 'prop-types';
        const Component = React.createReactClass({
          childContextTypes: {
            a: PropTypes.bool,
            b: PropTypes.array,
            c: PropTypes.func,
            d: PropTypes.object,
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 36)\n\n--- Source code under test ---\n\n        import React from 'react';\n        import PropTypes from 'prop-types';\n        const Component = React.createReactClass({\n          childContextTypes: {\n            a: PropTypes.bool,\n            b: PropTypes.array,\n            c: PropTypes.func,\n            d: PropTypes.object,\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[36], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[37]: import React from 'react'; const Component = React.create...", ({ task }) => {
      const code = `
        import React from 'react';
        const Component = React.createReactClass({
          propTypes: {},
          childContextTypes: {},
          contextTypes: {},
          componentWillMount() { },
          componentDidMount() { },
          componentWillReceiveProps() { },
          shouldComponentUpdate() { },
          componentWillUpdate() { },
          componentDidUpdate() { },
          componentWillUnmount() { },
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 37)\n\n--- Source code under test ---\n\n        import React from 'react';\n        const Component = React.createReactClass({\n          propTypes: {},\n          childContextTypes: {},\n          contextTypes: {},\n          componentWillMount() { },\n          componentDidMount() { },\n          componentWillReceiveProps() { },\n          shouldComponentUpdate() { },\n          componentWillUpdate() { },\n          componentDidUpdate() { },\n          componentWillUnmount() { },\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[37], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[38]: import { string, element } from \"prop-types\"; class Sampl...", ({ task }) => {
      const code = `
        import { string, element } from "prop-types";

        class Sample extends React.Component {
          render() { return null; }
        }

        Sample.propTypes = {
          title: string.isRequired,
          body: element.isRequired
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 38)\n\n--- Source code under test ---\n\n        import { string, element } from \"prop-types\";\n\n        class Sample extends React.Component {\n          render() { return null; }\n        }\n\n        Sample.propTypes = {\n          title: string.isRequired,\n          body: element.isRequired\n        };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[38], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[39]: import React from 'react'; const A = { B: 'C' }; export d...", ({ task }) => {
      const code = `
        import React from 'react';

        const A = { B: 'C' };

        export default class MyComponent extends React.Component {
          [A.B] () {
            return null
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 39)\n\n--- Source code under test ---\n\n        import React from 'react';\n\n        const A = { B: 'C' };\n\n        export default class MyComponent extends React.Component {\n          [A.B] () {\n            return null\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[39], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[40]: const MyComponent = React.forwardRef((props, ref) => <div...", ({ task }) => {
      const code = `
        const MyComponent = React.forwardRef((props, ref) => <div />);
        MyComponent.defaultProps = { value: "" };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 40)\n\n--- Source code under test ---\n\n        const MyComponent = React.forwardRef((props, ref) => <div />);\n        MyComponent.defaultProps = { value: \"\" };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[40], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[41]: import styled from \"styled-components\"; const MyComponent...", ({ task }) => {
      const code = `
        import styled from "styled-components";

        const MyComponent = styled.div;
        MyComponent.defaultProps = { value: "" };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 41)\n\n--- Source code under test ---\n\n        import styled from \"styled-components\";\n\n        const MyComponent = styled.div;\n        MyComponent.defaultProps = { value: \"\" };\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[41], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

    it("valid[42]: class Editor extends React.Component { #somethingPrivate(...", ({ task }) => {
      const code = `
        class Editor extends React.Component {
            #somethingPrivate() {
              // ...
            }

            render() {
            const { value = '' } = this.props;

            return (
              <textarea>
                {value}
              </textarea>
            );
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: valid (index 42)\n\n--- Source code under test ---\n\n        class Editor extends React.Component {\n            #somethingPrivate() {\n              // ...\n            }\n\n            render() {\n            const { value = '' } = this.props;\n\n            return (\n              <textarea>\n                {value}\n              </textarea>\n            );\n          }\n        }\n      \n\nThis code is VALID — the rule should produce NO diagnostics for it.\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      expect(ruleActive, `Rule "${RULE_NAME}" produced no diagnostics on any invalid case. Is the plugin loaded?`).toBe(true);
      const matches = ruleErrors(results[42], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(0);
    });

  });

  describe("invalid", () => {
    it("invalid[0]: class Component extends React.Component { static PropType...", ({ task }) => {
      const code = `
        class Component extends React.Component {
          static PropTypes = {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 0)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static PropTypes = {};\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[43], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[1]: class Component extends React.Component {} Component.Prop...", ({ task }) => {
      const code = `
        class Component extends React.Component {}
        Component.PropTypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 1)\n\n--- Source code under test ---\n\n        class Component extends React.Component {}\n        Component.PropTypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[44], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[2]: function MyComponent() { return (<div>{this.props.myProp}...", ({ task }) => {
      const code = `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.PropTypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 2)\n\n--- Source code under test ---\n\n        function MyComponent() { return (<div>{this.props.myProp}</div>) }\n        MyComponent.PropTypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[45], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[3]: class Component extends React.Component { static proptype...", ({ task }) => {
      const code = `
        class Component extends React.Component {
          static proptypes = {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 3)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static proptypes = {};\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[46], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[4]: class Component extends React.Component {} Component.prop...", ({ task }) => {
      const code = `
        class Component extends React.Component {}
        Component.proptypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 4)\n\n--- Source code under test ---\n\n        class Component extends React.Component {}\n        Component.proptypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[47], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[5]: function MyComponent() { return (<div>{this.props.myProp}...", ({ task }) => {
      const code = `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.proptypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 5)\n\n--- Source code under test ---\n\n        function MyComponent() { return (<div>{this.props.myProp}</div>) }\n        MyComponent.proptypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[48], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[6]: class Component extends React.Component { static ContextT...", ({ task }) => {
      const code = `
        class Component extends React.Component {
          static ContextTypes = {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 6)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static ContextTypes = {};\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[49], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[7]: class Component extends React.Component {} Component.Cont...", ({ task }) => {
      const code = `
        class Component extends React.Component {}
        Component.ContextTypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 7)\n\n--- Source code under test ---\n\n        class Component extends React.Component {}\n        Component.ContextTypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[50], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[8]: function MyComponent() { return (<div>{this.props.myProp}...", ({ task }) => {
      const code = `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.ContextTypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 8)\n\n--- Source code under test ---\n\n        function MyComponent() { return (<div>{this.props.myProp}</div>) }\n        MyComponent.ContextTypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[51], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[9]: class Component extends React.Component { static contextt...", ({ task }) => {
      const code = `
        class Component extends React.Component {
          static contexttypes = {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 9)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static contexttypes = {};\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[52], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[10]: class Component extends React.Component {} Component.cont...", ({ task }) => {
      const code = `
        class Component extends React.Component {}
        Component.contexttypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 10)\n\n--- Source code under test ---\n\n        class Component extends React.Component {}\n        Component.contexttypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[53], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[11]: function MyComponent() { return (<div>{this.props.myProp}...", ({ task }) => {
      const code = `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.contexttypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 11)\n\n--- Source code under test ---\n\n        function MyComponent() { return (<div>{this.props.myProp}</div>) }\n        MyComponent.contexttypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[54], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[12]: class Component extends React.Component { static ChildCon...", ({ task }) => {
      const code = `
        class Component extends React.Component {
          static ChildContextTypes = {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 12)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static ChildContextTypes = {};\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[55], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[13]: class Component extends React.Component {} Component.Chil...", ({ task }) => {
      const code = `
        class Component extends React.Component {}
        Component.ChildContextTypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 13)\n\n--- Source code under test ---\n\n        class Component extends React.Component {}\n        Component.ChildContextTypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[56], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[14]: function MyComponent() { return (<div>{this.props.myProp}...", ({ task }) => {
      const code = `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.ChildContextTypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 14)\n\n--- Source code under test ---\n\n        function MyComponent() { return (<div>{this.props.myProp}</div>) }\n        MyComponent.ChildContextTypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[57], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[15]: class Component extends React.Component { static childcon...", ({ task }) => {
      const code = `
        class Component extends React.Component {
          static childcontexttypes = {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 15)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static childcontexttypes = {};\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[58], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[16]: class Component extends React.Component {} Component.chil...", ({ task }) => {
      const code = `
        class Component extends React.Component {}
        Component.childcontexttypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 16)\n\n--- Source code under test ---\n\n        class Component extends React.Component {}\n        Component.childcontexttypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[59], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[17]: function MyComponent() { return (<div>{this.props.myProp}...", ({ task }) => {
      const code = `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.childcontexttypes = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 17)\n\n--- Source code under test ---\n\n        function MyComponent() { return (<div>{this.props.myProp}</div>) }\n        MyComponent.childcontexttypes = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[60], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[18]: class Component extends React.Component { static DefaultP...", ({ task }) => {
      const code = `
        class Component extends React.Component {
          static DefaultProps = {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 18)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static DefaultProps = {};\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[61], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[19]: class Component extends React.Component {} Component.Defa...", ({ task }) => {
      const code = `
        class Component extends React.Component {}
        Component.DefaultProps = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 19)\n\n--- Source code under test ---\n\n        class Component extends React.Component {}\n        Component.DefaultProps = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[62], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[20]: function MyComponent() { return (<div>{this.props.myProp}...", ({ task }) => {
      const code = `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.DefaultProps = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 20)\n\n--- Source code under test ---\n\n        function MyComponent() { return (<div>{this.props.myProp}</div>) }\n        MyComponent.DefaultProps = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[63], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[21]: class Component extends React.Component { static defaultp...", ({ task }) => {
      const code = `
        class Component extends React.Component {
          static defaultprops = {};
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 21)\n\n--- Source code under test ---\n\n        class Component extends React.Component {\n          static defaultprops = {};\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[64], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[22]: class Component extends React.Component {} Component.defa...", ({ task }) => {
      const code = `
        class Component extends React.Component {}
        Component.defaultprops = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 22)\n\n--- Source code under test ---\n\n        class Component extends React.Component {}\n        Component.defaultprops = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[65], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[23]: function MyComponent() { return (<div>{this.props.myProp}...", ({ task }) => {
      const code = `
        function MyComponent() { return (<div>{this.props.myProp}</div>) }
        MyComponent.defaultprops = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 23)\n\n--- Source code under test ---\n\n        function MyComponent() { return (<div>{this.props.myProp}</div>) }\n        MyComponent.defaultprops = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[66], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[24]: Component.defaultprops = {} class Component extends React...", ({ task }) => {
      const code = `
        Component.defaultprops = {}
        class Component extends React.Component {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 24)\n\n--- Source code under test ---\n\n        Component.defaultprops = {}\n        class Component extends React.Component {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[67], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[25]: /** @extends React.Component */ class MyComponent extends...", ({ task }) => {
      const code = `
        /** @extends React.Component */
        class MyComponent extends BaseComponent {}
        MyComponent.PROPTYPES = {}
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 25)\n\n--- Source code under test ---\n\n        /** @extends React.Component */\n        class MyComponent extends BaseComponent {}\n        MyComponent.PROPTYPES = {}\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoStaticClassProp): Typo in static class property declaration\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[68], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in static class property declaration");
    });

    it("invalid[26]: class Hello extends React.Component { static GetDerivedSt...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          static GetDerivedStateFromProps()  { }
          ComponentWillMount() { }
          UNSAFE_ComponentWillMount() { }
          ComponentDidMount() { }
          ComponentWillReceiveProps() { }
          UNSAFE_ComponentWillReceiveProps() { }
          ShouldComponentUpdate() { }
          ComponentWillUpdate() { }
          UNSAFE_ComponentWillUpdate() { }
          GetSnapshotBeforeUpdate() { }
          ComponentDidUpdate() { }
          ComponentDidCatch() { }
          ComponentWillUnmount() { }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 26)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          static GetDerivedStateFromProps()  { }\n          ComponentWillMount() { }\n          UNSAFE_ComponentWillMount() { }\n          ComponentDidMount() { }\n          ComponentWillReceiveProps() { }\n          UNSAFE_ComponentWillReceiveProps() { }\n          ShouldComponentUpdate() { }\n          ComponentWillUpdate() { }\n          UNSAFE_ComponentWillUpdate() { }\n          GetSnapshotBeforeUpdate() { }\n          ComponentDidUpdate() { }\n          ComponentDidCatch() { }\n          ComponentWillUnmount() { }\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 13 diagnostic(s):\n  [0] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: GetDerivedStateFromProps should be getDerivedStateFromProps\n  [1] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentWillMount should be componentWillMount\n  [2] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: UNSAFE_ComponentWillMount should be UNSAFE_componentWillMount\n  [3] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentDidMount should be componentDidMount\n  [4] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentWillReceiveProps should be componentWillReceiveProps\n  [5] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: UNSAFE_ComponentWillReceiveProps should be UNSAFE_componentWillReceiveProps\n  [6] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ShouldComponentUpdate should be shouldComponentUpdate\n  [7] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentWillUpdate should be componentWillUpdate\n  [8] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: UNSAFE_ComponentWillUpdate should be UNSAFE_componentWillUpdate\n  [9] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: GetSnapshotBeforeUpdate should be getSnapshotBeforeUpdate\n  [10] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentDidUpdate should be componentDidUpdate\n  [11] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentDidCatch should be componentDidCatch\n  [12] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentWillUnmount should be componentWillUnmount\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[69], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(13);
      expect(matches[0].message).toBe("Typo in component lifecycle method declaration: GetDerivedStateFromProps should be getDerivedStateFromProps");
      expect(matches[1].message).toBe("Typo in component lifecycle method declaration: ComponentWillMount should be componentWillMount");
      expect(matches[2].message).toBe("Typo in component lifecycle method declaration: UNSAFE_ComponentWillMount should be UNSAFE_componentWillMount");
      expect(matches[3].message).toBe("Typo in component lifecycle method declaration: ComponentDidMount should be componentDidMount");
      expect(matches[4].message).toBe("Typo in component lifecycle method declaration: ComponentWillReceiveProps should be componentWillReceiveProps");
      expect(matches[5].message).toBe("Typo in component lifecycle method declaration: UNSAFE_ComponentWillReceiveProps should be UNSAFE_componentWillReceiveProps");
      expect(matches[6].message).toBe("Typo in component lifecycle method declaration: ShouldComponentUpdate should be shouldComponentUpdate");
      expect(matches[7].message).toBe("Typo in component lifecycle method declaration: ComponentWillUpdate should be componentWillUpdate");
      expect(matches[8].message).toBe("Typo in component lifecycle method declaration: UNSAFE_ComponentWillUpdate should be UNSAFE_componentWillUpdate");
      expect(matches[9].message).toBe("Typo in component lifecycle method declaration: GetSnapshotBeforeUpdate should be getSnapshotBeforeUpdate");
      expect(matches[10].message).toBe("Typo in component lifecycle method declaration: ComponentDidUpdate should be componentDidUpdate");
      expect(matches[11].message).toBe("Typo in component lifecycle method declaration: ComponentDidCatch should be componentDidCatch");
      expect(matches[12].message).toBe("Typo in component lifecycle method declaration: ComponentWillUnmount should be componentWillUnmount");
    });

    it("invalid[27]: class Hello extends React.Component { static Getderivedst...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          static Getderivedstatefromprops() { }
          Componentwillmount() { }
          UNSAFE_Componentwillmount() { }
          Componentdidmount() { }
          Componentwillreceiveprops() { }
          UNSAFE_Componentwillreceiveprops() { }
          Shouldcomponentupdate() { }
          Componentwillupdate() { }
          UNSAFE_Componentwillupdate() { }
          Getsnapshotbeforeupdate() { }
          Componentdidupdate() { }
          Componentdidcatch() { }
          Componentwillunmount() { }
          Render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 27)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          static Getderivedstatefromprops() { }\n          Componentwillmount() { }\n          UNSAFE_Componentwillmount() { }\n          Componentdidmount() { }\n          Componentwillreceiveprops() { }\n          UNSAFE_Componentwillreceiveprops() { }\n          Shouldcomponentupdate() { }\n          Componentwillupdate() { }\n          UNSAFE_Componentwillupdate() { }\n          Getsnapshotbeforeupdate() { }\n          Componentdidupdate() { }\n          Componentdidcatch() { }\n          Componentwillunmount() { }\n          Render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 14 diagnostic(s):\n  [0] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Getderivedstatefromprops should be getDerivedStateFromProps\n  [1] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Componentwillmount should be componentWillMount\n  [2] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: UNSAFE_Componentwillmount should be UNSAFE_componentWillMount\n  [3] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Componentdidmount should be componentDidMount\n  [4] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Componentwillreceiveprops should be componentWillReceiveProps\n  [5] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: UNSAFE_Componentwillreceiveprops should be UNSAFE_componentWillReceiveProps\n  [6] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Shouldcomponentupdate should be shouldComponentUpdate\n  [7] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Componentwillupdate should be componentWillUpdate\n  [8] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: UNSAFE_Componentwillupdate should be UNSAFE_componentWillUpdate\n  [9] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Getsnapshotbeforeupdate should be getSnapshotBeforeUpdate\n  [10] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Componentdidupdate should be componentDidUpdate\n  [11] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Componentdidcatch should be componentDidCatch\n  [12] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Componentwillunmount should be componentWillUnmount\n  [13] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: Render should be render\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[70], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(14);
      expect(matches[0].message).toBe("Typo in component lifecycle method declaration: Getderivedstatefromprops should be getDerivedStateFromProps");
      expect(matches[1].message).toBe("Typo in component lifecycle method declaration: Componentwillmount should be componentWillMount");
      expect(matches[2].message).toBe("Typo in component lifecycle method declaration: UNSAFE_Componentwillmount should be UNSAFE_componentWillMount");
      expect(matches[3].message).toBe("Typo in component lifecycle method declaration: Componentdidmount should be componentDidMount");
      expect(matches[4].message).toBe("Typo in component lifecycle method declaration: Componentwillreceiveprops should be componentWillReceiveProps");
      expect(matches[5].message).toBe("Typo in component lifecycle method declaration: UNSAFE_Componentwillreceiveprops should be UNSAFE_componentWillReceiveProps");
      expect(matches[6].message).toBe("Typo in component lifecycle method declaration: Shouldcomponentupdate should be shouldComponentUpdate");
      expect(matches[7].message).toBe("Typo in component lifecycle method declaration: Componentwillupdate should be componentWillUpdate");
      expect(matches[8].message).toBe("Typo in component lifecycle method declaration: UNSAFE_Componentwillupdate should be UNSAFE_componentWillUpdate");
      expect(matches[9].message).toBe("Typo in component lifecycle method declaration: Getsnapshotbeforeupdate should be getSnapshotBeforeUpdate");
      expect(matches[10].message).toBe("Typo in component lifecycle method declaration: Componentdidupdate should be componentDidUpdate");
      expect(matches[11].message).toBe("Typo in component lifecycle method declaration: Componentdidcatch should be componentDidCatch");
      expect(matches[12].message).toBe("Typo in component lifecycle method declaration: Componentwillunmount should be componentWillUnmount");
      expect(matches[13].message).toBe("Typo in component lifecycle method declaration: Render should be render");
    });

    it("invalid[28]: class Hello extends React.Component { static getderivedst...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          static getderivedstatefromprops() { }
          componentwillmount() { }
          unsafe_componentwillmount() { }
          componentdidmount() { }
          componentwillreceiveprops() { }
          unsafe_componentwillreceiveprops() { }
          shouldcomponentupdate() { }
          componentwillupdate() { }
          unsafe_componentwillupdate() { }
          getsnapshotbeforeupdate() { }
          componentdidupdate() { }
          componentdidcatch() { }
          componentwillunmount() { }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 28)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          static getderivedstatefromprops() { }\n          componentwillmount() { }\n          unsafe_componentwillmount() { }\n          componentdidmount() { }\n          componentwillreceiveprops() { }\n          unsafe_componentwillreceiveprops() { }\n          shouldcomponentupdate() { }\n          componentwillupdate() { }\n          unsafe_componentwillupdate() { }\n          getsnapshotbeforeupdate() { }\n          componentdidupdate() { }\n          componentdidcatch() { }\n          componentwillunmount() { }\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        }\n      \n\nThis code is INVALID — the rule should produce 13 diagnostic(s):\n  [0] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: getderivedstatefromprops should be getDerivedStateFromProps\n  [1] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: componentwillmount should be componentWillMount\n  [2] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: unsafe_componentwillmount should be UNSAFE_componentWillMount\n  [3] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: componentdidmount should be componentDidMount\n  [4] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: componentwillreceiveprops should be componentWillReceiveProps\n  [5] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: unsafe_componentwillreceiveprops should be UNSAFE_componentWillReceiveProps\n  [6] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: shouldcomponentupdate should be shouldComponentUpdate\n  [7] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: componentwillupdate should be componentWillUpdate\n  [8] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: unsafe_componentwillupdate should be UNSAFE_componentWillUpdate\n  [9] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: getsnapshotbeforeupdate should be getSnapshotBeforeUpdate\n  [10] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: componentdidupdate should be componentDidUpdate\n  [11] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: componentdidcatch should be componentDidCatch\n  [12] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: componentwillunmount should be componentWillUnmount\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[71], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(13);
      expect(matches[0].message).toBe("Typo in component lifecycle method declaration: getderivedstatefromprops should be getDerivedStateFromProps");
      expect(matches[1].message).toBe("Typo in component lifecycle method declaration: componentwillmount should be componentWillMount");
      expect(matches[2].message).toBe("Typo in component lifecycle method declaration: unsafe_componentwillmount should be UNSAFE_componentWillMount");
      expect(matches[3].message).toBe("Typo in component lifecycle method declaration: componentdidmount should be componentDidMount");
      expect(matches[4].message).toBe("Typo in component lifecycle method declaration: componentwillreceiveprops should be componentWillReceiveProps");
      expect(matches[5].message).toBe("Typo in component lifecycle method declaration: unsafe_componentwillreceiveprops should be UNSAFE_componentWillReceiveProps");
      expect(matches[6].message).toBe("Typo in component lifecycle method declaration: shouldcomponentupdate should be shouldComponentUpdate");
      expect(matches[7].message).toBe("Typo in component lifecycle method declaration: componentwillupdate should be componentWillUpdate");
      expect(matches[8].message).toBe("Typo in component lifecycle method declaration: unsafe_componentwillupdate should be UNSAFE_componentWillUpdate");
      expect(matches[9].message).toBe("Typo in component lifecycle method declaration: getsnapshotbeforeupdate should be getSnapshotBeforeUpdate");
      expect(matches[10].message).toBe("Typo in component lifecycle method declaration: componentdidupdate should be componentDidUpdate");
      expect(matches[11].message).toBe("Typo in component lifecycle method declaration: componentdidcatch should be componentDidCatch");
      expect(matches[12].message).toBe("Typo in component lifecycle method declaration: componentwillunmount should be componentWillUnmount");
    });

    it("invalid[29]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
            a: PropTypes.Number.isRequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 29)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n            a: PropTypes.Number.isRequired\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: Number\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[72], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in declared prop type: Number");
    });

    it("invalid[30]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
            a: PropTypes.number.isrequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 30)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n            a: PropTypes.number.isrequired\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[73], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in prop type chain qualifier: isrequired");
    });

    it("invalid[31]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.number.isrequired
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 31)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {\n          static propTypes = {\n            a: PropTypes.number.isrequired\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[74], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in prop type chain qualifier: isrequired");
    });

    it("invalid[32]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {
          static propTypes = {
            a: PropTypes.Number
          }
        };
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 32)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {\n          static propTypes = {\n            a: PropTypes.Number\n          }\n        };\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: Number\n\nFeatures: class fields\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[75], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in declared prop type: Number");
    });

    it("invalid[33]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
            a: PropTypes.Number
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 33)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n            a: PropTypes.Number\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: Number\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[76], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in declared prop type: Number");
    });

    it("invalid[34]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.shape({
            b: PropTypes.String,
            c: PropTypes.number.isRequired,
          })
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 34)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.shape({\n            b: PropTypes.String,\n            c: PropTypes.number.isRequired,\n          })\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: String\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[77], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in declared prop type: String");
    });

    it("invalid[35]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.oneOfType([
            PropTypes.bools,
            PropTypes.number,
          ])
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 35)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.oneOfType([\n            PropTypes.bools,\n            PropTypes.number,\n          ])\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: bools\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[78], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Typo in declared prop type: bools");
    });

    it("invalid[36]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 36)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.bools,\n          b: PropTypes.Array,\n          c: PropTypes.function,\n          d: PropTypes.objectof,\n        }\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: bools\n  [1] (messageId: typoPropType): Typo in declared prop type: Array\n  [2] (messageId: typoPropType): Typo in declared prop type: function\n  [3] (messageId: typoPropType): Typo in declared prop type: objectof\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[79], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Typo in declared prop type: bools");
      expect(matches[1].message).toBe("Typo in declared prop type: Array");
      expect(matches[2].message).toBe("Typo in declared prop type: function");
      expect(matches[3].message).toBe("Typo in declared prop type: objectof");
    });

    it("invalid[37]: import PropTypes from \"prop-types\"; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from "prop-types";
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 37)\n\n--- Source code under test ---\n\n        import PropTypes from \"prop-types\";\n        class Component extends React.Component {};\n        Component.childContextTypes = {\n          a: PropTypes.bools,\n          b: PropTypes.Array,\n          c: PropTypes.function,\n          d: PropTypes.objectof,\n        }\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: bools\n  [1] (messageId: typoPropType): Typo in declared prop type: Array\n  [2] (messageId: typoPropType): Typo in declared prop type: function\n  [3] (messageId: typoPropType): Typo in declared prop type: objectof\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[80], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Typo in declared prop type: bools");
      expect(matches[1].message).toBe("Typo in declared prop type: Array");
      expect(matches[2].message).toBe("Typo in declared prop type: function");
      expect(matches[3].message).toBe("Typo in declared prop type: objectof");
    });

    it("invalid[38]: import PropTypes from 'prop-types'; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from 'prop-types';
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 38)\n\n--- Source code under test ---\n\n        import PropTypes from 'prop-types';\n        class Component extends React.Component {};\n        Component.childContextTypes = {\n          a: PropTypes.bools,\n          b: PropTypes.Array,\n          c: PropTypes.function,\n          d: PropTypes.objectof,\n        }\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: bools\n  [1] (messageId: typoPropType): Typo in declared prop type: Array\n  [2] (messageId: typoPropType): Typo in declared prop type: function\n  [3] (messageId: typoPropType): Typo in declared prop type: objectof\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[81], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Typo in declared prop type: bools");
      expect(matches[1].message).toBe("Typo in declared prop type: Array");
      expect(matches[2].message).toBe("Typo in declared prop type: function");
      expect(matches[3].message).toBe("Typo in declared prop type: objectof");
    });

    it("invalid[39]: import PropTypes from 'prop-types'; class Component exten...", ({ task }) => {
      const code = `
        import PropTypes from 'prop-types';
        class Component extends React.Component {};
        Component.propTypes = {
          a: PropTypes.string.isrequired,
          b: PropTypes.shape({
            c: PropTypes.number
          }).isrequired
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 39)\n\n--- Source code under test ---\n\n        import PropTypes from 'prop-types';\n        class Component extends React.Component {};\n        Component.propTypes = {\n          a: PropTypes.string.isrequired,\n          b: PropTypes.shape({\n            c: PropTypes.number\n          }).isrequired\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n  [1] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[82], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Typo in prop type chain qualifier: isrequired");
      expect(matches[1].message).toBe("Typo in prop type chain qualifier: isrequired");
    });

    it("invalid[40]: import RealPropTypes from 'prop-types'; class Component e...", ({ task }) => {
      const code = `
        import RealPropTypes from 'prop-types';
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: RealPropTypes.bools,
          b: RealPropTypes.Array,
          c: RealPropTypes.function,
          d: RealPropTypes.objectof,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 40)\n\n--- Source code under test ---\n\n        import RealPropTypes from 'prop-types';\n        class Component extends React.Component {};\n        Component.childContextTypes = {\n          a: RealPropTypes.bools,\n          b: RealPropTypes.Array,\n          c: RealPropTypes.function,\n          d: RealPropTypes.objectof,\n        }\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: bools\n  [1] (messageId: typoPropType): Typo in declared prop type: Array\n  [2] (messageId: typoPropType): Typo in declared prop type: function\n  [3] (messageId: typoPropType): Typo in declared prop type: objectof\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[83], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Typo in declared prop type: bools");
      expect(matches[1].message).toBe("Typo in declared prop type: Array");
      expect(matches[2].message).toBe("Typo in declared prop type: function");
      expect(matches[3].message).toBe("Typo in declared prop type: objectof");
    });

    it("invalid[41]: import React from 'react'; class Component extends React....", ({ task }) => {
      const code = `
      import React from 'react';
      class Component extends React.Component {};
      Component.propTypes = {
        a: React.PropTypes.string.isrequired,
        b: React.PropTypes.shape({
          c: React.PropTypes.number
        }).isrequired
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 41)\n\n--- Source code under test ---\n\n      import React from 'react';\n      class Component extends React.Component {};\n      Component.propTypes = {\n        a: React.PropTypes.string.isrequired,\n        b: React.PropTypes.shape({\n          c: React.PropTypes.number\n        }).isrequired\n      }\n    \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n  [1] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[84], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Typo in prop type chain qualifier: isrequired");
      expect(matches[1].message).toBe("Typo in prop type chain qualifier: isrequired");
    });

    it("invalid[42]: import React from 'react'; class Component extends React....", ({ task }) => {
      const code = `
        import React from 'react';
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: React.PropTypes.bools,
          b: React.PropTypes.Array,
          c: React.PropTypes.function,
          d: React.PropTypes.objectof,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 42)\n\n--- Source code under test ---\n\n        import React from 'react';\n        class Component extends React.Component {};\n        Component.childContextTypes = {\n          a: React.PropTypes.bools,\n          b: React.PropTypes.Array,\n          c: React.PropTypes.function,\n          d: React.PropTypes.objectof,\n        }\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: bools\n  [1] (messageId: typoPropType): Typo in declared prop type: Array\n  [2] (messageId: typoPropType): Typo in declared prop type: function\n  [3] (messageId: typoPropType): Typo in declared prop type: objectof\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[85], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Typo in declared prop type: bools");
      expect(matches[1].message).toBe("Typo in declared prop type: Array");
      expect(matches[2].message).toBe("Typo in declared prop type: function");
      expect(matches[3].message).toBe("Typo in declared prop type: objectof");
    });

    it("invalid[43]: import { PropTypes } from 'react'; class Component extend...", ({ task }) => {
      const code = `
      import { PropTypes } from 'react';
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string.isrequired,
        b: PropTypes.shape({
          c: PropTypes.number
        }).isrequired
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 43)\n\n--- Source code under test ---\n\n      import { PropTypes } from 'react';\n      class Component extends React.Component {};\n      Component.propTypes = {\n        a: PropTypes.string.isrequired,\n        b: PropTypes.shape({\n          c: PropTypes.number\n        }).isrequired\n      }\n    \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n  [1] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[86], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Typo in prop type chain qualifier: isrequired");
      expect(matches[1].message).toBe("Typo in prop type chain qualifier: isrequired");
    });

    it("invalid[44]: import 'react'; class Component extends React.Component {};", ({ task }) => {
      const code = `
      import 'react';
      class Component extends React.Component {};
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 44)\n\n--- Source code under test ---\n\n      import 'react';\n      class Component extends React.Component {};\n    \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noReactBinding): `'react'` imported without a local `React` binding.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[87], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`'react'` imported without a local `React` binding.");
    });

    it("invalid[45]: import { PropTypes } from 'react'; class Component extend...", ({ task }) => {
      const code = `
        import { PropTypes } from 'react';
        class Component extends React.Component {};
        Component.childContextTypes = {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 45)\n\n--- Source code under test ---\n\n        import { PropTypes } from 'react';\n        class Component extends React.Component {};\n        Component.childContextTypes = {\n          a: PropTypes.bools,\n          b: PropTypes.Array,\n          c: PropTypes.function,\n          d: PropTypes.objectof,\n        }\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: bools\n  [1] (messageId: typoPropType): Typo in declared prop type: Array\n  [2] (messageId: typoPropType): Typo in declared prop type: function\n  [3] (messageId: typoPropType): Typo in declared prop type: objectof\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[88], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Typo in declared prop type: bools");
      expect(matches[1].message).toBe("Typo in declared prop type: Array");
      expect(matches[2].message).toBe("Typo in declared prop type: function");
      expect(matches[3].message).toBe("Typo in declared prop type: objectof");
    });

    it("invalid[46]: import PropTypes from 'prop-types'; class Component exten...", ({ task }) => {
      const code = `
      import PropTypes from 'prop-types';
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string.isrequired,
        b: PropTypes.shape({
          c: PropTypes.number
        }).isrequired
      }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 46)\n\n--- Source code under test ---\n\n      import PropTypes from 'prop-types';\n      class Component extends React.Component {};\n      Component.propTypes = {\n        a: PropTypes.string.isrequired,\n        b: PropTypes.shape({\n          c: PropTypes.number\n        }).isrequired\n      }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n  [1] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[89], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Typo in prop type chain qualifier: isrequired");
      expect(matches[1].message).toBe("Typo in prop type chain qualifier: isrequired");
    });

    it("invalid[47]: import PropTypes from 'prop-types'; class Component exten...", ({ task }) => {
      const code = `
      import PropTypes from 'prop-types';
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string.isrequired,
        b: PropTypes.shape({
          c: PropTypes.number
        }).isrequired
      }
    `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 47)\n\n--- Source code under test ---\n\n      import PropTypes from 'prop-types';\n      class Component extends React.Component {};\n      Component.propTypes = {\n        a: PropTypes.string.isrequired,\n        b: PropTypes.shape({\n          c: PropTypes.number\n        }).isrequired\n      }\n    \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n  [1] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[90], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Typo in prop type chain qualifier: isrequired");
      expect(matches[1].message).toBe("Typo in prop type chain qualifier: isrequired");
    });

    it("invalid[48]: import React from 'react'; import PropTypes from 'prop-ty...", ({ task }) => {
      const code = `
        import React from 'react';
        import PropTypes from 'prop-types';
        const Component = React.createReactClass({
          propTypes: {
            a: PropTypes.string.isrequired,
            b: PropTypes.shape({
              c: PropTypes.number
            }).isrequired
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 48)\n\n--- Source code under test ---\n\n        import React from 'react';\n        import PropTypes from 'prop-types';\n        const Component = React.createReactClass({\n          propTypes: {\n            a: PropTypes.string.isrequired,\n            b: PropTypes.shape({\n              c: PropTypes.number\n            }).isrequired\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n  [1] (messageId: typoPropTypeChain): Typo in prop type chain qualifier: isrequired\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[91], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Typo in prop type chain qualifier: isrequired");
      expect(matches[1].message).toBe("Typo in prop type chain qualifier: isrequired");
    });

    it("invalid[49]: import React from 'react'; import PropTypes from 'prop-ty...", ({ task }) => {
      const code = `
        import React from 'react';
        import PropTypes from 'prop-types';
        const Component = React.createReactClass({
          childContextTypes: {
            a: PropTypes.bools,
            b: PropTypes.Array,
            c: PropTypes.function,
            d: PropTypes.objectof,
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 49)\n\n--- Source code under test ---\n\n        import React from 'react';\n        import PropTypes from 'prop-types';\n        const Component = React.createReactClass({\n          childContextTypes: {\n            a: PropTypes.bools,\n            b: PropTypes.Array,\n            c: PropTypes.function,\n            d: PropTypes.objectof,\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 4 diagnostic(s):\n  [0] (messageId: typoPropType): Typo in declared prop type: bools\n  [1] (messageId: typoPropType): Typo in declared prop type: Array\n  [2] (messageId: typoPropType): Typo in declared prop type: function\n  [3] (messageId: typoPropType): Typo in declared prop type: objectof\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[92], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(4);
      expect(matches[0].message).toBe("Typo in declared prop type: bools");
      expect(matches[1].message).toBe("Typo in declared prop type: Array");
      expect(matches[2].message).toBe("Typo in declared prop type: function");
      expect(matches[3].message).toBe("Typo in declared prop type: objectof");
    });

    it("invalid[50]: import React from 'react'; const Component = React.create...", ({ task }) => {
      const code = `
        import React from 'react';
        const Component = React.createReactClass({
          proptypes: {},
          childcontexttypes: {},
          contexttypes: {},
          getdefaultProps() { },
          getinitialState() { },
          getChildcontext() { },
          ComponentWillMount() { },
          ComponentDidMount() { },
          ComponentWillReceiveProps() { },
          ShouldComponentUpdate() { },
          ComponentWillUpdate() { },
          ComponentDidUpdate() { },
          ComponentWillUnmount() { },
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 50)\n\n--- Source code under test ---\n\n        import React from 'react';\n        const Component = React.createReactClass({\n          proptypes: {},\n          childcontexttypes: {},\n          contexttypes: {},\n          getdefaultProps() { },\n          getinitialState() { },\n          getChildcontext() { },\n          ComponentWillMount() { },\n          ComponentDidMount() { },\n          ComponentWillReceiveProps() { },\n          ShouldComponentUpdate() { },\n          ComponentWillUpdate() { },\n          ComponentDidUpdate() { },\n          ComponentWillUnmount() { },\n          render() {\n            return <div>Hello {this.props.name}</div>;\n          }\n        });\n      \n\nThis code is INVALID — the rule should produce 13 diagnostic(s):\n  [0] (messageId: typoPropDeclaration): Typo in property declaration\n  [1] (messageId: typoPropDeclaration): Typo in property declaration\n  [2] (messageId: typoPropDeclaration): Typo in property declaration\n  [3] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: getdefaultProps should be getDefaultProps\n  [4] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: getinitialState should be getInitialState\n  [5] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: getChildcontext should be getChildContext\n  [6] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentWillMount should be componentWillMount\n  [7] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentDidMount should be componentDidMount\n  [8] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentWillReceiveProps should be componentWillReceiveProps\n  [9] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ShouldComponentUpdate should be shouldComponentUpdate\n  [10] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentWillUpdate should be componentWillUpdate\n  [11] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentDidUpdate should be componentDidUpdate\n  [12] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: ComponentWillUnmount should be componentWillUnmount\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[93], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(13);
      expect(matches[0].message).toBe("Typo in property declaration");
      expect(matches[1].message).toBe("Typo in property declaration");
      expect(matches[2].message).toBe("Typo in property declaration");
      expect(matches[3].message).toBe("Typo in component lifecycle method declaration: getdefaultProps should be getDefaultProps");
      expect(matches[4].message).toBe("Typo in component lifecycle method declaration: getinitialState should be getInitialState");
      expect(matches[5].message).toBe("Typo in component lifecycle method declaration: getChildcontext should be getChildContext");
      expect(matches[6].message).toBe("Typo in component lifecycle method declaration: ComponentWillMount should be componentWillMount");
      expect(matches[7].message).toBe("Typo in component lifecycle method declaration: ComponentDidMount should be componentDidMount");
      expect(matches[8].message).toBe("Typo in component lifecycle method declaration: ComponentWillReceiveProps should be componentWillReceiveProps");
      expect(matches[9].message).toBe("Typo in component lifecycle method declaration: ShouldComponentUpdate should be shouldComponentUpdate");
      expect(matches[10].message).toBe("Typo in component lifecycle method declaration: ComponentWillUpdate should be componentWillUpdate");
      expect(matches[11].message).toBe("Typo in component lifecycle method declaration: ComponentDidUpdate should be componentDidUpdate");
      expect(matches[12].message).toBe("Typo in component lifecycle method declaration: ComponentWillUnmount should be componentWillUnmount");
    });

    it("invalid[51]: class Hello extends React.Component { getDerivedStateFrom...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          getDerivedStateFromProps() { }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 51)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          getDerivedStateFromProps() { }\n        }\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: staticLifecycleMethod): Lifecycle method should be static: getDerivedStateFromProps\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[94], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("Lifecycle method should be static: getDerivedStateFromProps");
    });

    it("invalid[52]: class Hello extends React.Component { GetDerivedStateFrom...", ({ task }) => {
      const code = `
        class Hello extends React.Component {
          GetDerivedStateFromProps() { }
        }
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 52)\n\n--- Source code under test ---\n\n        class Hello extends React.Component {\n          GetDerivedStateFromProps() { }\n        }\n      \n\nThis code is INVALID — the rule should produce 2 diagnostic(s):\n  [0] (messageId: staticLifecycleMethod): Lifecycle method should be static: GetDerivedStateFromProps\n  [1] (messageId: typoLifecycleMethod): Typo in component lifecycle method declaration: GetDerivedStateFromProps should be getDerivedStateFromProps\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[95], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(2);
      expect(matches[0].message).toBe("Lifecycle method should be static: GetDerivedStateFromProps");
      expect(matches[1].message).toBe("Typo in component lifecycle method declaration: GetDerivedStateFromProps should be getDerivedStateFromProps");
    });

    it("invalid[53]: import 'prop-types'", ({ task }) => {
      const code = `
        import 'prop-types'
      `;
      task.meta.source = code;
      task.meta.explanation = "Rule: no-typos\nType: invalid (index 53)\n\n--- Source code under test ---\n\n        import 'prop-types'\n      \n\nThis code is INVALID — the rule should produce 1 diagnostic(s):\n  [0] (messageId: noPropTypesBinding): `'prop-types'` imported without a local `PropTypes` binding.\n\nRule message templates:\n  typoPropTypeChain: Typo in prop type chain qualifier: {{name}}\n  typoPropType: Typo in declared prop type: {{name}}\n  typoStaticClassProp: Typo in static class property declaration\n  typoPropDeclaration: Typo in property declaration\n  typoLifecycleMethod: Typo in component lifecycle method declaration: {{actual}} should be {{expected}}\n  staticLifecycleMethod: Lifecycle method should be static: {{method}}\n  noPropTypesBinding: `'prop-types'` imported without a local `PropTypes` binding.\n  noReactBinding: `'react'` imported without a local `React` binding.";
      const matches = ruleErrors(results[96], RULE_NAME, RULE_MESSAGES);
      expect(matches).toHaveLength(1);
      expect(matches[0].message).toBe("`'prop-types'` imported without a local `PropTypes` binding.");
    });

  });
});
