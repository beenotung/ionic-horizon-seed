import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountType} from "../../model/config/account";
import {isNumber} from "../../../lib/tslib/src/lang";

/*
 Generated class for the DevSettings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-dev-settings',
  templateUrl: 'dev-settings.html'
})
export class DevSettingsPage implements OnInit, OnDestroy {
  accountType: AccountType.Type;
  AccountTypeList = Object.keys(AccountType.Type).filter(x => !isNumber(x));
  AccountType = AccountType.Type;

  ngOnInit(): void {
    console.log('loading settings');
    this.accountType = AccountType.get();
  }

  ngOnDestroy(): void {
    console.log('saving settings');
    AccountType.set(this.accountType);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevSettingsPage', this.AccountTypeList);
  }

}
