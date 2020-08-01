import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, take } from "rxjs/operators";


import { UsersActions } from "../store/actions";
import { UserPartialState } from "../store/reducers/users";
import { selectEntityLoaded } from "../store/selectors/users";

@Injectable()
export class UsersResolver implements Resolve<boolean> {
  constructor(private store: Store<UserPartialState>) {}

  resolve(): Observable<boolean> {
    const loaded$ = this.store.pipe(select(selectEntityLoaded));

    return loaded$.pipe(

      filter(loaded => {

        if (loaded === false) {
          this.store.dispatch(UsersActions.loadUsers());
        }

        return loaded;
      }),
      take(1)
    );
  }
}