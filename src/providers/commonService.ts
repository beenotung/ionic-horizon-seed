import {TranslateService} from "ng2-translate";
import {first_non_null} from "../../lib/tslib/src/lang";
import {config} from "../app/config";
import {Component} from "@angular/core";

@Component({
  providers: [
    TranslateService,
  ],
})
export class CommonService {
  constructor(private translate: TranslateService) {
    let lang = first_non_null(
      translate.getDefaultLang()
      , translate.getBrowserCultureLang()
      , translate.getBrowserLang()
      , config.fallbackLang
    ).split('-')[0];
    translate.setDefaultLang(lang);
    translate.use(lang);
  }
}
