import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
@NgModule({
  exports: [
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    NgxMatTimepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
  ],
  providers: [DatePipe],
})
export class MaterialModule {}
