import { Component } from '@angular/core';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
import { ApiCallParams, ExtendedGridDefinition, GridResponse, ResponseObj } from 'projects/core/src/public-api';
import { map, tap } from 'rxjs';
import { TestService } from 'src/app/tests/test.service';

@Component({
  selector: 'app-grid-server-side',
  templateUrl: './grid-server-side.component.html',
  styleUrls: ['./grid-server-side.component.scss']
})
export class GridServerSideComponent {
  constructor(private _testService: TestService){}
  
  columnDefs: (ColDef<any>|ColGroupDef<any>)[]|undefined = [];
  gridId = 'grid-server-side';
  extGridDefn?: ExtendedGridDefinition;
  apiCallParams: ApiCallParams = {
    api: (params, method, nexturl) => this._testService.translations().pipe(map((res: ResponseObj<GridResponse>) => {
      const _data = this._testService.exctractTranslationData(res);
      res.content.fields = [
        {label: 'string', field: 'label'},
        {value: 'string', field: 'value'},
        {group: 'string', field: 'group'}
      ];
      res.content.permission = {
        read: true,
        create: true,
        delete: true,
        update: true
      }
      res.content.results = _data.result;
      return res;
    })),
  };
  gridParams: GridReadyEvent<any>|undefined;
  rowData: any[] = [];

  ngOnInit(){
    
  }
}
