import "../../node_modules/chart.js/dist/Chart.bundle.min.js";
import {MyApp} from "./app.component";
import {UnderMaintenancePage} from "../pages/under-maintenance/under-maintenance";
import {LoginPage} from "../pages/login/login";
import {MenuPageHeaderComponent} from "../components/menu-page-header/menu-page-header";
import {ModalHeaderComponent} from "../components/modal-header/modal-header";
import {DevSettingsPage} from "../pages/dev-settings/dev-settings";
import {MainDashboardPage} from "../pages/main-dashboard/main-dashboard";
import {IonTableComponent} from "../components/ion-table/ion-table";
import {CommonOverviewComponent} from "../components/common-overview/common-overview";
import {DocumentListComponent} from "../components/document-list/document-list";
import {UploadButtonComponent} from "../components/upload-button/upload-button";
import {SettingsComponent} from "../components/settings/settings";
import {ErrorHandler, NgModule} from "@angular/core";
import {FormatByte} from "../pipes/format-byte";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {Storage} from "@ionic/storage"
import {BrowserXhr, Http, HttpModule} from "@angular/http";
import {TranslateLoader, TranslateModule, TranslateService, TranslateStaticLoader} from "ng2-translate";
import {ChartsModule} from "ng2-charts";
import {CustomBrowserXhr} from "./config";
import {CommonService} from "../providers/common-service";
import {StorageService} from "../providers/storage-service";
import {DatabaseService} from "../providers/database-service";

/* the order doesn't matter */
export const AppComponents = [
  MyApp
  , UnderMaintenancePage
  , LoginPage
  , MenuPageHeaderComponent
  , ModalHeaderComponent
  , DevSettingsPage
  , MainDashboardPage
  , IonTableComponent
  , CommonOverviewComponent
  , DocumentListComponent
  , UploadButtonComponent
  , SettingsComponent
];

@NgModule({
  declarations: [
    AppComponents
    , FormatByte
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
      deps: [Http],
    }),
    ChartsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: AppComponents,
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: BrowserXhr, useClass: CustomBrowserXhr},
    Storage,
    CommonService,
    StorageService,
    TranslateService,
    DatabaseService,
  ],
})
export class AppModule {
}
