import React, {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

import { UserAcc } from "../../algorand";
import { reducer, Action } from "./reducer";

interface Props {
  children: ReactNode;
}

export type InsuranceGroups = {
  [key: string]: boolean;
};

export interface StateContext {
  insurerAcc: {
    acc: UserAcc;
    mnemonic: string;
  };
  creatorInfo: Record<string, any>;
}

interface Store {
  state: StateContext;
  dispatch?: Dispatch<Action>;
}

export const defaultState: StateContext = {
  insurerAcc: {
    acc: {
      addr: "",
      sk: new Uint8Array(),
    },
    mnemonic: "",
  },
  creatorInfo: {},
};

const Context = createContext<Store>({ state: defaultState });

export default Context;
