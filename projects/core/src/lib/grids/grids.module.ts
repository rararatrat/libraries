import { NgModule } from '@angular/core';
import { GridComponent } from './grid/grid.component';
import { CommonModule } from '@angular/common';
import { EagnaPipesModule } from '../pipes/eagna-pipes.module';
import { AgGridModule } from 'ag-grid-angular';
import { CustomToolsPanel } from './tool-panel/custom-tools-panel';
import { AnalysisToolPanel } from './tool-panel/analysis-tool-panel';
import { DatePickerEditorComponent } from './editor/datepicker-editor.component';
import { DropdownSelectEditorComponent } from './editor/dropdown-select-editor.component';
import { DropdownMultiSelectEditorComponent } from './editor/dropdown-multiselect-editor.component';
import { NumericEditorComponent } from './editor/numeric-editor.component';
import { MaskEditorComponent } from './editor/mask.editor.component';
import { BooleanFilter } from './custom-filter/boolean-filter';
import { CellCustomComponent } from './cell-custom/cell-custom.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { TranslateModule } from '@ngx-translate/core';
import { GenericModule } from '../generic/generic.module';

const components : any  = [
                            GridComponent,
                            CustomToolsPanel,
                            AnalysisToolPanel,
                            DatePickerEditorComponent,
                            DropdownSelectEditorComponent,
                            DropdownMultiSelectEditorComponent,
                            NumericEditorComponent,
                            MaskEditorComponent,
                            BooleanFilter,
                            CellCustomComponent
                          ];

const modules    : any  = [
                            CommonModule,
                            TranslateModule,
                            AgGridModule,
                            FormsModule,
                            ReactiveFormsModule,
                            PrimeNgModule.forRoot(),
                            EagnaPipesModule,
                            GenericModule
                          ];

@NgModule({
  declarations: [].concat(components),
  imports     : [].concat(modules),
  exports     : [].concat(modules, components)
})
export class GridsModule { }
