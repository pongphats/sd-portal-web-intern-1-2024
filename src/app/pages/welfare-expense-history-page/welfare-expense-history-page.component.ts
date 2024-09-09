import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { department } from 'src/app/interface/common';
import { Employee } from 'src/app/interface/employee';
import { SearchExpenseHistoryForms } from 'src/app/interface/form';
import {
  expenseReportRequest,
  GetExpenseReportRequest,
} from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import { WelfareService } from 'src/app/services/welfare.service';
import Swal from 'sweetalert2';
import { ExpenseHistoryReportPdfModalComponent } from './components/expense-history-report-pdf-modal/expense-history-report-pdf-modal.component';
import { ExpenseDetailModalComponent } from './components/expense-detail-modal/expense-detail-modal.component';

@Component({
  selector: 'app-welfare-expense-history-page',
  templateUrl: './welfare-expense-history-page.component.html',
  styleUrls: ['./welfare-expense-history-page.component.scss'],
})
export class WelfareExpenseHistoryPageComponent implements OnInit {
  searchFormsGroup!: FormGroup<SearchExpenseHistoryForms>;
  filteredOptions!: Observable<any[]>;
  expenseHistoryDataTable: any[] = [];
  pageLength!: number;
  currentPageIndex: number = 0;
  currentPageSize: number = 5;
  isSearchMode: boolean = false;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
    private swalService: SwalService,
    private welfareService: WelfareService,
    public dialog: MatDialog
  ) {
    this.searchFormsGroup = this.fb.group({
      companyName: ['', Validators.required],
      deptName: [''],
      empName: [''],
      endDate: [null, Validators.required],
      sectorName: [''],
      startDate: [null, Validators.required],
    }) as FormGroup<SearchExpenseHistoryForms>;
  }

  ngOnInit(): void {
    this.filteredOptions =
      this.searchFormsGroup.controls.empName!.valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => this.getEmp(value ? value : ''))
      );
  }

  async firstSearchData() {
    this.swalService.showLoading();
    try {
      const formValues = this.searchFormsGroup.value;

      const companyName = formValues.companyName || '';

      const startDate = this.commonService.formatDateToYYYYMMDDString(
        new Date(formValues.startDate || '')
      );

      const endDate = this.commonService.formatDateToYYYYMMDDString(
        new Date(formValues.endDate || '')
      );
      const sectorId: any = formValues.sectorName
        ? Number(formValues.sectorName)
        : null;
      const deptId: any = formValues.deptName
        ? Number(formValues.deptName)
        : null;

      const empId: any = formValues.empName
        ? this.dataListEmp.find(
            (item) =>
              `${item.firstname} ${item.lastname}` === formValues.empName
          )?.id
        : null;

      const req: expenseReportRequest = {
        page: 0,
        size: 5,
        companyName: companyName,
        deptId: deptId,
        sectorId: sectorId,
        userId: empId,
        startDate: startDate,
        endDate: endDate,
      };

      const res = await this.apiService
        .getExpenseReportWithPaginationV2(req)
        .toPromise();

      if (res) {
        const sortData = res.content;
        // ใช้ Promise.all เพื่อรอให้ทุกการเรียก API เสร็จสิ้นก่อน
        const mappedData = await Promise.all(
          sortData.map(async (item) => {
            const employee = await this.apiService
              .findUserById(item.userId)
              .toPromise();
            if (employee) {
              return {
                ...item,
                fullName: `${employee.firstname} ${employee.lastname}`,
                level: employee.level,
                sectorAndDept: `${employee.sector.sectorCode}/${employee.department.deptCode}`,
                companyName: `${employee.company.companyName}`,
                empCode: employee.empCode,
              };
            } else {
              return {
                ...item,
                fullName: '',
                level: '',
                sectorAndDept: '',
                companyName: '',
                empCode: '',
              };
            }
          })
        );

        // ตรวจสอบข้อมูลหลังจาก map เสร็จแล้ว
        // console.log(mappedData); // ลบค่า null หรือ undefined ออก
        this.expenseHistoryDataTable = mappedData;
        this.pageLength = res.totalElements;
        this.currentPageIndex = 0;
        this.currentPageSize = 5;
      }
      this.isSearchMode = true;
      Swal.close();
    } catch (error) {
      console.error(error);
      this.swalService.showError('เกิดข้อผิดพลาดในการค้นหาข้อมูล');
    }
  }

  dataListEmp: Employee[] = [];
  getEmp(term: string): Observable<any[]> {
    // กรณี ไม่กรอกอะไรเลย
    if (term == '') {
      this.dataListEmp = [];
      return of([]);
    }
    return this.apiService.getEmplistByName(term).pipe(
      map((res: any) => {
        let fullNameList: any[] = [];
        if (res == null) {
          this.dataListEmp = [];
          return [];
        } else {
          const result = res.result;
          if (result.length == 0) {
            this.dataListEmp = [];
            return [];
          }
          this.dataListEmp = result;
          fullNameList = result.map((item: any) => ({
            ...item,
            fullName: `${item.firstname} ${item.lastname}`,
          }));
          return fullNameList;
        }
      })
    );
  }
  async onPageChange(event: PageEvent) {
    this.swalService.showLoading();
    this.currentPageIndex = event.pageIndex; // กำหนดค่าจาก event ที่เกิดขึ้นเมื่อมีการเปลี่ยนหน้า
    this.currentPageSize = event.pageSize;
    // console.log('Page changed to: ', this.currentPageIndex);

    try {
      const formValues = this.searchFormsGroup.value;

      const companyName = formValues.companyName || '';

      const startDate = this.commonService.formatDateToYYYYMMDDString(
        new Date(formValues.startDate || '')
      );

      const endDate = this.commonService.formatDateToYYYYMMDDString(
        new Date(formValues.endDate || '')
      );
      const sectorId: any = formValues.sectorName
        ? Number(formValues.sectorName)
        : null;
      const deptId: any = formValues.deptName
        ? Number(formValues.deptName)
        : null;

      const empId: any = formValues.empName
        ? this.dataListEmp.find(
            (item) =>
              `${item.firstname} ${item.lastname}` === formValues.empName
          )?.id
        : null;

      const req: expenseReportRequest = {
        page: event.pageIndex,
        size: event.pageSize,
        companyName: companyName,
        deptId: deptId,
        sectorId: sectorId,
        userId: empId,
        startDate: startDate,
        endDate: endDate,
      };

      const res = await this.apiService
        .getExpenseReportWithPaginationV2(req)
        .toPromise();

      if (res) {
        const sortData = res.content;
        // ใช้ Promise.all เพื่อรอให้ทุกการเรียก API เสร็จสิ้นก่อน
        const mappedData = await Promise.all(
          sortData.map(async (item) => {
            const employee = await this.apiService
              .findUserById(item.userId)
              .toPromise();
            if (employee) {
              return {
                ...item,
                fullName: `${employee.firstname} ${employee.lastname}`,
                level: employee.level,
                sectorAndDept: `${employee.sector.sectorCode}/${employee.department.deptCode}`,
                companyName: `${employee.company.companyName}`,
                empCode: employee.empCode,
              };
            } else {
              return {
                ...item,
                fullName: '',
                level: '',
                sectorAndDept: '',
                companyName: '',
                empCode: '',
              };
            }
          })
        );

        // ตรวจสอบข้อมูลหลังจาก map เสร็จแล้ว
        // console.log(mappedData); // ลบค่า null หรือ undefined ออก
        this.expenseHistoryDataTable = mappedData;
        this.pageLength = res.totalElements;
      }
    } catch (error) {
      console.error(error);
    } finally {
      Swal.close();
    }
  }

  sectorOpts: any[] = [];
  async changeCompany(companyName: string) {
    try {
      const res =
        (await this.commonService
          .getSectorCompanyByName(companyName)
          .toPromise()) || [];
      this.sectorOpts = res;
      // console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  deptOpts: department[] = [];
  async changeSector(id: number) {
    try {
      const res =
        (await this.commonService.getDeptListBySectorId(id).toPromise()) || [];
      this.deptOpts = res;
    } catch (error) {
      console.error(error);
    }
  }

  clearSearch() {
    this.pageLength = 0;
    this.currentPageIndex = 0;
    this.currentPageSize = 0;
    this.searchFormsGroup.reset();
    this.isSearchMode = false;
    this.expenseHistoryDataTable = [];
  }

  async openPdfModal() {
    this.swalService.showLoading();
    const formValues = this.searchFormsGroup.value;

    const companyName = formValues.companyName || '';

    const startDate = this.commonService.formatDateToYYYYMMDDString(
      new Date(formValues.startDate || '')
    );

    const endDate = this.commonService.formatDateToYYYYMMDDString(
      new Date(formValues.endDate || '')
    );
    const sectorName: any = formValues.sectorName
      ? this.sectorOpts.find((item) => item.sectorId == formValues.sectorName)
          .sectorName
      : null;
    const deptName: any = formValues.deptName
      ? this.deptOpts.find((item) => item.id == Number(formValues.deptName))
      : null;

    const empId: any = formValues.empName
      ? this.dataListEmp.find(
          (item) => `${item.firstname} ${item.lastname}` === formValues.empName
        )?.id
      : null;
    try {
      const req: GetExpenseReportRequest = {
        companyName: companyName,
        deptName: deptName,
        endDate: endDate,
        sectorName: sectorName,
        startDate: startDate,
        userId: empId,
      };
      const res = await this.apiService
        .getExpenseHistoryReportPDFandELSXBase64(req)
        .toPromise();
      if (res) {
        this.welfareService.pdfBase64 = res.pdfBase64;
        this.dialog.open(ExpenseHistoryReportPdfModalComponent, {
          width: '80%',
        });
      }
      Swal.close();
    } catch (error) {
      console.error(error);
      this.swalService.showError('เกิดข้อผิดพลาดในพิพม์รายงาน');
    }
  }

  async downloadElsx() {
    this.swalService.showLoading();
    const formValues = this.searchFormsGroup.value;

    const companyName = formValues.companyName || '';

    const startDate = this.commonService.formatDateToYYYYMMDDString(
      new Date(formValues.startDate || '')
    );

    const endDate = this.commonService.formatDateToYYYYMMDDString(
      new Date(formValues.endDate || '')
    );
    const sectorName: any = formValues.sectorName
      ? this.sectorOpts.find((item) => item.sectorId == formValues.sectorName)
          .sectorName
      : null;
    const deptName: any = formValues.deptName
      ? this.deptOpts.find((item) => item.id == Number(formValues.deptName))
      : null;

    const empId: any = formValues.empName
      ? this.dataListEmp.find(
          (item) => `${item.firstname} ${item.lastname}` === formValues.empName
        )?.id
      : null;
    try {
      const req: GetExpenseReportRequest = {
        companyName: companyName,
        deptName: deptName,
        endDate: endDate,
        sectorName: sectorName,
        startDate: startDate,
        userId: empId,
      };
      const res = await this.apiService
        .getExpenseHistoryReportPDFandELSXBase64(req)
        .toPromise();
      if (res) {
        this.welfareService.xlsxBase64 = res.excelBase64;
        this.commonService.downloadExcelFile(
          'รายงานการเบิกค่ารักษาพยาบาล',
          res.excelBase64
        );
      }
      Swal.close();
    } catch (error) {
      console.error(error);
      this.swalService.showError('เกิดข้อผิดพลาดในพิพม์รายงาน');
    }
  }

  openExpenseDetailModal(data: any) {
    // console.log(data);

    this.welfareService.expenseId = data.id;

    this.dialog.open(ExpenseDetailModalComponent, {
      width: '80%',
    });
  }
}
