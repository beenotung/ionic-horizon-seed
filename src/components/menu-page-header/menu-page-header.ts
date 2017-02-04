import {Component, Input} from '@angular/core';

/*
 Generated class for the MenuPageHeader component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'menu-page-header',
  templateUrl: 'menu-page-header.html'
})
export class MenuPageHeaderComponent {

  @Input()
  title: string;

}
