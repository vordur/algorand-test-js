import { StateContext } from "./Context";

export enum ActionType {
  SET_INSURERACC = "set insurer account",
  SET_CREATOR_INFO = "set creator wallet",
  SET_CLAIMER_WALLET = "set claimer wallet",
}

export type Action = {
  type: ActionType;
  payload: StateContext;
};

export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.SET_INSURERACC:
      localStorage.setItem(
        "insurer-wallet",
        JSON.stringify(action.payload.insurerAcc)
      );
      return {
        ...state,
        insurerAcc: action.payload.insurerAcc,
      };
    case ActionType.SET_CREATOR_INFO:
      localStorage.setItem(
        "insurer-acc",
        JSON.stringify(action.payload.creatorInfo)
      );
      return {
        ...state,
        creatorInfo: action.payload.creatorInfo,
      };
    case ActionType.SET_CLAIMER_WALLET:
      localStorage.setItem(
        "claimer-wallet",
        JSON.stringify(action.payload.claimerAcc)
      );
      return {
        ...state,
        claimerAcc: action.payload.claimerAcc,
      };
    default:
      throw new Error("Not among actions");
  }
};
