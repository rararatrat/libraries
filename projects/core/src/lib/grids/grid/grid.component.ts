import { AfterViewChecked, ChangeDetectorRef, Component, DoCheck, EventEmitter, Inject, Input, LOCALE_ID, OnDestroy, OnInit, Optional, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ColGroupDef, Column, FilterChangedEvent, FirstDataRenderedEvent, GridReadyEvent, IDatasource, IGetRowsParams, IServerSideDatasource, IServerSideGetRowsParams, RowNode, SelectionChangedEvent, SideBarDef, GetRowIdFunc, GetRowIdParams, CellClassParams, CellValueChangedEvent, Environment, BeanStub, LoadSuccessParams, GetContextMenuItemsParams, GridOptions, MenuItemDef, GetLocaleTextParams, ValueFormatterParams, SortChangedEvent,  CellEditingStartedEvent, ColumnState } from 'ag-grid-community';
import {  Observable, Subject, Subscription } from 'rxjs';
import { ApiCallParams, apiMethod, MESSAGE_SEVERITY, ResponseObj, UserPreferences, userPrefType } from '../../core.interface';
import { ApiCallService, CoreService } from '../../core.service';
import { HelperService } from '../../helper.service';
import { CustomPluralPipe } from '../../pipes/eagna.pipe';
import { SharedService } from '../../shared.service';
import { BooleanFilter } from '../custom-filter/boolean-filter';
import { DatePickerEditorComponent } from '../editor/datepicker-editor.component';
import { DropdownSelectEditorComponent } from '../editor/dropdown-select-editor.component';
import { MaskEditorComponent } from '../editor/mask.editor.component';
import { NumericEditorComponent } from '../editor/numeric-editor.component';
import { agThemeType, apiFilter, /* AutoCompleteCellEditorParams, */ BOOLEAN_FILTER_MODE, colsAndCharts, COLUMN_TYPE, editableIndicator, ExtendedGridDefinition,  fieldMapperType, filterTypeDate, filterTypeSet, filterTypeText, FILTER_TYPE, GridPeferences, GridPrefColumns, GridPrefMultiFilters, GridResponse, GRID_TYPE, multiFilterTypeText, rowModelType, gridDefaultColumns } from '../grid.interface';
import { CellCustomComponent } from '../cell-custom/cell-custom.component';
import { AnalysisToolPanel } from '../tool-panel/analysis-tool-panel';
import { CustomToolsPanel } from '../tool-panel/custom-tools-panel';
import { Message, MessageService, PrimeIcons } from 'primeng/api';
import { AbstractCoreService } from '../../abstract-core';
import { GridService } from '../grid.service';
import { FormatWidth, getLocaleDateFormat, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Core } from '../../core.static';
import { deepEqual } from 'ts-deep-equal' 

@Component({
    selector: 'eag-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy, AfterViewChecked, DoCheck {
  constructor(
        private _helper: HelperService,
        private _activatedRoute : ActivatedRoute,
        private _pluralPipe: CustomPluralPipe,
        private _lowerCase: LowerCasePipe,
        private _messageService: MessageService,
        private _gridService: GridService,
        private _upperCase: UpperCasePipe,
        public sharedService: SharedService,
        public _coreService: CoreService,
        private _cdr: ChangeDetectorRef,
        @Inject(LOCALE_ID) private _ilocale: string,
        @Optional() private _coreServiceImpl: AbstractCoreService,
        @Optional() private _apiCallService? : ApiCallService,
  ) {}

  private _noReadRendered = false;
  private _agLangProvider: any;
  private _currentPage = 0;
  private _jumpToLastPage = false;
  private _nextPage = false;
  private _sortChanged = false;
  private _initSortModel?: any[];
  private _initFilterModel: any; //TODO
  private _subscription = new Subscription();
  private _isQuerying = false;
  private _userPrefReInit = false;
  private _locale = SharedService.getSavedLocale(this.sharedService.appConfig.env?.main.locale) || SharedService.defaultLocaleConf.locale;
  private _dateDelimeter = getLocaleDateFormat(this._locale, FormatWidth.Short).includes("/") ? "/" : ".";
  private _dateFormat = this._dateDelimeter == "." ? getLocaleDateFormat(this._locale, FormatWidth.Medium) : SharedService.defaultDateFormatEn;
  private _gridEnv: Environment | undefined;
  public darkMode!: boolean;
  public picons = PrimeIcons;

  public tOverlay: {loading?: string, noRows?: string} = {loading: undefined, noRows: undefined};

  @Input()
  defaultColumns: gridDefaultColumns;

  @Input()
  public duplicateApiParams?: (data: any) => any;

  @Input()
  public isDebug = this.sharedService.appConfig.env?.main.isDebug == true;

  @Input()
  public dateFiltersToLocale = false;

  @Input()
  digitsInfo = "0.0-2";
  
  @Input()
  isReadonly = false;

  @Input()
  /** Supply this property with the grid's first result for ClientSide */
  public firstResult?: GridResponse;

  @ViewChild("agGrid") public agGrid!: AgGridAngular;
  @Input() appProject: string | undefined;
  @Input() gridId: string | undefined;
  @Input() agClass = '';
  @Input() agStyle?: string | {[p: string]: any} | undefined;

  @Input() agTheme: agThemeType = SharedService.defaultGridTheme;

  @Input() columnDefs: (ColDef | ColGroupDef)[] | undefined;
  @Input() rowModelType: rowModelType = 'clientSide';
  @Input() rowData: any[] | undefined;

  /** AbstractCore Service that should have been implemented */
  @Input() coreServiceImpl: AbstractCoreService | undefined;
  @Input() tokenRequired = false;
  @Input() holder?: HTMLDivElement | string;

  /**
   * 2-way Binding property to acccess gridParams easily when grid is ready (GridReadyEvent)
   */
  @Input() gridParams: GridReadyEvent | undefined;

  @Output() gridParamsChange: EventEmitter<GridReadyEvent> = new EventEmitter<GridReadyEvent>();

  /**
   * The string to be used as initial value in Search Box when enableSideBar, enableCustomToolPanel and enableGridSearch are on, defaulted to ''
   */
  @Input() searchQuery: { value: string } = { value: "" };

  /**
  * Whether the sidebar is to be displayed in Grid or not, defaulted to true
  */
  @Input() enableSideBar: boolean = true;

  /**
   * Whether the custom panel (Grid Options) is to be displayed in the sidebar, defaulted to true
   */
  @Input() enableCustomToolPanel: boolean = true;


  /**
  * Grid Insights tool panel, turned off for pilot
  */
  @Input() enableAnalysisToolPanel: boolean = false;

  /**
   * If opted to never offer analysis of a grid at all, turn this off
   */
  @Input() analysisOption                 : boolean = true;

  /**
   * Whether saving of columns and filters is turned on or not, defaulted to true
   */
  @Input() enableSaveColumnsAndFilters    : boolean = true;

  /**
  * Whether the search is to be used in Grid Options sidebar or not, defaulted to true
  */
  @Input() enableGridSearch               : boolean = true;

  @Input() gridOptions!: GridOptions;
  @Input() extendedGridDefinition: ExtendedGridDefinition = {};
  @Input() extraParams: any = {};
  @Input() floatingFilter = false;

  /**
   * Optionally tell the Grid what sidebar tab should be activated by default.
   */
  @Input() defaultToolPanel: "customTools" | "filters" | "columns" | "" = "";

  @Input() pivotMode= false;

  /**
   * Change the way how Editable Columns shows the edit (pencil) indicator: defaulted to 'hover'
   * hide: to never show the pencil icon
   * show: to permanently show the pencil icon
   * hover: only show the pencil icon upon hover
   */
  @Input() editableInd: editableIndicator = "hover";


  /* Server-Side conf */

  /**
   * Standard api definition that will be used by the Grid, only for non-ClientSide (e.g. serverSide)
   */
  @Input() apiCallParams: ApiCallParams | undefined;

  /**
  * Optionally tells the Grid not to load the userPreferences for some instances, defaulted to false
  */
  @Input() skipUserPref: boolean = false;

   /**
   * Optionally append the Api request with aggs_filter object same as current filters, defaulted to false
   */
  @Input() aggsFilters: boolean = false;

  /**
   * If serverSideStoreType is full, optionally set limit for backend query, else limit will not be send
   */
  @Input() limit: number | undefined;

  /**
   * Acts as external event emitter when a column is being filtered
   */
  @Input() filteringCustomCallback: ((apiParams: any, col: any, colCurrentFilter: any) => any) | undefined;

  /**
   * Turn this on when using Lazy loaded Route. This will be used when urlState is not provided
   */
  @Input() isFeatureModule: boolean = false;

  /**
   * String to override the formula <gridId_modalId>, this is used in saving filters/coluns in user preference api
   * If not provided, it is computed as the current url route (the last children. it's important to turn on @isFeatureModule when using lazy loaded Module)
   */
  @Input() urlState: string | undefined;

   /**
   * Used for Grids that are declared in Modal, so that the id to be used in user preferences will be <gridID_modalId>
   */
  @Input() modalId: string | undefined;

  /**
   * Optionally tell the Grid to not use (Blank) in the filter aggregiation
   */
  @Input() dontAddBlankFilter: boolean = true;

   /**
   * Optionally override column keys as its filtering keys
   */
  @Input() defaultFilterOptions: any;

  /**
     * To override Grids Api filter aggs data pattern.
     * If not supplied, by default: {suffix: "_aggs",
     *  extraField: "buckets",
     *  objectKey: "key"
     * }
     * where the aggregation structure is e.g. {id: {buckets: [key: <value1_aggs>, key: <value2_aggs>, ...]}
     */
  //@Input() filterAggsMapper: FilterAggsMapper | undefined;


  @Input() fieldMapper?: fieldMapperType = {};

   /**
     * If enabled, filters and columns change event will save changes in Memory
     */
  @Input() enableFiltersAndColumnsMemory: boolean = false;

  @Input()
  enableProfile = false;

  /** Override this rowIdKey(s) to specify which data attribute is/are the unique key (or keys combination), default value: ['id'] */
  @Input()
  rowIdKey: string | string[] | undefined;

  /* RT eagna
  BEGIN ex-inputs
  properties that used to be input, now converted to extendedGridDefinition properties  */

  public defaultColDef: ColDef | undefined;

  public components: {
    [p: string]: any;
  } | undefined;

  public columnTypes: {
    [key: string]: ColDef;
  } | undefined;

  public pagination: boolean = true;
  public paginationAutoPageSize: boolean = true;
  public paginationPageSize = 50;
  public cacheOverflowSize = 2;
  public maxConcurrentDatasourceRequests = 2;
  public infiniteInitialRowCount = 1;
  public maxBlocksInCache = 200;
  public cacheBlockSize = 100;
  public serverSideInfiniteScroll = true;
  public getRowId: GetRowIdFunc | undefined;
  //END ex-inputs

  public localeText?: {
    [key: string]: string;
  };

  public getLocaleText: (params: GetLocaleTextParams) => string = (
    params: GetLocaleTextParams ) => {
    switch (params.key) {
        case "dateFormatOoo": return this._lowerCase.transform(this._dateFormat);
        default:
            if(params.defaultValue && this._locale != "en"){
                return this._agLangProvider ? (this._agLangProvider[params.key] || params.defaultValue) : params.defaultValue;
            }
            return params.defaultValue;
    }
  }

  public icons: any;
  public sideBarParams: any //TODO put this as property, or fire eventemitter for searchQuery
  public excelMode = false;
  public isPivotModeOn = false;

  /** Specifies the side bar components.     */
  public sideBar: SideBarDef | string | string[] | boolean | null | undefined;

  /**
   * Grid internal property used in styling
   */
  public gridHasFiltersApplied = false;

  /**
     * Grid rendering indicator that can optionally be changed externally (not most of time)
     * as this property is originally designed as internal for Grid itself
     */
   /* public hasRendered                      : { firstData: boolean, onwardChanges: boolean, firstFilter: boolean, firstSort: boolean, pivotColumns: boolean }
   = { firstData: false, onwardChanges: false, firstFilter: false, firstSort: false, pivotColumns: false }; */

  protected hasRendered: { gridReady: boolean, firstFilter: boolean, firstSort: boolean, forcedDestroyed: boolean}
   = { gridReady: false, firstFilter: false, firstSort: false, forcedDestroyed: false};

  public on = false;

  private _appConfigName = this.sharedService.appConfig?.appName || 'no-app';
  public userPref?: {grid: GridPeferences | undefined, darkMode: boolean};

  private _restoringChart: string | undefined;
  private _origRowModelType: rowModelType;
  private _orig_num_results: number | undefined;
  private _colsAndChartState: colsAndCharts | undefined;
  private _orig_pagination: boolean | undefined;
  private _pivotingList: any[] = [];
  private _chartRef: any[] = [];
  private _reset_cache = false;
  private _cacheLastUpdate$: Subject<any> = new Subject<any>();
  private _colsAndChartState$ = new Subject<any>();
  private _loadedProfile = null;
  private _isFilterAndSortingApplied = false;
  private _currentSelections: any[] | undefined;
  private _selectionBeforeRefreshSubject: Subject<boolean> = new Subject();
  private _selectionBeforeRefresh$: Observable<boolean> = this._selectionBeforeRefreshSubject.asObservable();
  private _isRefreshed = false;
  private _dataSource!: IDatasource;
  private _serverSideDataSource!: IServerSideDatasource;
  private _pSuccessData?: LoadSuccessParams;

  /* BEGIN variables to be observed in DoCheck lifecycle*/
  private _apiCallParamsParams: any = undefined;
  private _searchValueValue: any = '';

  private _isServerSideInstance(obj: any) : obj is IServerSideGetRowsParams{
    return obj && obj.hasOwnProperty("request");
  }

  private _isInfiniteInstance(obj: any) : obj is IGetRowsParams{
      return obj && !obj.hasOwnProperty("request");
  }

  private _isIDataSourceInstance(obj: { hasOwnProperty: (arg0: string) => boolean; }) : obj is IDatasource{
    return obj && obj.hasOwnProperty("rowCount");
  }

  private _isIServerSideDatasourceInstance(obj: { hasOwnProperty: (arg0: string) => any; }) : obj is IServerSideDatasource{
      return obj && !obj.hasOwnProperty("rowCount");
  }

  ngOnInit(): void {
    /* console.log({initLocale: this._locale}); */

    if(!this.appProject){
      this.appProject = this._appConfigName;
    }

    if(!this.coreServiceImpl && this._coreServiceImpl){
        this.coreServiceImpl = this._coreServiceImpl;
    }
    this._initGrid();
  }

  private _initUserGridPref(){
    const _setUserPref = (userPref: UserPreferences) => {
        const _urlState = this._getUrlState();
        const _user = this.sharedService?.appConfig.user;

        if(userPref){
            this.darkMode = this._coreService.isDarkMode;
            let grid: GridPeferences | undefined = userPref.grid?.[_urlState];
            if(!grid){
                const theme = userPref.changeType?.value || 'balham';
                grid = ({gridId: _urlState, theme});
            }
            this.userPref = {grid, darkMode: this.darkMode};
            this._dateDelimeter = getLocaleDateFormat(this._locale, FormatWidth.Short).includes("/") ? "/" : ".";
            this._dateFormat = this._dateDelimeter == "." ? getLocaleDateFormat(this._locale, FormatWidth.Medium) : SharedService.defaultDateFormatEn;

            if(this._locale != "en"){
                this._agLangProvider = this.sharedService.gridLocal;
            }

            if(_user?.globalGridPref && userPref.grid?.['all']){
                this.agTheme = userPref.grid?.['all'].theme;
            } else if(this.userPref.grid){
                this.agTheme = this.userPref.grid.theme;
            }

            if(this.isDebug){
                console.table([
                        {'rowHeight': this._gridEnv?.getSassVariable(this.agTheme, 'rowHeight')},
                        {'chartMenuPanelWidth': this._gridEnv?.getSassVariable(this.agTheme, 'chartMenuPanelWidth')},
                        {'headerCellMinWidth': this._gridEnv?.getSassVariable(this.agTheme, 'headerCellMinWidth')},
                        {'headerHeight': this._gridEnv?.getSassVariable(this.agTheme, 'headerHeight')},
                        {'listItemHeight': this._gridEnv?.getSassVariable(this.agTheme, 'listItemHeight')},
                        {'isAlive': this._gridEnv?.isAlive()},
                        {'gridOption': this._gridEnv?.isAlive()},
                        {'locale': this._locale}
                    ]
                );
            }

            this._initAgGridChartTheme(`ag-vivid${this.darkMode ? '-dark' : ''}`);
            this._initExtendedGridDefinition();
            this._initSideBar("_setUserPref");

            if(this.hasRendered.gridReady && (<userPrefType[]>['gridTheme', 'locale']).includes(userPref.changeType?.type)){
                this.destroyAndLive({timeout: 5});
                this._userPrefReInit = true;
            } else{
                this.on = true;
            }

        }
    };

    if(this._helper.isNotEmpty(this.sharedService.userPref)){
        _setUserPref((this.sharedService.userPref || {})[this._appConfigName]);
    } else{
        this.on = true;
        this._cdr.detectChanges();
    }
    if(this.sharedService.userPref$){
        this._subscription.add(this.sharedService.userPref$?.subscribe((userPref: UserPreferences) => {
            _setUserPref(userPref);
        }));
    }
  }

  private _initGrid(){
    /* set extraParams */
    this.extraParams = { ...this.extraParams,
      rowModelType: this.rowModelType,
      /* floatingFilter: this.floatingFilter, */
      editableInd: (this.editableInd || "hover")
    };

    /* set columnDefs */
    this._initColumnDefs();

    /* set pagination */
    this._initPagination();

    /*set columTypes */
    this._initColumnTypes();

    /* set components */
    this._initComponents();

    //set getRowId for non-clientSide ??only
    if(this.rowModelType != 'clientSide'){
        this._initGetRowId();
    }

    /* init UserGridPref */
    this._initUserGridPref();
  }

  private _reapplyTheme(newAgTheme: agThemeType){
    this.destroyAndLive({timeout: 10, inBetweenCallback: (_a)=>{
        if(newAgTheme){
            this.agTheme = newAgTheme;
        }
        if(this._gridEnv){
            this.extendedGridDefinition.rowHeight = this._gridEnv.getSassVariable(newAgTheme, 'rowHeight');
            this.extendedGridDefinition.headerHeight = this._gridEnv.getSassVariable(newAgTheme, 'headerHeight');
        }
    }});
  }

  private _initExtendedGridDefinition(){
    this._initContextMenu();

    if(this.extendedGridDefinition){
        if(this.extendedGridDefinition.enableCharts === undefined){
            this.extendedGridDefinition.enableCharts = true; 
        }
        if(this.extendedGridDefinition.enableRangeSelection === undefined){
            this.extendedGridDefinition.enableRangeSelection = true;
        }
        if(this.extendedGridDefinition.columnHoverHighlight === undefined){
            this.extendedGridDefinition.columnHoverHighlight = true;
        }
        if(this.extendedGridDefinition.rowSelection === undefined){
            this.extendedGridDefinition.rowSelection = 'multiple';
        }
        if(this.extendedGridDefinition.allowDragFromColumnsToolPanel === undefined){
            this.extendedGridDefinition.allowDragFromColumnsToolPanel = true;
        }
        if(this.extendedGridDefinition.allowDragFromColumnsToolPanel === undefined){
            this.extendedGridDefinition.allowDragFromColumnsToolPanel = true;
        }
    
        if(this.userPref && this._gridEnv){
            this.extendedGridDefinition.rowHeight = this._gridEnv.getSassVariable(this.agTheme, 'rowHeight');
            this.extendedGridDefinition.headerHeight = this._gridEnv.getSassVariable(this.agTheme, 'headerHeight');
        }

        const _exg = Object.assign({}, this.extendedGridDefinition);
        if(!this.gridOptions){
            delete _exg.extraContextMenuItems;
            delete _exg.amendColDefs;
            this.gridOptions = _exg;
        }
    }

  }

  private _initContextMenu(){
    if(!this.extendedGridDefinition?.getContextMenuItems){
        this.extendedGridDefinition.getContextMenuItems = (params: GetContextMenuItemsParams) => {
            let hasGroupNode = false;
            params.api.forEachNode(node => {
                if(!hasGroupNode && node.group){
                    hasGroupNode = true;
                }
            });

            if(this.extendedGridDefinition?.rowSelection != undefined && params.node){
                params.node.setSelected(true, true);
            }

            const _performDuplicate = (_data: any) => {
                this._subscription.add(this.apiCallParams?.api(_data, 'put').subscribe(res => {
                    this._messageService.add({detail: Core.Localize('successfullyCopied') , severity: MESSAGE_SEVERITY.SUCCESS});
                    this.refresh();
                }));
            }
            
            let _dataCopy = Object.assign({}, params.node?.data);
            const _isRowNotEmpty = this._helper.isNotEmpty(_dataCopy);
            const initDefault: (string | MenuItemDef)[]  = [...(this.isReadonly ? [] :[
                {
                    icon: `<i class="${PrimeIcons.COPY}"></i>`,
                    name: (Core.Localize('duplicate', {item: ''})), 
                    disabled: !_isRowNotEmpty,
                    action: ()=>{ 
                        if(_isRowNotEmpty){
                            delete _dataCopy.id;
                            delete _dataCopy.isChanged;
                            for (const key in _dataCopy) {
                                if (Object.prototype.hasOwnProperty.call(_dataCopy, key)) {
                                    if(_dataCopy[key + "_orig"]){
                                        /* console.log(_dataCopy[key + "_orig"]); */
                                        delete _dataCopy[key + "_orig"];
                                    }
                                }
                            }
                            if(this.duplicateApiParams){
                                _dataCopy = this.duplicateApiParams(_dataCopy);
                                /* console.log({_dataCopy}); */
                                _performDuplicate(_dataCopy);
                            } else{
                                _performDuplicate(_dataCopy)
                            }
                        } else{
                            console.warn('Cannot copy');
                        }
                }}
                ]),
                ...[
                    'autoSizeAll',
                    {
                        name: (Core.Localize('sizeToFitColumns') || 'Size to Fit Columns'), 
                        action: ()=>{
                            params.api.sizeColumnsToFit();
                    }},
                ],
                ...(params.defaultItems || []),
                ...(this.rowModelType == GRID_TYPE.CLIENT_SIDE && this.extendedGridDefinition?.enableRangeSelection ? ['chartRange'].concat(hasGroupNode ? ['expandAll', 'contractAll'] : []) : [])
            ];

            let _prepend: (string | MenuItemDef)[] =  [];
            let _append: (string | MenuItemDef)[] = [];

            for (const cm of (typeof this.extendedGridDefinition?.extraContextMenuItems == "function" ? this.extendedGridDefinition?.extraContextMenuItems(params) : this.extendedGridDefinition?.extraContextMenuItems) || []) {
                if(typeof cm.item != "string" || !initDefault.includes(cm.item)){
                    if(cm.position == "after"){
                        _append.push(cm.item);
                    } else{
                        _prepend.push(cm.item);
                    }
                }
            }

            return [..._prepend.concat(_prepend.length > 0 ? ['separator'] : []), ...initDefault, ..._append];
        }
    }
  }

  private _initGetRowId(){
    if(this.extendedGridDefinition?.getRowId){
        this.getRowId = this.extendedGridDefinition?.getRowId;
    } else{
        let _messageJustOnce = false;
        this.getRowId = (params: GetRowIdParams<any>) => {
            if(this._helper.isNotEmpty(this.firstResult?.results?.[0]?.id)){
                let _rowIdValue = '';
                let _tmpRowIdKey = this.rowIdKey;
                let _rowIdKeyNotFound: string[] = [];
                //let tmpRowIdKey = (this.rowIdKey || ['id']) as string[];

                if(!_tmpRowIdKey){
                    _tmpRowIdKey = ['id'];
                }else if(!Array.isArray(_tmpRowIdKey)){
                    _tmpRowIdKey = [_tmpRowIdKey];
                }

                _tmpRowIdKey.forEach(eachRowIdKey => {
                    _rowIdValue += (params.data?.[eachRowIdKey] || '');
                    if(!this._helper.isNotEmpty(params.data?.[eachRowIdKey])){
                        _rowIdKeyNotFound.push(eachRowIdKey);
                    }
                });

                if(!_messageJustOnce && _rowIdKeyNotFound.length > 0){
                    console.warn(`No row data found using ${(!this.rowIdKey ? "default 'id' key" : _rowIdKeyNotFound.toString() + " key" + this._pluralPipe.transform(_rowIdKeyNotFound.length))}. Either provide different rowIdKey: string | string[] input or compute it via 'ExtendedGridDefinition.getRowId' property`)
                    _messageJustOnce = true;
                }
                return _rowIdValue || '';
            }
            return '';
        };
    }
  }

  private _initColumnDefs(){
    if(this.coreServiceImpl){
        if(!this.columnDefs){
            if(this.gridId){
                try{
                    this.columnDefs = this.coreServiceImpl.getColumnDefs(this.gridId, this.extraParams);
                } catch(e: any){
                    if(e?.name == 'TypeError'){
                        console.warn("getColumnDefs() not implemented");
                    } else{
                        console.warn("getColumnDefs()", e);
                    }
                }
            } else{
                console.warn("Cannot compute columnDefs via AbstractCoreService. " + (!this.gridId ? "gridId is mandatory" : ""));
            }
        }
    } else {
        if(!this.columnDefs){
            console.warn("No column definition provided.");
        } else{
            console.warn("No AbstractCoreService implementation provided.");
      }
    }

    if(this.columnDefs){ //mandatory fields mapping after columnDefs retrieved
        this.columnDefs.forEach((_eachCol: ColDef) => {
            if(!_eachCol.headerName){
                const _colId = _eachCol.colId || _eachCol.field;
                const _locColId = Core.Localize(_colId || 'no-column-id');
                if(_colId && _locColId && _locColId != `{translations.${_colId}}`){
                    _eachCol.headerName = _locColId;
                }
            }
            if(!_eachCol.headerTooltip && _eachCol.headerName){
                _eachCol.headerTooltip = _eachCol.headerName;
            }
        });
    }
  }

  private _initColumnTypes(){
    this.defaultColDef = {...this._gridService?.getDefaultColDef(this.extraParams, this.extendedGridDefinition?.defaultColDef, this.fieldMapper)};
    const _errCellRenderer = (p: any, whichErr: 'required' | 'unique' = 'required') => {
        const _val = p.valueFormatted || p.value || '';
        const _colId = p.column?.getColId() || ''
        if(p.tooltip && _colId && ( (whichErr == 'required' && p.data?._errors && p.data?._errors.includes(_colId)) || (whichErr == 'unique' && p.data?._duplicates && p.data?._duplicates.includes(_colId)) )){
            return `<i class="${whichErr == 'required' ? 'grid-error-icon' : 'grid-warning-icon'} ${p.tooltip.icon}" style='margin-left: -9px;' title="${p.tooltip.error || ''}"></i> ${_val}`;
        }

        return _val;
    };

    const getUniqueColumn = (isCaseSensitive = false) : ColDef => {
        return {...this.defaultColDef,
            cellClassRules: {
                'grid-cell-warning border-2': (p: CellClassParams) => this._gridService?.validateDuplicate(p, isCaseSensitive) == true
            },
            cellRendererParams: {tooltip: {error: `The field values must be Unique${isCaseSensitive ? ' (Case Sensitive)' : ''}.`, icon: PrimeIcons.INFO_CIRCLE } },
            cellRenderer: (p: any) => _errCellRenderer(p, 'unique')
        };
    }

    const getRequiredOrValidateWhenColumn = (isValidateWhen = false) : ColDef => {
        return {...this.defaultColDef,
            cellClassRules: {
                'grid-cell-error border-2': (p: CellClassParams) => this._gridService?.isRequiredOrValidateWhen(p, isValidateWhen) == true
            },
            ...(isValidateWhen ? {cellEditorParams: {validateWhen: (p?: any) =>  false}} : {}),
            cellRendererParams: {tooltip: {error: 'The field is required.', icon: PrimeIcons.EXCLAMATION_CIRCLE } },
            cellRenderer: (p: any) => _errCellRenderer(p, 'required')
        };
    }

    const dateColumn = {...this._gridService?.getDefaultColDef(this.extraParams, this.extendedGridDefinition?.defaultColDef, this.fieldMapper, 'agDateColumnFilter')};
    const numberColumn = {...this._gridService?.getDefaultColDef(this.extraParams, this.extendedGridDefinition?.defaultColDef, this.fieldMapper, 'agNumberColumnFilter')}; //TODO: remove rowModelType dependency from extraParams
    const booleanColumn = {filter: "booleanFilter", /* cellEditor: "booleanFilter", */ filterParams: {mode: BOOLEAN_FILTER_MODE.TRUE_FALSE }, valueFormatter: (p: ValueFormatterParams) => {
        const colId = p.column.getColId();
        if(p.colDef?.filterParams?.mode == BOOLEAN_FILTER_MODE.YES_NO){
            if(p.value === true){
                return "Yes" ;
            } else {
                return "No"
            }
        }
        return p.value;
    }};

    const editableColumn: ColDef = {...this.defaultColDef, editable: !this.isReadonly,
        cellClassRules: {'grid-cell-changed': (p: CellClassParams) => {
            const _colId = p.colDef.colId || p.colDef.field || '';
            if(_colId && p.data){
                return (p.data.isChanged || []).includes(_colId);
            }
            return false;
    }}};

    //columnTypes is automatically being rendered in CLIENT SIDE, hence putting a type to a column will help setting it up for Server Side
    this.columnTypes = { ...this.extendedGridDefinition?.columnTypes,
      ...{
        booleanColumn,
        default_setColumn: this.defaultColDef,
        dateColumn,
        editableColumn,
        superUserColumn: this.defaultColDef,
        keepIconColumn: this.defaultColDef,
        noIconColumn: this.defaultColDef,
        nonEditableColumn: {...this.defaultColDef, editable: false },
        notNullColumn: this.defaultColDef,
        nullableColumn: this.defaultColDef,
        numberColumn,
        decimalColumn: {...numberColumn, cellRendererParams: {digitsInfo: this.digitsInfo}},
        floatColumn: {...numberColumn, cellRendererParams: {digitsInfo: this.digitsInfo}},
        requiredColumn: getRequiredOrValidateWhenColumn(),
        validateWhenColumn: getRequiredOrValidateWhenColumn(true),
        showToolTipValueColumn: this.defaultColDef,
        uniqueValueColumn: getUniqueColumn(),
        uniqueCaseSensitiveColumn: getUniqueColumn(true),
        pivotingId: this.defaultColDef,
        pivotingDate: dateColumn,
        pivotingList: this.defaultColDef,
        newAutoCompleteColumn: {
            valueFormatter: (_k) => (_k.value?.name || _k.value)
        }
      }
    };
  }

  private _initPagination(){
    this.pagination = (this.extendedGridDefinition?.pagination === undefined || this.extendedGridDefinition?.pagination === true);
    this.paginationAutoPageSize = (this.extendedGridDefinition?.paginationAutoPageSize === undefined || this.extendedGridDefinition?.paginationAutoPageSize === true)

    if(this.extendedGridDefinition?.serverSideInfiniteScroll){
        this.serverSideInfiniteScroll = this.extendedGridDefinition?.serverSideInfiniteScroll;
    }
    if(this.extendedGridDefinition?.paginationPageSize){
        this.paginationPageSize = this.extendedGridDefinition?.paginationPageSize;
    }
    if(this.extendedGridDefinition?.cacheOverflowSize){
        this.cacheOverflowSize = this.extendedGridDefinition?.cacheOverflowSize;
    }
    if(this.extendedGridDefinition?.maxConcurrentDatasourceRequests){
        this.maxConcurrentDatasourceRequests = this.extendedGridDefinition?.maxConcurrentDatasourceRequests;
    }
    if(this.extendedGridDefinition?.infiniteInitialRowCount){
        this.infiniteInitialRowCount = this.extendedGridDefinition?.infiniteInitialRowCount;
    }
    if(this.extendedGridDefinition?.maxBlocksInCache){
        this.maxBlocksInCache = this.extendedGridDefinition?.maxBlocksInCache;
    }
    if(this.extendedGridDefinition?.cacheBlockSize){
        this.cacheBlockSize = this.extendedGridDefinition?.cacheBlockSize;
    }
  }

  private _initComponents(){
    this.components = {
      ...this.extendedGridDefinition?.components, ...{
        agSaveColumn: CustomToolsPanel,
        customToolsPanel: CustomToolsPanel,
        analysisPanel: AnalysisToolPanel,
        numericEditor: NumericEditorComponent,
        maskEditor: MaskEditorComponent,
        dropdownEditor: DropdownSelectEditorComponent,
        datePicker: DatePickerEditorComponent,
        booleanFilter: BooleanFilter,
        cellCustom: CellCustomComponent,
        agDateInput: DatePickerEditorComponent
      }
    };
  }

  public toggleOn(){
    /* console.log({here3: this.on}) */
    this.on = !this.on;
    /* this._cdr.detectChanges(); */
  }

  public destroyAndLive(_p: {timeout?: number, inBetweenCallback?: (_a?: any)=>void} = {timeout: 1000}){
    this.on = false;
    this.firstResult = undefined;
    this.hasRendered.forcedDestroyed = true;
    this.gridParams?.api?.destroy();
    
    setTimeout(() => {
      this.tOverlay.noRows = undefined;
      _p?.inBetweenCallback?.();
      this.on = true;
      this._cdr.detectChanges();
    }, _p?.timeout);
  } 

  private _requery(){
    if(this.apiCallParams){
        const _oldApiCallParamsParams = {...this.apiCallParams.params} || {};
        if (this.searchQuery.value) {
            _oldApiCallParamsParams.query = this.searchQuery.value;
        } else {
            delete _oldApiCallParamsParams.query;
        }
        this.apiCallParams.params = {..._oldApiCallParamsParams};
    }
    this.refresh();
  }

  private _updatePreferences(newFiltersColumnsTheme: any, whichPref: 'filters' | 'columns' | 'gridTheme', inMemory = false){
    if(this.sharedService.userPref && this._helper.isNotEmpty(newFiltersColumnsTheme)){
        const _urlState = this._getUrlState();
        const _userPref = (this.sharedService.userPref[this._appConfigName] || {});

        let gridPref = _userPref.grid?.[_urlState];
        let method: apiMethod = 'patch';
        let changeType: userPrefType = 'gridPref';
        if(!gridPref){
            gridPref = {gridId: _urlState, filters: '', columns: '', theme: this.agTheme};
            if(!_userPref.grid){
                _userPref.grid = {};
            }
            _userPref.grid[_urlState] = gridPref;
        }
        try{
            setTimeout(() => {
                if(gridPref){
                    if(whichPref == 'filters'){
                        gridPref.filters = JSON.stringify(newFiltersColumnsTheme);
                    } else if(whichPref == 'columns'){
                        gridPref.columns = JSON.stringify(newFiltersColumnsTheme);
                    } else if(whichPref == 'gridTheme'){
                        gridPref.theme = newFiltersColumnsTheme;
                        changeType = 'gridTheme';
                    }

                    if(!inMemory){
                        this.coreServiceImpl?.userPreferences(_userPref, changeType, method, {gridId: gridPref.gridId} ).subscribe({next: result => {
                            if(this.isDebug){console.log("result", result);}
                            if([200, 201].includes(result?.status?.status_code)){
                                gridPref = result?.content?.results[0];
                                if(gridPref?.gridId && this.sharedService.userPref && this.sharedService.userPref[this._appConfigName]){
                                    this.sharedService.userPref[this._appConfigName].grid = {
                                        ...this.sharedService.userPref[this._appConfigName].grid, [gridPref.gridId]: gridPref};
                                        if(this.isDebug){console.log({gridPref, newGridPref: this.sharedService.userPref[this._appConfigName].grid});}
                                }
                                this._messageService.add({detail: Core.Localize('successfullySaved', {change: (Core.Localize(whichPref) || whichPref) }) , severity: MESSAGE_SEVERITY.SUCCESS});
                                if(changeType == 'gridTheme'){
                                    location.reload();
                                }
                            } else{
                                this._messageService.add(<Message>{summary: result.status.message, detail: JSON.stringify((<any>result.content)?.results), severity: MESSAGE_SEVERITY.ERROR});
                            }
                        }});
                    } else{
                        //TODO: use inMemory input
                        console.warn("inMemory not yet implemented");
                    }
                }
            });
        } catch(e){}
    }
  }

  private _saveColumns(inMemory = false, profileColumns?: any){
    const newColumns = profileColumns?.state || this.gridOptions?.columnApi?.getColumnState();
    const newGroupColumns = profileColumns?.groupState || this.gridOptions?.columnApi?.getColumnGroupState();
    this._updatePreferences({state: newColumns, groupState: newGroupColumns}, "columns", inMemory);
  }

  private _saveFilters(inMemory = false, profileFilters?: any){
    const newFilters = profileFilters || this.gridOptions?.api?.getFilterModel();
    this._updatePreferences(newFilters, "filters", inMemory);
  }

  private _initSideBar(fromWhere: string){
    if(this.isDebug){console.log("_initSideBar fromWhere", fromWhere);}
      const _toolTip = `Grid Data Rendering: ${this.rowModelType == 'clientSide' ? 'Client Side': 'Non-Client Side'}
Grid ID: ${this.gridId}`;

      this.icons = {...this.extendedGridDefinition?.icons, ...{
          "custom-tools": "<span class='ag-icon ag-icon-pivot fs-16' title='"+ _toolTip +"'></span>",
          "custom-grid": "<span class='pi pi-table fs-16' title='"+ _toolTip +"'></span>",
          "custom-save": "<span class='p-button-icon pi pi-save fs-16'></span>",
      }};

      const toolPanelEvents: any = {
          saveTheme: (newAgTheme: agThemeType) => { this._saveTheme(newAgTheme); },
          saveColumns: () => { this._saveColumns(); },
          saveFilters: () => { this._saveFilters(); },
          clearColumns: () => { this._clearColumns(); },
          clearFilters: () => { this._clearFilters(); },
          requery: (params?: any) => {
              this._isQuerying = true;
              this.searchQuery = params.searchQuery;
              if (this.rowModelType != "clientSide") {
                  this._requery();
              } else {
                  this.gridParams?.api?.setQuickFilter(this.searchQuery.value);
              }
          }
      };

      this.sideBarParams = { //TODO put this as property, or fire eventemitter for searchQuery
          searchQuery: this.searchQuery,
          enableCustomToolPanel: this.enableCustomToolPanel,
          enableAnalysisToolPanel: this.enableAnalysisToolPanel,
          analysisOption: this.analysisOption,
          enableSaveColumnsAndFilters: this.enableSaveColumnsAndFilters,
          enableGridSearch: this.enableGridSearch,
          gridId: this.gridId,
          agTheme: this.agTheme,
          isPivotModeOn: this.isPivotModeOn,
          isSaveFilterDisabled: (this.isPivotModeOn && this._origRowModelType != "clientSide"),
          cacheLastUpdate$: this._cacheLastUpdate$,
          colsAndChartState$: this._colsAndChartState$,
          loadedProfile: this._loadedProfile,
          toolPanelEvents
      };

      if(!this.sideBarParams.columnDefsControls){
          this.sideBarParams.columnDefsControls = {};
      }

      this.sideBarParams.columnDefsControls.excelMode = {value: this.excelMode, type: 'filterParams'}; //type can be null/unset

      //RT eagna TODO:
      let toolDef = null;
      if(!this.extendedGridDefinition?.sideBar){
        this.sideBar = this._gridService?.getSideBar(this.sideBarParams, this.defaultToolPanel, toolDef, this.rowModelType == 'clientSide' ? "custom-tools" : "custom-grid", this.isPivotModeOn);
      } else{
        this.sideBar = this.extendedGridDefinition?.sideBar
      }
  }

  private _getUrlState(): string{
    /** preferences now in the database will have urlState_gridId, e.g: 'versions_bucketVersions'
     * to avoid sharing and overriding two grids in 1 place
    */
    const toReturn = (this.urlState ? (this.urlState + '_') : '') + (this.modalId ? this.modalId + '_' : "") + this.gridId;
    return toReturn;
  }

  private _extractUserPref(columnsOrFilters: "columns" | "filters"): GridPrefColumns | GridPrefMultiFilters{
    switch(columnsOrFilters){
        case "columns":
        try{
            return <GridPrefColumns>(JSON.parse(this.userPref?.grid?.columns || "{'state': [], 'groupState': []}") || {state: []});
        } catch(e){
            return {state: []};
        }
        case "filters":
        try{
            return <GridPrefMultiFilters>(JSON.parse(this.userPref?.grid?.filters || "{}") || {});
        } catch(e){
            return {};
        }
    }
  }

  public applyFilters(){
    const savedFilters = <GridPrefMultiFilters>this._extractUserPref("filters");
    this.gridParams?.api.setFilterModel(savedFilters);
  }

  public _saveTheme(newAgTheme: agThemeType){
    this._updatePreferences(newAgTheme, "gridTheme");
  }

  private _isConditionDateType(cond: filterTypeText | filterTypeDate): cond is filterTypeDate{
    return cond?.filterType == "date";
  }

  private _isLocaleDate(date: string): boolean{
    return this._dateDelimeter == "." && typeof date == "string" && date.includes(this._dateDelimeter) //e.g. 09.10.2010 is already locale formatted, then skip
  }

  private _dateFiltersToLocale(filterModels: [multiFilterTypeText, filterTypeSet], key: string){
    const _fm = JSON.parse(JSON.stringify(filterModels));
    const e1 = _fm[0];
    if(e1){
        if(e1.condition1 && this._isConditionDateType(e1.condition1)){
            if(e1.condition1.dateFrom && !this._isLocaleDate(e1.condition1.dateFrom)){
                e1.condition1.dateFrom = this._helper.pipeDate(e1.condition1.dateFrom, this._dateFormat, this._locale);
            }
            if(e1.condition1.dateTo && !this._isLocaleDate(e1.condition1.dateTo)){
                e1.condition1.dateTo = this._helper.pipeDate(e1.condition1.dateTo, this._dateFormat, this._locale);
            }
        }
        if(e1.condition2 && this._isConditionDateType(e1.condition2)){
            if(e1.condition2.dateFrom && !this._isLocaleDate(e1.condition2.dateFrom)){
                e1.condition2.dateFrom = this._helper.pipeDate(e1.condition2.dateFrom, this._dateFormat, this._locale);
            }
            if(e1.condition2.dateTo  && !this._isLocaleDate(e1.condition2.dateTo)){
                e1.condition2.dateTo = this._helper.pipeDate(e1.condition2.dateTo, this._dateFormat, this._locale);
            }
        }
    }
    const e2 = _fm[1];
    const thisCol = this.gridParams?.columnApi.getColumn(key);
    if(e2 && thisCol?.getColDef().type?.includes(COLUMN_TYPE.DATE_COLUMN)){
        e2.values.forEach((e2Val: any, i: number) => {
            if(!this._isLocaleDate(e2Val)){
                e2.values[i] = this._helper.pipeDate(e2Val, this._dateFormat, this._locale, undefined, true);
            }
        });
    }
    return _fm;
  }

  private _getKeyToUse(_colId: string): string{
    return (<string>this.fieldMapper?.[_colId]?.filterKey) || _colId;
  }

  private _appendUserPref(apiParams: any, gridParams: IServerSideGetRowsParams | IGetRowsParams){
    if (!this.skipUserPref && !this.hasRendered.gridReady && ((this.enableSaveColumnsAndFilters && this.enableSideBar) || this.enableFiltersAndColumnsMemory)){ // filtering and sorting the first time
        const savedFilters = <GridPrefMultiFilters>this._extractUserPref("filters");
        const savedColumns = <GridPrefColumns>this._extractUserPref("columns");

        if (this._helper.isNotEmpty(savedFilters)) {
            apiParams.filters = {};
            for (const key in savedFilters) {
                const _whichKey = this._getKeyToUse(key);
                if (savedFilters.hasOwnProperty(key)) {
                    const element = savedFilters[key];
                    if(element && this._helper.isNotEmpty(element.filterModels)){
                        if(this.dateFiltersToLocale){
                            apiParams.filters[_whichKey] = this._dateFiltersToLocale(element.filterModels, _whichKey);
                        } else{
                            apiParams.filters[_whichKey] = element.filterModels;
                        }

                    }
                }
            }
        }

        if (savedColumns && this._helper.isNotEmpty(savedColumns.state)) {
            savedColumns.state.forEach(col => {
                if(col.sort){
                    if (!apiParams.sort) {
                        apiParams.sort = [];
                    }
                    apiParams.sort.push({colId: col.colId, sort: col.sort, sortIndex: col.sortIndex});
                }
            });
            if(apiParams.sort && apiParams.sort.length > 0){
                apiParams.sort = this._helper.arraySortBy({arr: apiParams.sort, byId: "sortIndex"}).map(m => ({ colId: m.colId, sort: m.sort }));
            }
        }
        return apiParams;
    } else { // for every filtering and sorting apply
        // filtering
        let filterModel: any = {};
        let sortModel: any[] = [];

        if(gridParams){
            let succeedingCallbackProps = ['groupKeys', 'pivotCols', 'pivotMode', 'rowGroupCols', 'valueCols'];
            const processRequests = (whichRequests: any) => {
                //IServerSideGetRowsRequest
                Object.keys(whichRequests).forEach(key => {
                    if(succeedingCallbackProps.includes(key) && this._helper.isNotEmpty(whichRequests[key])){
                        apiParams[key] = whichRequests[key];
                    }
                });

                filterModel = whichRequests?.filterModel;
                sortModel = whichRequests?.sortModel;
            }

            if(this.rowModelType == "serverSide" && this._isServerSideInstance(gridParams)){
                processRequests(gridParams.request);
            } else if(this._isInfiniteInstance(gridParams)){
                processRequests(gridParams);
            }
        }

        if (filterModel && Object.keys(filterModel).length > 0) {
            apiParams.filters = {};
            for (const key in filterModel) {
                const _whichKey = this._getKeyToUse(key);
                if (filterModel.hasOwnProperty(key)) {
                    const element = filterModel[key];
                    if(element){
                        if(this._helper.isNotEmpty(element.filterModels)){
                            if(this.dateFiltersToLocale){
                                apiParams.filters[_whichKey] = this._dateFiltersToLocale(element.filterModels, _whichKey);
                            } else{
                                apiParams.filters[_whichKey] = element.filterModels;
                            }
                        } else if(element.filterType == FILTER_TYPE.SET){ //RT: boolean filter
                            apiParams.filters[_whichKey] = element.values?.[0];
                        }
                    }
                }
            }
        }

        // sorting
        if (sortModel && sortModel.length > 0) {
            apiParams.sort = sortModel;
        }

        return apiParams;
    }
  }

  private _setUserColumns(columns: GridPrefColumns, noUserPref = false): void {
    const allCols = (columns.state || []);
    if(this.gridParams && this.gridParams?.columnApi){
        if(!noUserPref){
            this._helper.mergeArrays(allCols, this.gridParams?.columnApi.getColumnState(), "colId");
        }
        //const applyResult1 = this.gridParams?.columnApi.applyColumnState({state: , applyOrder: true});
        const hiddenColumns = allCols.filter(col => col.hide).map(col => {
            const thisCol = this.gridParams?.columnApi.getColumn(col.colId);
            if(thisCol){
                let headerName;
                if(thisCol.getOriginalParent && this._helper.isNotEmpty(thisCol.getOriginalParent()?.getColGroupDef)){
                headerName = thisCol.getOriginalParent()?.getColGroupDef()?.headerName;
                } else{
                headerName = thisCol.getColDef().headerName != undefined ? thisCol.getColDef().headerName : thisCol.getColId();
                }
                return {...col, headerName };
            }
            return col;
        });

        const applyResult = this.gridParams?.columnApi.applyColumnState({state:
        [...allCols.filter(col => !col.hide),
            ...this._helper.arraySortBy({arr: hiddenColumns, byId: 'headerName'}).map(col => {
            delete col.headerName;
            return col;
        })],
        applyOrder: true});

        if(noUserPref){
            setTimeout(() => {
                this.gridParams?.columnApi.autoSizeAllColumns();
            })
        }
    }
  }

  private _setUserFilters(savedFilters: { [x: string]: any; }, clear?: boolean){
    if(this._helper.isNotEmpty(savedFilters)){
        setTimeout(() => {
            if(this.rowModelType != GRID_TYPE.CLIENT_SIDE){
                this.hasRendered.firstFilter = true;
            }
            this.gridParams?.api.setFilterModel(savedFilters);
            this.gridHasFiltersApplied = true;
        });
    }
  }

  private _disableEnableNextPrevious(mode: 'add' | 'remove'){
    const _p = (<any>document.querySelectorAll('.ag-icon-previous')[0])?.parentElement;
    const _n = <any>(document.querySelectorAll('.ag-icon-next')[0])?.parentElement;
    if(_p){
        const _cl1 = <string>this._helper.toggleClass(_p.className, 'cursor-not-allowed pointer-events-none', mode);
        _p.className = _cl1;
    }
    if(_n){
        const _cl2 = <string>this._helper.toggleClass(_n.className, 'cursor-not-allowed pointer-events-none', mode);
        _n.className = _cl2;
    }
  }

  /**
   * Grid internal method that performs action onGridReady
   * @params params Grid Options params (e.g. params.api)
   * Use extendedGridDefinition?.onGridReady to extend this method
   */
  public onGridReady(params: GridReadyEvent){
    //setTimeout(() => {
        this.gridParams = params;
        this.gridParamsChange.emit(this.gridParams);

        if(this.hasRendered.gridReady && this._userPrefReInit){
            this._userPrefReInit = false;
            setTimeout(() => {
                this._setUserPreferences("filters");
            });
        }

        //this.extendedGridDefinition?.onGridReady?.(params);
        if (this.rowModelType == GRID_TYPE.INFINITE || this.rowModelType == GRID_TYPE.SERVER_SIDE) {
            //set empty failCallback to perform data empty
            if(this.apiCallParams !== undefined){
                if (!this.apiCallParams?.failCallback) {
                    this.apiCallParams.failCallback = (e, p) => {
                        if (p) {
                            if(p.fail){
                                p.fail();
                            }
                            params.api?.showNoRowsOverlay();
                        }
                    }
                } else {
                    this.apiCallParams.executeAfterFailCallback = (e, p) => {
                        if (p) {
                            if(p.fail){
                                p.fail();
                            }
                            params.api?.showNoRowsOverlay();
                        }
                    }
                }

                //next set callback
                this.apiCallParams.callback = (result: GridResponse, p: IServerSideGetRowsParams | IGetRowsParams) => {
                    if(!this.firstResult){
                        this.firstResult = result;

                        let noRowData = true;
                        const firstRow = result?.results?.[0];
                        if(firstRow){
                            for (const key in firstRow) {
                                if (Object.prototype.hasOwnProperty.call(firstRow, key)) {
                                    const element = firstRow[key];
                                    if(noRowData && this._helper.isNotEmpty(element)){
                                        noRowData = false;
                                    }
                                }
                            }
                        }
                        if(noRowData){
                            this._onFirstDataRendered(params);
                        }
                    }

                    if(!this._noReadRendered && (!result?.permission || !result?.permission.read)){
                        this._noReadRendered = true;
                        this.tOverlay.noRows = `<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">No Read Permission</span>`;
                        if(this.rowModelType != 'clientSide'){
                            if(this._isServerSideInstance(p)){
                                p?.fail();
                            } else{
                                p?.failCallback();
                            }
                            params.api?.showNoRowsOverlay();
                        }
                    } else if(this._noReadRendered){
                        if(this._isServerSideInstance(p)){
                            p?.fail();
                        } else{
                            p?.failCallback();
                        }
                        params.api?.showNoRowsOverlay();
                        this._messageService.add({detail: Core.Localize('noReadAccess') , severity: MESSAGE_SEVERITY.WARN});
                    } else{
                        let editableCols: any[] = [];
    
                        if (params.columnApi) {
                            editableCols = (params.columnApi.getColumns() || []).filter(col => col.getColDef().editable);
                        }
    
                        if(result.results && Array.isArray(result.results)){
                            if (editableCols.length > 0) {
                            result.results = result.results.map((r: { [x: string]: any; isChanged: any[]; }) => {
                                editableCols.forEach((e: { colId: string; }) => {
                                    r[e.colId + "_orig"] = ((r[e.colId] || "") + ""); // just assign the value, not ref
                                });
                                r.isChanged = [];
                                return r;
                            });
                            }
                        }
    
                        if(p){
                            this._pSuccessData = {rowData: result.results, rowCount: (result.total || 0)};
                            if(this._isServerSideInstance(p)){
                                p.success(this._pSuccessData);
                            } else {
                                p.successCallback(this._pSuccessData?.rowData, (this._pSuccessData?.rowCount || 0));
                            }
                            this._cdr.detectChanges();
                        }
    
                        if(result.total > 0){
                            params.api?.hideOverlay();
                            //tell to reselect the selection
                            if(this._isRefreshed){
                                this._isRefreshed = false;
                                this._selectionBeforeRefreshSubject.next(true);
                            }
                        }
                        else if(result.total <= 0) {
                            params.api?.showNoRowsOverlay();
                        } else{
                            params.api?.hideOverlay();
                        }
    
                        if (!this.hasRendered.gridReady) {
                            this.hasRendered.gridReady = true;
                            if((this.enableSaveColumnsAndFilters && this.enableSideBar)){ //|| this.enableFiltersAndColumnsMemory
                                this._setUserPreferences("filters", "apiCallParams.callback");
                            }
                        }
                        this._initDataValidation(params, result.results);
    
                        if (this.apiCallParams?.executeAfterCallback) {
                            this.apiCallParams.executeAfterCallback(result, params);
                        }
    
                        const _f = document.querySelectorAll('.ag-icon-first')[0];
                        const _l = document.querySelectorAll('.ag-icon-last')[0];
    
                        const _p = (<any>document.querySelectorAll('.ag-icon-previous')[0])?.parentElement;
                        const _n = <any>(document.querySelectorAll('.ag-icon-next')[0])?.parentElement;
                        if(_f){
                            const _cl1 = <string>this._helper.toggleClass(_f.className, 'hidden', 'add');
                            _f.className = _cl1;
                        }
                        if(_l){
                            const _cl2 = <string>this._helper.toggleClass(_l.className, 'hidden', 'add');
                            _l.className = _cl2;
                        }
    
                        this._disableEnableNextPrevious('remove');
                    }

                };
            } else{
                this._messageService.add({detail: Core.Localize('noApiCallParamsProvided'), severity: MESSAGE_SEVERITY.ERROR, sticky: true});
            }

            const thisApiCallParams: any = Object.assign({}, this.apiCallParams);
            const i_dataSource: any = {
                rowCount: null,
                getRows: (p: IServerSideGetRowsParams | IGetRowsParams) => {
                    let sortModel: any = null;
                    let filterModel: any = null;
                    if(this._isServerSideInstance(p)){
                        sortModel = p.request.sortModel;
                        filterModel = p.request.filterModel;
                    } else{
                        sortModel = p.sortModel;
                        filterModel = p.filterModel;
                    }

                    if(this._currentPage > 0 && this._sortChanged){ // RT && this._helper.isNotEmpty(sortModel)
                        this._initSortModel = sortModel;
                        this._initFilterModel = filterModel;
                        this.destroyAndLive({timeout: 10});
                    } else{
                        if(!this._jumpToLastPage ){
                            this._disableEnableNextPrevious('add');
                            this.hasRendered.firstFilter = true;
                                params.api?.showLoadingOverlay();
        
                                let apiCallParamsParams = Object.assign({}, this.apiCallParams?.params);
                                if (!apiCallParamsParams) {
                                    apiCallParamsParams = {};
                                }
        
                                const executeApiCallParams = (newApiCallParams: any) => {
                                    thisApiCallParams.params = Object.assign({}, newApiCallParams);
        
                                    let startRow = 0, endRow = 0;
                                    if (this.rowModelType == "serverSide" && this._isServerSideInstance(p) ) {
                                        startRow = (p.request.startRow || 0);
                                        endRow = (p.request.endRow || this.cacheBlockSize);
                                    } else if (this.rowModelType == "infinite" && this._isInfiniteInstance(p)) {
                                        startRow = p.startRow;
                                        endRow = p.endRow;
                                    }
        
                                    let aggs_filters: any;
                                    if(this.aggsFilters){
                                        aggs_filters = Object.assign({}, thisApiCallParams.params); //to just create a copy not the instance, otherwise it will create circular copying;
                                    }
        
                                    if(this.serverSideInfiniteScroll){
                                        const pageSize = this.paginationAutoPageSize ? (endRow - startRow) : this.paginationPageSize;
                                        const page = (startRow / pageSize) + 1;
                                        thisApiCallParams.params.limit = pageSize;
                                    } else if(!this.serverSideInfiniteScroll && this.limit){
                                        thisApiCallParams.params.limit = this.limit;
                                    }
        
                                    if(this._apiCallService){
                                        this._apiCallService.execute(thisApiCallParams, this.tokenRequired, p, true, this._nextPage)
                                            .then((_promise: {[key: string]: GridResponse, p?: any}) => {
                                                if(_promise['result']?.aggs){
                                                    this._gridService.aggsValue = _promise['result'].aggs;
                                                    /* this.cacheBlockSize = 400; */
                                                    thisApiCallParams.next = _promise['result']?.page?.next;
                                                    thisApiCallParams.previous = _promise['result']?.page?.previous;
                                                } else {
                                                    //after getRows execution, call the same query with aggs and replace the _newAggsFromResult for new async computation
                                                    setTimeout(() => {
                                                        const aggsCallParams: any = {...thisApiCallParams.params, ...{aggs: true, limit: 1}, ...(aggs_filters? {aggs_filters} : {})};
                                                        if(aggsCallParams.page){
                                                            delete aggsCallParams.page;
                                                        }
                                                        this._gridService.aggsValue = undefined;
                                                        const tempSub = thisApiCallParams.api(aggsCallParams).subscribe({next: (_newAggsFromResult: ResponseObj<GridResponse>) => {
                                                            this._gridService.aggsValue = _newAggsFromResult.content?.aggs;
                                                        }, error:  (err: any) => {
                                                        }, complete: ()=> {
                                                            setTimeout(()=>{
                                                                if(tempSub){
                                                                    tempSub.unsubscribe();
                                                                }
                                                            });
                                                        }})
                                                    });
                                                }
    
                                                this._nextPage = false;
                                                this._isQuerying = false;
                                            }).catch(() => {
                                                this._nextPage = false;
                                                this._isQuerying = false;
                                            });
                                    } else{
                                        console.warn('No ApiCallService provided');
                                    }
                                };

                                let _p = p;
                                if(this._helper.isNotEmpty(this._initSortModel)){ // RT || this._helper.isNotEmpty(this._initFilterModel)
                                    //TODO filter this._initFilterModel
                                    if(this._isServerSideInstance(p)){
                                        _p = {..._p, request: {...p.request , sortModel: (this._initSortModel || [])}};
                                    } else{
                                        _p = {..._p, sortModel: (this._initSortModel || [])};
                                    }
                                    
                                    //mark sorting without triggering event
                                    let _hasSorting = false;
                                    this._initSortModel?.forEach((_s, i) => {
                                        const thisCol = params?.columnApi.getColumn(_s.colId);
                                        if(thisCol){
                                            _hasSorting = true;
                                            thisCol.setSort(_s.sort);
                                            thisCol.setSortIndex(i);
                                        }
                                    });
                                    if(_hasSorting){
                                        params?.api?.refreshHeader();
                                    }
                                }
                                
                                const appendApiCallParams = this._appendUserPref(apiCallParamsParams, _p);
                                //RT amend filters implementation
                                if(this.isDebug){console.log({appendApiCallParams});}        
                                for (const key in appendApiCallParams) {
                                    if (Object.prototype.hasOwnProperty.call(appendApiCallParams, key)) {
                                        if(key=="filters"){
                                            for (const key2 in appendApiCallParams[key]) {
                                                if (Object.prototype.hasOwnProperty.call(appendApiCallParams[key], key2)) {
                                                    const element = appendApiCallParams[key][key2];
                                                    if(element && element[1]){
                                                        appendApiCallParams[key2] = (<filterTypeSet>element[1])?.values;
                                                    } else{ //boolean filter
                                                        appendApiCallParams[key2] = element;
                                                    }
                                                    if(this.isDebug){console.log("multifilter 1", element[0]);}
                                                }
                                            }
                                            delete appendApiCallParams.filters;
                                        }
                                    }
                                }
                                executeApiCallParams(appendApiCallParams);
                        } else{
                            //at this moment the ag grid will automatically go back to last first page
                            params.api?.refreshServerSide({ route: [], purge: true });
                        }
                    }

                    this._sortChanged = false;
                    //this._isQuerying = false;
                }
            };

            if(this.rowModelType == "serverSide"){ //if(this._isIServerSideDatasourceInstance(i_dataSource)){
                this._serverSideDataSource = i_dataSource;
                params.api?.setServerSideDatasource(this._serverSideDataSource);
            } else {
                this._dataSource = i_dataSource;
                params.api?.setDatasource(this._dataSource);
            }
        } else if(this.rowModelType == GRID_TYPE.CLIENT_SIDE){
            if(this.apiCallParams){
                //this.apiCallParams.api(this.apiCallParams.params, 'options').subscribe((res: ResponseObj<GridResponse>) => {
                this.apiCallParams.api(this.apiCallParams.params, 'post').subscribe((res: ResponseObj<GridResponse>) => {
                    if(!this.firstResult){
                        this.firstResult = res?.content;

                        let noRowData = true;
                        const firstRow = res?.content?.results?.[0];
                        if(firstRow){
                            for (const key in firstRow) {
                                if (Object.prototype.hasOwnProperty.call(firstRow, key)) {
                                    const element = firstRow[key];
                                    if(noRowData && this._helper.isNotEmpty(element)){
                                        noRowData = false;
                                    }
                                }
                            }
                        }
                        if(noRowData){
                            this._onFirstDataRendered(params);
                        }
                    }
                    if(!this.rowData){
                        this.rowData = res?.content?.results || [];
                    }
                    // console.log({here2: this.rowData});
                    this._cdr.detectChanges();
                });
            }

            if (!this.hasRendered.gridReady) {
                this.hasRendered.gridReady = true;
            }
            setTimeout(() => {
                this._cdr.detectChanges();
            }, 1000);
        }

        // RT eagna commented if(this._loadedProfile){
        // params.api?.openToolPanel("customTools");
        // }
        if((this.enableSaveColumnsAndFilters && this.enableSideBar) || this.enableFiltersAndColumnsMemory){
            this._setUserPreferences("columns", "on gridReady");
        }
    //});
  }

  private _onFirstDataRendered(params: any){
    //to make initial validations
    if(this.rowModelType == GRID_TYPE.CLIENT_SIDE){
        this._initDataValidation(params);
        if ((this.enableSaveColumnsAndFilters && this.enableSideBar) || this.enableFiltersAndColumnsMemory){
            this._setUserPreferences("filters", "on firstdatarendered");
        }
    }
    //no default columnDefs is provided neither computed, computing now based on data columns field
    if(this.hasRendered.forcedDestroyed || !this._helper.isNotEmpty(this.columnDefs)){
        this.columnDefs = this._gridService.extractApiColumns(this.firstResult, this.isDebug);
        if(this.hasRendered.forcedDestroyed){
            this.hasRendered.forcedDestroyed = false;
        }
    }

    this.firstResult?.fields?.filter( _f => GridService.ObjectFields.includes(_f?.form || '')).forEach( _f2 => {
        let _col: ColDef | undefined = this.columnDefs ?.find((_c: ColDef) => _c?.field == _f2?.field);
        if(_col){
            if(Array.isArray(_col.type)){
                _col.type.push(COLUMN_TYPE.NEW_AUTOCOMPLETE_COLUMN);
            } else if(_col.type){
                _col.type = [_col.type, COLUMN_TYPE.NEW_AUTOCOMPLETE_COLUMN];
            } else {
                _col.type = [COLUMN_TYPE.NEW_AUTOCOMPLETE_COLUMN];
            }
        }
    });

    if(this.extendedGridDefinition?.amendColDefs){
        const _newColDefs = this.extendedGridDefinition?.amendColDefs(this.columnDefs || [], this.firstResult, params);
        if(this._helper.isNotEmpty(_newColDefs)){
            this.columnDefs = _newColDefs;
        }
    }

    if(this._helper.isNotEmpty(this.columnDefs)){
        setTimeout(() => {
            this.hasRendered.firstFilter = true;
            this._setUserPreferences("both", "onFirstDataRendered after extractBackendColumns"); //TODO, to fix the double call
        });
    } else{
        this._messageService.add({detail: Core.Localize('noColumnsProvided'), severity: MESSAGE_SEVERITY.ERROR, sticky: true});
    }
  }

  public onFirstDataRendered(params: FirstDataRenderedEvent){
    this._onFirstDataRendered(params);
  }

  private _initDataValidation(params: FirstDataRenderedEvent | GridReadyEvent, rowData?: any[]) {
    params.api?.forEachNode(rowNode => {
        if(rowNode.data){
            params.columnApi.getColumns()?.forEach(col => {
                const value = rowNode.data?.[col.getColId()] || undefined;
                const colDef = col.getColDef();
                const tmpParams = {value, api: params.api, colDef, data: rowNode.data};
                if(colDef.type){
                    if(colDef.type.includes(COLUMN_TYPE.UNIQUE_VALUE_COLUMN)){
                        this._gridService?.validateDuplicate(tmpParams); //to validate unique
                    } else if(colDef.type == COLUMN_TYPE.UNIQUE_CASE_SENSITIVE_COLUMN){
                        this._gridService?.validateDuplicate(tmpParams, true); //to validate unique case-sensitive
                    }

                    if(colDef.type.includes(COLUMN_TYPE.REQUIRED_COLUMN)){
                        this._gridService?.isRequiredOrValidateWhen(tmpParams); //to validate unique
                    } else if(colDef.type == COLUMN_TYPE.VALIDATE_WHEN_COLUMN){
                        this._gridService?.isRequiredOrValidateWhen(tmpParams, true); //to validate unique case-sensitive
                    }
                }
            });
        }
    });
  }

  /**
     * Grid internal method that performs action onSelectionChanged
     * @params params Grid Options params (e.g. params.api)
     * Use extendedGridDefinition?.selectionChanged to extend this method
     */
  public onSelectionChanged(params: SelectionChangedEvent){}

  public onFilterChanged(params: FilterChangedEvent){
    this._initFilterModel = undefined;
  }

  /**
     * Grid internal method that performs action onCellValueChanged
     * @params params Grid Options params (e.g. params.api)
     * Use extendedGridDefinition?.cellValueChanged to extend this method
     */
  public onCellValueChanged(params: CellValueChangedEvent){
    const _colId = params.colDef.colId || params.colDef.field || '';
    if(_colId){
        if (!params.data?.hasOwnProperty(_colId + '_orig')){
            params.data[_colId + '_orig'] = params.oldValue;
        }
        let _isChanged;
        let newObj: any = Object.assign({}, params.data);
        let newValue    = params.newValue;
        let oldValue    = params.data?.[_colId + '_orig'];
        newValue        = newValue === "" ? null : newValue;
        oldValue        = oldValue === "" ? null : oldValue;
        _isChanged      = newValue != oldValue;
        if(_isChanged !== null && params.node){
            newObj.isChanged = newObj.isChanged||[];
            if(_isChanged){
                if(!newObj.isChanged.includes(_colId)){
                    newObj.isChanged.push(_colId);
                }
            } else {
                if (newObj.isChanged.includes(_colId)) {
                    newObj.isChanged = newObj.isChanged.filter((x: any) => x != _colId)
                }
            }
            params.node.setData(newObj);
            params.api?.refreshCells({columns: [_colId], force: true});
        }
    }
  }

  /**
     * Grid internal method that performs action onCellEditingStarted
     * @params params Grid Options params (e.g. params.api)
     * Use extendedGridDefinition?.cellEditingStarted to extend this method
     */
  public onCellEditingStarted(params: CellEditingStartedEvent){
    //TODO: add input if doenst want to autoselect while upon editing start
    const _noWritePermission = (!this.firstResult?.permission || !this.firstResult?.permission?.update || !this.firstResult?.permission?.create);
    if(_noWritePermission){
        this._messageService.add({detail: Core.Localize('noWriteAccess'), severity: MESSAGE_SEVERITY.WARN});
        params.api.stopEditing(true);
    }
  }

  /**
     * Grid internal method that performs action onCellEditingStopped
     * @params params Grid Options params (e.g. params.api)
     * Use extendedGridDefinition?.cellEditingStopped to extend this method
     */
  public onCellEditingStopped(params: any){
    if(params.valueChanged){
        const _noWritePermission = (!this.firstResult?.permission || !this.firstResult?.permission?.update || !this.firstResult?.permission?.create);

        if(_noWritePermission){
            //console.log("this should not be allowed when console 1 is triggered", {onCellEditingStopped: _noWritePermission});
            this._messageService.add({detail: Core.Localize('noWriteAccess'), severity: MESSAGE_SEVERITY.WARN});
        }
    }

  }

  /**
     * Cal this method to force refresh the grid cells (by rows or columns)
     * @param cellsToRefresh columns: array of column [colId1, colId2...], (or rows: [RowNode1, RowNode2...], or rowNodes: [RowNode1, RowNode2...])
     * @param params Grid Options params (e.g. params.api)
     */
    forceRefreshCells(cellsToRefresh: {columns?: any[], rows?: any[], rowNodes?: any[]} = {}, params?: any){
        const toRefresh = {...cellsToRefresh, ...{force: true}};
        const gridParams = params || this.gridParams;
        if(gridParams && gridParams?.api){
            gridParams?.api?.refreshCells({...{force: true, columns: toRefresh.columns}, ...(toRefresh.rows? {rows: toRefresh.rows}: {})});

            if(cellsToRefresh.rowNodes && this._helper.isNotEmpty(this.extendedGridDefinition?.rowClassRules)){
                gridParams?.api?.redrawRows({rowNodes: cellsToRefresh.rowNodes});
            }
        }
    }

  /**
   * Grid internal method that performs action onColumnResized
   * @params params Grid Options params (e.g. params.api)
   * Use extendedGridDefinition?.columnResized to extend this method
   */
  public onColumnResized(p: any){
  }

  private _clearColumns(): void {
    this._initSortModel = undefined;
    this.gridParams?.columnApi.resetColumnState();
  }

  private _clearFilters(): void {
    this._initFilterModel = undefined;
    this.gridParams?.api?.setFilterModel({});
  }

  private _initAgGridChartTheme(base: string){
  }

  private _setUserPreferences(forFiltersOrColumns: "both" | "filters" | "columns" = "both", debugFrom?: string): void {
    if(this.isDebug){console.log("_setUserPreferences", debugFrom);}

    if(!this.skipUserPref){
        if((this.enableSaveColumnsAndFilters && this.enableSideBar) /* || this.enableFiltersAndColumnsMemory */){
            let savedColumns = null;
            let savedFilters: any;
            let newFilters: {
                [p: string]: apiFilter;
            } = {};

            if(this.userPref && this.gridParams && this.gridParams?.api){
                //this.gridParams?.api?.refreshHeader();
                if(["both", "columns"].includes(forFiltersOrColumns)){
                    savedColumns = <GridPrefColumns>this._extractUserPref("columns");
                    if(this.isDebug){console.log({savedColumns});}

                    if(this._helper.isNotEmpty(savedColumns) && this._helper.isNotEmpty(savedColumns.state)){
                        this._setUserColumns(savedColumns || { state: [] });
                    } else {
                        const _gridColState = this.gridParams?.columnApi.getColumnState();
                        if(this.defaultColumns?.columns != undefined){                   
                            let _colState: ColumnState[] = [];
                            if(this._helper.isArrayOfString(this.defaultColumns?.columns.state)){
                                _colState = _gridColState.map(_gcs => {
                                    const _hidden = !(<string[]>this.defaultColumns?.columns?.state).includes(_gcs.colId);
                                    return {..._gcs, hide: _hidden};
                                    });
                            } else{
                                _colState = this.defaultColumns?.columns.state || [];
                            }
                            const _state = _colState.map(_col => (!(this.defaultColumns?.hiddenCols || []).includes(_col.colId)) ? _col : {..._col, hide: true});
                            this._setUserColumns({state: _state, groupState: this.gridParams?.columnApi.getColumnGroupState()}, true);
                        } else if(this.gridParams?.columnApi){
                            this._setUserColumns({state: _gridColState.map(_col => (!(this.defaultColumns?.hiddenCols || []).includes(_col.colId)) ? _col : {..._col, hide: true}), groupState: this.gridParams?.columnApi.getColumnGroupState()}, true);
                        }
                    }
                }
                //RT: added condition apply user filter only when columnDefs is available
                if(["both", "filters"].includes(forFiltersOrColumns) && this._helper.isNotEmpty(this.columnDefs)){
                    savedFilters = <GridPrefMultiFilters>this._extractUserPref("filters");
                    //TODO: when there's another filter logic
                    newFilters = savedFilters;
                    if (this._helper.isNotEmpty(newFilters)) {
                        this._setUserFilters(newFilters);
                    }
                }
            }
        }
    }
  }

    public stageEditableDataState(p?: GridReadyEvent<any> | undefined, rowNodes?: any[], reselect = false){
        const params = p || this.gridParams;
        let editableCols: any[];
        const stageData = (node: RowNode, fromRowNode = false) => {
            if(node.data){
                node.data.isChanged = [];
                if (editableCols && editableCols.length > 0) {
                    editableCols.forEach((e: { colId: string; }) => {
                        if(node.group != true){
                            node.data[e.colId + "_orig"] = ((node.data[e.colId] || "") + ""); // just assign the value, not ref
                        }
                    });
                }
            }

            if(fromRowNode){
                params?.api?.redrawRows({rowNodes: [node]});
                node.setSelected(reselect);
            }
        };

        if (params?.columnApi) {
            editableCols = params.columnApi.getAllGridColumns().filter((col: Column) => col.getColDef().editable);
        }

        if(this._helper.isNotEmpty(rowNodes)){
            rowNodes?.forEach(node => {
                stageData(node, true);
            })
        } else{
            params?.api?.forEachNode((node: any) => {
                stageData(node);
            });
        }
    }

    /**
     * Call this method when to get the current row selections, returns [] if empty
     */
     public getSelectedNodes(filterFunc?: (node: any)=>boolean): any[] {
        const sels = this.gridParams?.api?.getSelectedNodes() || [];
        if(filterFunc && sels.length > 0){
            return sels.filter(filterFunc);
        }
        return [];
    }

    /**
     * Call this method when to get all rows, returns [] if empty
     */
    public getAllNodes(): any[]{
        const allNodes: any[] = [];
        if(this.gridParams && this.gridParams?.api){
            this.gridParams?.api?.forEachNode(node => {
                allNodes.push(node);
            });
        }
        return allNodes;
    }

    /**
     * Call this method to identify if Grid has any field that has isChanged: [col1, col2, etc.] row data
     */
    public isChanged(): boolean{
        return this._doesGridHas("isChanged");
    }

    /**
     * Call this method to identify if Grid has any field that has _errors: [col1, col2, etc.] row data
     */
    public hasErrors(): boolean{
        return this._doesGridHas("_errors");
    }

    /**
     * Call this method to identify if Grid has any field that has _duplicates: [col1, col2, etc.] row data
     */
    public hasDuplicates(): boolean{
        return this._doesGridHas("_duplicates");
    }

    private _doesGridHas(whichProperty: string): boolean{
        let _isTrue = false;
        if(this.gridParams !== undefined && this.gridParams?.api){
            this.gridParams?.api?.forEachNode(node => {
                if(!_isTrue && node.data && this._helper.isNotEmpty(node.data[whichProperty])){
                    _isTrue = true;
                }
            });
        }
        return _isTrue;
    }

    public onPaginationChanged(p: any/*PaginationChangedEvent<any> */) {
        if(this.rowModelType != "clientSide"){
            this._nextPage = false;
            const currPage = p.api?.paginationGetCurrentPage();
            if(this._currentPage != currPage){
                this._nextPage = true;
            }

            const lastPage = (p.api?.paginationProxy?.totalPages - 1) || 0;
            this._jumpToLastPage = false;

            if(currPage == lastPage && (this._currentPage < lastPage - 1)){
                this._messageService.add({detail: Core.Localize('jumpToLastPageNotAllowed') , severity: MESSAGE_SEVERITY.WARN});
                this.destroyAndLive();
            } else{
                this._currentPage = currPage;
            }
        }
    }
    
    public onSortChanged(p: SortChangedEvent<any>) {
        this._initSortModel = undefined;
        this._sortChanged = true;
    }

  /**
     * Instead of wondering how to refresh the currently loaded grid data for which GRID_TYPE
     * Use this global method that applies to all
     * Technically will do the refresh cache for non-CLIENTSIDE
     * and will reinitiate the grid lifecycle for CLIENTSIDE.
     * @param purge: turn this off normal refresh without purging the entire data
     * @param route?: optionally provide route for grouped grid, e.g. ['Group1', 2, 'Group3']
    */
    public refresh(params: {
        gridParams?: any,
        redrawRows?: any[] | {refreshWithIds: any[], idField?: string } | ApiCallParams,
        purge?: boolean,
        route?: any[],
        dontReselect?: boolean} = {purge: true}){

        const gridParams = params.gridParams || this.gridParams;
        //let dontReselect = false;

        /* console.log({params}); */

        if(params && params.purge !== false ){
            params.purge = true;
        }

        //get previous selection first
        let sel: {rowIndex: number, id?: number}[] = [];
        //let sel: any[];
        let isPreSelected = false;
        if(this._currentSelections && this._currentSelections.length > 0 && !isPreSelected){
            const currSelLength = (this._currentSelections.length * 1);
            sel = JSON.parse(JSON.stringify([...this._currentSelections.slice(0, currSelLength)].map(node => ({rowIndex: node.rowIndex, id: (node.data ? node.data?.id : null)}))));
            isPreSelected = true;
        }

        //deselect all
        if(this._helper.isNotEmpty(sel) && !params.dontReselect){
            if(this.rowModelType != "clientSide"){
                gridParams?.api?.forEachNode( (node: { setSelected: (arg0: boolean) => void; },i: any) => {
                    node.setSelected(false)
                });
                this._isRefreshed = true;
            } else{
                gridParams?.api?.deselectAll();
            }
        }

        if (gridParams && gridParams?.api) {
            const fullRefresh = (fail = false) => {
                //refresh according to grid type
                if(this.rowModelType == "clientSide"){
                    //this.triggerOnwardChanges(true);
                    if(this.apiCallParams){
                        const refreshRef = this.apiCallParams.api(this.apiCallParams.params).subscribe({next: (res2: ResponseObj<GridResponse>) => {
                            (<GridReadyEvent>gridParams).api?.setRowData(res2.content.results || []);
                        }, error: err=>{
                            refreshRef?.unsubscribe();
                        }, complete: ()=>{
                            gridParams?.api?.hideOverlay();
                            setTimeout(() => { refreshRef?.unsubscribe(); });
                        }});
                        
                    } else{
                        this.destroyAndLive({timeout: 5});
                    }

                    
                } else{
                    if(!this._isFilterAndSortingApplied){
                        gridParams?.api?.onFilterChanged();
                        this._isFilterAndSortingApplied = true;
                    } else {
                        if(this.rowModelType == "serverSide"){
                            if(!params.purge && gridParams?.api?.refreshServerSideStore){ //TODO: Test on grouped grid
                                /* const blockStateBefore1 = Object.assign({}, gridParams?.api?.getCacheBlockState()); */
                                gridParams?.api?.refreshServerSideStore({route: params.route, purge: params.purge});
                            } else{
                                /* const blockStateBefore2 = Object.assign({}, gridParams?.api?.getCacheBlockState()); */
                                gridParams?.api?.refreshServerSide();
                            }
                        } else if(this.rowModelType == "infinite"){
                            if(gridParams?.api?.getDisplayedRowCount() == 0 || params.purge) {
                                gridParams?.api?.purgeInfiniteCache();
                            } else{
                                gridParams?.api?.refreshInfiniteCache();
                            }
                        }
                    }
                }
            }

            if(params && params.redrawRows){
                gridParams?.api?.showLoadingOverlay(); //TODO replace with line loader
                if(Array.isArray(params.redrawRows)){ //usually being called by simple grid (client side)
                    this.stageEditableDataState(gridParams, params.redrawRows, true);
                    //TODO: call refresh aggregations or observe 'clear' of newRowsAction
                } else {
                    let requery;
                    if(!this._helper.isApiCallParams(params.redrawRows) && this.apiCallParams){
                        requery = this.apiCallParams.api({...this.apiCallParams.params, aggs: true, [params.redrawRows.idField || "id"]: params.redrawRows.refreshWithIds});
                    } else {
                        if(this.rowModelType == "clientSide" && this._helper.isApiCallParams(params.redrawRows)){
                            requery = params.redrawRows.api({...params.redrawRows.params, aggs: true});
                        }
                    }

                    if(requery){
                        const refreshRef = requery.subscribe({next: res2 => {
                            if(res2){
                                if(res2.data) {
                                    let rowNodes: any[] | undefined = [];
                                    gridParams?.api?.forEachNode((currentSelectionNode: { data: { id: any; }; setData: (arg0: any) => void; }) => {
                                        if(currentSelectionNode.data){
                                            const pairedResult = res2.data?.find((resData: { id: any; }) => resData?.id == currentSelectionNode.data?.id);
                                            if(pairedResult){
                                                currentSelectionNode.setData(pairedResult);
                                                rowNodes?.push(currentSelectionNode);
                                            }
                                        }
                                    });

                                    if(rowNodes.length > 0){
                                        this.stageEditableDataState(gridParams, rowNodes, true);
                                    } else{
                                        console.warn('no refresh done');
                                        fullRefresh(true);
                                    }
                                } else{
                                    fullRefresh(true);
                                }
                            } else{
                                fullRefresh(true);
                            }
                        }, error: err=>{
                            fullRefresh(true);
                        }, complete: ()=>{
                            gridParams?.api?.hideOverlay();
                            setTimeout(() => { refreshRef?.unsubscribe(); });
                        }});
                    } else{
                        fullRefresh(true);
                    }
                }
            } else {
                fullRefresh();
            }

            //then reselect after refresh
            const selRef = this._selectionBeforeRefresh$.subscribe(s => {
                if(sel && !params.dontReselect){
                    gridParams?.api?.forEachNode( (node: { data: { id: number | undefined; }; rowIndex: number; setSelected: (arg0: boolean) => void; }, i: any) => {
                        if(sel.find(selNode => (this._helper.isNotEmpty(selNode.id) && this._helper.isNotEmpty(node.data) && selNode.id == node.data?.id) || (!this._helper.isNotEmpty(selNode.id) && selNode.rowIndex == node.rowIndex) )){
                            node.setSelected(true);
                        }
                    });
                    setTimeout(() => {
                        selRef.unsubscribe();
                    });
                }
            });

        }
    }

  public ngAfterViewInit(): void {
    setTimeout(() => {
        if(!this.agStyle){
            this.agStyle = 'width: 100%; height: calc(100vh - 0px)';
        }
    })
  }

  public ngOnDestroy  (): void {
    this.firstResult = undefined;
    this.gridOptions?.api?.refreshServerSide({ route: undefined, purge: true });
    this.gridOptions?.api?.purgeInfiniteCache();
    this.gridOptions?.api?.destroy();
    this.gridParams = undefined;
    this._subscription.unsubscribe();
  }

  public ngAfterViewChecked(): void {
    setTimeout(() => {
        this.darkMode = this._coreService.isDarkMode;
    });
  }

  ngDoCheck(): void {
    if(this.rowModelType != 'clientSide'){
        /**
         * for nonClientSide, triggers of refresh 
         * 1. apiCallParams.params
         */
        if(this.hasRendered.gridReady){
            /* if(this.isDebug){
                console.log({_apiCallParamsParams: this._apiCallParamsParams, 'apiCallParams.params': this.apiCallParams?.params})
            } */

            if(this.searchQuery?.value != this._searchValueValue){
                this._searchValueValue = this.searchQuery?.value;
                this._isQuerying = true;
                this._requery();
            } else if(!deepEqual(this._apiCallParamsParams, this.apiCallParams?.params)){
                /* if(this.isDebug){
                    console.log("deepEqual true!!");
                } */
                /* assign the current value to be observed by DoCheck */
                this._apiCallParamsParams = Object.assign({}, this.apiCallParams?.params);
                
                /** 
                 * perform only the refresh when SEARCH is not being performed 
                 * since search also appends apiCallParams.params
                 */
                if(!this._isQuerying){
                    this.destroyAndLive({timeout: 100});
                }
            }
        }
    } else{
        if(this.hasRendered.gridReady){
            if(this.searchQuery?.value != this._searchValueValue){
                this.gridParams?.api?.setQuickFilter(this.searchQuery?.value);
                this._searchValueValue = this.searchQuery?.value;
            }
        }
    }
  }
}
