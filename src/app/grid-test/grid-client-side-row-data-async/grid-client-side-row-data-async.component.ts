import { Component } from '@angular/core';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
import { ApiCallParams, ExtendedGridDefinition, GridResponse, ResponseObj } from 'projects/core/src/public-api';
import { Observable, map, of, tap } from 'rxjs';
import { TestService } from 'src/app/tests/test.service';

@Component({
  selector: 'app-grid-client-side-row-data-async',
  templateUrl: './grid-client-side-row-data-async.component.html',
  styleUrls: ['./grid-client-side-row-data-async.component.scss']
})
export class GridClientSideRowDataAsyncComponent {
  constructor(private _testService: TestService){}
  
  columnDefs: (ColDef<any>|ColGroupDef<any>)[]|undefined = [];
  gridId = 'grid-client-side-';
  extGridDefn?: ExtendedGridDefinition;
  apiCallParams: ApiCallParams|undefined;
  gridParams: GridReadyEvent<any>|undefined;
  rowData$: Observable<any[]> = this._testService.translations().pipe(map((res: ResponseObj<GridResponse>) => {
    const _data = this._testService.exctractTranslationData(res);
    this.columnDefs = _data.columnDefs;
    return _data.result;
    }));

  ngOnInit(){}
}
