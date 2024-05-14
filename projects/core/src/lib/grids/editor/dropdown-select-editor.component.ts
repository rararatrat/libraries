import { AfterViewInit,Component,ViewChild,ViewContainerRef, OnDestroy } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
/* import { HeaderMenu } from "../../header-menu/header-menu.interface";
import { HeaderMenuComponent } from "../../header-menu/header-menu.component"; */
import { Subscription } from "rxjs";

@Component({
    selector: "dropdown-select-editor",
    template: `<div #container class="dropdown-container"><span class="p-5 p-l-10 m-5" [innerHTML]="getSource()"></span>
            <!-- <eagna-header-menu #hMenu [menuList]="[headerMenu]" [gridParams]="params"></eagna-header-menu> -->
        </div>`,
    styles: [`
        .flex-column{
            display: flex;
            flex-direction: column;
        }
      `],
})
export class DropdownSelectEditorComponent implements ICellEditorAngularComp, AfterViewInit, OnDestroy {
    public params: any;
    /* public headerMenu: HeaderMenu; */
    public source: any;
    private _subs = new Subscription()

    @ViewChild("container", { read: ViewContainerRef }) public container: ViewContainerRef | undefined;
    /* @ViewChild("hMenu") hMenu: HeaderMenuComponent; */

    constructor() {
        /* this.headerMenu = {
            isForGridEditable: true,
            isMulti: true, id: "someEditables",
            xPosition: "after",
            yPosition: "above",
            searchPlaceHolder: "Source",
            text: () => this.getValue(),
            selectCallback: (p, extra?) => { this.onClick(p); },
        }  */
    }

    public getSource(){
        if(typeof this.source != "object"){
            return this.source;
        } else{
            if(this.params.colDef && this.params.colDef.valueGetter && typeof this.params.colDef.valueGetter == "function"){
                return this.params.colDef.valueGetter(this.params)
            } else if(this.params.colDef && this.params.colDef.cellRenderer && typeof this.params.colDef.cellRenderer == "function"){
                return this.params.colDef.cellRenderer(this.params);
            }
        }
        return '';
    }
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    public ngAfterViewInit() {
        setTimeout(()=>{
            /* if(this.hMenu && this.hMenu.allTriggers[0]){
                this.hMenu.allTriggers[0].openMenu();
                this._subs.add(this.hMenu.allTriggers[0].menuClosed.subscribe(() => {
                        this.params.api.stopEditing();
                }));
            } */
        });
    }
    
    public agInit(params: any): void {
        this.params = {isFromDropDownEditor: true, ...params};
        this.source = this.params.value;
        
        if(this.params){
            if(this.params.hMenu){
                /* this.headerMenu = {...this.headerMenu, ...this.params.hMenu}; */
            } else{
                if(this.params.useChildren){
                } else if(this.params.optionsAsyncParams){
                    /* this.headerMenu.optionsAsyncParams = this.params.optionsAsyncParams;
                    if(this.params.value){
                        this.headerMenu.triggerInitialSearch = this.source;
                        this.headerMenu.search = this.source;
                    } */
                } else {
                    /* this.headerMenu.options = this.params.values; */
                }

                if(this.params.dontUseSearch){
                    /* delete this.headerMenu.searchPlaceHolder; */
                } else if(this.params.searchPlaceHolder){
                    /* this.headerMenu.searchPlaceHolder = this.params.searchPlaceHolder; */
                }
            }
        }
        
    }

    public getValue(): any {
        return this.source;
    }

    public isPopup(): boolean {
        return false;
    }

    public onClick(src: string) {
        if(!this.params.onSelect){
            this.source = src;
        } else{
            const onSelectVal = this.params.onSelect(src);
            if(onSelectVal && onSelectVal.srcChanged){
                this.source = onSelectVal.newVal;
            }            
        }
        this.params.api.stopEditing();
    }

    public onKeyDown(event: any): void {}

    ngOnDestroy(){
        this._subs.unsubscribe();
    }
}
