import { createAction, props } from "@ngrx/store";

import { Rule } from "../../models/rule";

export enum RuleActionTypes {
  LoadRules = "[Rule] Load Rules",
  LoadRulesSuccess = "[Rule] Load Rules Success",
  LoadRulesFail = "[Rule] Load Rules Fail",
  LoadRule = "[Rule] Load Rule",
  LoadRuleSuccess = "[Rule] Load Rule Success",
  LoadRuleFail = "[Rule] Load Rule Fail",
  UpdateRule = "[Rule] Update Rule",
  UpdateRuleSuccess = "[Rule] Update Rule Success",
  UpdateRuleFail = "[Rule] Update Rule Fail",
  CreateRule = "[Rule] Create Rule",
  CreateRuleSuccess = "[Rule] Create Rule Success",
  CreateRuleFail = "[Rule] Create Rule Fail",
  OffLoad = "[Rule] OffLoad"
}

export const offLoad = createAction(RuleActionTypes.OffLoad);

export const loadRules = createAction(RuleActionTypes.LoadRules);

export const loadRulesSuccess = createAction(
  RuleActionTypes.LoadRulesSuccess,
  props<{ data: Rule[] }>()
);

export const loadRulesFail = createAction(
  RuleActionTypes.LoadRulesFail,
  props<{ error: Error | any }>()
);

export const loadRule = createAction(
  RuleActionTypes.LoadRule,
  props<{ id: string | number }>()
);

export const loadRuleSuccess = createAction(
  RuleActionTypes.LoadRuleSuccess,
  props<{ id: string | number; item: Rule }>()
);

export const loadRuleFail = createAction(
  RuleActionTypes.LoadRuleFail,
  props<{ error: Error | any }>()
);

export const updateRule = createAction(
  RuleActionTypes.UpdateRule,
  props<{ id: number | string; data: any;  }>()
);

export const updateRuleSuccess = createAction(
  RuleActionTypes.UpdateRuleSuccess,
  props<{ item: any }>()
);

export const updateRuleFail = createAction(
  RuleActionTypes.UpdateRuleFail,
  props<{
    error: Error | any;
  }>()
);

export const createRule = createAction(
  RuleActionTypes.CreateRule,
  props<{ data: any }>()
);

export const createRuleSuccess = createAction(
  RuleActionTypes.CreateRuleSuccess,
  props<{ item: any }>()
);

export const createRuleFail = createAction(
  RuleActionTypes.UpdateRuleFail,
  props<{
    error: Error | any;
  }>()
);

export const fromRuleActions = {
  loadRules,
  loadRulesFail,
  loadRulesSuccess,
  loadRule,
  loadRuleFail,
  loadRuleSuccess,
  createRule,
  createRuleSuccess,
  createRuleFail,
  updateRule,
  updateRuleSuccess,
  updateRuleFail,
  offLoad
};
