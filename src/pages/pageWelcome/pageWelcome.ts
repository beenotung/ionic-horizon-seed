import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {config} from '../../app/config';

@Component({
  selector: 'page-pageWelcome',
  templateUrl: 'pageWelcome.html'
})
export class PageWelcome {
  appname: string;

  constructor(public navCtrl: NavController) {
    this.appname = "Coin Welcome";
  }


  hasLogin() {
    return false;
  }
}
