import { Component, OnInit } from "@angular/core";
import { AgCellMenuItems, CellCustomActions } from "../grid.interface";
import { getElementValue } from "../../core.interface";
import { MenuItem } from "primeng/api";
import { HelperService } from "../../helper.service";

@Component({
    selector    : "app-cell-custom",
    templateUrl : "./cell-custom.component.html",
    styleUrls   : ["./cell-custom.component.scss"]
})
export class CellCustomComponent implements OnInit {
    public params               : any;
    public cellCustomActions    : CellCustomActions[] = [];
    public checkboxValue: boolean | null = null;

    constructor(private _helper: HelperService) {}

    public getElementValue = getElementValue;

    public ngOnInit() { }

    public agInit(params: any) {
        this.params = params;

        if (this.params.actions != null) {
            this.cellCustomActions = this.params.actions;

            this.cellCustomActions.forEach((action)=>{

                if( action.buttonOptions != null){
                    action.buttonOptions.forEach((button: any)=>{
                        if (button.class == null){
                            button.class = "btn btn-border slim";
                        }
                    });
                }

                /* if(action.useButton == undefined){
                    action.useButton = true;
                } */
                /* if(action.mode == undefined){
                    action.mode = 'button';
                } */
                if(action.initParams){
                    action.initParams(this.params);
                }
                action.menuItems = this.getMenuItems(action.menuItems || []);
            });
        }
    }

    public isPopup(){
        return true;
    }

    getMenuItems(menuItems: AgCellMenuItems[], p?: any): MenuItem[]{
        const m = (mm: AgCellMenuItems[]) => {
            mm.forEach((mmm, i) => {
                if((mmm.items || []).length > 0){
                    m(mmm.items || []);
                } else{
                    const mCommand = Object.assign({}, mmm);
                    mm[i].command = (e?:any) => {
                        if(mCommand.clickCallback) {
                            mCommand.clickCallback(e, this.params);
                        }
                    };

                }
            });
        };
        m(menuItems);
        return menuItems;
    }

    public onSelect(e: any){}

    public buttonClick(e: UIEvent , mat: CellCustomActions, params?: any) {
        if(mat.isMulti){
            params?.toggle(e);
            e.preventDefault();
            e.stopPropagation();
        } else{
            if (mat.clickCallback) {
                mat.clickCallback(e, params);
            }
        }
    }

    public getBgStyle(mat: CellCustomActions) {
        if (mat.clickCallback) {
            mat.bgStyle = { ...mat.bgStyle, ...{ cursor: "pointer" } };
        }
        return mat.bgStyle;
    }
}

