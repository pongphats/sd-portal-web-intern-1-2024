import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
// import { sector } from 'src/app/interface/common';
import { Department, Employee, Role, Sector } from 'src/app/interface/employee';
import { approverForms } from 'src/app/interface/form';
import { createEmployeeReq } from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-approver-manage-page',
  templateUrl: './approver-manage-page.component.html',
  styleUrls: ['./approver-manage-page.component.scss']
})
export class ApproverManagePageComponent implements OnInit {

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
      dataCompany: [''],
      dataDeptOrSector: [''],
    })
  }

  dataSectorsDeptsCompany: any[] = [];

  ngOnInit(): void {
    this.getAllPrivilegeApprover()
    this.getDataSectorsDeptsCompany()

    this.approverManageForm.get('dataCompany')?.valueChanges.subscribe(value => {
      console.log("company change")
      this.checkCompanyAndRole(value);

    });
  }

  async getDataSectorsDeptsCompany() {
    try {
      const res = await this.apiService.getSectorsDeptsCompanysList().toPromise();
      if (res) {
        this.dataSectorsDeptsCompany = res;
      }
    } catch (error) {
      this.dataSectorsDeptsCompany = [];
    }
  }

  async checkCompanyAndRole(value: string) {

    if (this.isVicePresident) {
      console.log("role: president", value)
      this.getListSector(value)
    }

    else {
      console.log("role: order", value)
      this.getListDept(value)
    }
  }


  async getListDept(value: string) {
    const resSector = await this.commonService.getSectorCompanyByName(value).toPromise();

    let deptList: any[] = [];
    for (const sector of resSector || []) {
      try {
        const res = await this.commonService.getDeptListBySectorId(sector.sectorId).toPromise();
        deptList = deptList.concat(res);
      } catch (error) {
        console.error(`Error fetching department list for sectorId ${sector.sectorId}`, error);
      }
    }

    this.deptOrSectorList = deptList.map((item: any) => ({
      id: item.id,
      name: item.deptName
    }))
  }

  async getListSector(value: string) {
    const res = await this.commonService.getSectorCompanyByName(value).toPromise();
    if (res) {
      this.deptOrSectorList = res.map((item: any) => ({
        id: item.sectorId,
        name: item.sectorName
      }))
    }
  }

  dataEmpSelect!: Employee;

  approverForm!: FormGroup<approverForms>;
  approverManageForm!: FormGroup<any>;

  isVicePresident: boolean = false;

  deptOrSectorList!: { id: number; name: string; }[];
  personList!: Employee[];

  dataSourceTable1 = new MatTableDataSource<any>([]); // เริ่มต้นด้วยข้อมูลว่าง
  dataSourceTable2 = new MatTableDataSource<any>([]); // เริ่มต้นด้วยข้อมูลว่าง
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

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

  async addPrivilegeBtn() {
    console.log("grantBtn")
    if (this.dataEmpSelect && this.approverManageForm.value.dataDeptOrSector) {
      let sectorListId: number[];
      let deptListId: number[];
      if (this.isVicePresident) {
        sectorListId = this.dataEmpSelect.sectors.map((sector: Sector) => sector.id);
        sectorListId.push(this.approverManageForm.value.dataDeptOrSector.id)
        deptListId = this.dataEmpSelect.departments.map((department: Department) => department.id);
      }
      else {
        sectorListId = this.dataEmpSelect.sectors.map((sector: Sector) => sector.id);
        deptListId = this.dataEmpSelect.departments.map((department: Department) => department.id);
        deptListId.push(this.approverManageForm.value.dataDeptOrSector.id)
      }

      const uid = this.dataEmpSelect.id

      const req: createEmployeeReq = {
        empCode: this.dataEmpSelect.empCode,
        title: this.dataEmpSelect.title,
        firstname: this.dataEmpSelect.firstname,
        lastname: this.dataEmpSelect.lastname,
        positionName: this.dataEmpSelect.position.positionName,
        email: this.dataEmpSelect.email,
        level: this.dataEmpSelect.level,
        typeEmp: this.dataEmpSelect.typeEmp || '',
        startDate: this.dataEmpSelect.startDate || '',
        passDate: this.dataEmpSelect.passDate || '',
        dept_actual: this.dataEmpSelect.department.id,
        sector_actual: this.dataEmpSelect.sector.id,
        deptID: deptListId,
        companyID: this.dataEmpSelect.companys.map((company: any) => company.id),
        sectorID: sectorListId,
        roles: this.dataEmpSelect.roles.map((role: Role) => role.role),//ทำไมเอาแค่string มันมี id,role
      }
      console.log("req", req)
      const res = await this.apiService.editEmployee(req, uid).toPromise();
      console.log("res", res)
      if (res.responseMessage == 'กรอกข้อมูลเรียบร้อย') {
        this.swalService.showSuccess("เพิ่มสิทธิ์เรียบร้อยแล้ว")
        this.settingPrivilegeBtn(this.dataEmpSelect)
      }
    }
    else {
      if (!this.dataEmpSelect) {
        this.swalService.showWarning("กรุณาเลือกรายชื่อผู้มีสิทธิอนุมัติ")
      }
      else if (!this.approverManageForm.value.dataDeptOrSector) {
        const mes = this.isVicePresident ? "กรุณาเลือกฝ่าย" : "กรุณาเลือกแผนก";
        this.swalService.showWarning(mes)

      }
    }
  }


  async settingPrivilegeBtn(element: any) {
    console.log("settingPrivilegeBtn")

    this.dataEmpSelect = element;

    // TODO: set "isVicePresident" & show table
    this.isVicePresident = element.roles.some((role: any) => role.role === 'VicePresident');
    if (this.isVicePresident) {
      this.displayedColumns1 = this.displayedColumns1.filter(col => col !== 'deptCode' && col !== 'deptName');
    } else {
      this.displayedColumns1 = [...this.originalDisplayedColumns1];
    }

    const company = element.company;
    const sector = element.sector;
    // TODO: set show "approverForm"
    this.approverForm.patchValue({
      fullName: element.firstname + ' ' + element.lastname,
      position: element.typeEmp,
      company: company.companyName,
      sectorCode: sector.sectorCode,
      deptCode: element.department.deptCode,
    })

    // TODO: get "deptOrSectorList"
    this.approverManageForm.reset()

    // TODO: get "dataSourceTable1"
    const res = await this.commonService.getUserDetailByEmpcode(element.empCode).toPromise();
    console.log("res: ", res)
    if (this.isVicePresident) {
      const sectors = res?.sectors.map((item: any) => {
        const departmentDetail = this.dataSectorsDeptsCompany.find(data => data.sectorId === item.id);
        return departmentDetail ? {
          company: departmentDetail.company,
          sectorCode: departmentDetail.sectorCode,
          sectorName: departmentDetail.sectorName,
          deptCode: '-',
          deptName: '-'
        } : null;
      })
      this.dataSourceTable1.data = sectors || [];

    } else {
      // TODO: เอา department.id ไปหา company & sector
      const departments = res?.departments.map((item: any) => {
        const departmentDetail = this.dataSectorsDeptsCompany.find(data => data.department.id === item.id);
        return departmentDetail ? {
          company: departmentDetail.company,
          sectorCode: departmentDetail.sectorCode,
          sectorName: departmentDetail.sectorName,
          deptCode: departmentDetail.department.deptCode,
          deptName: departmentDetail.department.deptFullName
        } : null;
      })
      this.dataSourceTable1.data = departments || [];
    }

    this.dataSourceTable1.paginator = this.paginator1;
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

    this.dataSourceTable2.paginator = this.paginator2;

  }


}

