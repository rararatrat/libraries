import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'eag-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {


  @Input() enabled?             : boolean = false;
  @Input() type?                : string  = "standard" || "splash";
  @Input() message?             : string  = "Loading";
  @Input() image?               : any     = null;
  @Input() style?               : string  = "height: 7em; width: 9em;";

  private _isEnabled            : boolean = false;
  isLoading = false;
  isLoading2 = false;
  public constructor(){
    this.enabled = false;
  }

  public isEnabled(): boolean {
    return Boolean(this.enabled);
  }

  toggle() {
    this.isLoading = !this.isLoading;
  }

  toggle2() {
    this.isLoading2 = !this.isLoading2;
  }
}
