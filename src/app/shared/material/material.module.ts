import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  exports: [
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    NgxMatTimepickerModule,
    MatRadioModule,
    MatSelectModule,
  ],
  providers: [DatePipe],
})
export class MaterialModule {}
