import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { welfareForm } from 'src/app/interface/form';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import { debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { Employee } from 'src/app/interface/employee';
import { MatDialog } from '@angular/material/dialog';
import { DialogExpenseComponent } from './components/dialog-expense/dialog-expense.component';

@Component({
  selector: 'app-welfare-forms-page',
  templateUrl: './welfare-forms-page.component.html',
  styleUrls: ['./welfare-forms-page.component.scss']
})
export class WelfareFormsPageComponent implements OnInit {
  welfareForm!: FormGroup<welfareForm>;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private commonService: CommonService,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {
    this.welfareForm = this.fb.group({
      fullName: [''],
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogExpenseComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  filteredOptions!: Observable<any[]>;

  ngOnInit(): void {

    // ตั้งต้นว่าผูก Observable
    this.filteredOptions = this.welfareForm.get('fullName')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.getEmp(value ? value : ""))
    );

  }

  dataEmp: Employee[] = [];
  getEmp(term: string): Observable<any[]> {
    // กรณี ไม่กรอกอะไรเลย
    if (term == '') {
      this.dataEmp = []
      return of([]);
    }
    return this.apiService.getEmplistByName(term).pipe(
      map((res: any) => {
        if (res == null) {
          this.dataEmp = []
          return []
        }
        else {
          const result = res.result;
          if (result.length == 0) {
            this.dataEmp = []
            return []
          }
          this.dataEmp = result.map((item: any) => ({
            ...item,
            fullName: `${item.firstname} ${item.lastname}`
          }))
          return this.dataEmp
        }
      }));
  }

  datafullName: string = '';
  dataEmpCode: string = '';
  dataSectorName: string = '';
  dataPositionName: string = '';
  dataEmail: string = '';
  dataLevel: string = '';
  dataStartDate: string = '';
  dataPassDate: string = '';
  dataTypeEmp: string = '';
  searchEmp() {
    console.log(this.dataEmp)
    if (this.dataEmp.length === 1) {
      const data = this.dataEmp[0];
      this.datafullName = `${data.title} ${data.firstname} ${data.lastname}`
      this.dataEmpCode = data.empCode
      this.dataSectorName = data.sector.sectorName
      this.dataPositionName = data.position.positionName
      this.dataEmail = data.email
      this.dataLevel = data.level
      this.dataStartDate = data.startDate || ''
      this.dataPassDate = data.passDate || ''
      this.dataTypeEmp = data.typeEmp || ''

    } else {
      this.datafullName = ''
      this.dataEmpCode = ''
      this.dataSectorName = ''
      this.dataPositionName = ''
      this.dataEmail = ''
      this.dataLevel = ''
      this.dataStartDate = ''
      this.dataPassDate = ''
      this.dataTypeEmp = ''
      console.log("กรุณากรอกชื่อให้ครบถ้วน")

    }
  }
}

