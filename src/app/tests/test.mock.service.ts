import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiMethod, GridPeferences, GridResponse, HelperService, ObjToArrayPipe, ResponseObj, UserPreferences, userPrefType } from 'projects/core/src/public-api';
import { Observable, of, switchMap } from 'rxjs';
import { GridTest } from './grid-test/grid-test.static';
import { TestService } from './test.service';

@Injectable({
  providedIn: 'root'
})
export class TestMockService extends TestService {
  constructor(public http: HttpClient, public objToArray: ObjToArrayPipe, public helper: HelperService){
    super(http, objToArray, helper);
  }

  public override userPreferences(params: any, changeType: userPrefType,  method?: apiMethod, extra?: any): Observable<ResponseObj<UserPreferences>> {
    if(method != "get"){
      const _userPref = JSON.stringify(<ResponseObj<UserPreferences>>{
        content: {...params, grid: (params.grid || []).map((p: any) => ({...p, ...(!p.user_id ? {user_id: 'r.t'} : {})}))}, status: {status_code: 200, message: 'OK'}
      });
      localStorage.setItem('userPref', _userPref);
    }
    return localStorage.getItem('userPref') ? of(JSON.parse(localStorage.getItem('userPref') || '')) : GridTest.getUserPref();
  }

  public getCurrentLocale(): string{
    return JSON.parse(localStorage.getItem('userPref') || '{}').locale || null; 
  }

  public override historyComment(params?: any, method?: apiMethod): Observable<ResponseObj<any>>{
    return of(<ResponseObj<any>><unknown>{ status: 200, content: '' })
  }
}
