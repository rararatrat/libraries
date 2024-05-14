import { ColDef, ColumnApi, GridApi, GridOptions, Module, ColGroupDef, ExcelStyle, IDatasource, IServerSideDatasource, IViewportDatasource, IAggFunc, CsvExportParams, ExcelExportParams, StatusPanelDef, SideBarDef, AgChartThemeOverrides, AgChartTheme, ServerSideStoreType, RowGroupingDisplayType, GetContextMenuItems, GetMainMenuItems, GetRowNodeIdFunc, GetRowIdFunc, NavigateToNextHeaderParams, HeaderPosition, TabToNextHeaderParams, NavigateToNextCellParams, CellPosition, TabToNextCellParams, PostProcessPopupParams, GetDataPath, RowNode, IsRowMaster, IsRowSelectable, PaginationNumberFormatterParams, ProcessDataFromClipboardParams, GetServerSideGroupKey, IsServerSideGroup, SuppressKeyboardEventParams, GetChartToolbarItems, FillOperationParams, IsApplyServerSideTransaction, GetServerSideStoreParamsParams, ServerSideStoreParams, IsServerSideGroupOpenByDefaultParams, IsGroupOpenByDefaultParams, ColumnEverythingChangedEvent, NewColumnsLoadedEvent, ColumnPivotModeChangedEvent, ColumnRowGroupChangedEvent, ExpandCollapseAllEvent, ColumnPivotChangedEvent, GridColumnsChangedEvent, ColumnValueChangedEvent, ColumnMovedEvent, ColumnVisibleEvent, ColumnPinnedEvent, ColumnGroupOpenedEvent, ColumnResizedEvent, DisplayedColumnsChangedEvent, VirtualColumnsChangedEvent, AsyncTransactionsFlushed, RowGroupOpenedEvent, RowDataChangedEvent, RowDataUpdatedEvent, PinnedRowDataChangedEvent, RangeSelectionChangedEvent, ChartCreated, ChartRangeSelectionChanged, ChartOptionsChanged, ChartDestroyed, ChartRefParams, ToolPanelVisibleChangedEvent, ModelUpdatedEvent, PasteStartEvent, PasteEndEvent, CellClickedEvent, CellDoubleClickedEvent, CellMouseDownEvent, CellContextMenuEvent, CellValueChangedEvent, RowValueChangedEvent, CellFocusedEvent, RowSelectedEvent, SelectionChangedEvent, CellKeyDownEvent, CellKeyPressEvent, CellMouseOverEvent, CellMouseOutEvent, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, SortChangedEvent, VirtualRowRemovedEvent, RowClickedEvent, RowDoubleClickedEvent, GridReadyEvent, GridSizeChangedEvent, ViewportChangedEvent, FirstDataRenderedEvent, DragStartedEvent, DragStoppedEvent, RowEditingStartedEvent, RowEditingStoppedEvent, CellEditingStartedEvent, CellEditRequestEvent, CellEditingStoppedEvent, BodyScrollEvent, BodyScrollEndEvent, PaginationChangedEvent, ComponentStateChangedEvent, RowDragEvent, ColumnRowGroupChangeRequestEvent, ColumnPivotChangeRequestEvent, ColumnValueChangeRequestEvent, ColumnAggFuncChangeRequestEvent, ProcessRowParams, ProcessCellForExportParams, ProcessHeaderForExportParams, ProcessGroupHeaderForExportParams, RowStyle, RowClassRules, RowClassParams, RowHeightParams, SendToClipboardParams, TreeDataDisplayType, FullWidthCellKeyDownEvent, FullWidthCellKeyPressEvent, LoadingCellRendererSelectorFunc, IsExternalFilterPresentParams, InitialGroupOrderComparatorParams, GetGroupRowAggParams, PostSortRowsParams, IsFullWidthRowParams, GetLocaleTextParams, IsRowFilterable, ColumnState, MenuItemDef, GetContextMenuItemsParams } from "ag-grid-community";
import { EventEmitter } from "@angular/core";
import { AnyPropertyFunc, BooleanPropertyFunc, OptionsAsyncParams, StringPropertyFunc } from "../core.interface";
import { MenuItem } from "primeng/api";

export type rowModelType = 'clientSide' | 'infinite' | 'viewport' | 'serverSide' | undefined;
export type editableIndicator = "hide" | "show" | "hover";
export type apiFilter = {values: (string | number)[], type?: 'set' | 'date'};
export type statusPanel = { statusPanel: STATUS_PANEL, align?: "left" | "center" };
export type keysAndCallback = {[p: string]:{cond: (keyEvent: KeyboardEvent) => boolean, callback: (p?: any) => void}};
export type colsAndCharts = {[p: string]: {id?: number, cols: any, charts?: any, filters?: any, isFullRange?: boolean, isGlobal?: boolean, dateCreated?: string, lastUpdate?: string, user?: string, save_as?: string}};
export type columnTypeIsA = {isUnique?: boolean, isUniqueCaseSensitive?: boolean, hasErrors?: boolean, isRequiredWhen?: boolean, isRequiredWhenEditable?: boolean};
export type dropDownEditorParams = {value: any, searchPlaceHolder?: string, useChildren?: boolean, optionsAsyncParams?: OptionsAsyncParams, dontUseSearch?: boolean, options?: any /* RT eagna TODO: HeaderMenuOptions[] */, onSelect?: (val: any) => {srcChanged: boolean, newVal?: any}};
export type setValues = (p: any) => void | string[];

export type gridDefaultColumns = {
        columns?: {state: (ColumnState[] | string[]),
        groupState?: ({
                groupId: string,
                open: boolean
            })[] | undefined
        },
        hiddenCols?: string[]
    } | undefined;
/* export type aggsType = {[p: string]: (number | string)[]} | undefined; */
export type aggsType = {
    [p: string]: {
        [key: string]: any, count?: number} []
    };

    /* {[key: string]: any, p?: any} */

export interface GridResponse{
    /**
     * rows of fetched (according to limit and/or offset)
     */
    results: any[];

    /**
     * Total fetched / to fetch
     */
    total: number;
    
    /**
     * URL of previous page
     */
    previous?: string;

    /**
     * URL of next page
     */
    next?: string;
    
    /**
     * When fetching aggregations
     */
    aggs?: aggsType[] | undefined;

    /**
     * To identify automatically which field type to use
     */
    //fields?: {[field: string]: string}[];
    //fields?: { ['form']?: string, ['field']?: string, ['required']?: any, [field: string]: string | undefined }[];
    fields?: any[];

    /**
     * Page (auto when paginating)
     * Not used
     */
    page?: {
        next?: string;
        page: number;
        page_size?: number;
        previous?: string;
        total?: number;
    },
    /**
     * Displayed count (auto when paginating)
     * Not used
     */
    page_size?: number;

    /**
     * Permission (authorization rights from backend)
     */
    permission: {
        create?: boolean;
        read?: boolean;
        update?: boolean;
        delete?: boolean;
        role?: any;
        message?: any;
    }
}

/* PermissionConfig{
    create  ?: boolean;
    read    ?: boolean;
    update  ?: boolean;
    delete  ?: boolean;
    role    ?: any;
    message ?: any;
  } */

export enum BOOLEAN_FILTER_MODE {
    /**
    * Defaault if not supplied.
    */
   TRUE_FALSE = "trueFalse",
   /**
    * Converts True/False label to Yes/No.
    */
   YES_NO = "yesNo"
}

export enum GRID_TYPE {
    INFINITE    = "infinite",
    SERVER_SIDE = "serverSide",
    CLIENT_SIDE = "clientSide",
    VIEWPORT    = "viewport"
}

export enum CELL_EDITOR_TYPES {
    LARGE_TEXT              = "agLargeTextCellEditor",
    NUMERIC                 = "numericEditor",
    MASK                    = "maskEditor",
    DATE_PICKER             = "datePicker",
    DROPDOWN_EDITOR         = "dropdownEditor",
    DROPDOWN_EDITOR_NATIVE  = "agRichSelectCellEditor"
}

export enum COLUMN_TYPE {
    /**
     * boolean column is used for the column that tells a column is Yes/No or True/False e.g. has_attachments.
     */
    BOOLEAN_COLUMN = "booleanColumn",
    
    /**
     * date column is useful, for date formation, use of the calendar date picker, generating PIVOT extracted dates, etc.
     */
    DATE_COLUMN = "dateColumn",

    /**
     * default column type
     */
    DEFAULT_SET_COLUMN = "default_setColumn",

    /**
     * editable column without any validations
     */
    EDITABLE_COLUMN = "editableColumn",

    /**
     * auto complete column
     */
    /* AUTOCOMPLETE_COLUMN = "autoCompleteColumn", */

    /**
     * new auto complete column
     */
    NEW_AUTOCOMPLETE_COLUMN = "newAutoCompleteColumn",

    /**
     * column will only be available for superUser
     */
    SUPER_USER_COLUMN = "superUserColumn",

    /**
     * for editable column, to keep the icon even if is not empty
     */
    KEEP_ICON_COLUMN = "keepIconColumn",

    /**
     * for editable, but no edit Icon is gonna be displayed
     */
    NO_ICON_COLUMN = "noIconColumn",

    /**
     * depracated
     */
    NON_EDITABLE_COLUMN = "nonEditableColumn",

    /**
     * for filtering, not null columns will not have blank option
     */
    NOTNULL_COLUMN = "notNullColumn",

    /**
     * for filtering, nullable columns will have blank option
     */
    NULLABLE_COLUMN = "nullableColumn",

    //for PIVOTING
    /**
     * used for primary column, so it will aggregate to sum by default
     */
    PIVOTING_ID = "pivotingId",
    /**
     * use this column type to any dates needed by analysis tool to extract to dd/mm/yy
     */
    PIVOTING_DATE = "pivotingDate",
    /**
     * use this column type to a list containing lists so it will create a PIVOTING_LIST_column that can feed to value aggregation for analysis
     */
    PIVOTING_LIST = "pivotingList",

    /**
     * for filtering, number columns will have the proper sorted options, and various range like greater than or equal,etc.
     */
    NUMBER_COLUMN = "numberColumn",
    
    /**
     * another type for number to make the digit info defaulted to e.g. "0.50"
     */
    DECIMAL_COLUMN = "decimalColumn",

    /**
     * another type for number to make the digit info defaulted to e.g. "0.50"
     */
     FLOAT_COLUMN = "floatColumn",

    /**
     * Editable columns that are required to be filled in. Use grid hasErrors() method to check for validation
     */
    REQUIRED_COLUMN = "requiredColumn",

    /**
     * Editable columns that are required to be filled in with certain condition to be supplied in extraParams.validateRequiredWhen(p) => {return logic}.
     * For all editable columns with certain validations, either unique, unique case sensitive, required. This can be used as replacement as dynamic as needed.
     * Use grid hasErrors() method to check for validation.
     */
    VALIDATE_WHEN_COLUMN = "validateWhenColumn",

    /**
     * use this to show the raw value of the column data
     */
    SHOW_TOOLTIP_VALUE_COLUMN = "showToolTipValueColumn",

    /**
     * Editable columns that are must have unique values. Use grid hasDuplicates() method to check for validation
     */
    UNIQUE_VALUE_COLUMN = "uniqueValueColumn",

    /**
     * Editable columns that are must have unique CASE SENSITIVE values. Use grid hasDuplicates() method to check for validation
     */
    UNIQUE_CASE_SENSITIVE_COLUMN = "uniqueCaseSensitiveColumn"
}

export type agThemeType = 'balham' | 'alpine' | 'blue' | 'fresh' | 'bootstrap';

export enum STATUS_PANEL {
    TOTAL_AND_FILTERED_ROW_COUNT    = "agTotalAndFilteredRowCountComponent",
    TOTAL_ROW_COUNT                 = "agTotalRowCountComponent",
    FILTERED_ROW_COUNT              = "agFilteredRowCountComponent",
    SELECTED_ROW_COUNT              = "agSelectedRowCountComponent",
    AGGREGATION                     = "agAggregationComponent",
    COUNTER_OPERATIONS_TOOLBAR      = "countOperationsToolbar"
}

export enum FILTER_TYPE {
    DATE    = 'agDateColumnFilter',
    SET     = 'set'
}

enum DATE_SET_OPTIONS {
    IN_RANGE                = 'inRange',
    EQUALS                  = 'equals',
    NOT_EQUAL               = 'notEqual',
    GREATER_THAN_OR_EQUAL   = 'greaterThanOrEqual',
    LESS_THAN_OR_EQUAL      = 'lessThanOrEqual',
}

interface PrefColumns {
    col     : string;
    pinned  ?: string;
}

export abstract class PrefFilters {
    filterType  ?: string; //type and filterType are the same, just use filterType for backend request

    //if filterType date
    dateFrom    ?: string;
    dateTo      ?: string;
    type        ?: string;

    //if filterType set
    values          ?: setValues | undefined;
    valueFormatter  ?: any;

    //for sorting
    sort            ?: string;
    sortingOrder    ?: number;

    abstract setFilterParams(params?: any): void;
    abstract getFilterParams(enableDynamicFiltering?: boolean): any;
    abstract setFilterModel(params?: any): void;
    abstract getFilterModel(): any;
}

export type filterTypeDate = {dateFrom: string, dateTo: string, filterType: string /* text or date or number */, type: string} | null;
export type filterTypeText = {filter: string, filterType: string /* text or date or number */, type: string} | null;
export type multiFilterTypeText = {condition1: (filterTypeText | filterTypeDate), condition2?: (filterTypeText | filterTypeDate), filterType: string, operator?: string} | null
export type filterTypeSet = {filterType: "set", values: string[]} | null

export interface GridPrefMultiFilters{
    [p: string]: {filterType: "multi", filterModels: [multiFilterTypeText, filterTypeSet]}; //or {filterType: "set", values: string[]}
}

export interface GridPrefColumns{
    state: ColumnState[];
    groupState?: ({
        groupId: string;
        open: boolean;
    })[];
}

export interface GridPeferences{
    /** deprecated the app TOKEN provided by the app or manually specified to grid via appProject
     * refer to appId instead */
    app?: string;

    /** deprecated the user who saves the current preferences, readonly from backend */
    user_id?: number | string;

    /** the grid components's gridId */
    gridId: string;

    /** stringified:  
     * {[id: string]: {values: any[], filterType?: string}}
    */
    filters?: string;

    /** stringified: GridPrefColumns 
    */
    columns?: string;

    /** 'profile' for grid Profile's list when changing views
     * 'chart' is when saving and retrieving chart is enabled
     * dont set by default, it's the grid's columns and filters being saved.
     */
    type?: 'profile' | 'chart' | '' | undefined;

    /** when type is 'profile', profileName should be provided */
    profileName?: string;

    /** stringified array of charts object
     * when type is 'chart' */
    charts?: string;
    
    /** default TRUE, to be used later, when profile and charts are gonna be implemented */
    isGlobal?: boolean;

    /** default balham */
    theme: agThemeType;

    //backend alignment
    id?: number;
    appId?: number;
    prefId?: number;
}

export interface FilterAggsMapper {
    suffix      : string;
    extraField  ?: string;
    objectKey   ?: string; // if null, use default 'key'
}

export interface PrefParams {
    appProj     ?: number;
    filters     ?: any; //{filterName: {filterType: values: PrefFilters}}
    columns     ?: PrefColumns[];
    engColumns  ?: PrefColumns[];
    screen      ?: string;
}

export class PrefFilterTypeDate extends PrefFilters {
    public setFilterParams(params?: { dateFrom: string, dateTo: string }): void {
        /* this.dateFrom = params.dateFrom;
        this.dateTo = params.dateTo; */
    }

    public getFilterParams(enableDynamicFiltering = false): any { //in the future, extend this option to the grid component caller to be set to true/ currently false
        return {
            /* type: FILTER_TYPE.DATE, */
            browserDatePicker: true,
            suppressAndOrCondition: true,
            filterOptions: [DATE_SET_OPTIONS.IN_RANGE/* , DATE_SET_OPTIONS.EQUALS, DATE_SET_OPTIONS.GREATER_THAN_OR_EQUAL, DATE_SET_OPTIONS.LESS_THAN_OR_EQUAL, DATE_SET_OPTIONS.NOT_EQUAL */],
            defaultOption: DATE_SET_OPTIONS.IN_RANGE,
        };
    }

    public setFilterModel(params?: { dateFrom: string, dateTo: string, type?: string }): void {
        this.dateFrom = params?.dateFrom;
        this.dateTo = params?.dateTo;
        this.type = params?.type;
    }

    public getFilterModel(): any {
        return {
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            type: this.type
        }
    }
}

export class PrefFilterTypeSet extends PrefFilters {
    public setFilterParams(params?: { values: setValues, valueFormatter?: any}): void {
        this.values = params?.values;
        if(params?.valueFormatter){
            this.valueFormatter = params.valueFormatter;
        }        
    }

    public getFilterParams(enableDynamicFiltering = false): any {
        const fp: any = {
            /* type: "agSetColumnFilter", */
            values: this.values /* .filter(aggr => {return aggr.key != ''}) */
        };
        if(this.valueFormatter){
            fp.valueFormatter = this.valueFormatter;
        }
        return fp;
    }

    public setFilterModel(params?: { values: setValues }): void {
        this.values = params?.values;
    }

    public getFilterModel(): { type?: string, values: (setValues | undefined), selectAllOnMiniFilter?: boolean, valueFormatter?: any, date_from?: string, date_to?: string, date_type?: string } {
        return {
            type: "set",
            values: this.values,
            valueFormatter: this.valueFormatter,
        };
    }
}

export interface CellCustomActions {
    colId: string;
    color?: string | StringPropertyFunc;
    title?: string | StringPropertyFunc;
    icon?: string | StringPropertyFunc;
    text?: string | number | AnyPropertyFunc;
    extraText?: string | number | AnyPropertyFunc;
    iconClass?: any | AnyPropertyFunc;
    iconStyle?: any | AnyPropertyFunc;
    bgClass?: any | AnyPropertyFunc;
    badgeClass?: any | AnyPropertyFunc;
    bgStyle?: any | AnyPropertyFunc;
    isReversedTextAndIcon?: boolean;
    
    useButton?: boolean;
    mode?: 'button' | 'badge' | undefined;
    
    isCheckbox?: boolean;
    checkboxValue?: boolean;
    buttonOptions?: any[]; /* RT eagna TODO HeaderMenu[]; */
    fetchUserDetailsOnHover?: boolean; // To be implemented (using the hover directive)
    isHidden: boolean | BooleanPropertyFunc;
    initParams?(params?: any): boolean;    
    clickCallback?(event: UIEvent, params: any): void;

    //prime
    isMulti?: boolean;
    popup?: boolean;
    menuItems?: AgCellMenuItems[];

    //primeButton
    btnClass?: any | AnyPropertyFunc;
}

export interface AgCellMenuItems extends MenuItem{
    clickCallback?(event: UIEvent, params: any): void;
    items?: AgCellMenuItems[];
}

export type extraContextMenu = {position?: 'before' | 'after', item: (string | MenuItemDef)};

export type fieldMapperType = {[_f: string]: {
    aggKey?: string;
    aggValue?: string | AnyPropertyFunc;
    filterKey?: string | AnyPropertyFunc;
}} | undefined;

export interface IExtraContexMenuItems{
    (params: GetContextMenuItemsParams): extraContextMenu[];
};

export interface ExtendedGridDefinition extends GridOptions{
    extraContextMenuItems?: IExtraContexMenuItems | extraContextMenu[];
    /**
         * To amend existing column definitions:
         * 
         * Receive the colDefs object then return with amendment
         * 
         * eg. 
         * 
         *  * return colDefs.concat([{field: "my_new_field" type: [COLUMN_TYPE.EDITABLE_COLUMN, COLUMN_TYPE.NUMBER_COLUMN]}])
         * 
         * for ServerSide filtering using different aggs key or custom aggs function
         * use: 
         *  * filterKey: 'my_new_filter_key'
         * 
         * or 
         *  * filterFunc: (p?) => {
            *  return ['agg value 1', 'agg value 2']
            * }
         */
    amendColDefs?: (
            colDefs: ColDef[],
            gridResult?: GridResponse,
            p?: FirstDataRenderedEvent
        ) => (ColDef | ColGroupDef)[];
}

export interface AutoCompleteSelectDatum{
    label: string;
    value: any;
    group?: string;
}

export interface AutoCompleteCellEditorParams{
    placeholder: string;

    /** for Syncrhonous */
    //selectData?: ({[p: string]: any} | string)[];
    selectData?: AutoCompleteSelectDatum[];
    autocomplete?: {
      /** default to true, turn it off to allow any value */  
      strict?: boolean;
      /** default to true, turn it off to not auto-select the first item */  
      autoselectfirst?: boolean;
      /** for Asyncrhonous */
      fetch?(cellEditor: any, text: string, update: (p: AutoCompleteSelectDatum[]) => void): void;
    };
  }

  export interface StatusBar {
    statusPanels: statusPanel[];
  }

  export class StatusBarForGridWithoutPagination {
    constructor(panels?: STATUS_PANEL[]) {
        this._statusBar = {
            statusPanels: [
                ...(!panels || panels.includes(STATUS_PANEL.TOTAL_AND_FILTERED_ROW_COUNT) ? [{ statusPanel: STATUS_PANEL.TOTAL_AND_FILTERED_ROW_COUNT }]: []) as statusPanel[],
                ...(!panels || panels.includes(STATUS_PANEL.TOTAL_ROW_COUNT) ? [{ statusPanel: STATUS_PANEL.TOTAL_ROW_COUNT, align: "center" }]: []) as statusPanel[],
                ...(!panels || panels.includes(STATUS_PANEL.FILTERED_ROW_COUNT) ? [{ statusPanel: STATUS_PANEL.FILTERED_ROW_COUNT }]: []) as statusPanel[],
                ...(!panels || panels.includes(STATUS_PANEL.SELECTED_ROW_COUNT) ? [{ statusPanel: STATUS_PANEL.SELECTED_ROW_COUNT, align: "left"}]: []) as statusPanel[],
                ...(!panels || panels.includes(STATUS_PANEL.AGGREGATION) ? [{ statusPanel: STATUS_PANEL.AGGREGATION }]: []) as statusPanel[],
            ]
        }
    }

    private _statusBar: StatusBar;

    public set statusBar(statusBar) {
        this._statusBar = statusBar;
    }

    public get statusBar(): StatusBar {
        return this._statusBar;
    }
}