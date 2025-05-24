import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';




bootstrapApplication(AppComponent, {
    providers: [...appConfig,
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule)
    ],
});
