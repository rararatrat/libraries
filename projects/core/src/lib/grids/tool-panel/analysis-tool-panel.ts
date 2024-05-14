import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from "@angular/core";
import { IToolPanel, IToolPanelParams } from 'ag-grid-community';
import { Subscription } from "rxjs";
import { HelperService } from "../../helper.service";
import { CoreService } from "../../core.service";
import { MessageService } from "primeng/api";

@Component({ 
    selector: "analysis-tool-panel",
    templateUrl: "./analysis-tool-panel.html",
    styles: [
        `:host{
            width: 100% !important;
        }
        .savedButtons{
            width: 100px !important;
        }
        /* .menuHeader{ */
            .pButton, mat-button-wrapper{
                width: 24px; height: 24px; line-height: 24px
            }
        /* } */

        .columnDefs{
            padding: 10px;
            font-weight: 300;
        }
        ul{
            padding-left:24px;
            font-weight:bold;
        }
        ul li{
            margin-top:2px;
            margin-bottom:2px;
        }
        ul li:hover{
            text-decoration:underline !important;
        }
        `,
    ],
})
export class AnalysisToolPanel implements IToolPanel, AfterViewInit, OnDestroy {
    public params: any;
    public newTitle: string | undefined;
    public isPivotMode = false;
    public chartObj: any = {isLoading: false};
    public chartList: any[] = [];
    public currentId: number | undefined;
    public publish: boolean | undefined;
    private _origTitle: string | undefined;
    private _origId: number | undefined;
    public isDisabled = false;
    public last_update: any;

    private _subscription = new Subscription();
    @ViewChild("newChartTitle") newChartTitle: ElementRef | undefined;
    
    constructor(
        private _helper: HelperService,
        private _coreService: CoreService,
        private _messageService: MessageService
        ) {
            this._messageService.messageObserver.subscribe((a) => {});
        }

    agInit(params: IToolPanelParams): void {
        this.params = params;
        this.isPivotMode = true; //this._sharedService.globalVars.analysisMode == true;

        if(this.params.cacheLastUpdate$){
            this._subscription.add(this.params.cacheLastUpdate$.subscribe((cl: any) => {
                this.last_update = cl;
            }));
        }        
    }

    refresh(): void {
        throw new Error("Method not implemented.");
    }

    toggleAnalysisMode(reset = false){
        if(!reset){
            this.isPivotMode = !this.isPivotMode;
        } else{
            this.isPivotMode = true;
        }        
        this.params.toolPanelEvents.toggleAnalysisMode(this.isPivotMode, reset);
    }

    cancelSave(){
        this.newTitle = '';
        this.currentId = undefined;
        this.publish = false;
        this.isDisabled = false;
    }

    deleteChart(){ 
        const justDelete = () => {
            const deleteChart$ = this.params.toolPanelEvents.deleteChart(this.currentId);
            if(deleteChart$){
                const subRef = deleteChart$.subscribe((res: any) => {
                    if(res){
                        //this._helper.notification("Chart successfully deleted.");
                        this._messageService.add({detail: "Chart successfully deleted.", severity: "success"});
                        this.chartObj.isLoading = true;
                        this.params.toolPanelEvents.getColsAndChartState();
                        this.newTitle = '';
                        this.currentId = undefined;
                    }
                }, (err: any) => {}, ()=> {
                    subRef.unsubscribe();
                });
            }
        }

        /* this._coreService.confirmDialog({dialogData: new ConfirmDialogModel("Confirm delete chart.", {message: `Are you sure you want to delete the current chart?`}),
            config: {panelClass: "w-40-v"},
            doCallback: () => {
                justDelete();
            },
            neverAskAgain: "deleteChart"
        }); */
        /*
        RT eagna TODO
        this._messageService.clear();
        this._messageService.add({key: 'c', sticky: true, severity: 'info', summary:'Confirm delete chart', detail:'Are you sure you want to delete the current chart?'}); */
    }

    saveChart(name: any){
        const justSave = (override?: boolean | undefined) => {
            const saveChart$ = this.params.toolPanelEvents.saveChart(name, (override ? this.currentId : null), this.publish);
            if(saveChart$){
                const subRef = saveChart$.subscribe((id: number) => {
                    if(id){
                        //this._subsChartList();
                        //clear for new creation
                        //this.newTitle = '';
                        //this.currentId = null;
                        //if(res!.data!.id){
                        this.currentId = id;
                        //}
                        
                        this.chartObj.isLoading = true;
                        this.params.toolPanelEvents.getColsAndChartState();
                    }
                }, (err: any) => {}, ()=> {
                    if(subRef){
                        subRef.unsubscribe(); 
                    }
                });
            }
        }

        if(name){
            if(this.currentId || this.chartList.find(chart => chart.title == name)){
                /* this._coreService.confirmDialog({dialogData: new ConfirmDialogModel("Confirm override chart.", {message: `Are you sure you want to update the current chart?`}),
                config: {panelClass: "w-40-v"},
                doCallback: () => {
                    justSave(true);
                },
                neverAskAgain: "analysis"
                }); */
                /*RT eagna TODO: this._messageService.clear();
                this._messageService.add({key: 'c', sticky: true, severity: 'info', summary:'Confirm override chart.', detail:'Are you sure you want to update the current chart?'}); */
            } else{
                justSave();
            }
        }
    }

    onTitleChange(newTitle?: any){
        if(this._origTitle == this.newTitle){
            this.isDisabled = true;
            this.currentId = this._origId;
            /* this._coreService.notification("Chart name already exists.", "danger"); */
            this._messageService.add({detail: "Chart name already exists.", severity: "error"});
        } 
    }

    loadChart(chart: any){
        if(chart){
            const name = chart.title;
            const id = chart.id || null;
            const isGlobal = chart.isGlobal == true;

            if(this.isPivotMode){
                this._origTitle = name;
                this._origId = id;

                this.newTitle = name;
                this.currentId = id;

                this.publish = isGlobal;
                
                this.params.toolPanelEvents.restoreChart(name);
            }
        }
    }
    
    ngAfterViewInit() {
        this._subsChartList();
        setTimeout(()=>{
            this.newChartTitle?.nativeElement.focus();
        });        
    }

    private _subsChartList(){
        this.chartList = []
        const ch$ = this.params.colsAndChartState$;
        if(ch$){
            this._subscription.add(ch$.subscribe((colsAndChartState: { [x: string]: any; }) => {
                this.chartObj.isLoading = false;
                if(this._helper.isNotEmpty(colsAndChartState)){
                    this.chartList = this._helper.arraySortBy({arr: Object.keys(colsAndChartState)
                        .filter(k => colsAndChartState[k] && colsAndChartState[k].save_as == "chart")
                        .map(k => ({...colsAndChartState[k], title: k})), byId: "title"});
                }
            }));
        }
    }

    ngOnDestroy() {
        
    }
}
