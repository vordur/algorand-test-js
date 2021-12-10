import { StateContext } from "./Context";

export enum ActionType {
  SET_INSURERACC = "set insurer account",
}

export type Action = {
  type: ActionType;
  payload: StateContext;
};

export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.SET_INSURERACC:
      localStorage.setItem(
        "insurer-acc",
        JSON.stringify(action.payload.insurerAcc)
      );
      return {
        ...state,
        insurerAcc: action.payload.insurerAcc,
      };
    default:
      throw new Error("Not among actions");
  }
};
