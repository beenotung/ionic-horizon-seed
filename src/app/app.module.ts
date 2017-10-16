import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Storage} from "@ionic/storage";
import {BrowserXhr, Http, HttpModule} from "@angular/http";

import {MyApp} from "./app.component";
import {CommonService} from "../services/common/common.service";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {LoginPage} from "../pages/login/login";
import {TabsPage} from "../pages/tabs/tabs";
import {SearchSelectListPage} from "../pages/search-select-list/search-select-list";
import {SettingsPage} from "../pages/settings/settings";
import {UserSessionService} from "../services/user-session/user-session.service";
import {BugReportService} from "../services/bug-report/bug-report.service";
import {ShortIdPipe} from "../pipes/short-id/short-id.pipe";
import {NoticeService} from "../services/notice/notice.service";
import {WelcomePage} from "../pages/welcome/welcome";
import {DatabaseService} from "../services/database/database.service";
import {StorageService} from "../services/storage/storage.service";
import {LineModule} from "ioniclib";
import {HorizonModule, LoadingModule, ProgressBrowserXhr, ProgressModule} from "angularlib";
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {HttpClient} from "@angular/common/http";
import {ComponentsModule} from "../components/components.module";

export function provideStorage() {
  return new Storage({
    driverOrder: ["sqlite", "indexeddb", "websql", "localstorage"]
  });
}

// export function HttpLoaderFactory(http: Http) {
//   return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
// }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    /* lib components */

    /* main */
    MyApp,

    /* sign up and login pages */
    LoginPage,
    WelcomePage,

    /* utils pages */
    TabsPage,
    SearchSelectListPage,
    SettingsPage,

    /* main tabs */

    /* components */
    // TabHeaderComponent,
    // MenuSelectorButtonComponent,
    // LoadingDivComponent,

    /* pipes */
    ShortIdPipe,

  ],
  imports: [
    BrowserModule
    , IonicModule.forRoot(MyApp)
    , HttpModule
    , TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http],
      }
    })
    , LineModule
    , LoadingModule
    , HorizonModule
    , ProgressModule
    , ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    /* sign up and login pages */
    LoginPage,
    WelcomePage,

    /* utils pages */
    TabsPage,
    SearchSelectListPage,
    SettingsPage,

    /* main four tabs */

    /* other components */
    // LoadingDivComponent,
  ],
  providers: [
    /* lib services */
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: BrowserXhr, useClass: ProgressBrowserXhr},
    {provide: Storage, useFactory: provideStorage},
    // Geolocation,
    UniqueDeviceID,
    /* custom services */
    DatabaseService,
    StorageService,
    CommonService,
    UserSessionService,
    BugReportService,
    NoticeService,
  ]
})

export class AppModule {
}
