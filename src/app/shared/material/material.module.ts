import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  exports: [MatDatepickerModule, MatInputModule , MatButtonModule],
  providers: [DatePipe],
})
export class MaterialModule {}
