import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import {StorageKey, StorageService} from "../storage";
import {config} from "../../app/app.config";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {Loading, LoadingController, NavOptions} from "ionic-angular";
import {Page} from "ionic-angular/navigation/nav-util";
import {UserSessionService} from "../user-session";
import {first_non_null} from "@beenotung/tslib/lang";
import {clear} from "@beenotung/tslib/array";
import {APIResponse, CommonResult} from "../api";
import {hookCheckClientVersion} from "../database";
import {NoticeService} from "../notice";
import {WelcomePage} from "../../pages/welcome/welcome";
import {swal} from "@beenotung/tslib/typestub-sweetalert2";
import {setWindowProp} from "@beenotung/tslib";

export interface NavMessage {
  type: "root" | "push"
  pageOrViewCtrl: Page | string
  params?: any
  opts?: NavOptions
  done?: () => void;
}

@Injectable()
export class CommonService {
  nav: Observable<NavMessage>;
  navObserver: Observer<NavMessage>;
  loadings: Loading[] = [];

  constructor(private translate: TranslateService
    , private userSession: UserSessionService
    , private loadingCtrl: LoadingController
    , private noticeService: NoticeService
    , private storage: StorageService) {
    this.nav = Observable.create((o: Observer<NavMessage>) => {
      this.navObserver = o;
    });
  }

  config() {
    const lang = first_non_null(
      this.translate.getBrowserCultureLang()
      , this.translate.getBrowserLang()
      , this.translate.getDefaultLang()
      , config.fallbackLang
    ).split("-")[0];
    /* use env default language */
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    console.debug("use lang", lang);

    /* use user choice language */
    this.storage.get<string>(StorageKey.lang)
      .then(lang => {
        if (lang) {
          this.translate.use(lang);
          console.debug("use lang", lang);
        }
      })
    ;
    hookCheckClientVersion(this.noticeService);
    setWindowProp("translate", this.translate);
  }

  /**
   * return boolean : true if it is a common error and get handled
   *                  false if it is not a supported error
   * */
  handleCommonError(res: APIResponse<any, any>): boolean {
    if (res.result_enum !== CommonResult) {
      return false;
    }
    switch (res.result_code) {
      case CommonResult.banned:
        this.promptError("msg_.error_.account_banned", "msg_.error_.account_banned_title");
        this.navObserver.next({
          type: "root"
          , pageOrViewCtrl: WelcomePage
          , opts: {
            animate: true
            , direction: "forward"
          }
        });
        return true;
      case CommonResult.not_login:
        this.promptNotLogin();
        return true;
      case CommonResult.unknown:
        this.promptError("msg_.error_.network_na", "msg_.error_.network_na_title");
        return true;
      case CommonResult.not_impl:
        this.promptError("msg_.error_.not_impl", "msg_.error_.not_impl_title");
        return true;
      default:
        return false;
    }
  }

  /**
   * @param msg : translate key for pop up box body
   * @param title : translate key for pop up box title
   * */
  async promptError(msg: string, title = "prompt_.error-title") {
    const ss = await this.translate.get([title, msg]).toPromise();
    return swal(ss[title], ss[msg], "error");
  }

  async promptNotLogin() {
    await this.promptError("msg_.error_.not_login", "msg_.error_.not_login_title");
    await this.userSession.logout();
    // this.navObserver.next({
    //   type: 'root'
    //   , pageOrViewCtrl: LoginPage
    //   , opts: {
    //     animate: true,
    //     direction: 'back'
    //   }
    // });
    location.search = "";
  }

  async showLoading(msg?: string, translate: boolean = true) {
    if (typeof msg !== "string") {
      msg = "msg_.loading";
      translate = true;
    }
    if (translate) {
      msg = await this.translate.get(msg).toPromise();
    }
    const x = this.loadingCtrl.create({
      content: msg
    });
    this.loadings.push(x);
    return x.present();
  }

  dismissLoading() {
    this.loadings.forEach(x => x && x.dismiss());
    clear(this.loadings);
  }
}
