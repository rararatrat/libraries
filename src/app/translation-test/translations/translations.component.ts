import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Data, Params, NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { RouteObserverService } from '@eagna-io/core';
import { Core, CoreService } from 'projects/core/src/public-api';
import { Subscription, filter, pairwise, startWith } from 'rxjs';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent /* extends RouteObserverService */ implements OnInit {
  public subscription = new Subscription();
  loaded = {isLoaded: false};
  
  translateAccount!: string;
  creditNote!: string;
  creditNotes!: string;
  
  people?: {
    he: string,
    she: string,
    they: string,
  };

  translate_accounting_code = "<span [innerHTML]=\"'translations.accounting' | translate'\"></span>";
  translate_account_code = "this.translateAccount = Core.Localize('account');";
  translate_security_code = "<span [innerHTML]=\"'translations.security' | translate : {count: 1}\"></span>";
  translate_securities_code = "<span [innerHTML]=\"'translations.security' | translate : {count: 2}\"></span>";
  translate_credit_note = "Core.Localize('credit_note')";
  translate_credit_notes = "Core.Localize('credit_note', {count: 2})";
  translate_html_he_is = "<span [innerHTML]=\"'translations.people' | translate : { gender: 'male', how: ('translations.funny' | translate) }\"></span>";
  translate_html_she_is = "<span [innerHTML]=\"'translations.people' | translate : { gender: 'female', how: ('translations.charming' | translate) }\"></span>";
  translate_html_they_are = "<span [innerHTML]=\"'translations.people' | translate : { gender: 'heshe', how: ('translations.lovely' | translate) }\"></span>";
  translate_ts_he_is = "Core.Localize('people', { gender: 'male', how: (Core.Localize('funny')) })";
  translate_ts_she_is = "Core.Localize('people', { gender: 'female', how: (Core.Localize('charming')) })";
  translate_they_are = "Core.Localize('people', { gender: 'heshe', how: (Core.Localize('lovely')) })";

  private _loaded = false;

  constructor(private _coreService: CoreService, private _router: Router/* , private _activatedRoute: ActivatedRoute */){
    /* super(_activatedRoute, _router); */

    this.subscription.add(this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      pairwise(),
      ).subscribe((e: any[]) => {
        // if(this._loaded){
          this._coreService.translationDone$.subscribe((res) => {
            this.loaded.isLoaded = true;
          });
          this._loadTranslations();
        // }
      })
    )
  }

  /* override onRouteReady(event?: any[] | undefined, snapshot?: ActivatedRouteSnapshot | undefined, rootData?: Data | undefined, rootParams?: Params | undefined): void {}
  override onRouteReloaded(event?: NavigationEnd | undefined, snapshot?: ActivatedRouteSnapshot | undefined, rootData?: Data | undefined, rootParams?: Params | undefined): void {
    this.loaded.isLoaded = true
    this._loadTranslations();
  } */

  ngOnInit(){
    /* this.snapshotLoaded = true; */
    if(!this._loaded){
      this._coreService.translationDone$.subscribe((res) => {
        this.loaded.isLoaded = true;
        this._loadTranslations();
      });
      this._loaded=true;
    }
  }


  private _loadTranslations(){
    //simple translation
    this.loaded.isLoaded = true;
    this.translateAccount = Core.Localize('account');
      
    //singular plural
    this.creditNote = Core.Localize('credit_note');
    this.creditNotes = Core.Localize('credit_note', {count: 2});
    
    //selection
    this.people = {
      he: Core.Localize('people', { gender: 'male', how: (Core.Localize('funny')) }),
      she: Core.Localize('people', { gender: 'female', how: (Core.Localize('charming')) }),
      they: Core.Localize('people', { gender: 'heshe', how: (Core.Localize('lovely')) })
    }
  }


}
