import { createAction, props } from "@ngrx/store";

import { Supplier } from "../../models/supplier";

export enum SupplierActionTypes {
  LoadSuppliers = "[Supplier] Load Suppliers",
  LoadSuppliersSuccess = "[Supplier] Load Suppliers Success",
  LoadSuppliersFail = "[Supplier] Load Suppliers Fail",
  LoadSupplier = "[Supplier] Load Supplier",
  LoadSupplierSuccess = "[Supplier] Load Supplier Success",
  LoadSupplierFail = "[Supplier] Load Supplier Fail",
  UpdateSupplier = "[Supplier] Update Supplier",
  UpdateSupplierSuccess = "[Supplier] Update Supplier Success",
  UpdateSupplierFail = "[Supplier] Update Supplier Fail"
}

export const loadSuppliers = createAction(SupplierActionTypes.LoadSuppliers);

export const loadSuppliersSuccess = createAction(
  SupplierActionTypes.LoadSuppliersSuccess,
  props<{ data: Supplier[] }>()
);

export const loadSuppliersFail = createAction(
  SupplierActionTypes.LoadSuppliersFail,
  props<{ error: Error | any }>()
);

export const loadSupplier = createAction(
  SupplierActionTypes.LoadSupplier,
  props<{ id: string | number }>()
);

export const loadSupplierSuccess = createAction(
  SupplierActionTypes.LoadSupplierSuccess,
  props<{ id: string | number; item: Supplier }>()
);

export const loadSupplierFail = createAction(
  SupplierActionTypes.LoadSupplierFail,
  props<{ error: Error | any }>()
);

export const updateSupplier = createAction(
  SupplierActionTypes.UpdateSupplier,
  props<{ id: number | string; originalItem: any; updatedItem: any }>()
);

export const updateSupplierSuccess = createAction(
  SupplierActionTypes.UpdateSupplierSuccess,
  props<{ id: number | string; originalItem: any; updatedItem: any }>()
);

export const updateSupplierFail = createAction(
  SupplierActionTypes.UpdateSupplierFail,
  props<{
    id: number | string;
    originalItem: any;
    updatedItem: any;
    error: Error | any;
  }>()
);

export const fromSupplierActions = {
  loadSuppliers,
  loadSuppliersFail,
  loadSuppliersSuccess,
  loadSupplier,
  loadSupplierFail,
  loadSupplierSuccess
};
