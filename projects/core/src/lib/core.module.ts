import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { GenericModule } from './generic/generic.module';
import { GridsModule } from './grids/grids.module';
import { NavigationModule } from './navigation/navigation.module';
import { EagnaPipesModule } from '../lib/pipes/eagna-pipes.module';
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { SharedService } from './shared.service';
import { KanbanModule } from './kanban/kanban.module';
import { EditorModule } from "@tinymce/tinymce-angular";

registerLocaleData(localeDe, localeDeExtra);
/* registerLocaleData(localeFr, localeFrExtra); */
const modules: any = [
                    EditorModule,
                    NavigationModule,
                    GenericModule,
                    GridsModule,
                    EagnaPipesModule,
                    PrimeNgModule,
                    KanbanModule
                  ];
const providers   : any = [
  /* { provide: ApiCallService, multi: true}, */
  { provide: LOCALE_ID, useValue: SharedService.defaultLocaleConf.locale}
];

/* window.console.log=function(){};
window.console.warn=function(){};
window.console.table=function(){}; */

@NgModule({
  imports       : [].concat(modules),
  exports       : [].concat(modules),
  providers     : [].concat(providers)
})
export class CoreModule {}
