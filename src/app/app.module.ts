import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from './layouts/layout.module';

import { PageModule } from './pages/page.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  APP_DATE_FORMATS,
  AppDateAdapter,
} from '@shared/utils/_dates/date.adapter';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    PageModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    JwtHelperService,
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class AppModule {}
