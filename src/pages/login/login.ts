import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {TranslateService} from "@ngx-translate/core";
import {config} from "../../app/app.config";
import {is_hk_mobile_phone} from "@beenotung/tslib/validate";
import {StorageKey, StorageService} from "../../services/storage/storage.service";
import {UserSessionService} from "../../services/user-session/user-session.service";

@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {

  phone_num = "";
  version = config.client_version;

  lang: string;

  constructor(public navCtrl: NavController
    , private translate: TranslateService
    , private storage: StorageService
    , private userSession: UserSessionService
    , public navParams: NavParams) {

    this.storage.get(StorageKey.lang).then(x => {
      if (x) {
        this.lang = x.toString();
      } else {
        this.lang = this.translate.getBrowserLang();
      }
    });

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  signup() {
    console.log("signup");
  }

  //
  // showLang() {
  //   this.modalCtrl.create(LangPopComponent).present();
  // }

  setAppLang(lang: string) {
    this.lang = lang;
    this.translate.use(lang);
    this.storage.set(StorageKey.lang, lang);
  }

  login() {
    console.log("login");
    this.userSession.setUserID("mock_user");
    this.navCtrl.setRoot(TabsPage);
  }

  validate(): boolean {
    return true || is_hk_mobile_phone(this.phone_num);
  }

}
