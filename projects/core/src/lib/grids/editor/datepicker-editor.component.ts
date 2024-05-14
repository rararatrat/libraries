import { AfterViewInit, Component, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { ICellEditorAngularComp, IDateAngularComp } from "ag-grid-angular";
import { Calendar, LocaleSettings } from "primeng/calendar";
import { FormatWidth, getLocalePluralCase, LowerCasePipe } from "@angular/common";
import { CoreService } from "../../core.service";
import { SharedService } from "../../shared.service";

@Component({
    selector: "date-editor-cell",
    template: `<div #agPCalHolder class="p-field p-col-12 p-md-4 inside-grid ag-input-wrapper" role="presentation">
        <!-- {{newDateFormat}} -->
        <p-calendar #agPCal
            [dateFormat]="newDateFormat"
            [(ngModel)]="calendarModel"
            [showIcon]="fromFilter"
            [inputStyleClass]="'inside-grid ag-input-field-input ag-text-field-input'"
            [inputId]="'agPCalInput'"
            [inputStyle]="inputStyle"
            [placeholder]="placeholder || localeFormatDefault"
            [ariaLabelledBy]="inputArialLabel"    
            (onSelect)="onSelect($event)"></p-calendar>
    </div>`,
    styles: [``],
    encapsulation: ViewEncapsulation.None
})
export class DatePickerEditorComponent implements ICellEditorAngularComp, IDateAngularComp, AfterViewInit {
    private _changesApplied = false;
    private _currentValue: any;

    public inputStyle = { height: '100%', width: '100%', 'border-radius': '0px' };
    public inputArialLabel = '';
    public placeholder = '';

    constructor(
        private _sharedService: SharedService,
        private _lowecase: LowerCasePipe,
        private _coreService: CoreService
        ) {}
    
    @ViewChild("agPCalInput", { read: ViewContainerRef }) public agPCalInput: ViewContainerRef | undefined;
    @ViewChild("agPCal") public agPCal: Calendar | undefined;

    public params           : any;
    public src              : any;
    public calendarModel    : any;
    public dateToday        = new Date();
    /* public textMask         : any = this._helper.dateMask(true); */

    private _localeFormat = this._coreService.getLocaleFormat(FormatWidth.Short);
    //public localeSettings   : LocaleSettings = {dateFormat: this._dateFormat};
    //public newDateFormat    = this._localeFormat._locale != "en" ? this._lowecase.transform(this._localeFormat._dateFormat) : "dd/mm/yy";
    public newDateFormat    = this._lowecase.transform(this._localeFormat._dateFormat).replace("yyyy", "yy");
    public localeFormatDefault = this._lowecase.transform(this._coreService.getLocaleFormat()._dateFormat);
    public fromFilter = false;

    isDebug = this._sharedService.appConfig.env?.main.isDebug == true;

    public agInit(params: any): void {
        if(params.hasOwnProperty('filterParams')){
            this.fromFilter = true;
        }
        this.params = params;
        this.src = this.params.value;
        if (this.src) {
            this.calendarModel = this.src;

            if(typeof this.src === "string"){
                let _newDate;
                try{
                    _newDate = new Date(this.src);
                } catch(e){
                    try{
                        const default_date = this.src.split("/");
                        _newDate = new Date(((default_date[2] as any) * 1), ((default_date[1] as any) * 1) - 1, (default_date[0] as any * 1));
                    } catch(e){
                        console.warn("new Date error", e);
                    }
                }
                if(_newDate){
                    this.calendarModel = _newDate;
                }
            }
        }
        if(this.params.eGridCell && this.params.eGridCell.clientHeight && this.params.eGridCell.clientWidth){
            this.inputStyle.height = this.params.eGridCell.clientHeight + 'px';
            this.inputStyle.width = this.params.eGridCell.clientWidth + 'px';
        }

        if(!this.fromFilter){
            setTimeout(() => {
                this.agPCal?.toggle();
            }, 1);
        }
    }

    public getGui() {}

    public afterGuiAttached() {}

    public getValue(): any {
        return this.src;
    }

    public isCancelAfterEnd(): boolean {
        return false;
    }

    public isCancelBeforeStart(): boolean {
        return false;
    }

    public isPopup(): boolean {
        return !this.fromFilter;
    }

    onSelect(p: any){
        this._applyChanges(p);
    }
    
    /* public dateChangeEvent(src: any) {
        this._applyChanges(src.value);
    }

    public dateInputEvent(src: any){
        setTimeout(() => {
            this._currentValue = src.value;
            this._applyChanges(src.value);
        }, 100);
    } */

    private _applyChanges(newVal: any){
        if(!this._changesApplied){
            this.src = newVal;
            this._changesApplied = true;
            this.params.api.stopEditing();
        }        
    }

    public ngAfterViewInit() {}

    //for filter
    getDate(): Date | null {
        return this.calendarModel;
    }
    setDate(date: Date | null): void {
        this.calendarModel = date;
    }
    /* setDisabled?(disabled: boolean): void {} */
    setInputPlaceholder?(placeholder: string): void {
        this.placeholder = placeholder;
    }
    setInputAriaLabel?(inputArialLabel: string): void {
        this.inputArialLabel = inputArialLabel;
    }
}