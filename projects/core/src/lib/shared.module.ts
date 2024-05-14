import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";
import { SharedService } from "./shared.service";
import { LicenseManager } from  'ag-grid-enterprise'

/* This is Shared Module Providing Shared Services */
@NgModule({
    imports       : [CommonModule]
  })
export class SharedModule {
  constructor(@Optional() @SkipSelf() parentModule?: SharedModule) {
    if (parentModule) {
      throw new Error(
        'SharedModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(config: { sharedService: SharedService}): ModuleWithProviders<SharedModule> {

    return {
      ngModule: SharedModule,
      providers: [
        { provide: SharedService, useValue: config.sharedService },
      ]
    };
  }
}
