import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IonTable} from "../ion-table/ion-table";
import {FormControl} from "@angular/forms";
import 'rxjs/add/operator/debounceTime';

/*
 Generated class for the CommonOverview component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'common-overview',
  templateUrl: 'common-overview.html'
})
export class CommonOverviewComponent<A> {

  @Input()
  create_new_text: string = 'Create New';

  @Input()
  recentListTitle: string;
  @Input()
  searchResultTitle: string;

  @Input()
  headers: string[];

  @Input()
  recentList: A[];

  @Input()
  searchResult: A[];

  @Input()
  datum_to_cols?: (a: A) => IonTable.TableCol[] = IonTable.default_datum_to_cols;

  /**
   * search bar
   * */
  @Input()
  placeholder: string;
  searchText: string = '';
  searchForm = new FormControl;

  @Output()
  simpleSearch = new EventEmitter<string>();
  @Output()
  advancedSearch = new EventEmitter();

  @Output()
  createNew = new EventEmitter();

  @Output()
  cellClick = new EventEmitter<IonTable.ClickEvent<A>>();

  constructor() {
    console.log('Hello CommonOverview Component');
    this.searchForm.valueChanges
      .subscribe(text => this.simpleSearch.emit(text));
  }
}
