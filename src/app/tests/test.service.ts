import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { ColDef, ColGroupDef, _ } from 'ag-grid-community';
import { AbstractCoreService } from 'projects/core/src/lib/abstract-core';
import { apiMethod, GridResponse, HelperService, ObjToArrayPipe, ResponseObj, UserPreferences, userPrefType } from 'projects/core/src/public-api';
import { delay, Observable, of, share, Subscription, switchMap } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { GridTest } from './grid-test/grid-test.static';

const APP_ID = 1;
const USER_ID = 3; //TODO get from localstorage user

@Injectable({
  providedIn: 'root'
})
export class TestService implements AbstractCoreService {

  constructor(private _http: HttpClient,
    private _objToArray: ObjToArrayPipe,
    private _helper: HelperService) {
    }

  private _subscription = new Subscription();

  protected transformResults(obj: any, toGrid = false): Observable<ResponseObj<GridResponse>>{
    let _toTransform = JSON.parse(JSON.stringify(obj));
    if(!this._helper.isResponseObj(obj)){
      if(toGrid && !this._helper.isGridResponse(obj)){
        _toTransform = <GridResponse>{results: obj, total: (obj || []).length};
      }

      _toTransform = <ResponseObj<GridResponse>>{content: _toTransform, status: {status_code: 200, message: 'OK'}};
    }
    return of(_toTransform);
  }

  protected submitHttpRequest(url: string, params?: any, method = 'get', toGrid = false): Observable<ResponseObj<any>>{
    switch(method){
      case 'post': return <Observable<any>>this._http?.post(url, params).pipe(share());
      case 'put': return <Observable<any>>this._http?.put(url, params).pipe(share());
      case 'patch': return <Observable<any>>this._http?.patch(url, params).pipe(share());
      case 'delete': return <Observable<any>>this._http?.put(url, params).pipe(share());
      default: return <Observable<any>>this._http?.get(url, {params}).pipe(switchMap((res) => this.transformResults(res, toGrid)),share());
    }
  }

  public exctractTranslationData(res: ResponseObj<GridResponse>): {result: any[], columnDefs: any[]}{
    const _toReturn: {result: any[], columnDefs: any[]}  = {result: [], columnDefs: []};
      const _results = res.content.results[0];

      for (const key in _results) {
        if (Object.prototype.hasOwnProperty.call(_results, key)) {
          const element = _results[key];
          const _eachArray = this._objToArray.transform(element);
          _toReturn.result = _toReturn.result.concat(_eachArray.map(_e => ({..._e, group: key})));
        }
      }

      /* this.rowData = res.content.results || []; */
      _toReturn.columnDefs = [
        {field: 'group'},
        {field: 'label'},
        {field: 'value'}
      ];

      console.log({_toReturn});
      return _toReturn;
  }

  public translations(params?: any, method: apiMethod = 'post', nexturl?:any): Observable<ResponseObj<any>>{
    /* console.log(nexturl)
    return this.submitHttpRequest(nexturl || `${env.apiUrl}settings/init_translation/en`, params, method).pipe(share()); */
    return <Observable<any>>this._http?.get(`${env.apiUrl}settings/init_translation/en`, {})
  }

  public taxes(params?: any, method: apiMethod = 'post', nexturl?:any): Observable<ResponseObj<any>>{
    console.log(nexturl)
    return this.submitHttpRequest(nexturl || `${env.apiUrl}/org/contact/`, params, method);
  }

  //Core Implementation
  public getColumnDefs(gridId: string, extraParams?: any): (ColDef<any> | ColGroupDef<any>)[] {
    let _cols: ColDef[] = [];
    switch(gridId){}
    return _cols;
  }

  public userPreferences(params: any, changeType: userPrefType, method?: apiMethod, extra?: any): Observable<ResponseObj<UserPreferences>> {
    if(method != "get"){
      //write to localStorage
      const _userPref = JSON.stringify(<UserPreferences>params);
      localStorage.setItem('userPref', _userPref);

      //write to API
      let _settingUrl = 'settings/';
      let _settingParams: any;

      switch(changeType){
        case 'am': /* TODO: */ break;
        case 'darkMode':
          _settingUrl += 'app_preferences';
          if(method == 'patch'){
            _settingParams = {
              appId: APP_ID,
              userId: USER_ID,
              //ui_theme: (<UserPreferences>params).app ? "dark" : "light"
            };
          }
          break;
        case 'gridPref':
        /* case 'gridTheme':
          _settingUrl += 'grid_pref';
          if(method == 'patch'){
            if(extra?.gridId){ //when grid theme or preferences is set from Grid Component
              _settingParams = {...(<UserPreferences>params).grid?.find(_grid => (_grid.gridId == extra?.gridId)), appId: APP_ID};
            } else{ //when grid theme is set from APP (outside the grid)
              _settingParams = {batch_update: (<UserPreferences>params).grid?.map(_grid => ({..._grid, appId: APP_ID}))};
            }
          }
          break; */
        case 'locale':
          _settingUrl = 'user/list';
          if(method == 'patch'){
            _settingParams = {
                id: USER_ID,
                locale: (<UserPreferences>params).locale,
              };
          }
          break;
        case 'sidebar':
          _settingUrl += 'menu_pref';
          if(method == 'patch'){
            _settingParams = {
                 ...((<UserPreferences>params).sidebar?.[extra?.sideBarId]),
                appId: APP_ID,
              };
          }
          break;
      }
      this.submitHttpRequest(`${env.apiUrl}/${_settingUrl}/`, _settingParams, method).subscribe(() => {});
    }

    return localStorage.getItem('userPref') ? of(JSON.parse(localStorage.getItem('userPref') || '')) : this.submitHttpRequest(`${env.apiUrl}/userPreferences/`, params, method);
  }

  //App specific
  public getAsyncAutoCompleteData(params?: string): Observable<any> {
    return of(GridTest.getCountriesForAutoComplete(params)).pipe(share());
  }

  public testGridApi(params?: any, method?: apiMethod): Observable<ResponseObj<GridResponse>> {
    let _toReturn = this.submitHttpRequest(`https://www.ag-grid.com/example-assets/olympic-winners.json`, params, method);

    if(params.serverSide){
      _toReturn = _toReturn.pipe(switchMap((result: any) => {
        let toReturn: ResponseObj<GridResponse> = {
          status: {
            status_code: 0,
            message: 'Success'
          },
          content: { permission: {}, results: [], total: 0 }
        };

        let resultArray = [];
        if (result) {
          resultArray = (<any[]><unknown>result);
          let i = 0;
          toReturn.content = {
            permission: {},
            results: (resultArray.slice((params?.page - 1) * params?.num_results, (params?.page * params?.num_results)).map(d => {
              d.multiply = {a: ++i, b: ++i}
              return d;
            }) || []),
            total: resultArray.length
          };
        }

        if(params.aggs && resultArray.length > 0){
          //toReturn.content.aggs = {};
          const firstGridResult = resultArray[0];
          for (const key in firstGridResult) {
            if (Object.prototype.hasOwnProperty.call(firstGridResult, key)) {
              //toReturn.content.aggs[key] = (this._helper?.arrayFilterDistinct({arr: resultArray, byId: key}).map(val => val[key]) || []);
            }
          }
        }

        return of(toReturn);
      }), delay(1));
    }

    return _toReturn;
  }

  public historyComment(params?: any, method?: apiMethod): Observable<ResponseObj<any>>{
    return this.submitHttpRequest(`${env.apiUrl}/history`, params, method);
  }

  public org(params?: any, method: apiMethod = 'get', toGrid = false): Observable<ResponseObj<GridResponse>>{
    return this.submitHttpRequest(`${env.apiUrl}/org/list/`, params, method, toGrid);
  }

  getData() {
    return [
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1s.jpg',
            alt: 'Description for Image 1',
            title: 'Title 1'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
            alt: 'Description for Image 2',
            title: 'Title 2'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria3s.jpg',
            alt: 'Description for Image 3',
            title: 'Title 3'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria4s.jpg',
            alt: 'Description for Image 4',
            title: 'Title 4'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria5s.jpg',
            alt: 'Description for Image 5',
            title: 'Title 5'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria6.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria6s.jpg',
            alt: 'Description for Image 6',
            title: 'Title 6'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria7.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria7s.jpg',
            alt: 'Description for Image 7',
            title: 'Title 7'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria8.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria8s.jpg',
            alt: 'Description for Image 8',
            title: 'Title 8'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria9.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria9s.jpg',
            alt: 'Description for Image 9',
            title: 'Title 9'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria10s.jpg',
            alt: 'Description for Image 10',
            title: 'Title 10'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria11s.jpg',
            alt: 'Description for Image 11',
            title: 'Title 11'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria12.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria12s.jpg',
            alt: 'Description for Image 12',
            title: 'Title 12'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria13.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria13s.jpg',
            alt: 'Description for Image 13',
            title: 'Title 13'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria14.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria14s.jpg',
            alt: 'Description for Image 14',
            title: 'Title 14'
        },
        {
            itemImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria15.jpg',
            thumbnailImageSrc: 'https://primefaces.org/cdn/primeng/images/galleria/galleria15s.jpg',
            alt: 'Description for Image 15',
            title: 'Title 15'
        }
    ];
  }

  getImages() {
      return Promise.resolve(this.getData());
  }
}
