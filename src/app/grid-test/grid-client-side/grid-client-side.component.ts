import { Component } from '@angular/core';
import { ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
import { ApiCallParams, ExtendedGridDefinition, GridResponse, ResponseObj } from 'projects/core/src/public-api';
import { TestService } from 'src/app/tests/test.service';

@Component({
  selector: 'app-grid-client-side',
  templateUrl: './grid-client-side.component.html',
  styleUrls: ['./grid-client-side.component.scss']
})
export class GridClientSideComponent {
  constructor(private _testService: TestService){}
  
  columnDefs: (ColDef<any>|ColGroupDef<any>)[]|undefined = [];
  gridId = 'grid-client-side-';
  extGridDefn?: ExtendedGridDefinition;
  apiCallParams: ApiCallParams|undefined;
  gridParams: GridReadyEvent<any>|undefined;
  rowData: any[] = [];

  ngOnInit(){
    this._testService.translations().subscribe((res: ResponseObj<GridResponse>) => {
      const _data = this._testService.exctractTranslationData(res);
      this.rowData = _data.result;
      this.columnDefs = _data.columnDefs;
    });
  }

}
