import { AfterViewInit,Component,ViewChild,ViewContainerRef } from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
    selector: "dropdown-multiselect-editor",
    template: `<div #container>
        <span class="p-5 p-l-10 m-5">

        </span>
    </div>
    `,
    styles: [
        `
        .flex-column{
            display: flex;
            flex-direction: column;
        }
      `,
    ],
})
export class DropdownMultiSelectEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    public params   : any;
    public value    : any;
    public formControl : any;

    @ViewChild("container", { read: ViewContainerRef }) public container: ViewContainerRef | undefined;

    constructor() {
        this.formControl = new UntypedFormControl();
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    public ngAfterViewInit() {

    }

    public agInit(params: any): void {
        this.params             = {isFromDropDownEditor: true, ...params};
        this.value             = this.params.value;

    }

    public getValue(): any {
        return this.value;
    }

    public isPopup(): boolean {
        return false;
    }

    public onClick(src: string) {
        if(!this.params.onSelect){
            this.value = src;
        } else{
            const onSelectVal = this.params.onSelect(src);
            if(onSelectVal && onSelectVal.srcChanged){
                this.value = onSelectVal.newVal;
            }
        }
        this.params.api.stopEditing();
    }

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
