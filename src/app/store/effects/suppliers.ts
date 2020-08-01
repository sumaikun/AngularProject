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
              data: res.data
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

  constructor(
    private actions$: Actions,
    private entityService: SuppliersService
  ) {}
}
