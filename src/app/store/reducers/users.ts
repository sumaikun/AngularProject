import { createReducer, on, Action } from "@ngrx/store";

import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { UsersActions } from "../actions";
import { User } from "../../models/user";

export const ENTITY_FEATURE_KEY = "user";

export interface State extends EntityState<User> {
  loaded: boolean;
  error?: Error | any;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  // In this case this would be optional since primary key is id
  selectId: item => item.id
});

export interface UserPartialState {
  readonly [ENTITY_FEATURE_KEY]: State;
}

export const initialState: State = adapter.getInitialState({
  // Additional entity state properties
  loaded: false,
  error: null
});

const _reducer = createReducer(
  initialState,
  on(UsersActions.loadUsersSuccess, (state, { data }) => {
    console.log("data in reducer",data)
    return adapter.addAll(data, {
      ...state,
      loaded: true
    });
  }),
  on(UsersActions.loadUsersFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(UsersActions.loadUserSuccess, (state, { id, item }) => {
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });
  }),
  on(UsersActions.loadUserFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(UsersActions.createUserFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(UsersActions.createUserSuccess, (state, { item }) => {    
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });    
  }),
  on(UsersActions.updateUserFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(UsersActions.updateUserSuccess, (state, { item }) => {    
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });    
  }),
  on(UsersActions.offLoad, (state) => {    
    return{
      ...state,
      loaded:false 
    } 
  })
  // on(UserActions.updateUsers, (state, { users }) => {
  //   return adapter.updateMany(users, state);
  // })
);

export function reducer(state: State | undefined, action: Action) {
  return _reducer(state, action);
}
