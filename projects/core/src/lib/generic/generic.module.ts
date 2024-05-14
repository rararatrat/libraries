import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingDirective } from './loading/loading.directive';
import { ErrorComponent } from './error/error.component';
import { LoadingService } from './loading/loading.service';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EagnaPipesModule } from '../pipes/eagna-pipes.module';
import { SplashScreenComponent } from './generic-api';
import { SplashScreenResolver } from './splash-screen/splash-screen.resolver';
import { SplashScreenStateService } from './splash-screen/splash-screen-state.service';

const components  : any   = [
                              CardComponent,
                              LoadingComponent, 
                              ErrorComponent,
                              SplashScreenComponent
                            ]

const directive   : any   = [
                              LoadingDirective
                            ]

const modules     : any   = [
                              CommonModule,
                              ReactiveFormsModule,
                              PrimeNgModule,
                              EagnaPipesModule
                            ]
const provider    : any   = [
                              LoadingService,
                              SplashScreenResolver,
                              SplashScreenStateService
                            ]

@NgModule({
  declarations: [].concat(components, directive),
  imports     : [].concat(modules),
  providers   : [].concat(provider, directive),
  exports     : [].concat(modules, components, directive),
})
export class GenericModule { }
