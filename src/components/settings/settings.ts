import {Component} from '@angular/core';
import {CommonService} from "../../providers/common-service";
import {TranslateService} from "ng2-translate";
import {ViewController} from "ionic-angular";

/*
 Generated class for the Settings component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
  selector: 'settings'
  , templateUrl: 'settings.html'
})
export class SettingsComponent {

  langs: string[] = [
    'en'
    , 'zh-CN'
    , 'zh-HK'
    , 'zh-TW'
  ];
  lang: string;

  constructor(public translate: TranslateService
    , private viewCtrl: ViewController
    , private common: CommonService) {
    console.log('Hello Settings Component');
    this.lang = translate.currentLang;
  }

  chooseLang(lang: string) {
    console.log('choose lang', lang);
    this.translate.use(lang);
    this.viewCtrl.dismiss();
  }
}
