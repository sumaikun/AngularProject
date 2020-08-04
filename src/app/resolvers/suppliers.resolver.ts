import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, take } from "rxjs/operators";


import { SuppliersActions } from "../store/actions";
import { SupplierPartialState } from "../store/reducers/suppliers";
import { selectEntityLoaded } from "../store/selectors/suppliers";

@Injectable()
export class SuppliersResolver implements Resolve<boolean> {
  constructor(private store: Store<SupplierPartialState>) {}

  resolve(): Observable<boolean> {
    const loaded$ = this.store.pipe(select(selectEntityLoaded));

    return loaded$.pipe(

      filter(loaded => {

        //console.log("loaded",loaded)

        if (loaded === false) {
          this.store.dispatch(SuppliersActions.loadSuppliers());
        }

        return loaded;
      }),
      take(1)
    );
  }
}