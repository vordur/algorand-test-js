import { Dispatch, ReactNode, createContext } from "react";

import { UserAcc } from "../../algorand";
import { Action } from "./reducer";

interface Props {
  children: ReactNode;
}

export type InsuranceGroups = {
  [key: string]: boolean;
};

export interface StateContext {
  claimerAcc: {
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
  claimerAcc: {
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
