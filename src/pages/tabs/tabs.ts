import {Component, OnInit, ViewChild} from "@angular/core";
import {NavController, Tabs} from "ionic-angular";
import {SettingsPage} from "../settings/settings";
import {WelcomePage} from "../welcome/welcome";
import {UserSessionService} from "../../services/user-session/user-session.service";

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage implements OnInit {

  static instant: TabsPage;

  @ViewChild("tabs") tabs: Tabs;

  tab1 = SettingsPage;
  tab2 = SettingsPage;
  tab3 = SettingsPage;
  tab4 = SettingsPage;

  constructor(public navCtrl: NavController
    , private userSession: UserSessionService) {
    TabsPage.instant = this;
  }

  async ngOnInit() {
    if (!this.userSession.hasLogin()) {
      return this.navCtrl.setRoot(WelcomePage);
    }
  }
}
