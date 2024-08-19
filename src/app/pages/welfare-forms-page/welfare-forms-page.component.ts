import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { welfareForm } from 'src/app/interface/form';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Employee } from 'src/app/interface/employee';

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
  ) {
    this.welfareForm = this.fb.group({
      fullName: [''],
    })
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
  searchEmp() {
    if (this.dataEmp.length === 1) {
      const data = this.dataEmp[0];
      this.datafullName = `${data.title} ${data.firstname} ${data.lastname}`
      this.dataEmpCode = data.empCode
      this.dataSectorName = data.sector.sectorName
      this.dataPositionName = data.position.positionName
      this.dataEmail = data.email
      this.dataLevel = data.level

    } else {
      this.datafullName = ''
      this.dataEmpCode = ''
      this.dataSectorName = ''
      this.dataPositionName = ''
      this.dataEmail = ''
      this.dataLevel = ''
      console.log("กรุณากรอกชื่อให้ครบถ้วน")

    }
  }
}

