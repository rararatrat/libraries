import { Component } from '@angular/core';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
import { ApiCallParams, ExtendedGridDefinition, GridResponse, ResponseObj } from 'projects/core/src/public-api';
import { Observable, map, of, tap } from 'rxjs';
import { TestService } from 'src/app/tests/test.service';

@Component({
  selector: 'app-grid-client-side-api-call-params',
  templateUrl: './grid-client-side-api-call-params.component.html',
  styleUrls: ['./grid-client-side-api-call-params.component.scss']
})
export class GridClientSideApiCallParamsComponent {
  constructor(private _testService: TestService){}
  
  columnDefs: (ColDef<any>|ColGroupDef<any>)[]|undefined = [];
  gridId = 'grid-client-side-';
  extGridDefn?: ExtendedGridDefinition;
  apiCallParams: ApiCallParams = {params: {}, api: (params, method, nexturl) => this._testService.translations().pipe(map((res: ResponseObj<GridResponse>) => {
    const _data = this._testService.exctractTranslationData(res);
    //this.columnDefs = _data.columnDefs;
    res.content.fields = [
      {label: 'string', field: 'label'},
      {value: 'string', field: 'value'},
      {group: 'string', field: 'group'}
    ];
    res.content.results = _data.result;
    /* return _data.result; */
    return res;
    }))};
  gridParams: GridReadyEvent<any>|undefined;
  rowData$: Observable<any[]> = of([]);

  ngOnInit(){}
}
