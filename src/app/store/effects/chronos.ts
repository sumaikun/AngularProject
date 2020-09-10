import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, switchMap, catchError } from "rxjs/operators";

import { ChronosActions } from "../actions";
import { ChronosService } from "../../services/chronos";

@Injectable()
export class EntityEffects {

  loadEntities$ = createEffect(() =>{    
    console.log("load chronos effect")
    return this.actions$.pipe(
      ofType(ChronosActions.loadChronos),
      switchMap(() =>
        this.entityService.getEntities().pipe(
          map((res: any) =>
            ChronosActions.loadChronosSuccess({
              data: res
            })
          ),
          catchError(error =>
            of(
              ChronosActions.loadChronosFail({
                error
              })
            )
          )
        )
      )
    )
  });

  getEntity$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ChronosActions.loadChronosByID),
    switchMap((any) =>
      this.entityService.getEntity(any["id"]).pipe(
        map((res: any) =>
          ChronosActions.loadChronosSuccessByID({
            id:any["id"],
            item:res
          })
        ),
        catchError(error =>
          of(
            ChronosActions.loadChronosFailByID({
              error
            })
          )
        )
      )
    )
  )
);

createdChronos$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ChronosActions.createChronos),
    switchMap((any) =>
      this.entityService.saveEntity(any["data"]).pipe(
        map((res: any) =>
          ChronosActions.createChronosSuccess({
            item: res
          })
        ),
        catchError(error =>
          of(
            ChronosActions.createChronosFail({
              error
            })
          )
        )
      )
    )
  )
);

updatedChronosByID$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ChronosActions.updateChronos),
    switchMap((any) =>
      this.entityService.updateEntity(any["data"],any["id"]).pipe(
        map((res: any) =>
          ChronosActions.updateChronosSuccess({
            item: any["data"]
          })
        ),
        catchError(error =>
          of(
            ChronosActions.updateChronosFail({
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
    private entityService: ChronosService
  ) {}
}
