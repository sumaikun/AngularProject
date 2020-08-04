import { createAction, props } from "@ngrx/store";

import { User } from "../../models/user";

export enum UserActionTypes {
  LoadUsers = "[User] Load Users",
  LoadUsersSuccess = "[User] Load Users Success",
  LoadUsersFail = "[User] Load Users Fail",
  LoadUser = "[User] Load User",
  LoadUserSuccess = "[User] Load User Success",
  LoadUserFail = "[User] Load User Fail",
  UpdateUser = "[User] Update User",
  UpdateUserSuccess = "[User] Update User Success",
  UpdateUserFail = "[User] Update User Fail",
  CreateUser = "[User] Create User",
  CreateUserSuccess = "[User] Create User Success",
  CreateUserFail = "[User] Create User Fail",
  OffLoad = "[User] OffLoad"
}

export const offLoad = createAction(UserActionTypes.OffLoad);

export const loadUsers = createAction(UserActionTypes.LoadUsers);

export const loadUsersSuccess = createAction(
  UserActionTypes.LoadUsersSuccess,
  props<{ data: User[] }>()
);

export const loadUsersFail = createAction(
  UserActionTypes.LoadUsersFail,
  props<{ error: Error | any }>()
);

export const loadUser = createAction(
  UserActionTypes.LoadUser,
  props<{ id: string | number }>()
);

export const loadUserSuccess = createAction(
  UserActionTypes.LoadUserSuccess,
  props<{ id: string | number; item: User }>()
);

export const loadUserFail = createAction(
  UserActionTypes.LoadUserFail,
  props<{ error: Error | any }>()
);

export const updateUser = createAction(
  UserActionTypes.UpdateUser,
  props<{ id: number | string; data: any;  }>()
);

export const updateUserSuccess = createAction(
  UserActionTypes.UpdateUserSuccess,
  props<{ item: any }>()
);

export const updateUserFail = createAction(
  UserActionTypes.UpdateUserFail,
  props<{
    error: Error | any;
  }>()
);

export const createUser = createAction(
  UserActionTypes.CreateUser,
  props<{ data: any }>()
);

export const createUserSuccess = createAction(
  UserActionTypes.CreateUserSuccess,
  props<{ item: any }>()
);

export const createUserFail = createAction(
  UserActionTypes.UpdateUserFail,
  props<{
    error: Error | any;
  }>()
);

export const fromUserActions = {
  loadUsers,
  loadUsersFail,
  loadUsersSuccess,
  loadUser,
  loadUserFail,
  loadUserSuccess,
  createUser,
  createUserSuccess,
  createUserFail,
  updateUser,
  updateUserSuccess,
  updateUserFail,
  offLoad
};
