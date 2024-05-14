import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SideBarService} from '../navigation-api';
import { MenuItem } from 'primeng/api';
import { SubSink } from 'subsink2';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Router } from '@angular/router';
import { HelperService } from '../../helper.service';
import { sideBarMode } from './sidebar.interface';


@Component({
  selector: 'eag-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy{

  constructor(private _sb: SideBarService, private _router:Router, private _help: HelperService){}

  public items      : MenuItem[] = [];
  public isVisible  : boolean | undefined = true;
  public mode       : sideBarMode | undefined = "compact";
  public loaderId   !: string | undefined;
  public isList     : boolean = false;
  public isCompact  : boolean = false;
  public isThin     : boolean = false;
  public isExpanded : boolean = false;
  public origMode   : sideBarMode | undefined;
  private _subs     : SubSink = new SubSink();
  public selectedData : any = [];
  public selectedIdx  !: number;

  /* @ViewChild('tieredMenu') tieredMenu !: TieredMenu; */
  @ViewChild('op') overlaypanel !: OverlayPanel;

  ngOnInit(): void {

    this._subs.sink = this._sb.sidebar$.subscribe(res => {
      this.items = res.items.map(e => {
        e['expanded'] = false;
        return e;
      });

      this.isVisible  = res.isVisible;
      this.mode       = res.mode;
      this.origMode   = res.mode;
      this.loaderId   = res.sidebarLoaderId
      this.isList     = (res.mode == 'list') ? true : false;
      this.isCompact  = (res.mode == 'compact') ? true : false;
      this.isThin     = (res.mode == 'thin') ? true : false;
      this.isExpanded = (res.mode == 'list') ? true : false;

    })
  }



  trackByFn(index:number, item:any) {
    return item.id; // unique id corresponding to the item
  }

  public isParentRoute(parent_route:any){
    if(parent_route.hasOwnProperty('routerLink') && parent_route.routerLink != null){
      return (this._router.url.includes(parent_route?.routerLink[0]))
    }else{
      return false;
    }
  }

  public showmenu(event:any, data:any){
    this.selectedData = data.data;
    this.selectedIdx = data.index;
    if(!data?.data.disabled){
      if(this.overlaypanel?.overlayVisible){
        this.overlaypanel?.show(event)
      }else{
        this.overlaypanel?.show(event)
      }
    }
  }


  public expand(){

    let _temp = this._sb.sidebar$.value;
    if(this.origMode){
      if(this.origMode == 'list'){
        this.isExpanded = !this.isExpanded;
        this.mode     = (this.isExpanded) ? 'list' : 'compact';
        this.isList   = (this.isExpanded) ? true : false;
        _temp['mode'] = this.mode;
      }else{
        this.isExpanded = !this.isExpanded;
        this.mode     = (this.isExpanded) ? 'list' : this.origMode;
        this.isList   = (this.isExpanded) ? true : false;
        _temp['mode'] = this.mode;
      }
      /* if(this.overlaypanel?.overlayVisible){
        this.overlaypanel?.hide();
      } */
      this._sb.sidebar$.next(_temp);
    }




  }

  public itemToggle(item:any, isOverlay:boolean=false){

    const _data = item.data;
    const _idx = item.index;

    if(_data.hasOwnProperty('items') && _data.items != null && _data.items.length > 0){
      if(!isOverlay){
        this.items[item.index].expanded = !item.data.expanded;
      }else{
        item.data.expanded = true;
      }
    }else{
      this.overlaypanel?.hide();
      this._help.gotoPage({pageName:_data.routerLink, extraParams:{}})

    }



  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }


}
