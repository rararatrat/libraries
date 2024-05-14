import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { SharedService } from 'projects/core/src/public-api';

if (environment.production) {
  enableProdMode();
}

const savedLocale = SharedService.getSavedLocale(environment.locale);

const bootApp = () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

bootApp();