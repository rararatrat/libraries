import { Component, ViewChild, AfterViewInit, ElementRef, OnDestroy } from "@angular/core";
import { IToolPanel, IToolPanelParams } from 'ag-grid-community';
import { fromEvent, Subscription, Subject } from "rxjs";
import { filter, debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { CoreService } from "../../core.service";
import { HelperService } from "../../helper.service";
import { ConfirmationService, ConfirmEventType, Message, MessageService } from "primeng/api";
import { SharedService } from "../../shared.service";
import { UserPreferences } from "../../core.interface";
import { TitleCasePipe } from "@angular/common";

@Component({
    selector: "custom-tools",
    templateUrl: "./custom-tools-panel.html",
    styles: [
        `:host{
            width: 100% !important;
        }
        .savedButtons{
            width: 100px !important;
        }
        .pButton, mat-button-wrapper{
            width: 24px; height: 24px; line-height: 24px
        }
        .columnDefs{
            padding: 10px;
            font-weight: 300;
        }
        `,
    ]
})
export class CustomToolsPanel implements IToolPanel, AfterViewInit, OnDestroy {
    params: any;

    @ViewChild("searchInput",{static:false}) searchInput: ElementRef | undefined;
    private _subscription = new Subscription();

    searchQuery: any;
    formGroup: UntypedFormGroup | undefined/*  = new FormGroup({}) */;
    colDefControls: any[] = [];
    isReset: any;
    controlsOrigState: any = {};

    public profileCtrl = new UntypedFormControl('');
    public selectedValue: any;
    public profiles: any[] = [];
    public newProfileTitle = '';
    public saveAs = false;
    public enableAnalysisToolPanel = false;

    constructor(private _helper: HelperService,
        private _fb: UntypedFormBuilder,
        private _confirmationService: ConfirmationService,
        private _sharedService: SharedService,
        private _messageService: MessageService,
        private _titleCase: TitleCasePipe
        ) {}

    public savedTheme: any;
    private _old_savedTheme: any;
    public isUserGlobalGridPrefEnabled = this._sharedService.appConfig.user?.globalGridPref == true;

    agInit(params: IToolPanelParams): void {
        if(this.savedTheme){
            this._old_savedTheme = Object.assign({}, this.savedTheme);
        }
        this.params = params;
        this.savedTheme = {value: this.params.agTheme, label: this._titleCase.transform(this.params.agTheme)};
        if(this.params.columnDefsControls){ //this is always false, unless otherwise not provided intentionally
            const controls: any = {
                'excelMode':new UntypedFormControl(false),
                'gridFont':new UntypedFormControl(false)
            };
            for (const controlKey in this.params.columnDefsControls) {
                const controlObject = Object.assign({}, this.params.columnDefsControls[controlKey]);
                if (this.params.columnDefsControls.hasOwnProperty(controlKey)) {
                    controls[controlKey] = new UntypedFormControl(controlObject.value, [Validators.required]);
                    this.colDefControls.push(controlKey); //no use for now
                    this.controlsOrigState[controlKey] = controlObject.value;
                }
            }
            /* this.controlsOrigState = Object.assign(controls); */
            this.formGroup = this._fb.group(controls);

            for (const controlKey in this.params.columnDefsControls) {
                this.formGroup.get(controlKey)?.valueChanges.subscribe(value => {
                    if(!this.isReset){
                        this.optionsChanges(value, {field: controlKey, type:  this.params.columnDefsControls[controlKey].type});
                    } else{
                        this.isReset = false;
                    }
                });
            }
        }

        if(this.params.loadedProfile){
            const profileToReload = Object.assign({}, this.params.loadedProfile);
            this.profileCtrl.setValue(profileToReload, {emitEvent: false});
            this.selectedValue = profileToReload;
            this.newProfileTitle = profileToReload!.title;
        }

        if(this.params.enableAnalysisToolPanel){
            this.enableAnalysisToolPanel = this.params.enableAnalysisToolPanel;
        }

        this.searchQuery = this.params.searchQuery;
    }

    /* BEGIN PROFILE */
    isDisabled = false;

    ngDoCheck(){
        if(this._old_savedTheme && this.savedTheme && this._old_savedTheme.value != this.savedTheme.value){
            this.params.toolPanelEvents.saveTheme?.(this.savedTheme?.value);
            this._old_savedTheme = Object.assign({}, this.savedTheme);
        } else if(!this._old_savedTheme && this.savedTheme){
            this._old_savedTheme = Object.assign({}, this.savedTheme);
        }
    }

    onSelectionChange(src: any){
        this.newProfileTitle = src!.value!.title;
        if(this.newProfileTitle && this.params.toolPanelEvents.loadGridProfile){
            this.params.toolPanelEvents.loadGridProfile({[this.newProfileTitle] :src!.value});
        }
    }

    cancelSave(){
        this.saveAs = false;
        this.selectedValue = null;
        this.profileCtrl.setValue(null, {emitEvent: false});
    }

    deleteProfile(){
        const justDelete = () => {
            const deleteChart$ = this.params.toolPanelEvents.deleteChart(this.selectedValue!.id);
            if(deleteChart$){
                const subRef = deleteChart$.subscribe((res: any) => {
                    if(res){
                        /* this._coreService.notification("Profile " + this.selectedValue!.title + " successfully deleted."); */
                        this._messageService.add({detail: `Profile ${this.selectedValue!.title} successfully deleted.`, severity: "success"});
                        this.cancelSave();
                        this.params.toolPanelEvents.getColsAndChartState();
                    }
                }, (err: any) => {}, ()=> {
                    subRef.unsubscribe();
                });
            }
        }
        
    }

    private _isProfileExists(): boolean{
        if(this.newProfileTitle){
            return this.profiles.find((p: any) => p.title == this.newProfileTitle) != null;
        }
        return false;
    }

    private _subsGridProfileList(){
        this.profiles = [];
        const ch$ = this.params.colsAndChartState$;
        if(ch$){
            this._subscription.add(ch$.subscribe((colsAndChartState: any) => {
                if(this._helper.isNotEmpty(colsAndChartState)){
                    this.profiles = this._helper.arraySortBy({arr: Object.keys(colsAndChartState)
                        .filter((k: any) => colsAndChartState[k] && colsAndChartState[k].save_as == "profile")
                        .map((k: any) => ({...colsAndChartState[k], title: k})), byId: "title"});
                }
            }));
        }
    }

    applyChanges(name: string){
        const justSave = (override?: boolean) => {
            const saveChart$ = this.params.toolPanelEvents.saveChart(name, (override ? this.selectedValue!.id : null), false, true);
            if(saveChart$){
                const subRef = saveChart$.subscribe((res: any) => {
                    if(res){
                        this.params.toolPanelEvents.getColsAndChartState();
                    }
                }, (err: any) => {}, ()=> {
                    if(subRef){
                        subRef.unsubscribe();
                    }
                });
            }
        }

        if((!this.selectedValue || this.saveAs) && this._isProfileExists()){ //always check when title is changed
            /* this._coreService.notification("Profile exists.", "warn"); */
            this._messageService.add({detail: "Profile exists.", severity: "warn"})
        } else{
            if(this.saveAs){
                justSave();
            } else if(this.selectedValue){ 
            }
        }
    }
    /* END PROFILE*/

    optionsChanges(value: any, whichField: {field: string, type?: string}){
        if(this.params.api && this.params.columnApi){
            this._messageService.clear();
            this._confirmationService.confirm({
                message: 'Are you sure you want to apply this new Grid Column Definition?\nThis will reset the Grid.',
                header: 'Confirm Changes',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
                },
                reject: (type: ConfirmEventType) => {
                    switch(type) {
                        case ConfirmEventType.REJECT:
                            this._messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
                        break;
                        case ConfirmEventType.CANCEL:
                            this._messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
                        break;
                    }
                }
            });
    
        }
    }

    /* saveTheme(){
        this.params.toolPanelEvents.saveTheme?.(this.savedTheme?.value);
    } */

    updateTotals(): void {}

    applyExcelModeChanges(value: any, whichField: any){
    }
    
    refresh(): void {}

    saveColumns() {
        this.params.toolPanelEvents.saveColumns();
    }

    toggleFontMonospace(){
        this.params.toolPanelEvents.toggleFontMonospace();

    }
    saveFilters() {
        this.params.toolPanelEvents.saveFilters();
    }

    clearColumns() {
        this.params.toolPanelEvents.clearColumns();
    }

    clearFilters() {
        this.params.toolPanelEvents.clearFilters();
    }

    maximize(e: any) {
        this.params.toolPanelEvents.resize();
    }

    moreOptions(e: any) { }

    ngAfterViewInit() {
        if (this.searchInput) {
            this._subscription.add(
                fromEvent(this.searchInput.nativeElement, "keyup")
                .pipe(
                    filter(Boolean),
                    debounceTime(1000),
                    tap(() => {
                        this.searchQuery.value = this.searchInput?.nativeElement.value.trim();
                        this.params.toolPanelEvents.requery({ searchQuery: this.searchQuery });
                    })
                )
                .subscribe());
        }
        this._subsGridProfileList();
    }

    toggleGridAnalytics(){
        this.params.enableAnalysisToolPanel = !this.params.enableAnalysisToolPanel;
        this.params.toolPanelEvents.toggleGridAnalytics(this.params.enableAnalysisToolPanel);
    } 

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
