import { DatePipe, DecimalPipe, DOCUMENT, FormatWidth, getLocaleDateFormat, getLocaleTimeFormat, Location } from '@angular/common';
import { EventEmitter, Inject, Injectable, LOCALE_ID, OnDestroy } from '@angular/core';
import { filter, Observable, of, pairwise, startWith, Subject, Subscription, switchMap, } from 'rxjs';
import { ApiCallParams, apiMethod, AppPreferences, ConfirmDialogResult, CONFIRM_DIALOG_TYPE, CustomDialogConfig, getLocaleType, /* localeTypeComplex, */ notifColors, ResponseObj, schemeType, snackBarExtraButtons, UserPreferences } from './core.interface';
import { SharedService } from './shared.service';
import { HelperService } from './helper.service';
import { agThemeType, GridResponse } from '../lib/grids/grid.interface';
import { Message, MessageService, PrimeNGConfig } from 'primeng/api';
import * as WebFont from 'webfontloader';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/* import { SideBarService } from '../lib/navigation/side-bar/side-bar.service'; */
import { AbstractCoreService } from './abstract-core';
import { DefaultLangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Core } from './core.static';
import { HttpClient } from '@angular/common/http';

let _APP_ID = 1;

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  constructor
  (
    @Inject(DOCUMENT) private _document: HTMLDocument,
    @Inject(LOCALE_ID) private _locale: string,
    private _sharedService: SharedService,
    private _helperService: HelperService,
    private _messageService: MessageService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    /* private _sidebarService: SideBarService, */
    private _location: Location,
    private _translate: TranslateService,
    private _primeConfig: PrimeNGConfig
  ){
    this.isDebug = this._sharedService.appConfig.env?.main.isDebug;
    /* if(!this.isDebug){
      window.console.log=function(){};
      window.console.table=function(){};
      window.console.warn=function(){};
    } */

    /* const _num = 6.75;
    const whole = _num - (_num % 1);
    const modulo = (((_num %1 ) * 10) * 0.1);
    const by60 = ((((_num %1 ) * 10) * 0.1) * 60) * 0.01;
    const _sum = whole + modulo;
    const formatted = this._number.transform(_sum * 100, "4.0", "en")?.replace(",", ""); */
    this._subscriptions.add(this._translate.onDefaultLangChange.subscribe((res: DefaultLangChangeEvent) => {
      if(this.isDebug){
        console.log("trans", res);
      }

      const _ttrans = res?.translations?.['translations'];
      for (const key in _ttrans) {
        if (Object.prototype.hasOwnProperty.call(_ttrans, key)) {
          const element = _ttrans[key];
          Core._localize[(key || '').toLowerCase()] = (p?) => {
            try{
              const _toReturn = element?.(p) || `translations.${key}`;
              /* console.trace({_toReturn}); */
              return _toReturn;
            } catch(e){
              console.warn('Core Localize', e);
              return `translations.${key}`;
            }
          };
        }
      }

      let onDefaultLangChange: 'init' | 'changed' = 'changed';
      if(!this._listenTranslateOnce){
        this._listenTranslateOnce = true;
        onDefaultLangChange = 'init';

        this._primeConfig.setTranslation(Core.setTranslations(this._locale));
      }
      this.translationDone$.next(onDefaultLangChange);

      if(this.isDebug){
        console.log({globalHeader: Core.Localize('globalHeader', {dateToday: new Date()})});
        console.log({people3: Core.Localize('people', { gender: 'male', how: (Core.Localize('funny')) })});
        console.log({people4: Core.Localize('nothing', { gender: 'female', how: (Core.Localize('charming')) })});
        console.log({people5: Core.Localize('people', { gender: 'heshe', how: (Core.Localize('charming')) })});
      }
    }));

    this._subscriptions.add(this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      ).subscribe(() => {
        /* this._sidebarService.sidebarLoaderId =  ''; */
        this._sharedService.globalVars = {...this._sharedService.globalVars, breadcrumbs: []};
        this.createBreadcrumbs(this._activatedRoute.root);
      }));

    this._subscriptions.add(this._sharedService.appConfig.app$?.subscribe(_app => {
      _APP_ID = _app.appId;
    }));

    window.matchMedia('(prefers-color-scheme: light)').addEventListener("change", (e) => {
      if(this._scheme == 'auto' && e.matches){
        this.setDarkMode('auto');
      }
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", (e) => {
      if(this._scheme == 'auto' && e.matches){
        this.setDarkMode('auto');
      }
    });
  }
  public isDebug = false;
  private _appName = this._sharedService.appConfig?.appName || 'no-app';
  private _subscriptions = new Subscription();
  private _listenTranslateOnce = false;
  public isLoading = false;
  public translationDone$ = new Subject<'init' | 'changed'>();
  /* private _isLocalizeComplex(obj: getLocaleType): obj is localeTypeComplex{
    return typeof obj == "object" && obj.hasOwnProperty('value');
  } */

  private _scheme: schemeType | undefined;

  private _isDarkMode!: boolean;

  public get isDarkMode(): boolean {
    if(this._scheme == 'auto'){
      if(window.matchMedia('(prefers-color-scheme: light)').matches){
        return false;
      } else if(window.matchMedia('(prefers-color-scheme: dark)').matches){
        return true;
      }
    }
    return this._scheme == 'dark';
  }

  public setDarkMode(scheme: schemeType, _abstractCore?: AbstractCoreService) {
    this._scheme = scheme;

    if(this._sharedService.userPref){
      const _userPref = (this._sharedService.userPref[this._appName] || {});
      let _apiMethod: apiMethod = "patch";
      let _appToUpdate = _userPref?.app?.find(_app => _app.appId == _APP_ID);

      if(_appToUpdate){
        _appToUpdate.ui_theme = scheme;
      } else {
        _apiMethod = "put";
        _appToUpdate = <AppPreferences>{appId: _APP_ID, ui_theme: scheme};
      }

      this._document.body.setAttribute("class", (this.isDarkMode ? "dark" : "light"));
      this._sharedService.userPref$?.next({..._userPref, changeType: {type: 'darkMode'}});

      if(_abstractCore){
        try{
          this._subscriptions.add(_abstractCore.userPreferences(_userPref, 'darkMode', _apiMethod, _appToUpdate).subscribe({next: result => {
            //am4core.useTheme(isDarkMode ? this._eagnaTheme.am4themes_darkTheme : this._eagnaTheme.am4themes_lightTheme);
            if(result.status.status_code == 200){
            }
          }, error: (err) => {
            console.warn('update userPreferences error', err);
          }
        }));
        } catch(e){
          console.warn('update userPreferences error', e);
        }
      }
    }
  }

  public setLocale(locale: string, _abstractCore?: AbstractCoreService){
    const _locale = locale == "tl" ? "pt-TL" : locale
    if(this._sharedService.userPref){
      const _userPref = (this._sharedService.userPref[this._appName] || {});
      _userPref.locale = _locale;
      this._sharedService.userPref$?.next({..._userPref, changeType: {type: 'locale'}});
      this._translate.setDefaultLang(_locale);

      if(_abstractCore){
        try{
          this._subscriptions.add(_abstractCore.userPreferences(_userPref, 'locale', "patch").subscribe({next: result => {
            const _loc = this._location.path();
            if(result.status.status_code == 200 || result.status.status_code == 201){
               if(this._helperService.isNotEmpty(_loc)){
                this._router.navigate(['/'], {skipLocationChange: true}).then(() => {
                  this._router.navigate([_loc]);
                });
               } else{
                //window.location.reload();
                this._router.navigate(['/']);
               }
            }
          }, error: (err) => {
            this._messageService.add({data: err, detail: "Error updating language", severity: "error"});
            console.warn('update userPreferences error', err);
          }
        }));
        } catch(e){
          this._messageService.add({data: e, detail: "Error updating language", severity: "error"});
          console.warn('update userPreferences error', e);
        }

        /* For translation, a refresh is necessary  */
        window.location.reload();
      }
    }
  }

  public refreshPage(loc?: Location){
    const _loc = (loc || this._location)?.path();
    if(this._helperService.isNotEmpty(_loc) && this._router){
      this._router.navigate(['/'], {skipLocationChange: true}).then(() => {
        this._router.navigate([_loc]);
      });
    }
  }

  public setAgTheme(theme: agThemeType, _abstractCore?: AbstractCoreService){ //TODO call in the beginning to set default
    if(theme != undefined && this._sharedService.userPref){
      const _userPref = (this._sharedService.userPref[this._appName] || {});

      for (const key in _userPref.grid) { //TODO: not necessary, when ['all'] in gridTheme is implemented
        if (Object.prototype.hasOwnProperty.call(_userPref.grid, key)) {
          if(_userPref.grid[key]){
            _userPref.grid[key].theme = theme;
          }
        }
      }

      this._sharedService.userPref$?.next({..._userPref, changeType: {type: "gridTheme", value: theme}});
      if(_abstractCore){
        try{
          this._subscriptions.add(_abstractCore.userPreferences(_userPref, "gridTheme", "patch", {gridId: 'all'}).subscribe({next: result => {
            if(result.status.status_code == 200){ }
          }, error: (err) => {
            console.warn('update userPreferences error', err);
          }
          }));
        } catch(e){
          console.warn('update userPreferences error', e);
        }
      }
    }
  }

  public loadFonts(){
    WebFont.load({
      google: {
          families: ['Material Icons:100,300,400,500,700,900', 'Urbanist:100,300,400,500,700,900', 'Roboto Condensed:100,300,400,500,700,900', 'Roboto Mono:100,300,400,500,700,900', 'Roboto:100,300,400,500,700,900'],
      },
      loading :() => {
        this.isLoading = true
      },
      active :() => {
        this.isLoading = false;
      },
      inactive :() => {
      },
    });
  }

  public get fetchErrorCodes(){
      let classes = [
          { error_code: "400", status: "400", icon: "pi pi-exclamation-triangle", name: "Bad Request", message: "The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing)"},
          { error_code: "401", status: "401", icon: "pi pi-lock", name: Core.Localize('unauthorized'), message: Core.Localize('unauthorizedDetails')},
          { error_code: "403", status: "403", icon: "pi pi-ban", name: "Forbidden", message: "The request contained valid data and was understood by the server, but the server is refusing action. This may be due to the user not having the necessary permissions for a resource or needing an account of some sort, or attempting a prohibited action (e.g. creating a duplicate record where only one is allowed)"},
          { error_code: "404", status: "404", icon: "", name: "Not Found", message: "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible."},
          { error_code: "405", status: "405", icon: "do_not_disturb", name: "Method Not Allowed", message: "A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource."},
          { error_code: "418", status: "418", icon: "assignment", name: "I'm a teapot", message: "This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. The RFC specifies this code should be returned by teapots requested to brew coffee."},
          { error_code: "500", status: "500", icon: "error", name: "Internal Server Error", message: "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable"},
          { error_code: "501", status: "501", icon: "warning_amber", name: "Not Implemented", message: "The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability (e.g., a new feature of a web-service API)."},
          { error_code: "502", status: "502", icon: "fence", name: "Bad Gateway", message: "The server was acting as a gateway or proxy and received an invalid response from the upstream server."},
          { error_code: "503", status: "503", icon: "event_busy", name: "Service Unavailable", message: "The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state"},
          { error_code: "504", status: "504", icon: "pi pi-clock", name: "Gateway Timeout", message: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server."},
      ];
      let temp :any = {};
      classes.forEach(element => {
          temp[element.error_code] = element;
      })
      return temp;
  }

  public setAndGetUserPreferences(_abstractCore: AbstractCoreService, refresh?: boolean, sharedUserPref?: {[appProjectName: string]: UserPreferences } ): Observable<UserPreferences> {
    const _defaultUserPref = SharedService.defaultUserPref;
    if(sharedUserPref){
      if (!sharedUserPref[this._appName] || Object.keys(sharedUserPref[this._appName]).length == 0 || refresh) {
        try{
          if(_abstractCore){
            return _abstractCore.userPreferences({app_name: this._appName}, undefined, "get").pipe(switchMap(value => {
              return of(value.content || _defaultUserPref);
            }));
          } else{
            console.warn("getUserPref() not implemented");
            return of(_defaultUserPref);
          }
        } catch(e: any){
          console.warn("getUserPref() error", e);
        }
      }
      return of(sharedUserPref[this._appName] || _defaultUserPref);
    }
    return of(_defaultUserPref);
  }

  public getLocaleFormat(_dateFormatWidth?: FormatWidth, _timeFormatWidth?: FormatWidth) : {_locale: string, _dateDelimeter: string, _dateFormat: string, _timeFormat: string} {
    let _toReturn = {
        _dateDelimeter: SharedService.defaultLocaleConf.dateDelimeter,
        _dateFormat: SharedService.defaultLocaleConf.dateFormat,
        _timeFormat: SharedService.defaultLocaleConf.timeFormat,
        _locale: SharedService.defaultLocaleConf.locale,
    };
    if(this._sharedService.userPref){
        //const _appConfigName = this._sharedService.appConfig?.appName || 'no-app';
        //console.log({injectedLocale: this._locale, sharedLocale: SharedService.getSavedLocale(this._sharedService.appConfig.env?.main.locale), defaultLocale: SharedService.defaultLocaleConf.locale});
        const _locale = SharedService.getSavedLocale(this._sharedService.appConfig.env?.main.locale) || this._locale || SharedService.defaultLocaleConf.locale;
        //console.log(_locale);

        const _dateDelimeter = getLocaleDateFormat(_locale, FormatWidth.Short).includes("/") ? "/" : ".";
        const _dateFormat = _dateDelimeter == "." ? getLocaleDateFormat(_locale, (_dateFormatWidth !== undefined ? _dateFormatWidth : FormatWidth.Medium)) : SharedService.defaultDateFormatEn;
        const _timeFormat = getLocaleTimeFormat(_locale, (_timeFormatWidth !== undefined ? _timeFormatWidth : (_dateFormatWidth !== undefined ? _dateFormatWidth : FormatWidth.Medium)));
        _toReturn = {
            _dateDelimeter,
            _dateFormat,
            _locale,
            _timeFormat
        };
    }
    return _toReturn;
}

  public createBreadcrumbs(route: ActivatedRoute) {
    this._sharedService.globalVars.breadcrumbs = [];
    this._sharedService.globalVars.url = '';
    const _recur = (route: ActivatedRoute, url: string = "#") => {
      const children: ActivatedRoute[] = route.children;
      const _toReturn = new Subject();

      /* if (children.length === 0) {
        ;
      } */

      for (const child of children) {
        const routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
        if (routeURL !== "") {
          url += `/${routeURL}`;
          this._sharedService.globalVars.url = url;
        }
        let label = '';
        if (child.snapshot.data.hasOwnProperty('title') && (this._sharedService.globalVars.breadcrumbs.length == 0 || (this._sharedService.globalVars.breadcrumbs[this._sharedService.globalVars.breadcrumbs.length-1] || {}).label != child.snapshot.data['title'])) {
          label = child.snapshot.data["title"] || '';
        } else {
          label = routeURL || '';
        }

        /* if(child.snapshot.data.hasOwnProperty('sidebarLoaderId') && child.snapshot.data['sidebarLoaderId']){
          this._sidebarService.sidebarLoaderId = child.snapshot.data['sidebarLoaderId'];
        } */

        if(this._helperService.isNotEmpty(label)){
          if(label.startsWith("titles.")){
            const _pluralCount = child.snapshot.data["pluralCount"] || 1;
            const _item = child.snapshot.data["item"] || '';
            try { //TODO do for translations first
              this._subscriptions.add(this._translate.get(label, {count: _pluralCount, item: _item}).subscribe((res: string) => {
                //if(`{${label}}` != routeURL){
                  this._sharedService.globalVars.breadcrumbs.push({label: (res ? res : label), routerLink: (url.slice(1) || '/') });
                //}
                _recur(child, url);
              }));
            } catch (error) {
              console.warn('problem in translation',error);
            }
          } else{
            this._sharedService.globalVars.breadcrumbs.push({label, routerLink: (url.slice(1) || '/') });
            _recur(child, url);
          }
        } else{
          _recur(child, url);
        }
      }
    }

    _recur(route);
  }

  /**
   * DOWNLOAD
   * @param s
   * @returns
   */
   private _s2ab(s: any) {
    let buf   = new ArrayBuffer(s.length);
    let view  = new Uint8Array(buf);

    for (let i = 0; i != s.length; ++i)
    {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  /**
   * DOWNLOAD
   * @param res
   * @param file_type
   */
  public  downloadFile(res: any, file_type?: any) { /* : Response */
  this._messageService.clear()
    if(res && res.file && res.filename){
      let fNameChunks = res.filename.split(".");
      let ext = fNameChunks[fNameChunks.length-1]
      fNameChunks.pop();
      let filename = fNameChunks.join('_') + Date.now().toString() + "." + ext;
      let blob = new Blob([this._s2ab(atob(res.file))]);
      /* this.notification("File generated.",'success'); */
      this._messageService.add({detail: "File generated", severity: "success"});
      /* saveAs(blob, filename); */
    } else {
      /* this.notification( {message: "No file(s) found from the database. Please contact the system administrators."}, "warn"); */
      this._messageService.add({detail: "No file(s) found from the database. Please contact the system administrators.", severity: "warn"});
    }
  }
}

@Injectable({providedIn: 'root'}) //Singletonization
export class ApiCallService {
    constructor(
      private _messageService: MessageService,
      private _eagnaListner: EagnaListener,
      private _helper: HelperService,
      private _http: HttpClient,
      ) { }

    private _caller: Subscription | undefined;

    execute(apiCallParams: ApiCallParams | undefined, requireToken?: boolean, p?: any, pipeMapForGrid = false, nextPage=false/* , loaderObject?: any *//* , l?: Observable<any> */): Promise<{[key: string]: any, p?: any}> { //(e.g. p is gridParams) /* loaderId?: string, */
      return new Promise((resolve, reject) => {
        if (!this._caller) { this._caller = new Subscription(); }
        let callSucceeded = false;

        //let apiCall: Observable<any> | undefined = l;
        let apiCall: Observable<any> | undefined;

        /* if(!l){ */
        if(nextPage &&  apiCallParams?.next){ // p.api?.paginationGetCurrentPage() > 0 &&
          apiCall = <Observable<any>>this._http?.post(apiCallParams?.next, apiCallParams.params);
        } else{
          apiCall = apiCallParams?.api(apiCallParams.params, "post", apiCallParams?.next);
        }
        /* } */

        /* loaderObject = {loader: {
          key: 'agGrid',
          value: apiCall
        }};

        console.log({loaderObject}); */

        if(pipeMapForGrid){
          const mapGridResponse = (res: GridResponse): GridResponse => {
            if(!res?.page && res?.results?.length > 0){
              res.page = {total: (res.results.length || 0), page: 1, page_size: 1};
            }
            if(!res?.total && res?.results?.length > 0){
              res.total = (res.results.length || 0);
            }
            return res;
          }

          apiCall = apiCall?.pipe(switchMap((result: ResponseObj<any>): Observable<GridResponse> => {
            if(this._helper.isResponseObj(result)){
              return of(mapGridResponse(<GridResponse>result.content || {}));
            } else if(this._helper.isGridResponse(result)){
              return of(mapGridResponse(<GridResponse>(result || {})));
            }
          return of(mapGridResponse(<GridResponse>(result || {})));
          }));
        }
        try {
          this._caller.add(apiCall?.subscribe({next: result => {
            if (requireToken) {
              this._messageService.add({detail: "Token sent.", severity: "success"});

              if(apiCallParams?.callback){
                apiCallParams?.callback({ tokenSent: true }, p);
              }
              /* RT: eagna TODO: timer value + resendFn */
              this._eagnaListner.customDialogOpened$.emit( {
                  visible: true,
                  position: 'center',
                  content: `You have requested an operation that requires e-mail verification. An email has been sent to your account.\nPlease provide the token in the field below: `,
                  dialogType: CONFIRM_DIALOG_TYPE.TOKEN,
                  header: `Email Verification`,
                  onConfirm: (tokenDialogResult: ConfirmDialogResult) => {
                    if(tokenDialogResult.isConfirmed){
                      if (!this._caller) { this._caller = new Subscription(); }

                      this._caller.add(apiCallParams?.api({ ...apiCallParams.params, token: tokenDialogResult.token })
                      .pipe(switchMap((result: ResponseObj<any>): Observable<any> => {
                        if(pipeMapForGrid){
                          if(this._helper.isResponseObj(result)){
                            return of(<GridResponse>result.content || {});;
                          } else if(this._helper.isGridResponse(result)){
                            return of((result || {}) as GridResponse);
                          }
                        }
                        return of(result);
                      }))
                      .subscribe({next: tokenSubmittedResult => {
                        resolve({tokenSubmittedResult, p});
                        if (apiCallParams.callback) {
                            apiCallParams.callback(tokenSubmittedResult, p);
                        }
                      }, error: e => {
                          if (apiCallParams.failCallback) {
                            reject({e, p});
                            apiCallParams.failCallback(e, p);
                            if (apiCallParams.executeAfterFailCallback) {
                                apiCallParams.executeAfterFailCallback(e, p);
                            }
                        }
                      }}));
                    }
                  },
                  onCancel: (cancelData: any) => {
                  }
              });
            } else {
                if (apiCallParams?.callback) {
                    resolve({result, p});
                    apiCallParams.callback(result, p);
                }
            }
            callSucceeded = true;
          }, error: (e) => {
            if (apiCallParams?.failCallback) {
                apiCallParams.failCallback(e, p);
                reject({e, p});
                if (apiCallParams?.executeAfterFailCallback) {
                    apiCallParams.executeAfterFailCallback(e, p);
                }
            }
          }}));
        } catch (error) {
          if (apiCallParams?.failCallback) {
              apiCallParams.failCallback(error, p);
              reject({error, p});
              if (apiCallParams.executeAfterFailCallback) {
                  apiCallParams.executeAfterFailCallback(error, p);
              }
          }
        }

        if(callSucceeded && apiCallParams?.finally){
            apiCallParams.finally(p);
        }

      });
    }

    kill() {
        if (this._caller) { this._caller.unsubscribe(); }
    }
}

@Injectable({providedIn: 'root'})
export class EagnaListener{
  constructor(){}

  /* public sideBarComponentLoader$ = new EventEmitter<SideBarLoaderParams<any>>(); */
  public authLogout$ = new EventEmitter<boolean>();
  public customDialogOpened$ = new EventEmitter<CustomDialogConfig>();
}
