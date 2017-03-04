import {Component, EventEmitter, Input, Output} from '@angular/core';
import {objValues} from "../../../lib/tslib/src/lang";

/*
 Generated class for the IonTable component.
 s
 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'ion-table',
  templateUrl: 'ion-table.html'
})
export class IonTableComponent<A> {
  @Input()
  title?: string;

  @Input()
  headers?: string[];

  @Input()
  data: A[];

  @Input()
  datum_to_cols?: (a: A) => IonTable.TableCol[] = IonTable.default_datum_to_cols;

  @Input()
  useTable?: boolean = IonTable.fallback;

  @Output()
  cellClick = new EventEmitter<IonTable.ClickEvent<A>>();

  onclick(datum: A, col: any, rowIndex: number, colIndex: number) {
    this.cellClick.emit({
      datum: datum
      , col: col
      , rowIndex: rowIndex
      , colIndex: colIndex
    });
  }
}
export namespace IonTable {
  export let fallback = false;
  export type TableCol = string | number;
  /** @deprecated no use? */
  export interface IonTableParam<A> {
    title?: string;
    headers?: string[];
    data: A[];
    datum_to_cols?: (a: A) => TableCol[];
    useTable?: boolean;
  }
  let hasWarned = false;
  export const default_datum_to_cols = (row: any) => {
    if (!Array.isArray(row)) {
      if (!hasWarned) {
        console.warn('the col is not an array, converting from object to array');
        hasWarned = true;
      }
      return objValues(row);
    }
    return row;
  };
  export interface ClickEvent<A> {
    datum: A;
    col: any;
    rowIndex: number;
    colIndex: number;
  }
}
