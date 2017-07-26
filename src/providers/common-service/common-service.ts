import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {StorageKey, StorageService} from "../storage-service/storage-service";
import {config} from "../../app/app.config";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import {Loading, LoadingController, NavOptions} from "ionic-angular";
import {Page} from "ionic-angular/navigation/nav-util";
import {UserSession} from "../user-session/user-session";
import {LoginPage} from "../../pages/login/login";
import {first_non_null} from "@beenotung/tslib/src/lang";
import {clear} from "@beenotung/tslib/src/array";
import {APIResponse, CommonResult} from "../api";
import {hookCheckClientVersion} from "../database-service/database-service.hook";
import {NoticeService} from "../notice-service/notice-service";
import {swal} from "@beenotung/tslib/src/typestub-sweetalert2";

export interface NavMessage {
  type: "root" | "push"
  pageOrViewCtrl: Page | string
  params?: any
  opts?: NavOptions
  done?: Function
}

/*
  Generated class for the CommonProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CommonService {
  nav: Observable<NavMessage>;
  navObserver: Observer<NavMessage>;
  loadings: Loading[] = [];

  constructor(private translate: TranslateService
    , private userSession: UserSession
    , private loadingCtrl: LoadingController
    , private noticeService: NoticeService
    , private storage: StorageService) {
    this.nav = Observable.create(o => {
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
          , pageOrViewCtrl: LoginPage
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
    await this.userSession.stopSession();
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


  showLoading() {
    const x = this.loadingCtrl.create({
      content: this.translate.instant("msg_.loading")
    });
    this.loadings.push(x);
    return x.present();
  }

  dismissLoading() {
    this.loadings.forEach(x => x && x.dismiss());
    clear(this.loadings);
  }
}
