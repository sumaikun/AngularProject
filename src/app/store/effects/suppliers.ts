import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, switchMap, catchError } from "rxjs/operators";

import { SuppliersActions } from "../actions";
import { SuppliersService } from "../../services/suppliers";

@Injectable()
export class EntityEffects {

  loadEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SuppliersActions.loadSuppliers),
      switchMap(() =>
        this.entityService.getEntities().pipe(
          map((res: any) =>
            SuppliersActions.loadSuppliersSuccess({
              data: res
            })
          ),
          catchError(error =>
            of(
              SuppliersActions.loadSuppliersFail({
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
    ofType(SuppliersActions.loadSupplier),
    switchMap((any) =>
      this.entityService.getEntity(any["id"]).pipe(
        map((res: any) =>
          SuppliersActions.loadSupplierSuccess({
            id:any["id"],
            item:res
          })
        ),
        catchError(error =>
          of(
            SuppliersActions.loadSupplierFail({
              error
            })
          )
        )
      )
    )
  )
);

createdSupplier$ = createEffect(() =>
  this.actions$.pipe(
    ofType(SuppliersActions.createSupplier),
    switchMap((any) =>
      this.entityService.saveEntity(any["data"]).pipe(
        map((res: any) =>
          SuppliersActions.createSupplierSuccess({
            item: res
          })
        ),
        catchError(error =>
          of(
            SuppliersActions.createSupplierFail({
              error
            })
          )
        )
      )
    )
  )
);

updatedSupplier$ = createEffect(() =>
  this.actions$.pipe(
    ofType(SuppliersActions.updateSupplier),
    switchMap((any) =>
      this.entityService.updateEntity(any["data"],any["id"]).pipe(
        map((res: any) =>
          SuppliersActions.updateSupplierSuccess({
            item: any["data"]
          })
        ),
        catchError(error =>
          of(
            SuppliersActions.updateSupplierFail({
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
    private entityService: SuppliersService
  ) {}
}
