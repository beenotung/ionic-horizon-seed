import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountType} from "../../model/config/account";

/*
 Generated class for the MainDashboard page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-main-dashboard',
  templateUrl: 'main-dashboard.html'
})
export class MainDashboardPage {
  accountType: AccountType.Type;
  AccountType = AccountType.Type;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.accountType = AccountType.get();
    console.log('account type', this.accountType);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainDashboardPage');
  }

}
