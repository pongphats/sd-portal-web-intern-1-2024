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
      companyName: [''],
      sectorName: [''],
      deptName: [''],
      empName: [''],
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
        this.getDepartments(sectorName);
      }
    });

    // ฟังการเปลี่ยนแปลงของแผนก (deptName) 
    this.expenseForm.get('deptName')?.valueChanges.subscribe((deptId) => {
      if (deptId) {
        this.getEmpByDeptId(deptId);
      }
      console.log("emp from (deptName)", deptId)
    });

    //-------------------------


 

   
  }




  ngAfterViewInit() {
    this.welfareExpense.paginator = this.paginator;
  }



  //Auto
  filteredOptions!: Observable<any[]>;
  //table
  welfareExpense = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['dateOfAdmission', 'fullName', 'level', 'canWithdraw'];
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

  //แสดง 1 ถึง 5 ของ 6 ข้อมูล
  getPaginatorLabel(): string {
    if (this.paginator && this.welfareExpense) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize + 1;
      const endIndex = Math.min(startIndex + this.paginator.pageSize - 1, this.welfareExpense.data.length);
      const totalLength = this.welfareExpense.data.length;
      return `แสดง ${startIndex} ถึง ${endIndex} ของ ${totalLength} ข้อมูล`;
    }
    return '';
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

        // รีเซ็ต sectorName ให้ไม่มีค่าเพื่อให้แน่ใจว่าเมื่อเปลี่ยนบริษัท
        // การเลือกใน mat-select จะถูกรีเซ็ต
        this.expenseForm.get('sectorName')?.reset();
        // การเลือกใน mat-select จะถูกรีเซ็ต ค่า deptName
        this.expenseForm.get('deptName')?.reset();

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

      },
      error: (error) => {
        console.error('Error fetching departments:', error);
      }
    });
  }

  // -----------------------------------------------



  //AutoForm
  empFormOption!: Observable<any[]>;
  getEmpByDeptId(deptId: number): Observable<any> {
    console.log("deptId", deptId);
    return this.apiService.getEmpByDeptId(deptId).pipe(
      map(emp => ({
        ...emp,
        fullName: `${emp.firstname} ${emp.lastname}`
      }))

    );
  }







  
  
 
  // idByEmp: Employee[] = [];
  // getEmpByDeptId(deptId: number): Observable<any[]> {
  //   console.log("getEmpByDeptId",deptId)
  //   // กรณี ไม่กรอกอะไรเลย
  //   if (deptId == 0) {
  //     this.idByEmp = [];
  //     return of([]);
  //   }
  //   console.log(",,")
  //   return this.apiService.getEmpByDeptId(deptId).pipe(
  //     map((res: any) => {
  //       if (res == null) {
  //         this.idByEmp = [];
  //         return [];
  //       } else {
  //         const result = res.result;
  //         if (result.length == 0) {
  //           this.idByEmp = [];
  //           return [];
  //         }
  //         this.idByEmp = result.map((item: any) => ({
  //           ...item,
  //           fullName: `${item.firstname} ${item.lastname}`,
  //         }));
  //         console.log("xxx",this.idByEmp)
  //         return this.idByEmp;
  //       }
  //     })
  //   );
  // }


  
 






}
