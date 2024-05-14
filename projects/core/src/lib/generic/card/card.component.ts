import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TASK_STATUS, TASK_TYPE } from '../../core.interface';

@Component({
  selector: 'eag-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  /* @Input()
  laneData: any;

  @Input()
  cardData: any;

  @Input()
  laneIndex!: number; //TODO remove

  @Input()
  activeLaneMenu: any;
  
  @Input()
  laneMenu: MenuItem[] = []
  
  @Input()
  connectedLanes: string|CdkDropList<any>|(string|CdkDropList<any>)[] = [];

  @Output()
  popShow = new EventEmitter<{data: any}>();
  
  @Output()
  addNew = new EventEmitter<{data: any}>();

  @Output()
  dropItem = new EventEmitter<{data: CdkDragDrop<any,any,any>}>();
  
  onPopupShow(data: any) {
    this.popShow.emit({data});
  }

  onAddNew(data: any) {
    this.addNew.emit({data});
  }

  onDropItem($event: CdkDragDrop<any,any,any>) {
    this.dropItem.emit ({data: $event})
  } */

  constructor(private _confirmationService: ConfirmationService,
    @Optional() public ref?: DynamicDialogRef,
    @Optional() private _config?: DynamicDialogConfig) {
      if(this._config?.data){
        this.view = this._config.data?.view;
      }
    }

  public PI = PrimeIcons;

  @Input()
  view?: 'default' | 'edit' = 'default';

  @Input()
  item: any;

  @Output()
  editItem = new EventEmitter<{mouseEvent: MouseEvent}>();  

  public status = TASK_STATUS;
  public taskType = TASK_TYPE;

  ngOnInit(): void {
  }
}
