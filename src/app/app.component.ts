import {Component, ViewChild} from "@angular/core";
import {TranslateService} from "ng2-translate";
import {CommonService} from "../providers/common-service";
import {Nav, Platform} from "ionic-angular";
import {LoginPage} from "../pages/login/login";
import {MainDashboardPage} from "../pages/main-dashboard/main-dashboard";
import {DevSettingsPage} from "../pages/dev-settings/dev-settings";
import {translateAsync} from "../../lib/tslib/src/async";
import {Splashscreen, StatusBar} from "ionic-native";

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }> = [];

  constructor(public platform: Platform,
              private translate: TranslateService,
              private common: CommonService,) {
    this.initializeApp();

    // this.rootPage = MainDashboardPage;
    /* just for the ease of dev */

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'dashboard', component: MainDashboardPage}
      , {title: 'dev_settings', component: DevSettingsPage}
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
