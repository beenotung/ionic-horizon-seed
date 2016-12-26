import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {HttpModule, Http, BrowserXhr} from '@angular/http';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
import {MyApp} from "./app.component";
import {CustomBrowserXhr} from "./config";
import {ProfilePage} from "../pages/profile/profile";
import {Storage}from "@ionic/storage";
import {FeedbackPage} from "../pages/feedback/feedback";
import {LoginPage} from "../pages/login/login";

export const AppComponents = [
  MyApp
  , LoginPage
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
