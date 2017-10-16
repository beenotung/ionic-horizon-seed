import {Component, forwardRef, Inject, OnInit} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import "rxjs/add/operator/toPromise";
import {CommonService} from "../../services/common/common.service";
import {DatabaseService} from "../../services/database/database.service";
import {LoginPage} from "../login/login";

@Component({
  selector: "page-welcome",
  templateUrl: "welcome.html",
})
export class WelcomePage implements OnInit {

  text = "loading";

  status = "loading";

  constructor(public navCtrl: NavController
    , translate: TranslateService
    , @Inject(forwardRef(() => CommonService)) private common: CommonService
              // , private common: CommonService
    , db: DatabaseService
    , public navParams: NavParams) {
    translate.get("test").toPromise().then(s => this.text = s);
    db.getHz().then(() => this.status = "Ready");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WelcomePage");
  }

  ngOnInit() {
    const f = () => {
      if (this.text !== "Translate Success" || this.status !== "Ready") {
        return setTimeout(f, 20);
      }
      this.common.showLoading("navigate to login screen after 2 seconds");
      setTimeout(() => {
        this.common.dismissLoading();
        return this.navCtrl.setRoot(LoginPage);
      }, 2000);
    };
    setTimeout(f, 20);
  }

}
