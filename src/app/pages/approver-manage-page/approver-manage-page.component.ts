import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Employee } from 'src/app/interface/employee';
import { approverForms } from 'src/app/interface/form';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-approver-manage-page',
  templateUrl: './approver-manage-page.component.html',
  styleUrls: ['./approver-manage-page.component.scss']
})
export class ApproverManagePageComponent implements OnInit {
  [x: string]: any;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private router: Router,
    private commonService: CommonService,
    private apiService: ApiService,
  ) {
    this.approverForm = this.fb.group({
      fullName: [''],
      position: [''],
      company: [''],
      sectorCode: [''],
      deptCode: [''],
    })

    this.approverManageForm = this.fb.group({
      dataCompany: ['PCCTH'],
      dataDept: [''],
    })
  }

  ngOnInit(): void {
    this.getAllPrivilegeApprover()

    this.approverManageForm.get('dataCompany')?.valueChanges.subscribe(value => {
      console.log("company change")
      if (this.isVicePresident) {
        console.log("role: president")
        this.getListSector(value);
      } else {
        console.log("role: order")
        this.getListDept(value);
      }
    });
  }

  ngAfterViewInit() {

  }

  async getListDept(value: string) {
    // const res = await this.commonService.getSectorCompanyName

  }

  getListSector(value: string) {
    // Replace with your API call logic for API b
  }

  approverForm!: FormGroup<approverForms>;
  approverManageForm!: FormGroup<any>;

  isVicePresident: boolean = false;

  deptOrSectorList: string[] = ['1', '2', '3']
  personList!: Employee[];

  dataSourceTable1 = new MatTableDataSource<any>([]); // เริ่มต้นด้วยข้อมูลว่าง
  dataSourceTable2 = new MatTableDataSource<any>([]); // เริ่มต้นด้วยข้อมูลว่าง
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  originalDisplayedColumns1: string[] = [
    'company',
    'sectorCode',
    'sectorName',
    'deptCode',
    'deptName',
    'revoke'
  ];

  displayedColumns1: string[] = [...this.originalDisplayedColumns1];

  displayedColumns2: string[] = [
    'company',
    'empCode',
    'fullName',
    'position',
    'assignPrivilege'
  ];

  cancelPrivilegeBtn(element: any) {
    console.log("cancelPrivilegeBtn")
    console.log(element)
  }

  addPrivilegeBtn() {
    console.log("grantBtn")
  }


  async settingPrivilegeBtn(element: any) {
    console.log("settingPrivilegeBtn")

    // TODO: set "isVicePresident"
    this.isVicePresident = element.roles.some((role: any) => role.role === 'VicePresident');
    if (this.isVicePresident) {
      this.displayedColumns1 = this.displayedColumns1.filter(col => col !== 'deptCode' && col !== 'deptName');
    } else {
      this.displayedColumns1 = [...this.originalDisplayedColumns1];
    }

    const company = element.company;
    const sector = element.sector;
    // TODO: set Form
    this.approverForm.patchValue({
      fullName: element.firstname + ' ' + element.lastname,
      position: element.typeEmp,
      company: company.companyName,
      sectorCode: sector.sectorCode,
      deptCode: element.department.deptCode,
    })

    const res = await this.commonService.getUserDetailByEmpcode(element.empCode).toPromise();
    if (this.isVicePresident) {
      console.log("v")
      const sectors = res?.sectors.map((item: any) => ({
        company: company?.companyName,
        sectorCode: item.sectorCode,
        sectorName: item.sectorName,
        deptCode: '-',
        deptName: '-'
      }))
      this.dataSourceTable1.data = sectors || [];

    } else {
      const departments = res?.departments.map((item: any) => ({
        company: company?.companyName,
        sectorCode: sector?.sectorCode,
        sectorName: sector?.sectorName,
        deptCode: item.deptCode,
        deptName: item.deptFullName
      }))
      this.dataSourceTable1.data = departments || [];
    }
  }

  async getAllPrivilegeApprover() {
    const res = await this.apiService.getAllPrivilegeApprovers().toPromise();
    console.log(res)
    if (res) {
      this.personList = res
    }

    // TODO: เปลี่ยนตำแหน่งจากภาษาอังกฤษเป็นภาษาไทย
    this.dataSourceTable2.data = this.personList.map((item: any) => ({
      ...item,
      roleTH: this.commonService.translateRole(item.roles),
    }));;

    // TODO: เรียงลำดับในการแสดง
    const order = ['ประธานเจ้าหน้าที่บริหาร/กรรมการผู้จัดการ', 'ผู้บริหาร', 'ผู้บังคับบัญชา', 'ผู้บังคับบัญชา/แผนกบุคคล', 'หัวหน้างาน'];
    this.dataSourceTable2.data.sort((a, b) => {
      return order.indexOf(a.roleTH) - order.indexOf(b.roleTH);
    });


    this.dataSourceTable2.paginator = this.paginator;
  }


}

