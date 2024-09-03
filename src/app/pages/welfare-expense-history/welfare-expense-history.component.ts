import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/services/swal.service';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import { Observable, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/interface/employee';
import { ExpenseForm, WelfareForm } from 'src/app/interface/form';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';

@Component({
  selector: 'app-welfare-expense-history',
  templateUrl: './welfare-expense-history.component.html',
  styleUrls: ['./welfare-expense-history.component.scss']
})


export class WelfareExpenseHistoryComponent implements OnInit {


  //Auto
  welfareForm!: FormGroup<WelfareForm>;
  expenseForm!: FormGroup<any>;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private commonService: CommonService,
    private apiService: ApiService,
    public dialog: MatDialog,
  ) {
    this.welfareForm = this.fb.group({
      fullName: ['', Validators.required],
    });

    this.expenseForm = this.fb.group({
      companyName: ['', Validators.required],
      sectorName: ['', Validators.required],
      deptName: ['', Validators.required],
      empName: ['', Validators.required],
      dateRange: [''],
    });

  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    //Auto
    this.filteredOptions = this.welfareForm.get('fullName')!.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => this.getEmp(value ? value : ''))
    );

    // ฟังการเปลี่ยนแปลงของฟอร์ม
    this.expenseForm.get('companyName')?.valueChanges.subscribe((companyName) => {
      if (companyName) {
        this.getSectors(companyName);
      }
    });

    //dept
    this.expenseForm.get('sectorName')?.valueChanges.subscribe((sectorName) => {
      if (sectorName) {
        this.expenseForm.patchValue({
          deptName : ''
        })
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
      console.log("deptId", deptId)
      if (deptId) {
        this.expenseForm.patchValue({
          empName:''
        })
        this.empFormOption = this.getEmpByDeptId(deptId);
        // this.filteredOptions = this.empFormOption;
      } 
    });

    // ฟังการเปลี่ยนแปลงของ empName
    this.filteredOptions = this.expenseForm.get('empName')!.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.empFormOption.pipe(
        map(options => options.filter(emp => emp.fullName.toLowerCase().includes(value.toLowerCase())))
      ))
    );



    







  }






  ngAfterViewInit() {
    this.welfareExpense.paginator = this.paginator;
  }



  //Auto
  filteredOptions!: Observable<any[]>;
  //table
  welfareExpense = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['company', 'sectorDept', 'empCode', 'firstName', 'lastName', 'position', 'email', 'status'];
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
          console.log(this.dataListEmp)
          return this.dataListEmp;
        }
      })
    );
  }


  //  ชื่อตาราง welfareExpense
  //ค้นหา
  async searchExpenses(): Promise<void> {
    const fullName = this.welfareForm.get('fullName')?.value;
    // ค้นหาผู้ใช้โดยใช้ firstname และ lastname
    const user = this.dataListEmp.find(emp =>
      `${emp.firstname} ${emp.lastname}` === fullName
    );

    console.log(user)

    if (user) {
      const res = await this.apiService.getExpenseHisoryWithPagination(0, 10, user.id).toPromise();
      console.log(res.content)

      this.welfareExpense.data = res.content.map((expense: any) => ({
        ...expense,
        fullName: `${user.firstname} ${user.lastname}`,
        level: user.level,
      }))

    } else {
      this.swalService.showError('User not found');
    }

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
    console.log("Fetching sectors for company:", companyName);
    this.commonService.getSectorCompanyByName(companyName).subscribe({
      next: (res) => {
        console.log("Sectors fetched:", res);
        this.sectorOptions = res; // `res` คือค่าที่ได้รับจาก observable

        // // รีเซ็ต sectorName ให้ไม่มีค่าเพื่อให้แน่ใจว่าเมื่อเปลี่ยนบริษัท
        // // การเลือกใน mat-select จะถูกรีเซ็ต
        // this.expenseForm.get('sectorName')?.reset();
        // // การเลือกใน mat-select จะถูกรีเซ็ต ค่า deptName
        // this.expenseForm.get('deptName')?.reset();

      },
      error: (error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    });
    console.log("api");
  }

  // ----------------------------------
  deptName: any[] = [];
  deptOptions: any[] = [];

  getDepartments(sectorId: number) {
    this.commonService.getDeptListBySectorId(sectorId).subscribe({
      next: (res) => {
        console.log("Departments fetched::", res);
        this.deptOptions = res;
        this.expenseForm.get('deptName')?.reset();
        // this.expenseForm.get('empName')?.reset();

      },
      error: (error) => {
        console.error('Error fetching departments:', error);
      }
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
        tap(emp => console.log(emp)), // ใช้ tap เพื่อแสดงค่า emp ในคอนโซล
        map(emp => 
          emp.map((item: Employee) => ({
            ...item,
            fullName: `${item.firstname} ${item.lastname}`,
          }))
        )
      );
    }





  // ==================================
 


  // async searchExpensesTable(): Promise<void> {
  //   const fullName = this.welfareForm.get('fullName')?.value;
  //   // ค้นหาผู้ใช้โดยใช้ firstname และ lastname
  //   const user = this.dataListEmp.find(emp =>
  //     `${emp.firstname} ${emp.lastname}` === fullName
  //   );

  //   console.log(user)

  //   if (user) {
  //     const res = await this.apiService.getExpenseReportWithPagination(expenseReportRequest).toPromise();
  //     console.log(res.content)

  //     this.welfareExpense.data = res.content.map((expense: any) => ({
  //       ...expense,
  //       fullName: `${user.firstname} ${user.lastname}`,
  //       level: user.level,
  //     }))

  //   } else {
  //     this.swalService.showError('User not found');
  //   }

  // }

















}
