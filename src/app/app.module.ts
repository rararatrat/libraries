import { Inject, LOCALE_ID, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule, envAppConfig } from 'projects/core/src/public-api';
import { AppComponent } from './app.component';
import { environment as env } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule, SharedService } from 'projects/core/src/public-api';
import { AppRoutingModule } from './app-routing.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, TranslateCompiler, TranslateService } from '@ngx-translate/core';
import { MyMissingTranslationHandler } from './translate/missing';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { BehaviorSubject } from 'rxjs';
import { LicenseManager } from 'ag-grid-enterprise';
import { GridClientSideComponent } from './grid-test/grid-client-side/grid-client-side.component';
import { GridServerSideComponent } from './grid-test/grid-server-side/grid-server-side.component';
import { AnimateModule } from 'primeng/animate';
import { GridClientSideRowDataAsyncComponent } from './grid-test/grid-client-side-row-data-async/grid-client-side-row-data-async.component';
import { GridClientSideApiCallParamsComponent } from './grid-test/grid-client-side-api-call-params/grid-client-side-api-call-params.component';
import { TranslationsComponent } from './translation-test/translations/translations.component';
import { CustomTranslateLoader } from './translate/translate.loader';

const savedLocale = SharedService.getSavedLocale(env.locale);

const httpLoaderFactory = (http: HttpClient) => {
  return new TranslateHttpLoader(http,
    './assets/localization/',
    '.json');
}

const components  : any = [
                            TranslationsComponent,
                            GridClientSideComponent,
                            GridClientSideRowDataAsyncComponent,
                            GridClientSideApiCallParamsComponent,
                            GridServerSideComponent,
                            AppComponent,
                          ];
const modules     : any = [
                            AppRoutingModule,
                            BrowserModule,
                            BrowserAnimationsModule,
                            CoreModule,
                            HttpClientModule,
                            AnimateModule,
                            TranslateModule.forRoot({
                              defaultLanguage: savedLocale,
                              loader: {
                                provide: TranslateLoader,
                                /* useFactory: httpLoaderFactory, */
                                useClass: CustomTranslateLoader,
                                deps: [HttpClient],
                              },
                              compiler: {
                                provide: TranslateCompiler,
                                useClass: TranslateMessageFormatCompiler
                              },
                              missingTranslationHandler: {provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler}
                            }),
                            SharedModule.forRoot({sharedService: new SharedService(
                              {appConfig: {
                                env: {
                                  main: {apiUrl: env.apiUrl, isProd: env.production === true, isDebug: env.debug == true, hideConsoleLog: env.hideConsoleLog} as envAppConfig,
                                  another: {}
                                },
                                appName: 'test-app',
                                app$: new BehaviorSubject({appId: 1})

                              },
                              agGridLicenseKey: env.agGridLicense
                            })}),
                          ];

const providers   : Provider[] = [
  { provide: Window, useValue: window },
  { provide: LOCALE_ID, useFactory: () => savedLocale },
];

@NgModule({
  declarations: [].concat(components),
  imports: [].concat(modules),
  providers,
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _translate: TranslateService,
    private _shared:SharedService,
    @Inject(LOCALE_ID) public LOCALE_ID: any){
    LicenseManager.setLicenseKey(this._shared.agGridLicenseKey||"");

    this._translate.onDefaultLangChange.subscribe(res => {
      let temp : any = {}
      for (let key in res.translations?.grid) {
        if (Object.prototype.hasOwnProperty.call(res.translations.grid, key)) {
          const element = res.translations.grid[key]?.("variable")
          temp[key] = element.replace("$undefined", "${variable}")
        }
      }
      this._shared.gridLocal = temp;
    })
  }
}
