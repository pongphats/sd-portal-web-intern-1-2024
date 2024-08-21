import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { welfareForm } from 'src/app/interface/form';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import { debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { Employee } from 'src/app/interface/employee';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-welfare-forms-page',
  templateUrl: './welfare-forms-page.component.html',
  styleUrls: ['./welfare-forms-page.component.scss']
})
export class WelfareFormsPageComponent implements OnInit {
  welfareForm!: FormGroup<welfareForm>;
  expenseForm: FormGroup;

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

    this.expenseForm = this.fb.group({
      treatmentType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      daysCount: ['', Validators.required],
      medicalCost: ['', Validators.required],
      roomAndBoardCost: ['', Validators.required],
      details: [''],
      notes: ['']
    });
  }

  filteredOptions!: Observable<any[]>;

  ngOnInit(): void {

    // ตั้งต้นว่าผูก Observable
    this.filteredOptions = this.welfareForm.get('fullName')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.getEmp(value ? value : ""))
    );

    this.expenseForm.get('startDate')?.valueChanges.subscribe(() => {
      this.calculateDaysCount();
    });

    this.expenseForm.get('endDate')?.valueChanges.subscribe(() => {
      this.calculateDaysCount();
    });

  }

  /**
   * part 1
   */
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
      this.dataStartDate = data.startDate || '-'
      this.dataPassDate = data.passDate || '-'
      this.dataTypeEmp = data.typeEmp || '-'

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

  
  /**
   * part 2
   */

  onSave(): void {
    if (this.expenseForm.valid) {
      console.log('treatmentType >> ' + this.expenseForm.value.treatmentType)
      console.log('startDate >> ' + this.expenseForm.value.startDate)
      console.log('endDate >> ' + this.expenseForm.value.endDate)
      console.log('daysCount >> ' + this.expenseForm.value.daysCount)
      console.log('medicalCost >> ' + this.expenseForm.value.medicalCost)
      console.log('roomAndBoardCost >> ' + this.expenseForm.value.roomAndBoardCost)
      console.log('details >> ' + this.expenseForm.value.details)
      console.log('notes >> ' + this.expenseForm.value.notes)
    }
  }

  clearForm() {
    this.expenseForm.reset();
  }

  calculateDaysCount(): void {
    const startDate = this.expenseForm.get('startDate')?.value;
    const endDate = this.expenseForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.expenseForm.patchValue({ daysCount: diffDays });
    } else {
      this.expenseForm.patchValue({ daysCount: '' });
    }
  }

  formatCurrency(event: any, controlName: string): void {
    let value = event.target.value;
    if (value) {
      // Remove any existing commas
      const cleanedValue = value.toString().replace(/,/g, '');
      // Convert to number and format
      const numberValue = parseFloat(cleanedValue);
      if (!isNaN(numberValue)) {
        const formattedValue = numberValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        this.expenseForm.patchValue({ [controlName]: formattedValue }, { emitEvent: false });
      }
    }
  }


}

