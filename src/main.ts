/**
 * ======================================
 * PROG2005 Assignment 3
 * Main Entry Point - Standalone Bootstrap
 * Author: Hanyu Man (whw343)
 * ======================================
 */

import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
