import { createAction, props } from "@ngrx/store";



export enum AuthActionTypes {
  Authenticate = "[Auth] Authenticate",
  AuthenticateSuccess = "[Auth] Authenticate Success",
  AuthenticateFail = "[Auth] Authenticate Fail",
}

export const auth = createAction(AuthActionTypes.Authenticate,
  props<{ username: string, password: string }>());

export const authSuccess = createAction(
    AuthActionTypes.AuthenticateSuccess,
  props<{ data: any }>()
);

export const authFail = createAction(
    AuthActionTypes.AuthenticateFail,
  props<{ error: Error | any }>()
);



export const fromAuthActions = {
  auth,
  authFail,
  authSuccess,
};
