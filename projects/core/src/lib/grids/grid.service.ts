import { Injectable, } from '@angular/core';
import { CellClassParams, ColDef, ColGroupDef, FirstDataRenderedEvent, GridApi, RowNode, SetFilterValuesFuncParams, SideBarDef } from 'ag-grid-community';
import { getLocaleType } from '../core.interface';
import { CoreService } from '../core.service';
import { Core } from '../core.static';
import { HelperService } from '../helper.service';
import { aggsType, colsAndCharts, columnTypeIsA, COLUMN_TYPE, fieldMapperType, GridPeferences, GridResponse, GRID_TYPE } from './grid.interface';

@Injectable({providedIn: 'root'})
export class GridService{
    constructor(private _helper: HelperService,
        private _coreService: CoreService
    ){}

    private _aggsValue!: aggsType[] | undefined;
    public get aggsValue(): aggsType[] | undefined {
        return this._aggsValue;
    }
    public set aggsValue(value: aggsType[] | undefined) {
        this._aggsValue = value;
    }

    /* headerName: key,
        colId: key,
        //pinned: "left",
        field:key,
        hide: false,
        width: 100,
        enableValue: true,
        sortable: true,
        lockPosition: false,
        cellClass: "no-border",
        rowGroup: false,
        type: this._checkTypes(paramData[key]) */

    public defaultColDef: ColDef = {
        hide: false,
        sortable: true,
        resizable: true,
        // allow every column to be aggregated
        enableValue: true,
        // allow every column to be grouped
        enableRowGroup: true,
        // allow every column to be pivoted
        enablePivot: true
    };

    public isColGroupDef(eachCol: ColGroupDef | ColDef): eachCol is ColGroupDef{
        return eachCol.hasOwnProperty("children");
    }

    public isColDef(eachCol: ColGroupDef | ColDef): eachCol is ColDef{
        return !eachCol.hasOwnProperty("children");
    }

    public getDefaultColDef(extraParams: any, 
        defColDefOverride: ColDef | undefined,
        fieldMapper: fieldMapperType = {},
        filterType: "agTextColumnFilter" | "agNumberColumnFilter" | "agDateColumnFilter" = "agTextColumnFilter", 
        eachCol?: ColDef): ColDef{
        const _updatedLocale = this._coreService.getLocaleFormat();
        return {...this.defaultColDef,
            /* floatingFilter: extraParams.floatingFilter, */
            ...defColDefOverride,
            ...(extraParams.rowModelType == GRID_TYPE.CLIENT_SIDE ? {keyCreator: (kParams) => {
                if(typeof kParams.value == "object" && kParams.value?.["name"]){
                    return kParams.value["name"];
                }
                return kParams.value;
            }} : {}),
            ...this.getMultiFilters(extraParams, filterType, eachCol, fieldMapper),
            ...(filterType == "agDateColumnFilter" ? {
                cellEditor: 'datePicker', valueFormatter: p => {
                    //const _updatedLocale = this._coreService.getLocaleFormat();
                    return this.reformatIfDate(p.value, _updatedLocale._dateFormat, _updatedLocale._locale, p)
                }, ...this.dateComparator(false)}: {}),
            ...(filterType == "agNumberColumnFilter" ? {...this.numberComparator(), valueFormatter: p => {
                if(p.value != null){
                    //const _updatedLocale = this._coreService.getLocaleFormat();
                    return this._helper.pipeDecimal(p.value, _updatedLocale._locale, p.colDef.cellRendererParams?.digitsInfo);
                }
                return p.value;
            } } : {})
        };
    }

    public getMultiFilters(extraParams: any, filterType: "agTextColumnFilter" | "agNumberColumnFilter" | "agDateColumnFilter" = "agTextColumnFilter", eachCol?: ColDef, fieldMapper: fieldMapperType = {}) : ColDef{
        const filters = [
            {
            filter: filterType,
            filterParams: {
                buttons: ['reset'].concat(extraParams.rowModelType != GRID_TYPE.CLIENT_SIDE ? ['apply'] : []),
                filterOptions: [...['notBlank', 'equals', 'notEqual'],
                ...(filterType == 'agTextColumnFilter' ? [
                    'contains',
                    'notContains',
                    'startsWith',
                    'endsWith']: 
                    ['lessThan',
                    'lessThanOrEqual',
                    'greaterThan',
                    'greaterThanOrEqual',
                    'inRange']
                    )
                ],
                defaultOption: 'equals',
                ...(filterType == "agNumberColumnFilter" ? this.numberComparator(true) : 
                    (filterType == "agDateColumnFilter" ? {...this.dateComparator(true), browserDatePicker: false} : {}))
                }
            },
            {filter: 'agSetColumnFilter', 
                filterParams: {
                    ...eachCol?.filterParams,
                    selectAllOnMiniFilter: false,
                    defaultToNothingSelected: true,
                    buttons: ['reset', 'apply'],
                    closeOnApply: true,
                    ...(extraParams.rowModelType != GRID_TYPE.CLIENT_SIDE ? {
                        refreshValuesOnOpen: true, newRowsAction: "keep", values: (p: SetFilterValuesFuncParams) => {
                            if(p.colDef.filterParams?.['filterFunc'] && typeof p.colDef.filterParams?.['filterFunc'] == 'function'){
                                p.success(p.colDef.filterParams?.['filterFunc']?.(p));
                            } else{
                                let colId = p.colDef.filterParams?.['filterKey'] || p.column?.getColId();
                                let _fieldToUse = colId;
                                if(colId && this._aggsValue !== undefined){
                                    const aggVal = this._aggsValue.find((eachAgg) => eachAgg.hasOwnProperty(colId));
                                    if(aggVal && aggVal[colId]){
                                        p.success(aggVal[colId].map((val: any) => {

                                            /* RT FILTERING KEY TO USE _fieldToUse */
                                            Object.keys(val).forEach((_eaKey: string) => {
                                                if(_eaKey != 'count'){
                                                    const _fSplit = _eaKey.split("__");
                                                    if(_fSplit?.length > 0 && _fSplit[1]){
                                                        _fieldToUse = _eaKey;
                                                        if(!fieldMapper?.[colId]){
                                                            fieldMapper[colId] = {filterKey: _fieldToUse};
                                                        }
                                                        
                                                    }
                                                }
                                            });
                                            /* if(fieldMapper?.[colId]?.filterKey){
                                                _fieldToUse = fieldMapper?.[colId]?.filterKey;
                                            } */
                                            return val?.[_fieldToUse];
                                        }));
                                    } else{
                                        p.success([]); //p.success(this._aggsValue[p.column?.getColId()] || []);  
                                    }
                                }
                            }
                            
                        }
                    } : {newRowsAction: "clear"}),
                    ...(filterType == "agNumberColumnFilter" ? this.numberComparator(true): 
                        (filterType == "agDateColumnFilter" ? {
                            valueFormatter: (p: any) => {
                                const _updatedLocale = this._coreService.getLocaleFormat();
                                return this.reformatIfDate(p.value, _updatedLocale._dateFormat, _updatedLocale._locale, p);
                            }, ...this.dateComparator(true) } : {})),
                }
            }
        ];

        const toReturn = {
            filter: "agMultiColumnFilter",
            filterParams: {
                filters
            }
        };
        return toReturn;
    }

    public getSideBar(params: any, defaultToolPanel = '', columnParams = null, iconKey = "custom-grid", pivotMode = false): any {
        const defTP = pivotMode ? "analysisPanel" : defaultToolPanel;
        const colParams = columnParams;
        const toolPanels: any/* : SideBarDef */ = {
            toolPanels: [
                /* {
                    id: "save",
                    labelDefault: "",
                    //labelKey: "filters",
                    iconKey: "custom-save",
                    toolPanel: "agSaveColumn",
                }, */
                {
                    id: "filters",
                    labelDefault: "Filters",
                    labelKey: "filters",
                    iconKey: "filter",
                    toolPanel: "agFiltersToolPanel",
                },
                {
                    id: "columns",
                    labelDefault: "Columns",
                    labelKey: "columns",
                    iconKey: "columns",
                    toolPanel: "agColumnsToolPanel",
                    toolPanelParams: colParams
                }
            ],
            defaultToolPanel: defTP
        };
        if (params.enableCustomToolPanel) {
            toolPanels.toolPanels.splice(0, 0, {
                id: "customTools",
                labelDefault: Core.Localize('gridOptions'),
                labelKey: "customTools",
                iconKey,
                toolPanel: "customToolsPanel",
                toolPanelParams: params
            });
        }
        if (params.enableAnalysisToolPanel) {
            toolPanels.toolPanels.push({
                id: "analysisPanel",
                labelDefault: "Insights (BETA)",
                labelKey: "analysis",
                iconKey:'chart',
                toolPanel: "analysisPanel",
                toolPanelParams: params,
                minWidth: 500,
                maxWidth: 500,
                width: 500,
            });
        }
        return toolPanels;
    }

    public reformatIfDate(val: any, dateFormat: string, locale: string, p?: any, tz?: string){
        if(!p || (p.colDef.type && p.colDef.type.includes(COLUMN_TYPE.DATE_COLUMN))){
            if(val){
                try {
                    if(val != null && typeof(val) == typeof(1)){//Date in Miliseconds
                        return (this._helper.pipeDate(val, dateFormat, locale, tz));
                    } else if(val != null && typeof(val) == typeof(new Date())){
                        return (this._helper.pipeDate(val, dateFormat, locale, tz));
                    } else if(val != null && typeof val == "string" && val.indexOf("T") >= 0){
                        return (this._helper.pipeDate(val, dateFormat, locale, tz));
                    } else{
                        return (this._helper.pipeDate(val, dateFormat, locale, tz, true));
                    }    
                } catch (error) {
                    console.warn('reformatIfDate', error);
                    return val;
                }
            }
        }
        return val;
    }

    public numberComparator(forGroupOrFiltering = false){ 
        return {
            comparator: (a: any, b: any) => {
            const valA = parseInt(a);
            const valB = parseInt(b);
            if(forGroupOrFiltering){
                if (valA === valB) return 0;
                return valA > valB ? 1 : -1;    
            } else {
                return valA - valB;
            }
        }};
    }

    public dateComparator(forGroupOrFiltering = false, p?: any){
        return {
            //filterLocalDateAtMidnight
            comparator: (date1: any, cellValue: any) => {
                const _updatedLocale = this._coreService.getLocaleFormat();
                const dateAsString = this.reformatIfDate(cellValue, _updatedLocale._dateFormat, _updatedLocale._locale);
                if (dateAsString == null) {
                    return 0;
                }
                // In the example application, dates are stored as dd.mm.yyyy
                // We create a Date object for comparison against the filter date
                const dateParts = dateAsString.split(_updatedLocale._dateDelimeter);
                const day = Number(dateParts[0]);
                const month = Number(dateParts[1]) - 1;
                const year = Number(dateParts[2]);
                const cellDate = new Date(year, month, day);

                // Now that both parameters are Date objects, we can compare
                if(forGroupOrFiltering){
                    if (cellDate < date1) {
                        return -1; 
                    } else if (cellDate > date1) {
                        return 1;
                    }
                } else{
                    if (dateAsString < date1) {
                        return 1; 
                    } else if (dateAsString > date1) {
                        return -1;
                    }
                    //return date1 == dateAsString ? 0 : (date1 > dateAsString ? 1 : -1);
                }
                return 0;
            },
        };
    }

    public extractApiColumns(_firstResult: GridResponse | undefined, isDebug = false): ColDef[]{
        if(isDebug){
            console.log("this._firstResult", _firstResult);
        }

        let colDefs: ColDef[] = [];
        if(this._helper.isNotEmpty(_firstResult)){
            colDefs = _firstResult?.fields?.map(_col => {
                let _toReturn: ColDef;
                let field = '_id';
                let colId = field;
                let headerName;
                let headerTooltip;
                let type : string | string[] = COLUMN_TYPE.DEFAULT_SET_COLUMN;
                
                if(this._helper.isNotEmpty(_col)){
                    field = Object.keys(_col)?.[0];
                    colId = field;
                    
                    const _toType = _col[field];
                    const _toEval = `COLUMN_TYPE.${_toType.toUpperCase()}_COLUMN`;

                    /* console.log({_toType, _toEval}); */
                    if(_toType){
                        try{
                            const _evalType = eval(_toEval);
                            if(_evalType){
                                if(isDebug){
                                    console.log({_toType, field, _toEval});
                                }
                                type = _evalType;
                            }
                        } catch(e){
                            switch(_toType){
                                case "Decimal": type = COLUMN_TYPE.DECIMAL_COLUMN; break;
                                case "Boolean": type = COLUMN_TYPE.BOOLEAN_COLUMN; break;
                                case "Number": type = COLUMN_TYPE.NUMBER_COLUMN; break;
                                case "Float": type = COLUMN_TYPE.FLOAT_COLUMN; break;
                                case "Date": type = COLUMN_TYPE.DATE_COLUMN; break;
                                case "String": break; 
                                default: console.warn({_toType, e});
                            }
                        }
                    }

                    if(isDebug){
                        console.log({_col: _col, field});
                    }

                    const _localizedCol = Core.Localize(field);
                    if(_localizedCol && _localizedCol != `{translations.${field}}`){
                        headerName = _localizedCol;
                    }
                    headerTooltip = (`${(_localizedCol || field)} ${type}`);

                    if(GridService.ObjectFields.includes(_col?.form) ){
                        type = [...(Array.isArray(type) ? type : [type]), COLUMN_TYPE.NEW_AUTOCOMPLETE_COLUMN];
                    }
                }
                
                _toReturn = {...this.defaultColDef, field, colId, headerName, headerTooltip, type};
                if(isDebug){
                    console.log({_col, _toReturn});
                }
                return _toReturn;
            }) || [];
        }
        return colDefs;
    }

    public columnTypeCheck(columnType: string | string[], columnTypeToCheck: string | string[], returnAsObject = false): boolean | columnTypeIsA{
        let isMatched = false;
        let toReturnAsObject: columnTypeIsA = {};
        if(columnType && columnTypeToCheck){
            const colType = (Array.isArray(columnType) ? columnType : [columnType]);
            const colTypeToCheck = (Array.isArray(columnTypeToCheck) ? columnTypeToCheck : [columnTypeToCheck]);
            isMatched = colType.some(ct => colTypeToCheck.includes(ct));

            if(isMatched && returnAsObject){
                if(colType.includes(COLUMN_TYPE.UNIQUE_CASE_SENSITIVE_COLUMN)){
                    toReturnAsObject.isUniqueCaseSensitive = true;
                }
                if(colType.includes(COLUMN_TYPE.VALIDATE_WHEN_COLUMN)){
                    toReturnAsObject.isRequiredWhen = true;
                }
            }
        }
        return (returnAsObject ? toReturnAsObject : isMatched);
    }

    public isCellEditable(p: any, whichCol?: string){
        let pColDef;
        if(p.columnApi && p.node){
            pColDef =  p.columnApi.getColumn(whichCol || p.colDef.colId);
            if(pColDef){
                return pColDef.isCellEditable(p.node);
            }
        }
        return false;
    }

    public isRequiredOrValidateWhen(params: CellClassParams | {value: any, api: GridApi, colDef: ColDef, data: any}, validateWhen = false): boolean{
        const _colId = params.colDef.colId || params.colDef.field || '';
        if(_colId && params.data){
            let _isEmpty = false;
            if(validateWhen){
                if(params.colDef.cellEditorParams.validateWhen){
                    _isEmpty = params.colDef.cellEditorParams.validateWhen(params);
                } else{
                    console.warn(`**** GRID WARNING: column '${_colId}' is of type ${COLUMN_TYPE.VALIDATE_WHEN_COLUMN} and is missing function 'cellEditorParams.validateWhen(p: CellClassParams): boolean' ****`)
                }
            } else if(!this._helper.isNotEmpty(params.value)){
                _isEmpty = true;
            }

            if(_isEmpty){
                if(!params.data?._errors){
                    params.data._errors = [];
                }
                if(!params.data?._errors.includes(_colId)){
                    params.data?._errors.push(_colId);
                }
            } else {
                const mands = params.data?._errors;
                if(mands && Array.isArray(mands)){
                    const rowIndex = mands.indexOf(_colId);
                    if(rowIndex >= 0){
                        mands.splice(rowIndex, 1);
                    }
                    if(mands.length == 0){
                        delete params.data?._errors;
                    }
                }
            }
            return _isEmpty;
        }
        return false;
    }

    public validateDuplicate(params: CellClassParams | {value: any, api: GridApi, colDef: ColDef, data: any}, isCaseSensitive = false): boolean{
        const _colId = params.colDef.colId || params.colDef.field || '';
        if(_colId && params.data){
            let _occurrence = 0;
            if(params.api && params.colDef){
                params?.api?.forEachNode((node: RowNode) => {
                    if(this._helper.isNotEmpty(params.value) && node.data){
                        if(!isCaseSensitive && typeof params.value == "string" && typeof node.data[_colId] == "string"){
                            if(params.value.toLowerCase() == node.data[_colId].toLowerCase()){
                                _occurrence++;
                            }
                        } else if(params.value === node.data[_colId]){
                            _occurrence++;
                        }
                    }
                });
            }
            if(_occurrence >= 2){
                if(!params.data?._duplicates){
                    params.data._duplicates = [];
                }
                if(!params.data?._duplicates.includes(_colId)){
                    params.data?._duplicates.push(_colId);
                }
            } else {
                const dups = params.data?._duplicates;
                if(dups && Array.isArray(dups)){
                    const rowIndex = dups.indexOf(_colId);
                    if(rowIndex >= 0){
                        dups.splice(rowIndex, 1);
                    }
                    if(dups.length == 0){
                        delete params.data?._duplicates;
                    }
                }
            }
            return (_occurrence >= 2);
        }
        return false;
    }

    public static ObjectFields: string[] = ['autocomplete', 'select', 'multiselect', 'address', 'file', 'JSON'];
}
