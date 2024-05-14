import { CellClassParams, ColDef, ValueGetterParams } from "ag-grid-community";
import { PrimeIcons } from "primeng/api";
import { Core } from "projects/core/src/lib/core.static";
import { AgCellMenuItems, AutoCompleteCellEditorParams, CellCustomActions, COLUMN_TYPE, GridResponse, ResponseObj, UserPreferences } from "projects/core/src/public-api";
import { delay, Observable, of } from "rxjs";

export class GridTest {
    public static getUserPref(): Observable<ResponseObj<UserPreferences>>{
        const toReturn: ResponseObj<UserPreferences> = {
            content: {
                grid:  {
                    'grid-server-side_grid-test-server-side-new': {
                        appId: 1, gridId: "grid-server-side_grid-test-server-side-new", user_id: "randy.tolentino", isGlobal: true, type: "",
                        columns: '{"state":[{"colId":"country","width":200,"hide":false,"pinned":null,"sort":"asc","sortIndex":0,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"athlete","width":220,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"year","width":200,"hide":false,"pinned":null,"sort":"desc","sortIndex":1,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"sport","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"gold","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"silver","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"bronze","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col5_custom","width":340,"hide": true,"pinned":"left","sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col6_autocomplete","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col7_autocomplete","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col8_autocomplete","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col_date","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"unique","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"unique_case_sensitive","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"required","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"required_when","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"date","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col9_auto_extra","width":200,"hide": true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null}],"groupState":[]}',
                        filters: '{"athlete":{"filterType":"multi","filterModels":[{"filterType":"text","operator":"AND","condition1":{"filterType":"text","type":"nonBlanks"},"condition2":{"filterType":"text","type":"equals","filter":"K"}},{"values":["Kateryna Serdiuk"],"filterType":"set"}]},"year":{"filterType":"multi","filterModels":[{"filterType":"number","operator":"AND","condition1":{"filterType":"number","type":"greaterThanOrEqual","filter":2006},"condition2":{"filterType":"number","type":"lessThanOrEqual","filter":2008}},{"values":["Michael Phelps","Kateryna Serdiuk"],"filterType":"set"}]}}',
                        charts: "", profileName: "", theme: 'balham'
                    },
                    'grid_grid-test-new': {
                        appId: 1, gridId: "grid_grid-test-new", user_id: "randy.tolentino", isGlobal: true, type: "",
                        columns: '{"state":[{"colId":"ag-Grid-AutoColumn","width":200,"hide":false,"pinned":null,"sort":"asc","sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"id","width":200,"hide":false,"pinned":null,"sort":"asc","sortIndex":2,"aggFunc":null,"rowGroup":true,"rowGroupIndex":0,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col4_date","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col2","width":200,"hide":false,"pinned":null,"sort":"asc","sortIndex":1,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col3","width":200,"hide":false,"pinned":null,"sort":"asc","sortIndex":0,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"multiply","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"validate_when","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"required_when","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"date","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col9_auto_extra","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col5_custom","width":276,"hide":true,"pinned":"left","sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"required","width":200,"hide":false,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col8_autocomplete","width":200,"hide":true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col7_autocomplete","width":200,"hide":true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col6_autocomplete","width":200,"hide":true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"col_date","width":200,"hide":true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"unique","width":200,"hide":true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null},{"colId":"unique_case_sensitive","width":200,"hide":true,"pinned":null,"sort":null,"sortIndex":null,"aggFunc":null,"rowGroup":false,"rowGroupIndex":null,"pivot":false,"pivotIndex":null,"flex":null}],"groupState":[]}',
                        filters: '{"col2":{"filterType":"multi","filterModels":[{"filterType":"text","type":"nonBlanks"},{"values":[null,"mvodowfd","name1","name2","name3","name4","name5","sdfdfgeg","test1","test2","test3","test4","u9837u","woeurwuir"],"filterType":"set"}]}}',
                        charts: "", profileName: "", theme: 'balham'
                    }
                },
                app: [{appId: 1, app_name: 'framework', ui_theme: "dark"}],
                locale: 'en',
                sidebar: {
                    'eag-main': {modal: false, mode: 'thin', sidebarVisible: true, menuType: "sidebar"},
                    'eag-lazy': {modal: true, mode: 'compact', sidebarVisible: false, menuType: "menubar"}}
            }, status: {status_code: 200, message: 'OK'}
        };
        return of(toReturn).pipe(delay(1));
    }

    public static getCountriesForAutoComplete(match?: string): any[]{
        return [
            { name:  'Canada',label:  '1 Canada', value:  'CA', group:  'North America', 'numericCode': 123, region: 'X'},
            { name:  'United States', label:  '1 United States', value:  'US', group:  'North America', 'numericCode': 234, region: 'X2' },
            { name:  'Uzbekistan',label:  '1 Uzbekistan', value:  'UZ', group:  'Asia', 'numericCode': 345, region: 'X3' },
            { name:  'Canada',label:  '2 Canada', value:  'CA2', group:  'North America', 'numericCode': 456, region: 'X4' },
            { name:  'United States', label:  '2 United States', value:  'US2', group:  'North America', 'numericCode': 567, region: 'X5' },
            { name:  'Uzbekistan',label:  '2 Uzbekistan', value:  '2UZ', group:  'Asia', 'numericCode': 789, region: 'X6' },
            { name:  'Canada',label:  '3 Canada', value:  'CA3', group:  'North America', 'numericCode': 910, region: 'X7' },
            { name:  'United States', label:  '3 United States', value:  'US3', group:  'North America', 'numericCode': 911, region: 'X8' },
            { name:  'Uzbekistan',label:  '3 Uzbekistan', value:  '3UZ', group:  'Asia', 'numericCode': 912, region: 'X9' },
            { name:  'Canada',label:  '4 Canada', value:  'CA4', group:  'North America', 'numericCode': 913, region: 'X9' },
            { name:  'United States', label:  '4 United States', value:  'US4', group:  'North America', 'numericCode': 914, region: 'X10' },
            { name:  'Uzbekistan',label:  '4 Uzbekistan', value:  '4UZ', group:  'Asia', 'numericCode': 915, region: 'X11' },
            { name:  'Canada',label:  '5 Canada', value:  'CA5', group:  'North America', 'numericCode': 916, region: 'X12' },
            { name:  'United States', label:  '5 United States', value:  'US5', group:  'North America', 'numericCode': 917, region: 'X13' },
            { name:  'Uzbekistan',label:  '5 Uzbekistan', value:  '5UZ', group:  'Asia', 'numericCode': 918, region: 'X14' },
            { name:  'Canada',label:  '6 Canada', value:  'CA6', group:  'North America', 'numericCode': 919, region: 'X15' },
            { name:  'United States', label:  '6 United States', value:  'US6', group:  'North America', 'numericCode': 920, region: 'X16' },
            { name:  'Uzbekistan',label:  '6 Uzbekistan', value:  '6UZ', group:  'Asia', 'numericCode': 921, region: 'X17' },
            { name:  'Canada',label:  '7 Canada', value:  'CA7', group:  'North America', 'numericCode': 123, region: 'X18' },
            { name:  'United States', label:  '7 United States', value:  'US7', group:  'North America', 'numericCode': 123, region: 'X19' },
            { name:  'Uzbekistan',label:  '7 Uzbekistan', value:  '7UZ', group:  'Asia', 'numericCode': 123, region: 'X20' },
            { name:  'Canada',label:  '8 Canada', value:  'CA8', group:  'North America', 'numericCode': 123, region: 'X21' },
            { name:  'United States', label:  '8 United States', value:  'US8', group:  'North America', 'numericCode': 123, region: 'X21' },
            { name:  'Uzbekistan',label:  '8 Uzbekistan', value:  '8UZ', group:  'Asia', 'numericCode': 123, region: 'X22' },
            { name:  'Canada',label:  '9 Canada', value:  'CA9', group:  'North America', 'numericCode': 123, region: 'X23' },
            { name:  'United States', label:  '9 United States', value:  'US9', group:  'North America', 'numericCode': 123, region: 'X24' },
            { name:  'Uzbekistan',label:  '9 Uzbekistan', value:  '9UZ', group:  'Asia', 'numericCode': 123, region: 'X25' },
            { name:  'Canada',label:  '10 Canada', value:  'CA10', group:  'North America', 'numericCode': 123, region: 'X26' },
            { name:  'United States', label:  '10 United States', value:  'US10', group:  'North America', 'numericCode': 123, region: 'X27' },
            { name:  'Uzbekistan',label:  '10 Uzbekistan', value:  '10UZ', group:  'Asia', 'numericCode': 123, region: 'X28' },
            { name:  'Canada',label:  '11 Canada', value:  'CA11', group:  'North America', 'numericCode': 123, region: 'X29' },
            { name:  'United States', label:  '11 United States', value:  'US11', group:  'North America', 'numericCode': 123, region: 'X30' },
            { name:  'Uzbekistan',label:  '11 Uzbekistan', value:  '11UZ', group:  'Asia', 'numericCode': 123, region: 'X31' },
            { name:  'Canada',label:  '12 Canada', value:  'CA12', group:  'North America', 'numericCode': 123, region: 'X32' },
            { name:  'United States', label:  '12 United States', value:  'US12', group:  'North America', 'numericCode': 123, region: 'X33' },
            { name:  'Uzbekistan',label:  '12 Uzbekistan', value:  '12UZ', group:  'Asia', 'numericCode': 123, region: 'X34' },
            { name:  'Canada',label:  '13 Canada', value:  'CA13', group:  'North America', 'numericCode': 123, region: 'X35' },
            { name:  'United States', label:  '13 United States', value:  'US13', group:  'North America', 'numericCode': 123, region: 'X36' },
            { name:  'Uzbekistan',label:  '13 Uzbekistan', value:  '13UZ', group:  'Asia', 'numericCode': 123, region: 'X37' },
            { name:  'Canada',label:  '14 Canada', value:  'CA14', group:  'North America', 'numericCode': 123, region: 'X38' },
            { name:  'United States', label:  '14 United States', value:  'US14', group:  'North America', 'numericCode': 123, region: 'X39' },
            { name:  'Uzbekistan',label:  '14 Uzbekistan', value:  '14UZ', group:  'Asia', 'numericCode': 123, region: 'X40' },
            { name:  'Canada',label:  '15 Canada', value:  'CA15', group:  'North America', 'numericCode': 123, region: 'X41' },
            { name:  'United States', label:  '15 United States', value:  'US15', group:  'North America', 'numericCode': 123, region: 'X42' },
            { name:  'Uzbekistan',label:  '15 Uzbekistan', value:  '15UZ', group:  'Asia', 'numericCode': 123, region: 'X43' },
            { name:  'Canada',label:  '16 Canada', value:  'CA16', group:  'North America', 'numericCode': 123, region: 'X44' },
            { name:  'United States', label:  '16 United States', value:  'US16', group:  'North America', 'numericCode': 123, region: 'X45' },
            { name:  'Uzbekistan',label:  '16 Uzbekistan', value:  '16UZ', group:  'Asia', 'numericCode': 123, region: 'X46' },
            { name:  'Canada',label:  '16 Canada', value:  'CA16b', group:  'North America', 'numericCode': 123, region: 'X47' },
            { name:  'United States', label:  '16 United States', value:  'US16b', group:  'North America', 'numericCode': 123, region: 'X100' },
            { name:  'Uzbekistan',label:  '16 Uzbekistan', value:  '16UZb', group:  'Asia', 'numericCode': 123, region: 'X101' },
        ].filter(d => (!match || d.name.indexOf(match) >= 0 || d.label.indexOf(match) >= 0 || d.group.indexOf(match) >= 0 || d.region.indexOf(match) >= 0));
    }

    public static getAdditionalColumns(extraParams: any): ColDef[]{
        const toReturn: ColDef[] = [
            {
            field: 'col5_custom', headerName: '', cellRenderer: 'cellCustom', width: 345, pinned: 'left', hide: true, cellRendererParams: (p: any) => ({
                actions: [
                { colId: 'col5_custom', isHidden: false, icon: PrimeIcons.BOLT, text: Core.Localize('options'), iconClass: 'p-button-info', isMulti: true, popup: true,
                    menuItems: this.getMenuItems(extraParams, p)},
                { colId: 'col5_custom', isHidden: false, icon: PrimeIcons.TRASH, text: Core.Localize('delete'), iconClass: 'p-button-danger', isReversedTextAndIcon: true,
                    clickCallback(event, params) {
                        if(extraParams.deleteAction){
                            extraParams.deleteAction(event, params);
                        }
                }},
                { colId: 'col5_custom', isHidden: false, icon: PrimeIcons.SAVE, text: Core.Localize('save'), iconClass: 'p-button-info',
                    clickCallback(event, params) {
                        if(extraParams.saveAction){
                            extraParams.saveeAction(event, params);
                        }
                }},
                { colId: 'col5_custom', isHidden: false, icon: PrimeIcons.INFO_CIRCLE, text: Core.Localize('info'), iconClass: 'p-button-info', title: Core.Localize('info'),
                    clickCallback(event, params) {
                        if(extraParams.infoAction){
                            extraParams.infoAction(event, params);
                        }
                }},
                ] as CellCustomActions[]
            })
            },
            /* {
            field: 'col6_autocomplete', headerName: Core.Localize('autoCompleteSync'), hide: true, type: COLUMN_TYPE.AUTOCOMPLETE_COLUMN, cellEditorParams: {
                selectData: this.getCountriesForAutoComplete(),
                placeholder: 'Select an option',
                autocomplete: {
                strict: true,
                autoselectfirst: true,
                }
            } as AutoCompleteCellEditorParams,
            },
            {
            field: 'col7_autocomplete', headerName: Core.Localize('autoCompleteAsync'), hide: true, type: COLUMN_TYPE.AUTOCOMPLETE_COLUMN, cellEditorParams: {
                autocomplete: {
                fetch: (cellEditor: any, text: string, update: (p?: any) => void) => {
                    const match = text.toLowerCase() || cellEditor.eInput.value.toLowerCase();
                    if(extraParams.getData){
                        extraParams.getData(match).subscribe({next: (data: any) => {
                            let items = data.map((d: any) => ({ value: d.numericCode, label: d.name, group: d.region }));
                            update(items);
                            }, error: (err: any) => { update(false) }
                        });
                    } else{
                        update([]);
                    }
                },
                },
                placeholder: 'Select a Country',
            } as AutoCompleteCellEditorParams
            },
            {
            field: 'col8_autocomplete', headerName: Core.Localize('autoCompleteNonStrict'), hide: true, type: COLUMN_TYPE.AUTOCOMPLETE_COLUMN, cellEditorParams: {
                selectData: this.getCountriesForAutoComplete(),
                placeholder: Core.Localize('selectAnOption'),
                autocomplete: {
                strict: false,
                autoselectfirst: false,
                }
            } as AutoCompleteCellEditorParams
            }, */
            { field: "col_date", headerName: Core.Localize('dateColumn'), type: [COLUMN_TYPE.EDITABLE_COLUMN, COLUMN_TYPE.DATE_COLUMN], hide: true,},
            { field: 'unique', type: [COLUMN_TYPE.EDITABLE_COLUMN, COLUMN_TYPE.UNIQUE_VALUE_COLUMN], hide: true, },
            { field: 'unique_case_sensitive', headerName: Core.Localize('uniqueCaseSensitive'), type: [COLUMN_TYPE.EDITABLE_COLUMN, COLUMN_TYPE.UNIQUE_CASE_SENSITIVE_COLUMN], hide: true, },
            { field: 'required', type: [COLUMN_TYPE.EDITABLE_COLUMN, COLUMN_TYPE.REQUIRED_COLUMN], hide: true, },
            { field: 'required_when',headerName: Core.Localize('requiredWhenEditable'), type:  [COLUMN_TYPE.EDITABLE_COLUMN, COLUMN_TYPE.VALIDATE_WHEN_COLUMN],
            cellEditorParams: {validateWhen: (p: CellClassParams) => (!p.value && p.data?.col_date !== null && p.data?.col_date !== undefined) },
            cellRendererParams: {tooltip: {error: 'The field is required when col_date is supplied', icon: PrimeIcons.EXCLAMATION_TRIANGLE } },
            },
            { field: 'date', type: [COLUMN_TYPE.EDITABLE_COLUMN, COLUMN_TYPE.DATE_COLUMN] },
            /* { field: 'col9_auto_extra', headerName: Core.Localize('extra'), type: COLUMN_TYPE.AUTOCOMPLETE_COLUMN }, */
        ];
        return toReturn;
    }

    public static getMenuItems(extraParams: any, p: any): AgCellMenuItems[]{
        return [{
            label:'File',
            icon:'pi pi-fw pi-file',
            items: [
                {
                    label:'New',
                    icon:'pi pi-fw pi-plus',
                    items:[
                    {
                        label:'Bookmark',
                        icon:'pi pi-fw pi-bookmark'
                    },
                    {
                        label:'Video',
                        icon:'pi pi-fw pi-video',
                        clickCallback(e?: any, pp?: any) {
                            if(extraParams?.gridMenuClicked){
                                extraParams?.gridMenuClicked(e, p);
                            }
                        },
                    },

                    ]
                },
                {
                    label:'Delete',
                    icon:'pi pi-fw pi-trash'
                },
                {
                    separator:true
                },
                {
                    label:'Export',
                    icon:'pi pi-fw pi-external-link'
                }
            ]
            },
            {
                label:'Edit',
                icon:'pi pi-fw pi-pencil',
                items:[
                    {
                        label:'Left',
                        icon:'pi pi-fw pi-align-left'
                    },
                    {
                        label:'Right',
                        icon:'pi pi-fw pi-align-right'
                    },
                    {
                        label:'Center',
                        icon:'pi pi-fw pi-align-center'
                    },
                    {
                        label:'Justify',
                        icon:'pi pi-fw pi-align-justify'
                    },

                ]
            },
            {
                label:'Users',
                icon:'pi pi-fw pi-user',
                items:[
                    {
                        label:'New',
                        icon:'pi pi-fw pi-user-plus',

                    },
                    {
                        label:'Delete',
                        icon:'pi pi-fw pi-user-minus',

                    },
                    {
                        label:'Search',
                        icon:'pi pi-fw pi-users',
                        items:[
                        {
                            label:'Filter',
                            icon:'pi pi-fw pi-filter',
                            items:[
                                {
                                    label:'Print',
                                    icon:'pi pi-fw pi-print'
                                }
                            ]
                        },
                        {
                            icon:'pi pi-fw pi-bars',
                            label:'List'
                        }
                        ]
                    }
                ]
            },
            {
                label:'Events',
                icon:'pi pi-fw pi-calendar',
                items:[
                    {
                        label:'Edit',
                        icon:'pi pi-fw pi-pencil',
                        items:[
                        {
                            label:'Save',
                            icon:'pi pi-fw pi-calendar-plus'
                        },
                        {
                            label:'Delete',
                            icon:'pi pi-fw pi-calendar-minus'
                        },

                        ]
                    },
                    {
                        label:'Archieve',
                        icon:'pi pi-fw pi-calendar-times',
                        items:[
                        {
                            label:'Remove',
                            icon:'pi pi-fw pi-calendar-minus'
                        }
                        ]
                    }
                ]
            },
            {
                separator:true
            },
            {
                label:'Quit',
                icon:'pi pi-fw pi-power-off'
            }
        ];
    }
}
