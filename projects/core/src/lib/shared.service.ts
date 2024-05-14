import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { envAppConfig, User, UserPreferences } from './core.interface';

import { agThemeType } from '../lib/grids/grid.interface';
import { sideBarMode } from './navigation/sidebar/sidebar.interface';


@Injectable({providedIn: 'root'})
export class SharedService {
  static defaultGridTheme: agThemeType = "alpine";
  static defaultLocaleConf = {
    locale: "en",
    dateDelimeter: "/",
    dateFormat: "dd/MM/y",
    timeFormat: "HH:mm:ss",
  };
  static defaultDateFormatEn = "dd/MM/yyyy";
  static defaultDateFormatEnForDatePicker = "dd/MM/yyyy";
  static defaultSidebarMode: sideBarMode = "thin";

  static defaultUserPref: UserPreferences = {
    app: [{ui_theme: 'light', appId: 1, app_name: "framework"}],
    locale: SharedService.defaultLocaleConf.locale
  }

  static getSavedLocale(envLocale: string): string{
    const _savedLocale = (JSON.parse(localStorage.getItem('userPref') || '{}').locale);
    const _locale = _savedLocale || envLocale || SharedService.defaultUserPref.locale;

    return (_locale == "tl" ? "pt-TL" : _locale);
  }

  constructor(config: SharedService) {
    this.appConfig = config.appConfig || {env: {main: {apiUrl: 'no-apiUrl', isProd: false, isDebug: false, hideConsoleLog: true} as envAppConfig},
      appName: 'no-app',
      app$: new BehaviorSubject({appId: 1})
    };
    this.userRoles = config.userRoles || [];
    this.userPref$ = config.userPref$ || new Subject(); /* || new BehaviorSubject<UserPreferences>({darkMode: false, sidebar: {'eag-main':{modal: false, mode: 'thin', sidebarVisible: true}}, grid: {theme: 'balham'}}); */
    this.userPref = config.userPref || {};
    this.agGridLicenseKey = config.agGridLicenseKey || "",
    this.tinyMceApiKey = config.tinyMceApiKey || "",
    //this.amChartsLicenseKey = config.amChartsLicenseKey || "",
    this.globalVars = config.globalVars || {}
  }

  public appConfig: {env: any, appName: string, app$: BehaviorSubject<any>, user?: User, userId?: number};
  public userRoles?: string[];
  public userPref$?: Subject<UserPreferences>;
  public userPref?: {[appProjectName: string]: UserPreferences};
  public gridLocal?:  {[key: string]: string};
  public agGridLicenseKey?:  string;
  public tinyMceApiKey?:  string;
  /* public amChartsLicenseKey?:  string; */
  public globalVars?: any;
}
