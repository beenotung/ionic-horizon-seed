import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {DatabaseService} from "../providers/databaseService";
import {CommonService} from "../providers/commonService";
import {TranslateService} from "ng2-translate";
import {translateAsync} from "../../lib/tslib/src/async";
import {LoginPage} from "../pages/login/login";

@Component({
  templateUrl: 'app.html',
  providers: [
    TranslateService,
    CommonService,
    DatabaseService,
  ],
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }> = [];

  constructor(public platform: Platform,
              private translate: TranslateService,
              private common: CommonService,) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'login', component: LoginPage}
      , {title: 'login', component: LoginPage}
    ];

    this.pages.forEach(x => translateAsync(translate, x.title).then(s => x.title = s));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page: any) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
