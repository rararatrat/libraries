import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanComponent } from './kanban.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { GenericModule } from '../generic/generic.module';

const components: any[] = [KanbanComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, PrimeNgModule, GenericModule],
  exports: components
})
export class KanbanModule {}
