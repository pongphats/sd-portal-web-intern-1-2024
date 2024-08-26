import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseForm, WelfareForm } from 'src/app/interface/form';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import { debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { Employee } from 'src/app/interface/employee';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExpenseRemainByYearResponse } from 'src/app/interface/response';
import { CreateExpenseRequest } from 'src/app/interface/request';

@Component({
  selector: 'app-welfare-forms-page',
  templateUrl: './welfare-forms-page.component.html',
  styleUrls: ['./welfare-forms-page.component.scss'],
})
export class WelfareFormsPageComponent implements OnInit {
  welfareForm!: FormGroup<WelfareForm>;
  expenseForm!: FormGroup<ExpenseForm>;
  yearForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private commonService: CommonService,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {
    this.welfareForm = this.fb.group({
      fullName: ['', Validators.required],
    });

    this.expenseForm = this.fb.group({
      treatmentType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      daysCount: ['', Validators.required],
      medicalCost: ['', Validators.required],
      roomAndBoardCost: ['', Validators.required],
      details: [''],
      notes: [''],
    });

    const currentYear = new Date().getFullYear() + 543; // คำนวณปีปัจจุบัน

    this.yearForm = this.fb.group({
      yearSearch: [currentYear],
    });
  }

  filteredOptions!: Observable<any[]>;

  ngOnInit(): void {
    // ตั้งต้นว่าผูก Observable
    this.filteredOptions = this.welfareForm.get('fullName')!.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => this.getEmp(value ? value : ''))
    );

    this.expenseForm.get('startDate')?.valueChanges.subscribe(() => {
      this.calculateDaysCount();
    });

    this.expenseForm.get('endDate')?.valueChanges.subscribe(() => {
      this.calculateDaysCount();
    });


    // this.getAllExpense()
  }

  /**
   * part 1
   */
  dataListEmp: Employee[] = [];
  getEmp(term: string): Observable<any[]> {
    // กรณี ไม่กรอกอะไรเลย
    if (term == '') {
      this.dataListEmp = [];
      return of([]);
    }
    return this.apiService.getEmplistByName(term).pipe(
      map((res: any) => {
        if (res == null) {
          this.dataListEmp = [];
          return [];
        } else {
          const result = res.result;
          if (result.length == 0) {
            this.dataListEmp = [];
            return [];
          }
          this.dataListEmp = result.map((item: any) => ({
            ...item,
            fullName: `${item.firstname} ${item.lastname}`,
          }));
          return this.dataListEmp;
        }
      })
    );
  }

  dataEmp: Employee | undefined = undefined;
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
    // เช็คว่าพิมพ์ชื่อครบถ้วน
    const condition = this.dataListEmp[0].firstname + " " + this.dataListEmp[0].lastname === this.welfareForm.value.fullName
    if (this.dataListEmp.length === 1 && condition) {
      this.dataEmp = this.dataListEmp[0];
      const data = this.dataEmp
      this.datafullName = `${data.title} ${data.firstname} ${data.lastname}`;
      this.dataEmpCode = data.empCode;
      this.dataSectorName = data.sector.sectorName;
      this.dataPositionName = data.position.positionName;
      this.dataEmail = data.email;
      this.dataLevel = data.level;
      this.dataStartDate = data.startDate || '-';
      this.dataPassDate = data.passDate || '-';
      this.dataTypeEmp = data.typeEmp || '-';

      this.getExpenseRemainByUserIdAndLevel(data);
      this.getExpenseUidAndYear()

    } else {
      this.datafullName = '';
      this.dataEmpCode = '';
      this.dataSectorName = '';
      this.dataPositionName = '';
      this.dataEmail = '';
      this.dataLevel = '';
      this.dataStartDate = '';
      this.dataPassDate = '';
      this.dataTypeEmp = '';
      this.dataOPD = ''
      this.dataIPD = ''
      this.dataRoom = ''
      this.dataSource.data = []
      this.allExpense = []
      this.dataEmp = undefined;
      this.swalService.showWarning("กรุณากรอกชื่อให้ครบถ้วน")
    }
  }

  /**
   * part 2
   */

  dataOPD: string = '';
  dataIPD: string = '';
  dataRoom: string = '';

  async getExpenseRemainByUserIdAndLevel(data: any) {
    try {
      const userId = data.id;
      const level = data.level ? data.level : '';
      const res = await this.apiService.getExpenseRemainByUserIdAndLevel(userId, level).toPromise();
      if (res) {
        this.dataOPD = this.convertNumberToStringFormat(res.opd)
        this.dataIPD = this.convertNumberToStringFormat(res.ipd);
        this.dataRoom = this.convertNumberToStringFormat(res.room);
      }
    } catch (error) {
      console.log("ไม่มีการระบุ Level")
      this.dataOPD = ''
      this.dataIPD = ''
      this.dataRoom = ''
    }
  }

  async onSave() {

    if (this.expenseForm.valid && this.welfareForm.valid) {

      let startDate = '';
      let endDate = '';
      const startDateValue = this.expenseForm.value.startDate;
      const endDateValue = this.expenseForm.value.endDate;
      if (startDateValue && endDateValue) {
        startDate = this.commonService.formatDateToYYYYMMDDString(new Date(startDateValue))
        endDate = this.commonService.formatDateToYYYYMMDDString(new Date(endDateValue))
      }

      const type = this.expenseForm.value.treatmentType;
      let ipd = 0;
      let opd = 0;
      if (type == 'ipd') {
        ipd = Number(this.expenseForm.value.medicalCost?.toString().replace(',', ''))
      } else if (type == 'opd') {
        opd = Number(this.expenseForm.value.medicalCost?.toString().replace(',', ''))
      }

      const days = Number(this.expenseForm.value.daysCount);

      const userId = this.dataEmp?.id
      const level = this.dataEmp?.level

      const req: CreateExpenseRequest = {
        types: type ? type : '',
        level: level || '',
        startDate: startDate,
        endDate: endDate,
        days: days,
        ipd: ipd,
        opd: opd,
        roomService: Number(this.expenseForm.value.roomAndBoardCost?.toString().replace(',', '')),
        description: this.expenseForm.value.details || '',
        remark: this.expenseForm.value.notes || '',
        adMission: '',
        userId: userId || -1
      };

      if (this.editMode) {
        console.log('edit', req)
        const confirmed = await this.swalService.showConfirm("คุณต้องการแก้ไขรายการเบิกค่ารักษาพยาบาลนี้หรือไม่");
        if (confirmed) {
          this.editMode = false;
          this.swalService.showSuccess('แก้ไขรายการการเบิกค่ารักษาพยาบาลเรียบร้อยแล้ว')
          this.clearForm();
        }else{
          console.log("ไม่แก้ไข")
        }

      } else {
        const res = await this.apiService.createExpense(req).toPromise()
        if (res?.responseMessage == 'กรอกข้อมูลเรียบร้อย') {
          this.swalService.showSuccess('เพิ่มรายการการเบิกค่ารักษาพยาบาลเรียบร้อยแล้ว')
          this.clearForm();
        }
      }
      this.searchEmp()
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
      // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.expenseForm.patchValue({ daysCount: diffDays.toString() });
    } else {
      this.expenseForm.patchValue({ daysCount: '' });
    }
  }

  formatCurrency(event: any, controlName: string): void {
    let value = event.target.value;
    if (value) {
      const cleanedValue = value.toString().replace(/,/g, '');
      const numberValue = parseFloat(cleanedValue);
      if (!isNaN(numberValue)) {
        const formattedValue = numberValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        this.expenseForm.patchValue(
          { [controlName]: formattedValue },
          { emitEvent: false }
        );
      }
    }
  }

  /**
   * part3
   */
  searchHistoryByYear() {
    console.log(this.yearForm.value.yearSearch)
  }

  /**
   * part4
   */
  dataSource = new MatTableDataSource<any>([]); // เริ่มต้นด้วยข้อมูลว่าง
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  allExpense: any[] = [];
  displayedColumns: string[] = ['No', 'date', 'detail', 'ipd', 'opd', 'room', 'price', 'editOrDelete'];
  async getExpenseUidAndYear() {
    if (this.dataEmp) {
      const yearInput = this.yearForm.value.yearSearch
      if (/^\d+$/.test(yearInput.toString())) {
        const uid = this.dataEmp.id
        const year = yearInput - 543
        const res = await this.apiService.getExpenseUidAndYear(uid, year).toPromise();
        if (res) {
          this.allExpense = res.map((expense: ExpenseRemainByYearResponse, index: number) => ({
            ...expense,
            no: index + 1
          }));
          this.dataSource.data = this.allExpense;
        }
      } else {
        this.swalService.showWarning("กรุณากรอกปีให้ถูกต้อง")
      }

    } else {
      this.swalService.showWarning("ต้องค้นหาชื่อพนักงานก่อน")
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  editMode: boolean = false;
  editBtn(element: ExpenseRemainByYearResponse) {

    this.editMode = true;
    const type = element.opd !== 0 ? 'opd' : 'ipd';
    const medicalCost = element.opd !== 0 ? element.opd : element.ipd;

    this.expenseForm.setValue({
      treatmentType: type,
      startDate: element.startDate,
      endDate: element.endDate,
      daysCount: (element.days).toString(),
      medicalCost: this.convertNumberToStringFormat(medicalCost),
      roomAndBoardCost: this.convertNumberToStringFormat(element.roomService),
      details: element.description,
      notes: element.remark
    });
  }

  async deleteBtn(element: any) {
    const confirmed = await this.swalService.showConfirm("คุณต้องการลบรายการเบิกนี้หรือไม่");
    if (confirmed) {
      console.log("ลบแล้ว")
      this.swalService.showSuccess('ลบรายการการเบิกค่ารักษาพยาบาลนี้เรียบร้อยแล้ว')
      this.searchEmp()
    } else {
      console.log("ไม่ลบ")
    }
    console.log("delete", element)
  }

  convertNumberToStringFormat(number: number): string {
    return this.commonService.convertNumberToStringFormatted2(number);
  }
}
