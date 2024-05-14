import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { apiMethod, ConfirmDialogResult, laneItem, laneType, MESSAGE_SEVERITY, ResponseObj } from '../core.interface';
import { CoreService } from '../core.service';
/* import { AddComponent } from '../generic/generic-api'; */
import { HelperService } from '../helper.service';

@Component({
  selector: 'eag-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit, /* OnChanges, */ OnDestroy{

  constructor(private _core: CoreService,
    private _helper: HelperService,
    private _messageService: MessageService,
    private _dialogService: DialogService,
    private _titleCase: TitleCasePipe
    ) {}
  
  @Input()
  public lanes: laneType[] = [];

  @Output()
  public lanesChange = new EventEmitter<laneType[]>();

  @Input()
  public laneDataApiService?: (p?: any, m?: apiMethod) => Observable<ResponseObj<any>>

  @Input()
  public laneApiService?: (p?: any, m?: apiMethod) => Observable<ResponseObj<any>>;

  /* @Input()
  public searchQuery = ''; */
  
  @Input()
  containerConfig: any;

  @Output()
  containerConfigChange = new EventEmitter<any>();
  
  public dataHolder!: {[id: string]: any[]};
  public activeLaneMenu?: laneType;
  private _subscription = new Subscription();
  public ref?: DynamicDialogRef;
  public PI = PrimeIcons;
  public toggleView: 'Grid' | 'Board' = 'Board';
  private _boardLaneFields!: { [field: string]: string; }[];
  private _boardDataFields!: { [field: string]: string; }[];
  private _lanesSource = new BehaviorSubject<laneType[]>([]);
  public collapsedAll = false;
  public lanes$ = this._lanesSource.asObservable();

  public laneMenu: MenuItem[] = [
    {
      label: 'Actions',
      icon: this.PI.CLOCK,
      items: [
        {
          label: 'Edit',
          icon: this.PI.PENCIL,
          command: (a) => {
            this.addEditBoard();
          },
        }
      ]
    },
    {
      label: 'Insert New Lane',
      icon: this.PI.UPLOAD,
      items: [
        {
          label: 'Left',
          icon: this.PI.ARROW_LEFT,
          command: () => {
            this.addEditBoard(true, 'left');
          }
        },
        {
          label: 'Right',
          icon: this.PI.ARROW_RIGHT,
          command: () => {
            this.addEditBoard(true, 'right');
          }
        } 
      ]
    }
  ];

  public ngOnInit(): void {
    const that = this;
    
    this.containerConfig = {
      hasHeader: true,
      header: (this.toggleView == 'Grid' ? 'Grid View' : 'Kanban Board'),
      subheader: "",
      containerType: "onecolumn",
      hasSearch: true,
      menuType:'menubar',
      menuDisplay:'text',
      items: [
        {
          label: 'New',
          icon: this.PI.PLUS,
          onClick: (item?: any, parentIndex?: number) => {},
          items: [
            {
              label: 'Board',
              icon: this.PI.PLUS,
              command: () => {
                that.addEditBoard(true);
              }
            },
          ]
        },
        {
          label: 'Toggle',
          icon: this.PI.EYE,
          onClick: (item?: any, parentIndex?: number) => {},
          items: [
            {
              label: (this.toggleView == 'Grid' ? 'Board' : 'Grid') + ' View',
              icon: (this.toggleView == 'Grid' ? that.PI.LIST : this.PI.TABLE ),
              command(p:any){
                that.toggleView = (that.toggleView == 'Grid' ? 'Board' : 'Grid');
                that.containerConfig.header = (that.toggleView == 'Grid' ? 'Grid View' : 'Kanban Board');

                this.label = (that.toggleView == 'Grid' ? 'Board' : 'Grid') + ' View',
                this.icon = (that.toggleView == 'Grid' ? that.PI.LIST : that.PI.TABLE )
              }
            },
            {
              label: (that.collapsedAll ? 'Expand' : 'Collapse') + ' All',
              icon: (that.collapsedAll ? that.PI.ANGLE_RIGHT : that.PI.ANGLE_LEFT),
              command(p: any){
                that.collapsedAll = !that.collapsedAll;
                
                this.label = (that.collapsedAll ? 'Expand' : 'Collapse') + ' All';
                this.icon = (that.collapsedAll ? that.PI.ANGLE_RIGHT : that.PI.ANGLE_LEFT);
                that.toggleCollapse(that.collapsedAll);
              }
            },
          ]
        },
        {
          label: 'Filter by',
          icon: this.PI.FILTER_FILL,
          onClick: (item?: any, parentIndex?: number) => {},
          items: [
            {
              label: 'Lane',
              icon: this.PI.ALIGN_JUSTIFY,
              command: (p: any) => {}
            },
            {
              label: 'Tasks',
              icon: this.PI.TICKET,
              command: (event: any) => {}
            }
          ]
        },
        {
          label: 'Clear Filters',
          icon: this.PI.TRASH,
          command: () => {
            this._filterBy = {};
            this._initSources();
          }
        }
      ],
      onSearch: (p: any, $e: any) => {
        //this.loaded = false;
        setTimeout(() => {
          //this._setupLanes(p);
          //this.searchQuery = p;
          this._initSources({query: p});
        })
      }
    };

    this._initSources(this._filterBy ? {filter: this._filterBy} : {});

    setTimeout(() => {
      this.containerConfigChange.emit(this.containerConfig);
    });
  }

  public isFiltered(){
    for (const key in this._filterBy) {
      if (Object.prototype.hasOwnProperty.call(this._filterBy, key)) {
        const element = this._filterBy[key];
        if(this._helper.isNotEmpty(element)){
          return true;
        }
      }
    } 

    return false;
  }

  public _filterBy: {[p: string]: string[]} = {
    lane: [
      'New', 'Commited',
    ],
    name: [
      'Item 2'
    ],
    projects: [
      'Project 1'
    ]
  };

  private _initSources(q:any = {}, whichFilter?: 'lane' | 'fields'){
    const that = this;
    //console.log({isFilterd: this.isFiltered()});
    
    //if(!whichFilter || whichFilter == 'fields'){
    this.dataHolder = {};
    //}

    if(/* !q?.query && !q?.filter */ !whichFilter || whichFilter == 'lane'){
      this._subscription.add(this.laneApiService?.((q || {}))?.subscribe((res => {
        this._boardLaneFields = res?.content?.fields;
        
        const _lanes = this._helper.arraySortBy({arr: (res?.content?.results || []).map((l: laneType, i: number) => (
          <laneType>{...l, isHidden: (this._helper.isNotEmpty(this._filterBy?.['lane']) && !this._filterBy['lane'].includes(l.name)), position: (l?.position || i)})), byId: 'position'
        });
  
        this._checkCollapsedAll(_lanes);
        this._lanesSource.next(_lanes);
        //TODO emit
        setTimeout(() => {
          this.lanesChange.emit(_lanes);
        });
  
        let allAggs: any[] = [];
        res.content?.aggs?.forEach((agg: any) => {
          allAggs = [...allAggs, ...agg["name"]?.map((eachAgg: any) => eachAgg?.["name"]) ];
        });
    
        const filterByLane = this.containerConfig?.items?.[2]?.items?.[0];
        if(filterByLane){
          const filterByLaneItemsMenu = allAggs?.map(agg => {
            let icon = this.PI.CIRCLE;
  
            if(that._filterBy['lane']?.includes(agg)){
              icon = this.PI.CIRCLE_FILL;
            }
            return {
              id: 'lane',
              label: agg,
              state: {['lane']: agg},
              icon,
              command(p: any){
                const _i2 = that._filterBy['lane']?.findIndex(_f => _f == agg);
                if(_i2 >= 0){
                  that._filterBy['lane']?.splice(_i2, 1);
                } else{
                  if(!that._filterBy['lane']){
                    that._filterBy['lane'] = [agg];
                  } else{
                    that._filterBy['lane'].push(agg);
                  }
                }
  
                //that?.onFilter({filter: {'lane': that._filterBy['lane']}}, 'lane');
                that?.onFilter({filter: that._filterBy}, 'lane');
              }
            };
          });
          filterByLane.items = filterByLaneItemsMenu;
        }
      })));
    }

    this._subscription.add(this.laneDataApiService?.((q || {}))?.subscribe(res => {
      this._boardDataFields = res?.content?.fields;
  
      const laneResults = this._helper.arraySortBy({arr: res?.content?.results || [], byId: 'position'});
      laneResults.forEach( laneItem => {
        this._insertLaneItem(laneItem);
      });

      //ammend the menu to toggle filtered ones
      //if(whichFilter == 'fields'){
      const filterByBoardDataMenu = this.containerConfig?.items?.[2]?.items?.[1];
      if(filterByBoardDataMenu){
        filterByBoardDataMenu.items = [];
  
        res.content?.aggs?.forEach((agg: any) => {
          let icon1 = this.PI.CIRCLE;

          const _objKey = Object.keys(agg)?.[0];

          const _keyName = this._titleCase.transform(_objKey || '');
          const _keyArrayValues: string[] = agg[_objKey]?.map((eachAgg: any) => eachAgg?.[_objKey]);

          if(that._filterBy[_objKey]?.find(_f => {
            return _keyArrayValues.includes(_f);
          })){
            icon1 = this.PI.CIRCLE_FILL;
          }
          filterByBoardDataMenu.items.push({
            label: _keyName,
            icon: icon1,
            items: (_keyArrayValues || []).map((_k: any) => {
              let icon2 = this.PI.CIRCLE;
              const _i2 = that._filterBy[_objKey]?.findIndex(_f => _f == _k);
              //if(that._filled[_objKey]?.includes(_k)){
              if(_i2 >= 0){
                icon2 = this.PI.CIRCLE_FILL;
              }
              return {
                id: _objKey,
                label: _k,
                state: {[_objKey]: _k},
                icon: icon2,
                command(p: any){
                  if(_i2 >= 0){
                    that._filterBy[_objKey]?.splice(_i2, 1);
                  } else{
                    if(!that._filterBy[_objKey]){
                      that._filterBy[_objKey] = [_k];
                    } else{
                      that._filterBy[_objKey].push(_k);
                    }
                  }
                  /* const _tmpFilters = Object.assign({}, that._filterBy);
                  delete _tmpFilters['lane'];
                  that?.onFilter({filter: _tmpFilters}, 'fields'); */
                  that?.onFilter({filter: that._filterBy}, 'fields');
                }
              }
            })
          });
        });
        //this.containerConfigChange.emit(this.containerConfig);
      }
      //}
    }));
  }

  private _insertLaneItem(laneItem: laneItem){
    laneItem.position = (this.dataHolder[laneItem.laneId]?.length || 0);

    if(this.dataHolder[laneItem.laneId]){
      this.dataHolder[laneItem.laneId] = [...this.dataHolder[laneItem.laneId], ...[laneItem]];
    } else{
      this.dataHolder[laneItem.laneId] = [laneItem];
    }
  }

  private _checkCollapsedAll(_lanes: laneType[]){
    this.collapsedAll = true;

    _lanes.forEach((lane: laneType) => {
      if(!lane.isCollapsed){
        this.collapsedAll = false;
      }
    });
  }

  public toggleCollapse(collapsedAll: boolean){
    const _currentLanes = this._lanesSource.value || [];
    _currentLanes.forEach((l: laneType) => {
      l.isCollapsed = collapsedAll;
    });
    this._lanesSource.next(_currentLanes);
    //TODO emit
    this.lanesChange.emit(_currentLanes);

    this._subscription.add(this.laneApiService?.(_currentLanes, "patch")?.subscribe({next: (lanes) => {console.log("successfully updated", lanes);}, error: (err) => {
        this._messageService.add({detail: err , severity: MESSAGE_SEVERITY.WARN});
      }
    }));
  }

  public getSortableLanes2(index: number, drag: CdkDrag, list: CdkDropList) {
    const isLocked = list.getSortedItems()?.[index]?.data?.isLocked;
    return !isLocked;
  }

  public getOtherLanes(lanes: laneType[], currentId: number): any[] {
    return lanes.filter( l => (l?.id != currentId && !l?.isCollapsed)).map( l => 'lane' + l?.id);
  }

  public dropItem(event: CdkDragDrop<string[]>, _newLaneId: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    
    const _oldLaneId = event.item.data.laneId;
    const _mapPositionAndLaneId = (d: any, i: number, _l: number) => {
      return {...d, position: i, laneId: _l };
    }

    const _fromData = event.previousContainer.data.map((d, i) => _mapPositionAndLaneId(d, i, (_oldLaneId != _newLaneId ? _oldLaneId : _newLaneId)));
    let _toData = [];

    if(_oldLaneId != _newLaneId){
      _toData = (event.container.data || []).map( (d, i) => _mapPositionAndLaneId(d, i, _newLaneId));
      this.dataHolder[_newLaneId] = _toData;
    }
    
    const _fromToData = [..._fromData, ..._toData];
    this._subscription.add(this.laneDataApiService?.(_fromToData, "patch")?.subscribe({next: (lanes: any) => {console.log("successfully saved", lanes);}, error: (err: any) => {
        this._messageService.add({detail: err , severity: MESSAGE_SEVERITY.WARN});
      }
    }));
  }

  /* private _addEdit(insertWhere?: 'L' | 'R'){
    this.ref = this.dialogService.open(AddComponent, {
      data: {
        item: this.activeLaneMenu,
        fields: this._boardLaneFields,
        api: this.laneApiService,
        //excludedFields: ['position'],
        lockedFields: ['id', 'position'],
        editMode: true
        },
        header: `Edit Board`,
        width: '50vw'
      });

    this._subscription.add(this.ref?.onClose.subscribe(result => {
      if ((<ConfirmDialogResult>result)?.isConfirmed) {
        this._messageService.add({detail: `Successfully ${result?.isDeleted? 'deleted' : 'saved.'}` , severity: MESSAGE_SEVERITY.SUCCESS});
        //this._crm.refreshPage();
      }
    }));
  } */

  public addEditBoard(isAdd = false, insertWhere?: 'left' | 'right'){
    let item: any = {position: (insertWhere ? (insertWhere == 'left' ? this.activeLaneMenu?.position : ((this.activeLaneMenu?.position || 0) + 1) ) : (this.lanes?.length || 0))};

    if(!isAdd){
      item = this.activeLaneMenu;
    }

    /* this.ref = this._dialogService.open(AddComponent, {
      data: {
        editMode: !isAdd,
        item,
        fields: this._boardLaneFields,
        api: (p: any, m: apiMethod) => {
          if(!isAdd){
            //m = 'patch';
          } else if(insertWhere){
            p.insert = true;
          }
          return this.laneApiService?.(p, m)
        },
        lockedFields: ['position'],
        excludedFields: ['id'],
      },
      header: isAdd ? `Add New Board ${insertWhere ? '(Insert '+ insertWhere + ')' : ''}` : 'Edit Board',
      width: '50vw'
    });
    this._subscription.add(this.ref?.onClose.subscribe(result => {
      if ((<ConfirmDialogResult>result)?.isConfirmed) {
        this._core.refreshPage();
        //this.activeLaneMenu = {...this.activeLaneMenu, ...result?.rawData}
        
        setTimeout(() => {
          this._messageService.add({detail: 'Successfully saved.' , severity: MESSAGE_SEVERITY.SUCCESS});
        });
      }
    })); */
  }

  public addNew(lane: laneType) {
    if(lane?.id){
      this.dataHolder[lane?.id] = [{laneId: lane.id, name: 'New', position: 0}].concat((this.dataHolder[lane.id] || []).map((l, i) => ({...l, position: (i + 1)})))
    }
  }

  public dropHorizontal(event: CdkDragDrop<string[]>, lanes: any[]) {
    moveItemInArray(lanes, event.previousIndex, event.currentIndex);
    setTimeout(() => {
      const _toNext = lanes.map((l, i) => ({...l, position: i}));
      this.laneApiService?.(_toNext, "patch")?.subscribe({next: (lanes) => {console.log("successfully saved", lanes)}, error: (err) => {
          this._messageService.add({detail: err , severity: MESSAGE_SEVERITY.WARN});
        }
      });
    });
  }

  public onPopupShow(lData: laneType, index: number) {
    this.activeLaneMenu= {...lData, position: index};
  }

  public editItem($event: MouseEvent, item: laneItem, index: number) {
    $event.stopImmediatePropagation();
    $event.stopPropagation();
    $event.preventDefault();

    /* this.ref = this._dialogService.open(AddComponent, {
      data: {
        item: {...item, position: index},
        fields: this._boardDataFields,
        api: this.laneDataApiService,
        editMode: (item?.id > 0),
        lockedFields: ['id', 'laneId', 'position'],
        //excludedFields: [],
      },
      header: `Edit ${item?.name}`,
      width: '50vw'
    });
    this._subscription.add(this.ref?.onClose.subscribe(result => {
      if ((<ConfirmDialogResult>result)?.isConfirmed) {
        this._messageService.add({detail: 'Successfully saved.' , severity: MESSAGE_SEVERITY.SUCCESS});
        //TODO: refresh?
      }
    })); */
  }

  public collapseExpand(_lane: laneType, _lanes: laneType[]){
    _lane.isCollapsed = !_lane?.isCollapsed;
    this.laneApiService?.(_lane, "patch")?.subscribe({next: (lanes) => {console.log("successfully updated", lanes)}, error: (err) => {
        this._messageService.add({detail: err , severity: MESSAGE_SEVERITY.WARN});
      }
    });
  }

  /* public onFilter(filterBy: MenuItem){
    const _toFilter = filterBy?.state || {[ filterBy?.id || 'filter' ]: filterBy?.label}; */
  public onFilter(filterBy: any, whichFilter?: 'lane' | 'fields'){
    //const _toFilter = filterBy?.state || {[ filterBy?.id || 'filter' ]: filterBy?.label};
    this._initSources(filterBy, whichFilter);
  }

  /* public ngOnChanges(changes: SimpleChanges): void { 
    if(!changes['searchQuery']?.firstChange && changes['searchQuery']?.currentValue != changes['searchQuery']?.previousValue){
      this._initSources({query: changes['searchQuery']?.currentValue});
    }
  } */

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
