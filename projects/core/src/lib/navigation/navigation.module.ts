import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* import { SideBarComponent } from './side-bar/side-bar.component'; */
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { EagnaPipesModule } from '../pipes/eagna-pipes.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';

const components : any  = [
                            SidebarComponent
                          ]

const modules    : any  = [
                            TranslateModule,
                            CommonModule,
                            EagnaPipesModule
                          ]
const internal    : any = [
                            PrimeNgModule
                          ]

@NgModule({
  declarations: [].concat(components),
  imports     : [].concat(modules, internal),
  exports     : [].concat(modules, components)
})

export class NavigationModule { }
