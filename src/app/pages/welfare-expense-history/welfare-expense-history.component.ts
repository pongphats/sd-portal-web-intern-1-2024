import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/services/swal.service';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/interface/employee';
import { ExpenseForm, WelfareForm } from 'src/app/interface/form';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { expenseReportRequest } from 'src/app/interface/request';
import { id } from 'date-fns/locale';

@Component({
  selector: 'app-welfare-expense-history',
  templateUrl: './welfare-expense-history.component.html',
  styleUrls: ['./welfare-expense-history.component.scss'],
})
export class WelfareExpenseHistoryComponent implements OnInit {
  //Auto
  expenseForm!: FormGroup<any>;
  empList: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private commonService: CommonService,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {
    this.expenseForm = this.fb.group({
      companyName: ['', Validators.required],
      sectorName: [''],
      deptName: [''],
      empName: [''],
      // dateRange: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // ฟังการเปลี่ยนแปลงของฟอร์ม
    this.expenseForm
      .get('companyName')
      ?.valueChanges.subscribe((companyName) => {
        if (companyName) {
          this.getSectors(companyName);
        }
      });

    //dept
    this.expenseForm.get('sectorName')?.valueChanges.subscribe((sectorName) => {
      if (sectorName) {
        this.expenseForm.patchValue({
          deptName: '',
        });
        this.getDepartments(sectorName);
      }
    });

    // ฟังการเปลี่ยนแปลงของแผนก (deptName)

    // -------------------------
    // this.expenseForm.get('deptName')?.valueChanges.subscribe(async (deptId) => {
    //   if (deptId) {
    //     const res = await this.getEmpByDeptId(deptId).toPromise();
    //     console.log(res)
    //     // this.empFormOption = res
    //   }
    //   console.log("emp from (deptName)", this.empFormOption);
    // });

    // // this.empFormOption = this.welfareForm.get('empName')!.valueChanges.pipe(
    // //   debounceTime(300),
    // //   switchMap((value) => this.empFormOption.filter(emp => emp.fullName.includes(value)))
    // // );

    // // this.expenseForm.get('deptName')?.valueChanges.subscribe(async (deptId) => {
    // //   if (deptId) {
    // //     this.empFormOption = await this.getEmpByDeptId(deptId).toPromise();
    // //   }
    // //   console.log("emp from (deptName)", this.empFormOption);
    // // });

    // // ฟังการเปลี่ยนแปลงของ empName
    // this.empFormOption = this.expenseForm.get('empName')!.valueChanges.pipe(
    //   debounceTime(300),
    //   switchMap(value => this.empFormOption.pipe(
    //     map(options => options.filter(emp => emp.fullName.toLowerCase().includes(value.toLowerCase())))
    //   ))
    // );

    //-------------แรก---------

    // this.expenseForm.get('deptName')?.valueChanges.subscribe(async (deptId) => {
    //   if (deptId) {
    //     this.empFormOption =await this.getEmpByDeptId(deptId).toPromise();
    //   }
    //   console.log("emp from (deptName)", this.empFormOption);
    // });

    //--------สอง------
    // ฟังการเปลี่ยนแปลงของแผนก (deptName)
    this.expenseForm.get('deptName')?.valueChanges.subscribe(async (deptId) => {
      console.log('deptId', deptId);
      if (deptId) {
        this.expenseForm.patchValue({
          empName: '',
        });
        this.empFormOption = this.getEmpByDeptId(deptId);
        await this.initEmpListByDeptId(deptId);
        // this.filteredOptions = this.empFormOption;
      }
    });

    // ฟังการเปลี่ยนแปลงของ empName
    this.filteredOptions = this.expenseForm.get('empName')!.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) =>
        this.empFormOption.pipe(
          map((options) =>
            options.filter((emp) =>
              emp.fullName.toLowerCase().includes(value.toLowerCase())
            )
          ),
          tap((filteredOptions) => {
            // เช็คว่ามีข้อมูล emp ที่ตรงกับ empName หรือไม่
            if (filteredOptions.length === 1) {
              console.log('filteredOptions', filteredOptions);
              // ถ้ามีข้อมูล emp เดียวที่ตรงกัน เก็บข้อมูลนั้นใน dataEmp
              this.dataEmp = filteredOptions[0];
            } else {
              // ถ้าไม่มีข้อมูลตรงหรือมีมากกว่าหนึ่งรายการ, clear dataEmp
              this.dataEmp = null;
            }
          })
        )
      )
    );
  }
  // ตัวแปรสำหรับเก็บข้อมูล emp ที่ตรงกับ empName
  dataEmp: any;

  ngAfterViewInit() {
    this.welfareExpense.paginator = this.paginator;
  }

  //Auto
  filteredOptions!: Observable<any[]>;
  //table
  welfareExpense = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'companyName',
    'sectorDept',
    'empCode',
    'firstname',
    'lastname',
    'position',
    'email',
    'status',
  ];
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
          console.log(this.dataListEmp);
          return this.dataListEmp;
        }
      })
    );
  }

  sectorName!: string;

  sectorOptions: any[] = [];

  // async getSectors(companyName: string) {
  //   console.log("api1", companyName)
  //   try {
  //     const res = await this.commonService.getSectorCompanyByName(companyName).toPromise();
  //     console.log(res)
  //     this.sectorOptions = res
  //   } catch (error) {
  //     console.error('Error fetching sectors:', error);
  //   }
  //   console.log("api")
  // }

  // getSectors(companyName: string) {
  //   console.log("api1", companyName);
  //   this.commonService.getSectorCompanyByName(companyName).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.sectorOptions = res; // `res` คือค่าที่ได้รับจาก observable
  //     },
  //     error: (error) => {
  //       console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
  //     }
  //   });
  //   console.log("api");
  // }

  getSectors(companyName: string) {
    console.log('Fetching sectors for company:', companyName);
    this.commonService.getSectorCompanyByName(companyName).subscribe({
      next: (res) => {
        console.log('Sectors fetched:', res);
        this.sectorOptions = res; // `res` คือค่าที่ได้รับจาก observable

        // // รีเซ็ต sectorName ให้ไม่มีค่าเพื่อให้แน่ใจว่าเมื่อเปลี่ยนบริษัท
        // // การเลือกใน mat-select จะถูกรีเซ็ต
        // this.expenseForm.get('sectorName')?.reset();
        // // การเลือกใน mat-select จะถูกรีเซ็ต ค่า deptName
        // this.expenseForm.get('deptName')?.reset();
      },
      error: (error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      },
    });
    console.log('api');
  }

  // ----------------------------------
  deptName: any[] = [];
  deptOptions: any[] = [];

  getDepartments(sectorId: number) {
    this.commonService.getDeptListBySectorId(sectorId).subscribe({
      next: (res) => {
        console.log('Departments fetched::', res);
        this.deptOptions = res;
        this.expenseForm.get('deptName')?.reset();
        // this.expenseForm.get('empName')?.reset();
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
      },
    });
  }

  // -----------------------------------------------

  //AutoForm ดึงพนักงานตามแผนก
  // empFormOption!: Observable<any[]>;
  // getEmpByDeptId(deptId: number): Observable<any[]> {
  //   console.log("deptId", deptId);
  //   return this.apiService.getEmpByDeptId(deptId).pipe(
  //     map(emp => {
  //       emp.map((item: Employee) => ({
  //         ...item,
  //         fullName: `${item.firstname} ${item.lastname}`,
  //       }))
  //       console.log("emp",emp)
  //       return emp

  //     }
  //     )
  //   );
  // }

  empFormOption!: Observable<any[]>;
  //   getEmpByDeptId(deptId: number): Observable<any> {
  //     console.log("deptId", deptId);
  //     return this.apiService.getEmpByDeptId(deptId).pipe(
  //       map(emp => {
  //         console.log("emp", emp)
  //         const test = emp.map((item: Employee) => ({
  //             ...item,
  //             fullName: `${item.firstname} ${item.lastname}`,
  //           })
  //       )
  //       return test
  //       })

  //     );
  // }

  // getEmpByDeptId(deptId: number): Observable<any[]> {
  //   return this.apiService.getEmpByDeptId(deptId).pipe(
  //     map(emp =>
  //       console.log(emp)
  //       emp.map((item: Employee) => ({
  //       ...item,
  //       fullName: `${item.firstname} ${item.lastname}`,
  //     })))
  // );
  // }

  //แรก
  // getEmpByDeptId(deptId: number): Observable<any> {
  //   console.log("deptId", deptId);
  //   return this.apiService.getEmpByDeptId(deptId).pipe(
  //     map(emp => {
  //       console.log(emp)
  //       const test = emp.map((item: Employee) => ({
  //           ...item,
  //           fullName: `${item.firstname} ${item.lastname}`,
  //         })
  //     )
  //     return test
  //     })

  //   );
  // }

  //สอง
  getEmpByDeptId(deptId: number): Observable<any[]> {
    return this.apiService.getEmpByDeptId(deptId).pipe(
      tap((emp) => console.log(emp)), // ใช้ tap เพื่อแสดงค่า emp ในคอนโซล
      map((emp) =>
        emp.map((item: Employee) => ({
          ...item,
          fullName: `${item.firstname} ${item.lastname}`,
        }))
      )
    );
  }

  async initEmpListByDeptId(deptid: number) {
    try {
      const res =
        (await this.apiService.getEmpByDeptId(deptid).toPromise()) || [];
      this.empList = res;
    } catch (error) {
      console.error(error);
    }
  }

  // ==================================

  async onSearch() {
    const formValues = this.expenseForm.value;

    // ตรวจสอบค่าที่ต้องเป็นตัวเลข
    const companyName = formValues.companyName;

    const sectorId: any = formValues.sectorName
      ? Number(formValues.sectorName)
      : null;
    const deptId: any = formValues.deptName
      ? Number(formValues.deptName)
      : null;

    const empId: any = formValues.empName
      ? this.empList.find(
          (item) => `${item.firstname} ${item.lastname}` === formValues.empName
        )?.id
      : null;
    // const id = formValues.id ? Number(formValues.id) : NaN;
    // console.log(this.dataEmp.id);

    // ตรวจสอบว่าค่าทั้งหมดมีอยู่และไม่เป็น undefined ก่อนส่งไปยัง API
    // if (
    //   companyName === undefined ||
    //   sectorId === undefined ||
    //   deptId === undefined
    // ) {
    //   console.error('Company ID, Sector ID, and Dept ID are required.');
    //   return; // หรือแสดงข้อความผิดพลาดใน UI
    // }

    const req: any = {
      page: 0, // ตัวอย่างค่าหน้าแรก
      size: 10, // ตัวอย่างขนาดหน้า
      companyName: companyName,
      sectorId: sectorId,
      deptId: deptId,
      userId: empId,
      startDate: formValues.startDate
        ? this.formatDate(formValues.startDate)
        : '', // ใช้ค่าว่างหากไม่มีวันที่
      endDate: formValues.endDate ? this.formatDate(formValues.endDate) : '', // ใช้ค่าว่างหากไม่มีวันที่
    };
    // console.log('req', req);

    try {
      const res = await this.apiService
        .getExpenseReportWithPaginationV2(req)
        .toPromise();
      // console.log(res);
      // res?.content.forEach(item => {
      //   item.
      // })
    } catch (error) {
      console.error(error);
    }

    // this.apiService.getExpenseReportWithPagination(req).subscribe(
    //   (response) => {
    //     this.welfareExpense.data = response.content.map((itemTable) => ({
    //       ...itemTable,
    //     })); // Assuming response.data contains the data
    //     console.log('this.welfareExpense.data', this.welfareExpense.data);
    //   },

    //   (error) => {
    //     console.error('Error fetching expense report:', error);
    //     // Handle error appropriately, possibly display an error message
    //     console.log('this.welfareExpense.data ', this.welfareExpense.data);
    //   }
    // );
  }

  // ฟังก์ชันสำหรับการแปลงวันที่
  formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // เดือนต้องมี 2 หลัก
    const day = ('0' + date.getDate()).slice(-2); // วันต้องมี 2 หลัก
    return `${year}-${month}-${day}`;
  }

  clearForm(): void {
    this.expenseForm.reset();
    this.welfareExpense.data = []; // Clear the table data
  }
}
