import { createAction, props } from "@ngrx/store";

import { Chronos } from "../../models/chronos";

export enum ChronosActionTypes {
  LoadChronos = "[Chronos] Load Chronos",
  LoadChronosSuccess = "[Chronos] Load Chronos Success",
  LoadChronosFail = "[Chronos] Load Chronos Fail",
  LoadChronosByID = "[Chronos] Load Chronos By id",
  LoadChronosSuccessByID = "[Chronos] Load Chronos by id Success",
  LoadChronosFailByID = "[Chronos] Load Chronos by id Fail",
  UpdateChronos = "[Chronos] Update Chronos",
  UpdateChronosSuccess = "[Chronos] Update Chronos Success",
  UpdateChronosFail = "[Chronos] Update Chronos Fail",
  CreateChronos = "[Chronos] Create Chronos",
  CreateChronosSuccess = "[Chronos] Create Chronos Success",
  CreateChronosFail = "[Chronos] Create Chronos Fail",
  DeleteChronos = "[Chronos] Delete Chronos",
  DeleteChronosSuccess = "[Chronos] Delete Chronos Success",
  DeleteChronosFail = "[Chronos] Delete Chronos Fail",
  OffLoad = "[Chronos] OffLoad"
}

export const offLoad = createAction(ChronosActionTypes.OffLoad);

export const loadChronos = createAction(ChronosActionTypes.LoadChronos);

export const loadChronosSuccess = createAction(
  ChronosActionTypes.LoadChronosSuccess,
  props<{ data: Chronos[] }>()
);

export const loadChronosFail = createAction(
  ChronosActionTypes.LoadChronosFail,
  props<{ error: Error | any }>()
);

export const loadChronosByID = createAction(
  ChronosActionTypes.LoadChronosByID,
  props<{ id: string | number }>()
);

export const loadChronosSuccessByID = createAction(
  ChronosActionTypes.LoadChronosSuccessByID,
  props<{ id: string | number; item: Chronos }>()
);

export const loadChronosFailByID = createAction(
  ChronosActionTypes.LoadChronosFailByID,
  props<{ error: Error | any }>()
);

export const updateChronos = createAction(
  ChronosActionTypes.UpdateChronos,
  props<{ id: number | string; data: any;  }>()
);

export const updateChronosSuccess = createAction(
  ChronosActionTypes.UpdateChronosSuccess,
  props<{ item: any }>()
);

export const updateChronosFail = createAction(
  ChronosActionTypes.UpdateChronosFail,
  props<{
    error: Error | any;
  }>()
);

export const createChronos = createAction(
  ChronosActionTypes.CreateChronos,
  props<{ data: any }>()
);

export const createChronosSuccess = createAction(
  ChronosActionTypes.CreateChronosSuccess,
  props<{ item: any }>()
);

export const createChronosFail = createAction(
  ChronosActionTypes.UpdateChronosFail,
  props<{
    error: Error | any;
  }>()
);

export const deleteChronos = createAction(
  ChronosActionTypes.DeleteChronos,
  props<{ id: string }>()
);

export const deleteChronosSuccess = createAction(
  ChronosActionTypes.DeleteChronosSuccess,
  props<{}>()
);

export const deleteChronosFail = createAction(
  ChronosActionTypes.DeleteChronosFail,
  props<{
    error: Error | any;
  }>()
);

export const fromChronosActions = {
  loadChronos,
  loadChronosFail,
  loadChronosSuccess,
  loadChronosByID,
  loadChronosFailByID,
  loadChronosSuccessByID,
  createChronos,
  createChronosSuccess,
  createChronosFail,
  updateChronos,
  updateChronosSuccess,
  updateChronosFail,
  deleteChronos,
  deleteChronosSuccess,
  deleteChronosFail,
  offLoad
};
