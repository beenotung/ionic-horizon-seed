import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {config} from "../../app/app.config";
import {StorageKey, StorageService} from "../../services/storage/storage.service";

export type Lang = "en" | "zh";

@Component({
  selector: "page-settings",
  templateUrl: "settings.html",
})
export class SettingsPage {

  pushNotice: boolean = false;
  lang: Lang;
  mode = config.mode;

  constructor(public navCtrl: NavController
    , public translate: TranslateService
    , private storage: StorageService
    , public navParams: NavParams) {
    this.storage.get<Lang>(StorageKey.lang).then(x => this.lang = x);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingsPage");
  }

  changeLang() {
    this.translate.use(this.lang);
    this.storage.set(StorageKey.lang, this.lang);
  }

}
