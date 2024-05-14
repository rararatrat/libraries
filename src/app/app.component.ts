import { Component } from '@angular/core';
import { CoreService, sideBarMode, SideBarService, /* SideBarComponent, SideBarService, */ UserPreferences } from 'projects/core/src/public-api';
import { ISideBar } from 'projects/core/src/lib/navigation/sidebar/sidebar.interface';
import { App } from './app.static';
import { MenuItem } from 'primeng/api';
import WebFont from 'webfontloader';
import { DatePipe, FormatWidth, getLocaleDateFormat, getLocaleTimeFormat } from '@angular/common';

const _APP_ID = 1;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{


  public isGlobalMenuPref   : boolean = false;
  public logoSrc            : any = null;
  public isSidebarHidden    : boolean = false;
  public menuItems          !: MenuItem[];
  public toggleMenu         !: MenuItem[];

  private _sbConfig         !: ISideBar;

  public locale!: string;
  public dateFormat!: string;
  public timeFormat!: string;
  public dateToday = new Date();

  constructor(private _sb:SideBarService, private _core: CoreService, private _datePipe: DatePipe){}

  ngOnInit(): void {
    this.logoSrc = "";
    this.initSideBar('compact', true);
    this._loadFonts();
    
    const _localeFormat = this._core.getLocaleFormat();
    this.locale = _localeFormat._locale;
    this.dateFormat = _localeFormat._dateFormat;
    this.timeFormat = _localeFormat._timeFormat;

    console.log({locale: this.locale, dateFormat: this.dateFormat, timeFormat: this.timeFormat});

    console.table({
      "short": getLocaleDateFormat(this.locale, FormatWidth.Short) + ' ' + this._datePipe.transform(this.dateToday, `${getLocaleDateFormat(this.locale, FormatWidth.Short)} ${getLocaleTimeFormat(this.locale, FormatWidth.Short)}`),
      "medium": getLocaleDateFormat(this.locale, FormatWidth.Medium)+ ' ' + this._datePipe.transform(this.dateToday, `${getLocaleDateFormat(this.locale, FormatWidth.Medium)} ${getLocaleTimeFormat(this.locale, FormatWidth.Medium)}`),
      "long": getLocaleDateFormat(this.locale, FormatWidth.Long)+ ' ' + this._datePipe.transform(this.dateToday, `${getLocaleDateFormat(this.locale, FormatWidth.Long)} ${getLocaleTimeFormat(this.locale, FormatWidth.Long)}`),
      "full": getLocaleDateFormat(this.locale, FormatWidth.Full)+ ' ' + this._datePipe.transform(this.dateToday, `${getLocaleDateFormat(this.locale, FormatWidth.Full)} ${getLocaleTimeFormat(this.locale, FormatWidth.Full)}`),
      "short-with-time": getLocaleTimeFormat(this.locale, FormatWidth.Short),
      "medium-with-time": getLocaleTimeFormat(this.locale, FormatWidth.Medium),
      "long-with-time": getLocaleTimeFormat(this.locale, FormatWidth.Long),
      "full-with-time": getLocaleTimeFormat(this.locale, FormatWidth.Full),
       });
  }

  public initSideBar(mode:sideBarMode, isVisible:boolean){
    this._sbConfig = {
      isVisible: isVisible,
      items : App.items,
      sidebarLoaderId: "home",
      mode:mode
    }
    this._sb.sidebar$.next(this._sbConfig)
  }

  public toggleSidebar(){
    this._sbConfig.isVisible = !this._sbConfig.isVisible
    this._sb.sidebar$.next(this._sbConfig);
  }

  private _loadFonts(font?: string) {
    let tFont = font || "Roboto";
    WebFont.load({
      google: {
          families: [ tFont + ' Condensed:100,300,400,500,700,900',
                      tFont + ' Mono:100,300,400,500,700,900',
                      tFont + ':100,300,400,500,700,900'
                    ],
      }
    });
  }

  ngOnDestroy(): void {}
}
