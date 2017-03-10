import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MainDashboardPage} from "../main-dashboard/main-dashboard";
import {DatabaseService} from "../../providers/database-service";
import {CommonService} from "../../providers/common-service";

/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username: string;
  password: string;

  constructor(public navCtrl: NavController
    , private db: DatabaseService
    , public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    console.log('try to login', this.username, this.password);
    this.navCtrl.setRoot(MainDashboardPage);
  }

  resetPassword() {
    console.log('reset password')
  }

}
