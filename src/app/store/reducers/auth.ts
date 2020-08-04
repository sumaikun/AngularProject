import { createReducer, on, Action } from "@ngrx/store";

import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { AuthActions } from "../actions";

export const ENTITY_FEATURE_KEY = "auth";

export interface State extends EntityState<any> {
  loaded: boolean;
  error?: Error | any;
  token: string,
  user:any,
  role:string
}

export const adapter: EntityAdapter<any> = createEntityAdapter<any>({
  // In this case this would be optional since primary key is id
  selectId: item => item.id
});

export interface AuthPartialState {
  readonly [ENTITY_FEATURE_KEY]: State;
}

export const initialState: State = adapter.getInitialState({
  // Additional entity state properties
  loaded: false,
  error: null,
  //token: localStorage?.getItem("auth_token"),
  token:null,
  user: null,
  role: null
});

const _reducer = createReducer(
  initialState,
  on(AuthActions.authSuccess, (state, { data }) => {
    
    //console.log("data in reducer",data)

    //localStorage.setItem("auth_token",data.access_token)

    return adapter.setOne(data, {
      ...state,
      token:data.access_token,
      user:data.user,
      role:data.role,
      loaded: true
    });
  }),
  on(AuthActions.authFail, (state, { error }) => {
    return {
      ...state,
      error
    };
  }),
  on(AuthActions.logout, (state, { }) => {
    return {
      ...state,
      loaded: false,
      error: null,
      token:null,
      user: null,
      role: null
    };
  }),
 
);

export function reducer(state: State | undefined, action: Action) {
  return _reducer(state, action);
}
