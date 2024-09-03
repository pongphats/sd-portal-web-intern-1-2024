import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { map, Observable, startWith, tap } from 'rxjs';
import { level } from 'src/app/interface/common';
import { Employee } from 'src/app/interface/employee';
import { SearchEmpTableForms, userForms } from 'src/app/interface/form';
import { createEmployeeReq } from 'src/app/interface/request';
import {
  Company,
  Department,
  Position,
  Sector,
} from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-management-user-page',
  templateUrl: './management-user-page.component.html',
  styleUrls: ['./management-user-page.component.scss'],
})
export class ManagementUserPageComponent implements OnInit, AfterViewInit {
  userForms!: FormGroup<userForms>;
  allCompanyValues!: Company[];
  allSectorDepts!: Sector[];
  allDepts!: Department[];
  allPositions!: Position[];
  empCodeIsDuplicate: boolean = false;
  emailIsDuplicate: boolean = false;
  empLevels: string[] = [];
  userResult: Employee[] = [];
  pageLength: number = 10;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  centerEmp: Employee[] = [];
  centerEmpBackUp: Employee[] = [];
  isEditMode: boolean = false;
  editId: number = 0;
  searchGroupControl!: FormGroup<SearchEmpTableForms>;
  empCodeAutoComplte: string[] = [];
  empFullNameAutoComplte: string[] = [];
  empPositionAutoComplte: string[] = [];
  autoCompleteValue: string[] = [];

  filteredSearchValue!: Observable<any[]>;
  searchOptions: string[] = [];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private swalService: SwalService
  ) {
    this.userForms = this.fb.group({
      companyName: ['PCCTH', Validators.required],
      sectorName: ['', Validators.required],
      sectorCode: ['', Validators.required],
      deptName: ['', Validators.required],
      deptCode: ['', Validators.required],
      empCode: ['', Validators.required],
      empPrefix: ['', Validators.required],
      empFirstName: ['', Validators.required],
      empLastName: ['', Validators.required],
      empEmail: ['', [Validators.required, Validators.email]],
      empPosition: ['', Validators.required],
      empLevel: ['', Validators.required],
      empPrivileges: ['', Validators.required],
      empType: ['', Validators.required],
      empStartDate: [null, Validators.required],
      empPassDate: [null],
    }) as FormGroup<userForms>;

    this.searchGroupControl = this.fb.group({
      searchType: ['', Validators.required],
      searchValue: ['', Validators.required],
    }) as FormGroup<SearchEmpTableForms>;
  }

  async ngOnInit() {
    await this.intSectorAndDeptByCompany();
    await this.initializedLevelInSelection();
    this.filterSelectedCompany();
    this.filteredSearchValue =
      this.searchGroupControl.controls.searchValue.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
  }

  loadingpage() {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 0;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.pageLength = this.centerEmp.length;
    this.userResult = this.centerEmp.slice(startIndex, endIndex);
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadingpage())).subscribe();
  }

  async intSectorAndDeptByCompany() {
    try {
      const data = await this.apiService
        .findAllSectorDepartmentPostions()
        .toPromise();
      if (data) {
        this.allCompanyValues = data;
      } else {
        throw new Error(`value not found`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  filterSelectedCompany(companyName: string = 'PCCTH') {
    this.allSectorDepts = this.allCompanyValues
      .filter((company) => company.company === companyName)
      .map((company) => company.sectors)
      .flat();

    console.log(this.allSectorDepts);
  }

  filterDeptBySectors(sectorName: string) {
    this.allDepts = this.allSectorDepts
      .filter((sector) => sector.sectorname === sectorName)
      .map((sector) => sector.departments)
      .flat();

    const sectorCode =
      this.allSectorDepts.find((sector) => sector.sectorname === sectorName)
        ?.sectorcode || '';
    this.userForms.controls.sectorCode.setValue(sectorCode);
  }

  async filterPositionByDept(deptName: string) {
    const deptId =
      this.allDepts.find((item) => item.deptname === deptName)?.deptid || 0;
    this.allPositions = this.allDepts
      .filter((dept) => dept.deptname == deptName)
      .map((dept) => dept.positions)
      .flat();
    const deptcode =
      this.allDepts.find((dept) => dept.deptname === deptName)?.deptcode || '';
    this.userForms.controls.deptCode.setValue(deptcode);

    if (!this.isEditMode) {
      try {
        this.swalService.showLoading();
        const res =
          (await this.apiService
            .getAllActiveEmpsByDeptId(deptId)
            .toPromise()) || [];
        this.centerEmp = this.commonService.sortData(res, 'empCode', 'asc');
        this.centerEmpBackUp = this.centerEmp;
        this.pageLength = this.centerEmp.length;
        this.userResult = this.centerEmp.slice(0, 5);
        Swal.close();

        this.empPositionAutoComplte = this.allPositions.map(
          (item) => item.name
        );
        this.empCodeAutoComplte = this.centerEmp.map((item) => item.empCode);
        this.empFullNameAutoComplte = this.centerEmp.map(
          (item) => `${item.firstname} ${item.lastname}`
        );
      } catch (error) {
        console.error(error);
        this.swalService.showError('เกิดข้อผิดพลาด');
      }
    }
  }

  async checkDulicateEmpCode() {
    try {
      const empCode = this.userForms.controls.empCode.value || '';
      const result = await this.commonService
        .checkDuplicateEmpCode(empCode)
        .toPromise();

      if (result != undefined && !this.isEditMode) {
        this.empCodeIsDuplicate = result; // Assume result returns `true` if duplicate found, `false` otherwise
        this.userForms.controls.empCode.setErrors(
          result ? { duplicate: true } : null
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  checkDulicateEmail() {
    const email = this.userForms.controls.empEmail.value || '';
    const result = this.userResult.find((item) => item.email == email);
    if (result && !this.isEditMode) {
      this.userForms.controls.empEmail.setErrors({ duplicate: true });
      this.emailIsDuplicate = true;
    } else {
      this.userForms.controls.empEmail.setErrors(null);
      this.emailIsDuplicate = false;
    }
  }

  async initializedLevelInSelection() {
    try {
      const res = await this.apiService.getEmpLevels().toPromise();
      if (res) {
        this.empLevels = res.map((item) => item.level);
        this.empLevels.sort((a: any, b: any) => {
          if (a && b) {
            return a.localeCompare(b, 'en', { numeric: true });
          }
          return 0;
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  DataCSV!: FormData;
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const csvData = XLSX.utils.sheet_to_csv(worksheet);

        this.DataCSV = new FormData();
        this.DataCSV.append(
          'file',
          new Blob([csvData], { type: 'text/csv;charset=utf-8' }),
          'file.csv'
        );
      };

      if (file.type === 'text/csv') {
        reader.readAsText(file, 'UTF-8');
      } else {
        reader.readAsBinaryString(file);
      }
    }
  }

  async uploadFileUser() {
    const result = await this.swalService.showConfirm(
      'โปรดตรวจสอบว่าได้เลือกบริษัทของพนักงานที่ต้องการอัปโหลดไฟล์หรือไม่'
    );

    if (result) {
      const companySelected = this.userForms.controls.companyName.value || '';
      try {
        this.swalService.showLoading();
        if (companySelected == 'PCCTH') {
          const res = await this.apiService
            .uploadPccUser(this.DataCSV)
            .toPromise();
          if (res.responseMessage == 'สำเร็จ') {
            this.swalService.showSuccess('อัปโหลดข้อมูลสำเร็จ');
          } else {
            throw new Error(res.responseMessage);
          }
        } else if (companySelected == 'WiseSoft') {
          const res = await this.apiService
            .uploadWsUser(this.DataCSV)
            .toPromise();
          if (res.responseMessage == 'สำเร็จ') {
            this.swalService.showSuccess('อัปโหลดข้อมูลสำเร็จ');
          } else {
            throw new Error(res.responseMessage);
          }
        } else {
          this.swalService.showWarning('โปรดเลือกบริษัทก่อนทำการอัปโหลด');
        }
      } catch (error) {
        console.error(error);
        this.swalService.showError('เกิดข้อผิดพลาดในการอัปโหลด');
      }
    } else {
      return;
    }
  }

  mngDeptIdList: number[] = [];
  mngSectorIdList: number[] = [];
  initialUserToForms(data: Employee) {
    console.log(data, typeof data);
    this.isEditMode = true;
    this.mngDeptIdList = data.departments.map((dept) => dept.id);
    this.mngSectorIdList = data.sectors.map((sector) => sector.id);
    // console.log(data.id);

    this.editId = data.id;
    this.userForms.patchValue({
      empCode: data.empCode,
      empPrefix: data.title,
      empFirstName: data.firstname,
      empLastName: data.lastname,
      empEmail: data.email,
      empPosition: data.position.positionName,
      empLevel: data.level,
      empPrivileges: this.commonService.mappedRole(data.roles),
      empType: data.typeEmp,
      empStartDate: new Date(data.startDate || ''),
      empPassDate: new Date(data.passDate || ''),
    });
  }

  cancelAction() {
    this.isEditMode = false;
    this.editId = 0;
    this.userForms.patchValue({
      empCode: '',
      empPrefix: '',
      empFirstName: '',
      empLastName: '',
      empEmail: '',
      empPosition: '',
      empLevel: '',
      empPrivileges: '',
      empType: '',
      empStartDate: null,
      empPassDate: null,
    });
  }

  async saveForms() {
    this.swalService.showLoading();
    try {
      const data = await this.mappingData();
      if (this.isEditMode) {
        const uid = this.editId;
        const res = await this.apiService.editEmployee(data, uid).toPromise();
      } else {
        const res = await this.apiService.createEmployee(data).toPromise();
      }
      const message = this.isEditMode
        ? 'แก้ไขข้อมูลสำเร็จ'
        : 'บันทึกข้อมูลสำเร็จ';
      this.swalService.showSuccess(message);
    } catch (error) {
      console.error(error);
      this.swalService.showError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      await this.fetchAfterAction();
    }
  }

  async mappingData(): Promise<createEmployeeReq> {
    let empRequstData: createEmployeeReq = {
      empCode: '',
      title: '',
      firstname: '',
      lastname: '',
      positionName: '',
      email: '',
      level: '',
      typeEmp: '',
      startDate: '',
      passDate: '',
      dept_actual: 0,
      sector_actual: 0,
      deptID: [],
      companyID: [],
      sectorID: [],
      roles: [],
    };
    try {
      const companyName = this.userForms.controls.companyName.value || '';
      const companyId =
        (await this.commonService
          .getCompanyIdByName(companyName)
          .toPromise()) || 0;
      const deptName = this.userForms.controls.deptName.value || '';
      const sectorName = this.userForms.controls.sectorName.value || '';
      const dept_actualId =
        this.allDepts.find((e) => e.deptname == deptName)?.deptid || 0;
      const sector_actualId =
        this.allSectorDepts.find((e) => e.sectorname == sectorName)?.sectorid ||
        0;
      const roles = this.commonService.splitRole(
        this.userForms.controls.empPrivileges.value || ''
      );

      if (!this.mngDeptIdList.includes(dept_actualId)) {
        this.mngDeptIdList.push(dept_actualId);
      }

      if (!this.mngSectorIdList.includes(sector_actualId)) {
        this.mngSectorIdList.push(sector_actualId);
      }
      empRequstData = {
        companyID: [companyId],
        dept_actual: dept_actualId,
        deptID: [dept_actualId],
        email: this.userForms.controls.empEmail.value || '',
        empCode: this.userForms.controls.empCode.value || '',
        firstname: this.userForms.controls.empFirstName.value || '',
        lastname: this.userForms.controls.empLastName.value || '',
        level: this.userForms.controls.empLevel.value || '',
        title: this.userForms.controls.empPrefix.value || '',
        positionName: this.userForms.controls.empPosition.value || '',
        typeEmp: this.userForms.controls.empType.value || '',
        startDate: this.commonService.formatDateToYYYYMMDDString(
          new Date(this.userForms.controls.empStartDate.value || '')
        ),
        passDate: this.commonService.formatDateToYYYYMMDDString(
          new Date(this.userForms.controls.empPassDate.value || '')
        ),
        sector_actual: sector_actualId,
        sectorID: [sector_actualId],
        roles: roles,
      };
      if (this.isEditMode) {
        if (this.userForms.controls.empPrivileges.value != 'User') {
          empRequstData = {
            ...empRequstData,
            sectorID: this.mngSectorIdList,
            deptID: this.mngDeptIdList,
          };
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      return empRequstData;
    }
  }

  async fetchAfterAction() {
    try {
      const deptName = this.userForms.controls.deptName.value;
      const deptId =
        this.allDepts.find((item) => item.deptname === deptName)?.deptid || 0;
      const res =
        (await this.apiService.getAllActiveEmpsByDeptId(deptId).toPromise()) ||
        [];
      this.centerEmp = this.commonService.sortData(res, 'empCode', 'asc');
      this.centerEmpBackUp = this.centerEmp;
      this.pageLength = this.centerEmp.length;
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingpage();
      this.cancelAction();
    }
  }

  async initialSearchValue(option: string) {
    if (option == 'empCode') {
      this.searchOptions = this.centerEmpBackUp.map((item) => item.empCode);
    } else if (option == 'fullName') {
      this.searchOptions = this.centerEmpBackUp.map(
        (item) => `${item.firstname} ${item.lastname}`
      );
    } else if (option == 'position') {
      this.searchOptions = this.centerEmpBackUp.map(
        (item) => item.position.positionName
      );
    } else {
      this.searchOptions = [];
    }

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  filterBySearchValue() {
    const option = this.searchGroupControl.controls.searchType.value || '';
    const value = this.searchGroupControl.controls.searchValue.value || '';

    if (option == 'empCode') {
      this.centerEmp = this.centerEmpBackUp.filter(
        (item) => item.empCode == value
      );
    } else if (option == 'fullName') {
      this.centerEmp = this.centerEmpBackUp.filter(
        (item) => `${item.firstname} ${item.lastname}` == value
      );
    } else if (option == 'position') {
      this.centerEmp = this.centerEmpBackUp.filter(
        (item) => item.position.positionName == value
      );
    } else {
      this.centerEmp = this.centerEmpBackUp;
    }
    this.loadingpage();
  }

  clearFilterSearch() {
    this.searchGroupControl.reset();
    this.centerEmp = this.centerEmpBackUp;
    this.loadingpage();
  }
}
