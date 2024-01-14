import { RootState } from "../store";
import { ThunkAction } from "redux-thunk";

export interface Action {
  type: string;
  payload?: any;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
