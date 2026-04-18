/**
 * ======================================
 * PROG2005 Assignment 3
 * App Configuration - Bootstrap (Standalone)
 * Author: Hanyu Man (whw343)
 * ======================================
 */

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicRouteStrategy, IonicModule } from '@ionic/angular';

import { routes } from './app.routes';

/**
 * Snake to Camel case interceptor for API response transformation
 * The API returns snake_case (item_id, item_name) but our models use camelCase
 */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SnakeToCamelInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only transform responses (not requests)
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (Array.isArray(body)) {
            // Transform array items
            return event.clone({
              body: body.map(item => this.transformKeys(item))
            });
          } else if (body && typeof body === 'object') {
            // Transform single object
            return event.clone({
              body: this.transformKeys(body)
            });
          }
        }
        return event;
      })
    );
  }

  private transformKeys(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    
    const result: any = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      const value = obj[key];
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[camelKey] = this.transformKeys(value);
      } else if (Array.isArray(value)) {
        result[camelKey] = value.map((item: any) => 
          typeof item === 'object' ? this.transformKeys(item) : item
        );
      } else {
        result[camelKey] = value;
      }
    }
    return result;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: SnakeToCamelInterceptor, multi: true },
    importProvidersFrom(IonicModule.forRoot()),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};
