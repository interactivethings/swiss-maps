import { Draft } from "immer";
import * as React from "react";
import { defaultOptions, Options, Shape } from "src/shared";

export interface State {
  options: Options;
  highlightedShape?: Shape;
}

export interface Value {
  state: State;
  mutate: (f: (draft: Draft<State>) => void | State) => void;
}

const Context = React.createContext<Value>({
  state: {
    options: defaultOptions,
  },
  mutate: () => {
    throw new Error("Not Implemented");
  },
});

export const Provider = Context.Provider;
export const useContext = () => React.useContext(Context);
