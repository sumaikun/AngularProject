import { createReducer, on, Action } from "@ngrx/store";

import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { ChronosActions } from "../actions";
import { Chronos } from "../../models/chronos";

export const ENTITY_FEATURE_KEY = "chronos";

export interface State extends EntityState<Chronos> {
  loaded: boolean;
  error?: Error | any;
}

export const adapter: EntityAdapter<Chronos> = createEntityAdapter<Chronos>({
  // In this case this would be optional since primary key is id
  selectId: item => item.id
});

export interface ChronosPartialState {
  readonly [ENTITY_FEATURE_KEY]: State;
}

export const initialState: State = adapter.getInitialState({
  // Additional entity state properties
  loaded: false,
  error: null
});

const _reducer = createReducer(
  initialState,
  on(ChronosActions.loadChronosSuccess, (state, { data }) => {
    console.log("data",data)
    return adapter.addAll(data, {
      ...state,
      loaded: true
    });
  }),
  on(ChronosActions.loadChronosFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(ChronosActions.loadChronosSuccessByID, (state, { id, item }) => {
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });
  }),
  on(ChronosActions.loadChronosFailByID, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(ChronosActions.createChronosFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(ChronosActions.createChronosSuccess, (state, { item }) => {   
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });    
  }),
  on(ChronosActions.updateChronosFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(ChronosActions.updateChronosSuccess, (state, { item }) => { 
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });    
  }),
  on(ChronosActions.offLoad, (state) => {    
    return{
      ...state,
      loaded:false 
    } 
  })
  // on(ChronosActions.updateChronos, (state, { suppliers }) => {
  //   return adapter.updateMany(suppliers, state);
  // })
);

export function reducer(state: State | undefined, action: Action) {
  return _reducer(state, action);
}
