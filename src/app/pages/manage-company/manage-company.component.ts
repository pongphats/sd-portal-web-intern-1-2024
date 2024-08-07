import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { SectorManageForm } from 'src/app/interface/form';
import { CreateSectorRequest } from 'src/app/interface/request';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';


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
      deptId: ['', Validators.required],
      deptCode: ['', [Validators.required]],
      deptManage: ['', [Validators.required]],
    })

  }


  ngOnInit(): void {
    //Auto
    this.filteredOptions = this.deptManage.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.deptManage)),
      map(deptManage => (deptManage ? this._filter(deptManage) : this.adminEmps.slice())),
    );

    this.genAdmin();
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
      } else {
        this.adminEmps = []; // Or handle the case where `res` is `undefined`
      }

    }

    catch (error) {
      console.error('Error generating admin full names:', error);
    }


  }



  //Auto
  deptManage = new FormControl();
  // myControl = new FormControl();
  // options: User[] = [{ deptManage: 'UUU' }, { deptManage: 'RRR' }, { deptManage: 'to' }];
  filteredOptions!: Observable<string[]>;

  displayFn(user: User): string {
    return user && user.deptManage ? user.deptManage : '';
  }

  private _filter(deptManage: string): string[] {
    const filterValue = deptManage.toLowerCase();

    return this.adminEmps
      .filter((option: string) => option.toLowerCase().includes(filterValue))
      .sort();
  }

  async createSectorDept() {

    console.log("GO")
    const companyId = this.sectorManageForm.value.company || ''; // แปลงค่าจากฟอร์มเป็นหมายเลข
    console.log(companyId)
    const res = await this.commonService.getCompanyIdByName(companyId).toPromise();
    console.log(res)


    //interface request -> CreateSectorRequest / form -> SectorManageForm
    //หน้า request หลัง form
    const req: CreateSectorRequest = {
      companyId: res || 0,
      sectorTname: this.sectorManageForm.value.sectorTname || '',
      sectorFullName: this.sectorManageForm.value.sectorEname || '', 
      sectorCode: this.sectorManageForm.value.sectorCode || '',
      deptTname: this.sectorManageForm.value.deptTname || '',
      deptFullName: this.sectorManageForm.value.deptEname || '',
      deptCode: this.sectorManageForm.value.deptCode || '',
      firstName: "",
      lastName: "",
      sectorName: this.sectorManageForm.value.sectorCode || '',
      deptName: this.sectorManageForm.value.deptCode || '',


    };

    console.log(req)
    try {
      //call api
      const apiRes = await this.apiService.createSectorAndDept(req).toPromise();
      console.log('Sector and Department created successfully:', apiRes);
    } catch (error) {
      // การจัดการข้อผิดพลาด
      console.error('Error creating sector and department:', error);
    }


    

  }

  
  




}
