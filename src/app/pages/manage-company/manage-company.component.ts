import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { SectorManageForm } from 'src/app/interface/form';
import { CreateSectorRequest } from 'src/app/interface/request';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


// Auto
export interface User {
  deptManage: string;
}

@Component({
  selector: 'app-manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.scss']
})
export class ManageCompanyComponent implements OnInit {



  sectorManageForm!: FormGroup<SectorManageForm>;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private apiService: ApiService

  ) {
    this.sectorManageForm = this.fb.group({
      company: ['PCCTH', [Validators.required]],
      sectorTname: ['', [Validators.required]],
      sectorEname: ['', [Validators.required]],
      sectorCode: ['', [Validators.required]],
      deptTname: ['', [Validators.required]],
      deptEname: ['', [Validators.required]],
      deptId: ['', [Validators.required]], //ไอดีแผนก
      deptCode: ['', [Validators.required]], //รหัสแผนก
      deptManage: ['', [Validators.required]],
    });

  }


  ngOnInit(): void {
    //Auto
    this.filteredOptions = this.sectorManageForm.get('deptManage')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : '')),
      map(deptManage => (deptManage ? this._filter(deptManage) : this.adminEmps.slice())),
    );

    this.genAdmin();//1

    this.loadSpecificCompanySectors();//2

  }

//
  ngAfterViewInit() {
    this.dataManageCompany.paginator = this.paginator;
  }


  



  //Auto
  adminEmps: string[] = [];
  async genAdmin() {
    try {
      //api
      const res = await this.commonService.generateAdminFullName().toPromise();
      if (res) {
        this.adminEmps = res;
        console.log(res)
        console.log('Admin Options:', this.adminEmps); // ดูว่ามีข้อมูลถูกต้องหรือไม่
      } else {
        this.adminEmps = []; // Or handle the case where `res` is `undefined`
      }

    }

    catch (error) {
      console.error('Error generating admin full names:', error);
    }


  }



  //Auto
  filteredOptions!: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.adminEmps
      .filter((option: string) => option.toLowerCase().includes(filterValue))
      .sort();
  }

  //add
  async createSectorDept() {
    //companyId ส่งไปหลัง
    console.log("Pass")
    const companyId = this.sectorManageForm.value.company || ''; // แปลงค่าจากฟอร์มเป็นหมายเลข
    console.log(companyId)
    const res = await this.commonService.getCompanyIdByName(companyId).toPromise();
    console.log(res)

    console.log(this.sectorManageForm)


    // console.log('deptManage value:', this.sectorManageForm.value.deptManage);

    // ตรวจสอบและแยกชื่อเต็ม
    const deptManageValue = this.sectorManageForm.value.deptManage || ''; // ค่าจากฟอร์ม
    console.log('deptManage value:', this.sectorManageForm.value.deptManage);

    const manageFullName = typeof deptManageValue === 'string' ? deptManageValue.split(' ') : [];
    const manageFirstName =
      manageFullName.length === 3 ? manageFullName[1] : (manageFullName[0] || '');
    const manageLastName =
      manageFullName.length === 3 ? manageFullName[2] : (manageFullName[1] || '');

    //interface request -> CreateSectorRequest / form -> SectorManageForm
    //หน้า request หลัง form
    const req: CreateSectorRequest = {
      companyId: res || 0,
      sectorTname: this.sectorManageForm.value.sectorTname || '',  //ฝ่ายไทย
      sectorFullName: this.sectorManageForm.value.sectorEname || '',   //ฝ่ายอังกฤษ
      sectorCode: this.sectorManageForm.value.sectorCode || '',      //รหัสฝ่าย
      deptTname: this.sectorManageForm.value.deptTname || '',        //แผนกไทย
      deptFullName: this.sectorManageForm.value.deptEname || '',    //แผนกอังกฤษ
      deptCode: this.sectorManageForm.value.deptId || '',
      firstName: manageFirstName,
      lastName: manageLastName,
      sectorName: this.sectorManageForm.value.sectorCode || '', //
      deptName: this.sectorManageForm.value.deptCode || '',  //รหัสแผนก 
    };

    console.log(req)
    try {
      //call api
      const apiRes = await this.apiService.createSectorAndDept(req).toPromise();
      console.log('Sector and Department created successfully:', apiRes);

      this.sectorManageForm.reset(); // Reset form after successful creation


    // // Update the table data
    // await this.loadSpecificCompanySectors(); // Re-fetch data to include new sector/department

    } catch (error) {
      // การจัดการข้อผิดพลาด
      console.error('Error creating sector and department:', error);
    }




  }


  //Table
  // dataManageCompany: any[] = [];

  dataManageCompany = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  
 //แสดงในตารางไม่ครบตรงนี้ จาก swagger
  displayedColumns: string[] = ['sectorTname', 'sectorFullName', 'sectorCode', 'department.deptTname','department.deptFullName', 'department.deptName', 'department.deptCode'];


   async loadSpecificCompanySectors() {
    // ดึงค่าของ companyId จากฟอร์ม
     const companyId = this.sectorManageForm.value.company || '';
     console.log(`Loading sectors for company: ${companyId}`); // 
     try{
      const companySectors = await this.commonService.getSectorAndDeptsListByCompanyName(companyId);
    
     console.log('OtherCompany sector: ', companySectors)

     this.dataManageCompany.data  = companySectors;

     console.log('Data for table:', this.dataManageCompany.data);

     

  } catch (error) {
    console.error('Error loading manage company data:', error);
  }
     
  }

// async
async clearForm(){
  this.sectorManageForm.reset()
}
// public clearForm(): void{
//   this.sectorManageForm.reset()
// }


}
