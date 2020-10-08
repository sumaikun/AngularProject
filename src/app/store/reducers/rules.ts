import { createReducer, on, Action } from "@ngrx/store";

import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { RulesActions } from "../actions";
import { Rule } from "../../models/rule";

export const ENTITY_FEATURE_KEY = "rule";

export interface State extends EntityState<Rule> {
  loaded: boolean;
  error?: Error | any;
}

export const adapter: EntityAdapter<Rule> = createEntityAdapter<Rule>({
  // In this case this would be optional since primary key is id
  selectId: item => item.id
});

export interface RulePartialState {
  readonly [ENTITY_FEATURE_KEY]: State;
}

export const initialState: State = adapter.getInitialState({
  // Additional entity state properties
  loaded: false,
  error: null
});

const _reducer = createReducer(
  initialState,
  on(RulesActions.loadRulesSuccess, (state, { data }) => {
    console.log("data in reducer",data)
    return adapter.addAll(data, {
      ...state,
      loaded: true
    });
  }),
  on(RulesActions.loadRulesFail, (state, { error }) => {
    console.log("error",error)
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(RulesActions.loadRuleSuccess, (state, { id, item }) => {
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });
  }),
  on(RulesActions.loadRuleFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(RulesActions.createRuleFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(RulesActions.createRuleSuccess, (state, { item }) => {    
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });    
  }),
  on(RulesActions.updateRuleFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(RulesActions.updateRuleSuccess, (state, { item }) => {    
    return adapter.addOne(item, {
      ...state,
      loaded:true
    });    
  }),
  on(RulesActions.deleteRuleFail, (state, { error }) => {
    return {
      ...state,
      error,
      loaded:false
    };
  }),
  on(RulesActions.deleteRuleSuccess, (state, { item }) => {    
    return {
      ...state,
      loaded:true
    }    
  }),
  on(RulesActions.offLoad, (state) => {    
    return{
      ...state,
      loaded:false 
    } 
  })
  // on(RuleActions.updateRules, (state, { rules }) => {
  //   return adapter.updateMany(rules, state);
  // })
);

export function reducer(state: State | undefined, action: Action) {
  return _reducer(state, action);
}
