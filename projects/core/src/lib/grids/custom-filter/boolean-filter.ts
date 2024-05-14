import { Component } from '@angular/core';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import { BOOLEAN_FILTER_MODE } from '../grid.interface';
import { onOff } from '../../core.interface';

@Component({
  selector: 'eagna-boolean-filter',
  template: `
    <div style="display: inline-block;" class="full-width">
      <p-inputSwitch inputId="booleanFilterSwitch" pStyleClass="boolean-filter fw-500 fs-13 p-l-8" 
        [class.isOn]="isOn()" [class.isOff]="isOff()" [class.isInactive]="!isFilterActive()"
        [(ngModel)]="value" (ngModelChange)="updateFilter()"></p-inputSwitch>
      <label for="booleanFilterSwitch" class="ml-2" [innerHTML]="getLabel()"></label>
      <div style="padding: 4px; text-align: center;" class="bg-eg-grey2">
        <button [disabled]="!isFilterActive()" mat-flat-button (click)="updateFilter(true)">Reset</button>
      </div>
    </div>
  `,
  styles: [
    `
    ::ng-deep.boolean-filter .mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-thumb {
      background-color: green !important;
    }
    
    ::ng-deep.boolean-filter .mat-slide-toggle.mat-primary.mat-checked:not(.mat-disabled) .mat-slide-toggle-bar {
        background-color: #ff99ff !important;
    }
    `
  ]
})
export class BooleanFilter /* implements AgFilterComponent */ {
  params: any; //IFilterParams; 
  value : boolean | null = null;
  mode: BOOLEAN_FILTER_MODE | string = BOOLEAN_FILTER_MODE.TRUE_FALSE;
  modeMap: {[p: string]: onOff} = {
    trueFalse: {on: "True", off: "False"},
    yesNo: {on: "Yes", off: "No"}
  };
  private _modeMapVal: onOff = this.modeMap['trueFalse'];
  private _mappedValue: string | undefined;

  agInit(params: IFilterParams): void {
    this.params = params;
    if(!!this.params.mode && [BOOLEAN_FILTER_MODE.TRUE_FALSE, BOOLEAN_FILTER_MODE.YES_NO].includes(this.params.mode)){
        this.mode = this.params.mode;
    }
    this._modeMapVal = this.modeMap[this.mode];
    if(this.params.defaultValue != null){
        this.value = this.params.defaultValue;
        this._setMappedValue();
        this.updateFilter();
    }
  }

  private _isFilterActive(){
    return this.value === true || this.value === false;
  }

  isOn(): boolean{
    return this.isFilterActive() && this.value === true;
  }

  isOff(): boolean{
    return this.isFilterActive() && this.value === false;
  }

  isFilterActive(): boolean {
    return this._isFilterActive();
  }

  private _setMappedValue(){
    if(this._modeMapVal){
      if(this.value === true){
        this._mappedValue = this._modeMapVal.on;
      } else if(this.value === false){
        this._mappedValue = this._modeMapVal.off;
      } else{
        this._mappedValue = '';
      }
    }
    //console.log({value: this.value, typeo: (typeof this.value), modelMapVal: this._modeMapVal});
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if(this.params.customFilterCondition){ //filtering condition can be customized outside using filterParams.customFilterCondition(p, filterValue: [true/false])
        return this.params.customFilterCondition({...this.params, ...params}, this.value);
    } else if(this.params.valueGetter){ //in case valueGetter is used
      const gotValue = this.params.valueGetter(params.node);
      if(gotValue !== undefined){
        return (gotValue == this.value || (this._mappedValue != null && gotValue == this._mappedValue));
      }
    } //else use its default value
    return (params.data[this.params.colDef.colId] == this.value || (this._mappedValue != null && params.data[this.params.colDef.colId] == this._mappedValue));
  }

  getModel() {
    if(this._isFilterActive()){
      const model = {
        filterType: "set",
        values: [(this.value === true)]
      };
      return model;
    }
    return null;
  }

  setModel(model: any) {
    this.value = null;
    if(model && model.values && model.values.length > 0){      
      this.value = (model.values[0]===true);      
    }
    this._setMappedValue();
  }

  updateFilter(clear = false) {
    if(clear){
        this.value = null;
    }
    this._setMappedValue();
    this.params.filterChangedCallback({colId: this.params.colDef.colId});
  }

  getLabel(){
    if(this.value === true){
      return this.modeMap[this.mode].on;
    } else if(this.value === false){
      return this.modeMap[this.mode].off;
    }    
    return `Filter is Off (${this.modeMap[this.mode].on}/${this.modeMap[this.mode].off})`;
  }
}