import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GridClientSideComponent } from './grid-test/grid-client-side/grid-client-side.component';
import { GridServerSideComponent } from './grid-test/grid-server-side/grid-server-side.component';
import { AppComponent } from './app.component';
import { GridClientSideRowDataAsyncComponent } from './grid-test/grid-client-side-row-data-async/grid-client-side-row-data-async.component';
import { GridClientSideApiCallParamsComponent } from './grid-test/grid-client-side-api-call-params/grid-client-side-api-call-params.component';
import { TranslationsComponent } from './translation-test/translations/translations.component';

const isProd = environment.production == true;

const routes: Routes = [
  { path: '', data: {sidebarLoaderId: 'eag-main', title: 'titles.home'}, children: [
    /* { path: '', data: {sidebarLoaderId: 'eag-main', title: 'titles.home'}, component: AppComponent}, */
    {path: 'grid-client-side-row-data', component: GridClientSideComponent, data: {title: 'titles.grid_client_side_row_data'} },
    {path: 'grid-client-side-row-data-async', component: GridClientSideRowDataAsyncComponent, data: {title: 'titles.grid_client_side_row_data_async'} },
    {path: 'grid-client-side-api-call-params', component: GridClientSideApiCallParamsComponent, data: {title: 'titles.grid_client_side_api-call-params'} },
    {path: 'grid-server-side', component: GridServerSideComponent, data: {title: 'titles.grid_server_side'} },
    {path: 'translations', component: TranslationsComponent, data: {title: 'titles.translation', } }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
