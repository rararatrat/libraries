import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ResponseObj, SharedService } from '@eagna-io/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig, Translation } from 'primeng/api';
/* import { AppStatic } from '../app.static'; */
import { environment as env } from 'src/environments/environment';


const LOCAL_URL = 'http://your.url.blanik.me/api';

export class CustomTranslateLoader implements TranslateLoader {

  public static gridLocale : any = {}
  /* public translation = AppStatic.PrimeNgTranslations$ = new Subject(); */


  constructor(private httpClient: HttpClient,) {}

  getTranslation(lang = 'en'): Observable<any> {

    const url = env.apiUrl + `settings/init_translation/${lang}`;
    let temp = {}
    return this.httpClient.get(url).pipe(
    //return this.httpClient.get(url, {params: {limit: 10000}}).pipe(
      map(
        /* (res: ResponseObj<any>) => { */
        (res: any) => {
          /* const primeng = res.content.results[0].primeng;
          for (const key in primeng) {
            if (Object.prototype.hasOwnProperty.call(primeng, key)) {
                try {
                  primeng[key] = eval(primeng[key])
                } catch (error) {
                }
            }

          }
          this.translation.next(primeng); */
          return res.content.results[0];
        }
      ),
      catchError((_) => this.httpClient.get(`/assets/localization/en.json`))
      );
  }
}
