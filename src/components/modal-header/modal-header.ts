import {Component, Input} from '@angular/core';
import {ViewController} from "ionic-angular";

/*
 Generated class for the ModalHeader component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'modal-header',
  templateUrl: 'modal-header.html'
})
export class ModalHeaderComponent {
  @Input()
  title: string;

  constructor(private viewCtrl: ViewController) {
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }
}
