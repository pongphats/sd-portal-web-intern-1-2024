import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/services/swal.service';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import {Observable, of} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/interface/employee';
import { ExpenseForm, WelfareForm } from 'src/app/interface/form';
import { MatPaginator } from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
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
      sectorName: ['']
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
        const res = await this.apiService.getExpenseHisoryWithPagination(0,10, user.id).toPromise();
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

    
  async getSectors(companyName: string) {
    console.log("api1", companyName)
    try {
      const res = await this.commonService.getSectorCompanyName(companyName);
      console.log(res)
      this.sectorOptions = res
    } catch (error) {
      console.error('Error fetching sectors:', error);
    }
    console.log("api")
  }

  deptName: any[] = [];
   

    


    

    
   
    


}
