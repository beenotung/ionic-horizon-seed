import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {HttpModule, Http, BrowserXhr} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
import {MyApp} from "./app.component";
import {CustomBrowserXhr} from "./config";
import {Storage}from "@ionic/storage";
import {LoginPage} from "../pages/login/login";
import {ModalHeaderComponent} from "../components/modal-header/modal-header";
import {MenuPageHeaderComponent} from "../components/menu-page-header/menu-page-header";

export const AppComponents = [
  MyApp
  , LoginPage
  , MenuPageHeaderComponent
  , ModalHeaderComponent
];

@NgModule({
  declarations: AppComponents,
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
      deps: [Http],
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: AppComponents,
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: BrowserXhr, useClass: CustomBrowserXhr},
    Storage,
  ],
})
export class AppModule {
}
