import { Injectable } from "@angular/core";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { Observable } from "rxjs";
import { apiMethod, ResponseObj, userPrefType } from "./core.interface";

@Injectable()
export abstract class AbstractCoreService {
    //to be implemented for Grid
    //TODO: can be removed
    public abstract getColumnDefs(gridId: string, extraParams?: any): (ColDef | ColGroupDef)[];

    //APIs
    public abstract userPreferences(params: any, changeType: userPrefType,  method?: apiMethod, extra?: any): Observable<ResponseObj<any>>;
}
