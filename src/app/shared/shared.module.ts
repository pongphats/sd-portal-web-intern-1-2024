import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

import { NgApexchartsModule } from "ng-apexcharts";

import { SelectorComponent } from './components/selector/selector.component';
import { BuddhistDatePipe } from "./pipes/budhist-date.pipe";
import { MaterialModule } from "./material/material.module";


@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgApexchartsModule,
    DragDropModule,
    ScrollToModule.forRoot(),
  ],
  exports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgApexchartsModule,
    DragDropModule,
    SelectorComponent,
    ScrollToModule,
  ],
  declarations: [SelectorComponent, BuddhistDatePipe],
})
export class SharedModule {}
