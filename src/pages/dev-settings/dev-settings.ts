import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

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
  keyAccountType: string;

  ngOnInit(): void {
    console.log('loading settings');
  }

  ngOnDestroy(): void {
    console.log('saving settings');
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevSettingsPage');
  }

}
