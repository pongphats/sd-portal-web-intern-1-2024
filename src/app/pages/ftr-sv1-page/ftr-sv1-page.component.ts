import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-ftr-sv1-page',
  templateUrl: './ftr-sv1-page.component.html',
  styleUrls: ['./ftr-sv1-page.component.scss']
})
export class FtrSv1PageComponent implements OnInit {
  trainingForm: any;
  rows: Array<any> = [];
  year: any;
  department: any;
  // remark: string = '';
  
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.trainingForm = this.fb.group({
      year: ['2023', Validators.required],
      department: ['SD1', Validators.required],
      position: ['Programmer', Validators.required],
      className: ['Introduction to Spring Framework รุ่น 9', Validators.required],
      no: ['1459', Validators.required],
      fee: ['-', Validators.required],
      accommodation: ['-', Validators.required],
      totalExp: ['-', Validators.required],
      remark: ['-', Validators.required]
    });
  }

  addBtn(){
    this.year = this.trainingForm.value.year;
    this.department = this.trainingForm.value.department;
    // console.log(this.trainingForm.value);
    this.rows.push(this.trainingForm.value);
    this.trainingForm.reset();
    // console.log(this.rows)
  }
  
  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('data-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, 'ExcelSheet.xlsx');
 
  }
}
