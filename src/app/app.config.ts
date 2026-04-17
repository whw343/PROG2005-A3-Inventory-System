/**
 * ======================================
 * PROG2005 Assignment 3
 * App Configuration - Bootstrap (Standalone)
 * Author: Hanyu Man (whw343)
 * ======================================
 */

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot()),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
