import {TranslateService} from "ng2-translate";
import {first_non_null} from "../../lib/tslib/src/lang";
import {config} from "../app/config";
import {Injectable} from "@angular/core";
import {StorageKey, StorageService} from "./storage-service";

@Injectable()
export class CommonService {
  constructor(private translate: TranslateService
    , private storage: StorageService) {
    let lang = first_non_null(
      translate.getBrowserCultureLang()
      , translate.getBrowserLang()
      , translate.getDefaultLang()
      , config.fallbackLang
    ).split('-')[0];
    /* use env default language */
    translate.setDefaultLang(lang);
    translate.use(lang);

    /* use user choice language */
    storage.get<string>(StorageKey.Lang)
      .then(lang => {
        if (lang)
          translate.use(lang)
      })
    ;
  }
}
