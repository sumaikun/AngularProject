import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, switchMap, catchError } from "rxjs/operators";

import { UsersActions } from "../actions";
import { UsersService } from "../../services/users";

@Injectable()
export class EntityEffects {
  
  loadEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.entityService.getEntities().pipe(
          map((res: any) =>
            UsersActions.loadUsersSuccess({
              data: res
            })
          ),
          catchError(error =>
            of(
              UsersActions.loadUsersFail({
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
      ofType(UsersActions.loadUser),
      switchMap((any) =>
        this.entityService.getEntity(any["id"]).pipe(
          map((res: any) =>
            UsersActions.loadUserSuccess({
              id:any["id"],
              item:res
            })
          ),
          catchError(error =>
            of(
              UsersActions.loadUserFail({
                error
              })
            )
          )
        )
      )
    )
  );

  createdUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),
      switchMap((any) =>
        this.entityService.saveEntity(any["data"]).pipe(
          map((res: any) =>
            UsersActions.createUserSuccess({
              item: res
            })
          ),
          catchError(error =>
            of(
              UsersActions.createUserFail({
                error
              })
            )
          )
        )
      )
    )
  );

  updatedUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      switchMap((any) =>
        this.entityService.updateEntity(any["data"],any["id"]).pipe(
          map((res: any) =>
            UsersActions.updateUserSuccess({
              item: any["data"]
            })
          ),
          catchError(error =>
            of(
              UsersActions.updateUserFail({
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
    private entityService: UsersService
  ) {}
}
