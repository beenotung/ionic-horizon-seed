import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';

/*
 Generated class for the UnderMaintenance page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-under-maintenance',
  templateUrl: 'under-maintenance.html'
})
export class UnderMaintenancePage {

  constructor(public navCtrl: NavController,
              private viewCtrl: ViewController,
              public navParams: NavParams,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnderMaintenancePage');
  }

}
