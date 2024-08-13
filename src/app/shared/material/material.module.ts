import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import {MatRadioModule} from '@angular/material/radio'; 
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';




@NgModule({
  exports: [
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    NgxMatTimepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule
   
  ],
  providers: [DatePipe],
})
export class MaterialModule {}
