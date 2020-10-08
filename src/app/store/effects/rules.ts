import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, switchMap, catchError } from "rxjs/operators";

import { RulesActions } from "../actions";
import { RulesService } from "../../services/rules";

@Injectable()
export class EntityEffects {

  loadEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RulesActions.loadRules),
      switchMap(() =>
        this.entityService.getEntities().pipe(
          map((res: any) => 
            RulesActions.loadRulesSuccess({
              data:res
            })            
          ),
          catchError(error =>
            of(
              RulesActions.loadRulesFail({
                error
              })
            )
          )
        )
      )
    )
  );

  getEntity$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RulesActions.loadRule),
    switchMap((any) =>
      this.entityService.getEntity(any["id"]).pipe(
        map((res: any) =>
          RulesActions.loadRuleSuccess({
            id:any["id"],
            item:res
          })
        ),
        catchError(error =>
          of(
            RulesActions.loadRuleFail({
              error
            })
          )
        )
      )
    )
  )
);

createdRule$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RulesActions.createRule),
    switchMap((any) =>
      this.entityService.saveEntity(any["data"]).pipe(
        map((res: any) =>
          RulesActions.createRuleSuccess({
            item: res
          })
        ),
        catchError(error =>
          of(
            RulesActions.createRuleFail({
              error
            })
          )
        )
      )
    )
  )
);

updatedRule$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RulesActions.updateRule),
    switchMap((any) =>
      this.entityService.updateEntity(any["data"],any["id"]).pipe(
        map((res: any) =>
          RulesActions.updateRuleSuccess({
            item: any["data"]
          })
        ),
        catchError(error =>
          of(
            RulesActions.updateRuleFail({
              error
            })
          )
        )
      )
    )
  )
);

deleteRule$ = createEffect(() =>
  this.actions$.pipe(
    ofType(RulesActions.deleteRule),
    switchMap((any) =>
      this.entityService.deleteEntity(any["id"]).pipe(
        map((res: any) =>
          RulesActions.deleteRuleSuccess({
            item: null
          })
        ),
        catchError(error =>
          of(
            RulesActions.deleteRuleFail({
              error
            })
          )
        )
      )
    )
  )
);

  constructor(
    private actions$: Actions,
    private entityService: RulesService
  ) {}
}
