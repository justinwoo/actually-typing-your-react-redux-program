// install @types/react-redux and other nonsense

import * as React from "react";
import { connect } from "react-redux";

// import { YourActualAppState, YourActualAppDispatch } from './wherever-it-is.ts'
type YourActualAppState = {
  whatever: {
    apple: String;
    banana: String;
  };
};
// hopefully you make a union of your actual actions in YourActualAppActions or something
type YourActualAppDispatch = (action: { type: "ASDF" }) => void;

// map state to props function that returns { whateverStateField: string }
export function mapStateToProps({ whatever }: YourActualAppState) {
  return {
    whateverStateField: "whatever"
  };
}

// map dispatch to props function that returns { whateverDispatchField: (...) => void }
export function mapDispatchToProps(dispatch: YourActualAppDispatch) {
  return {
    whateverDispatchField: (whatever: { kiwi: string }) =>
      dispatch({ type: "ASDF" })
  };
}

// function for making a "value" of the result type
function makeExtractable<Input, Output>(fn: (input: Input) => Output): Output {
  return (false as true) && fn({} as any); // trick compiler into evaluating return value, maybe this will be a feature in 4.0+++
}

// use makeExtractable on mapStateToProps
const extractStateProps = makeExtractable(mapStateToProps);
type StateProps = typeof extractStateProps;
// on hover:
// type StateProps = {
//   whateverStateField: string;
// }

// same with extractDispatchProps
const extractDispatchProps = makeExtractable(mapDispatchToProps);
type DispatchProps = typeof extractDispatchProps;
// on hover:
// type DispatchProps = {
//   whateverDispatchField: (whatever: { kiwi: string; }) => void;
// }

// whatever props this actually exposes
export type Props = {
  whateverPropField: {
    pineapple: string;
  };
};

// Clean/Pick trick suggested by @gcanti for cleaner intersections
type Clean<T> = Pick<T, keyof T>;
// intersection type for your component
type Type = Clean<Props & StateProps & DispatchProps>;
// so now:
// type Type = {
//   whateverPropField: {
//       pineapple: string;
//   };
//   whateverStateField: string;
//   whateverDispatchField: (whatever: {
//       kiwi: string;
//   }) => void;|
// }

// OR
// type Type = Props & StateProps & DispatchProps // intersection type for your component
// type Type = Props & {
//   whateverStateField: string;
// } & {
//   whateverDispatchField: (whatever: {
//       kiwi: string;
//   }) => void;
// }

// important: set Props for exporting the type
export const YourComponent: React.ComponentClass<Props> = connect(
  mapStateToProps,
  mapDispatchToProps
)(function(props: Type) { // Type used here for the combined props from connect
  return <div />
});

// congrats, now you have something actually useful that type checks in your whole app, unlike most every example I've seen
// remember: if you value your sanity, choose any compile-to-JS language that isn't Javascript/Typescript/Flow
