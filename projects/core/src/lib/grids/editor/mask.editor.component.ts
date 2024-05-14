import { AfterViewInit,Component,ViewChild,ViewContainerRef, ElementRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
    selector: "mask-editor",
    template: `<input  #textInput class="p-0 p-l-4 m-0 fill-height full-width" [(ngModel)]="value" type="text"/> <!-- [textMask]="input_mask" -->`,
    styles: [
        `
        .flex-column{
            display: flex;
            flex-direction: column;
        }
      `,
    ],
})
export class MaskEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    public params       : {input_mask: any, value:any, enforce_length?:boolean} | undefined;
    public value        : any;
    @ViewChild("container", { read: ViewContainerRef }) public container: ViewContainerRef | undefined;
    @ViewChild("textInput") textInput: ElementRef | undefined;

    constructor() {}

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    public ngAfterViewInit() {
        setTimeout(()=>{
            if (this.textInput) {
                this.textInput.nativeElement.focus();
            }
        });
    }

    public agInit(params: any): void {
        this.params            = params;
        /* this.input_mask        = this.params?.input_mask; */
        this.value             = this.params?.value;
    }
    isCancelAfterEnd() {
       // our editor will reject any value greater than 1000
        if(this.params?.enforce_length == false){
            return this.value == null;
        }else{
            /* RT TODO: return this.value == null || this.value != null && this.value.length != ((this.input_mask.mask) as any[]).length; */
            return false;
        }
   }


    public getValue(): any {
        return this.value;
    }

    public isPopup(): boolean {
        return false;
    }

    // public onClick(val: string) {
    //     this.value = val;
    //     this.params.api.stopEditing();
    // }

    public onKeyDown(event: any): void {
        /* let key = event.which || event.keyCode;
        if (
          key == 37 || // left
          key == 39
        ) {
          // right
          this.toggleMood(); */
        /* event.stopPropagation(); */
        /* } */
    }
}
