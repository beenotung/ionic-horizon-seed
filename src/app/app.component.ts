import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {CommonService} from "../services/common/common.service";
import {LoginPage} from "../pages/login/login";
import {config} from "./app.config";
import {Role} from "../model/data/role";
import {WelcomePage} from "../pages/welcome/welcome";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen
    , common: CommonService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    common.config();
    common.nav.subscribe(res => {
      if (res.type === "root") {
        this.nav.setRoot(res.pageOrViewCtrl, res.params, res.opts, res.done);
      } else if (res.type === "push") {
      } else {
        this.nav.push(res.pageOrViewCtrl, res.params, res.opts, res.done);
        console.error("unknown type", res);
      }
    });
    /* dev */
    if (config.mode === "dev") {
      this.rootPage = WelcomePage;
    }
  }
}

export namespace app {
  export function setRole(role: Role) {
    document.querySelector("[data-role]")
      .setAttribute("data-role", Role[role]);
  }
}
