import { createReducer, on, Action } from "@ngrx/store";

import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { SuppliersActions } from "../actions";
import { Supplier } from "../../models/supplier";

export const ENTITY_FEATURE_KEY = "supplier";

export interface State extends EntityState<Supplier> {
  loaded: boolean;
  error?: Error | any;
}

export const adapter: EntityAdapter<Supplier> = createEntityAdapter<Supplier>({
  // In this case this would be optional since primary key is id
  selectId: item => item.id
});

export interface SupplierPartialState {
  readonly [ENTITY_FEATURE_KEY]: State;
}

export const initialState: State = adapter.getInitialState({
  // Additional entity state properties
  loaded: false,
  error: null
});

const _reducer = createReducer(
  initialState,
  on(SuppliersActions.loadSuppliersSuccess, (state, { data }) => {
    console.log("data",data)
    return adapter.addAll(data, {
      ...state,
      loaded: true
    });
  }),
  on(SuppliersActions.loadSuppliersFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(SuppliersActions.loadSupplierSuccess, (state, { id, item }) => {
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });
  }),
  on(SuppliersActions.loadSupplierFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(SuppliersActions.createSupplierFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(SuppliersActions.createSupplierSuccess, (state, { item }) => {   
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });    
  }),
  on(SuppliersActions.updateSupplierFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(SuppliersActions.updateSupplierSuccess, (state, { item }) => { 
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });    
  }),
  on(SuppliersActions.offLoad, (state) => {    
    return{
      ...state,
      loaded:false 
    } 
  })
  // on(SupplierActions.updateSuppliers, (state, { suppliers }) => {
  //   return adapter.updateMany(suppliers, state);
  // })
);

export function reducer(state: State | undefined, action: Action) {
  return _reducer(state, action);
}
