import { Component, OnInit, Input } from '@angular/core';
import { CoreService } from '../../core.service';
import { Location } from '@angular/common';


@Component({
  selector: 'eag-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  constructor(private location: Location, 
    private _coreService: CoreService) { }

  gotoPrev() {
    this.location.back();
  }

  @Input() errorMessage   : any;
  public error            : any;

  ngOnInit(): void {
    const err = this.errorMessage;
    this.error = this._coreService.fetchErrorCodes?.[err?.status];

  }

}
