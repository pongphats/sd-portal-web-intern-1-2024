import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BuddhistDatePipe } from '@shared/pipes/budhist-date.pipe';
import { map, startWith } from 'rxjs';
import { Course, fileEdit } from 'src/app/interface/common';
import { Employee } from 'src/app/interface/employee';
import { trainingForm } from 'src/app/interface/form';
import { MngDeptListRes } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-section-one-form',
  templateUrl: './section-one-form.component.html',
  styleUrls: ['./section-one-form.component.scss'],
})
export class SectionOneFormComponent implements OnInit {
  trainingForm!: FormGroup<trainingForm>;
  // for keep data in memory
  mngDeptListRes: MngDeptListRes[] = [];
  // for show in selector
  mngDeptListShow: MngDeptListRes[] = [];

  tableToggle: boolean = false;

  courseList!: Course[];
  empList!: Employee[];
  empNameList!: string[];
  allPrivilegesApproversList!: Employee[];
  approversList!: Employee[];
  managersList!: Employee[];
  vicePresList!: Employee[];
  presidentsList!: Employee[];
  empNameListFiltered: any;
  sectionCanEditRole!: boolean;

  roleCheck!: string;

  trainingFiles: fileEdit[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private commonService: CommonService,
    private buddhistDatePipe: BuddhistDatePipe,
    private trainingService: TrainingService,
    private swalService: SwalService
  ) {
    this.trainingForm = this.fb.group({
      company: ['', Validators.required],
      deptCode: ['', Validators.required],
      deptId: [''],
      addMissionDate: [new Date(), Validators.required],
      formsType: ['', Validators.required],
      courseName: ['', Validators.required],
      courseObjective: [''],
      courseDuration: [''],
      courseDescription: [''],
      courseProject: [''],
      coursePrice: [''],
      courseTeacher: [''],
      courseLocation: [''],
      budgetType: ['', Validators.required],
      budgetDescription: [''],
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required],
      employeePosition: ['', Validators.required],
      approverName: [''],
      managerName: [''],
      vicePresName: [''],
      vicePresName2: [''],
      presidentName: [''],
    }) as FormGroup<trainingForm>;
  }

  async ngOnInit() {
    const id = this.trainingService.trainingEditData;
    // console.log('id:', id);

    this.roleCheck = this.authService.checkRole();
    this.sectionCanEditRole =
      this.roleCheck == 'ROLE_Personnel' ||
      this.roleCheck == 'ROLE_Admin' ||
      this.roleCheck == 'ROLE_ManagerAndROLE_Personnel';
    await this.initDeptSelectorByRole();
    await this.generateCoursesList();
    await this.initSectionOne();
    this.displayAutocomplete();
  }

  async initSectionOne() {
    try {
      const data = this.trainingService.trainingEditData;
      const req = this.trainingService.trainingRequest;
      // console.log('req:', req);

      // company select
      this.trainingForm.controls.company.setValue(
        data.training.user.company.companyName
      );
      this.filterDeptByCompanyName(
        this.trainingForm.controls.company.value || ''
      );
      // dept select
      this.trainingForm.controls.deptCode.setValue(
        data.training.user.department.deptName
      );
      this.generateDeptCode(this.trainingForm.controls.deptCode.value || '');

      // create date forms
      this.trainingForm.controls.addMissionDate.setValue(
        new Date(data.training.dateSave || '')
      );

      // forms type
      this.trainingForm.controls.formsType.setValue(data.training.action || '');

      // course select
      this.trainingForm.controls.courseName.setValue(
        data.training.courses.map((item) => item.courseName)[0] || ''
      );
      this.generateCourseForms(
        this.trainingForm.controls.courseName.value || ''
      );
      this.trainingForm.controls.courseProject.setValue(
        data.training.projectCourse || ''
      );
      // budget radio
      this.trainingForm.controls.budgetType.setValue(
        data.training.budgetType || ''
      );
      this.trainingForm.controls.budgetDescription.setValue(
        data.training.etcDetails || ''
      );

      // emp detail
      const fullName = `${data.training.user.firstname} ${data.training.user.lastname}`;
      this.trainingForm.controls.employeeName.setValue(fullName);
      this.trainingForm.controls.employeeId.setValue(
        data.training.user.empCode
      );
      this.trainingForm.controls.employeePosition.setValue(
        data.training.user.position.positionName
      );

      // privilegde user
      data.training.status.forEach((item) => {
        const empCode = item.approveId.empCode;
        if (item.indexOfSignature == 1) {
          this.trainingForm.controls.approverName.setValue(empCode);
        } else if (item.indexOfSignature == 2) {
          this.trainingForm.controls.managerName.setValue(empCode);
        } else if (item.indexOfSignature == 3) {
          this.trainingForm.controls.vicePresName.setValue(empCode);
        } else if (item.indexOfSignature == 4) {
          this.trainingForm.controls.vicePresName2.setValue(empCode);
        } else if (item.indexOfSignature == 5) {
          this.trainingForm.controls.presidentName.setValue(empCode);
        }
      });

      // file table
      if (data.training.trainingFiles.length > 0) {
        this.trainingFiles = data.training.trainingFiles;
      }
      this.sectionDisableCheck();
    } catch (error) {
      console.error(error);
    } finally {
      this.trainingService.setTrainingEditFormsInValid(
        this.trainingForm.invalid
      );
    }
  }

  sectionDisableCheck() {
    const role = this.authService.checkRole();
    // console.log(role);

    if (
      role == 'ROLE_Admin' ||
      role == 'ROLE_Personnel' ||
      role == 'ROLE_ManagerAndROLE_Personnel'
    ) {
    } else {
      this.trainingForm.disable();
    }
  }

  filterDeptByCompanyName(companyName: string): void {
    this.mngDeptListShow = this.mngDeptListRes.filter(
      (item) => item.companyName === companyName
    );
  }

  async generateCoursesList() {
    try {
      const res = await this.apiService.getAllCoursesList().toPromise();
      this.courseList = res ? res : [];
    } catch (error) {
      console.error(error);
    }
  }

  async initDeptSelectorByRole() {
    const role = this.authService.checkRole();
    if (role == 'ROLE_Admin') {
      await this.generateDeptListByUser();
    } else {
      const res =
        (await this.apiService.getSectorsDeptsCompanysList().toPromise()) || [];
      res.forEach(async (item) => {
        const companyId =
          (await this.commonService
            .getCompanyIdByName(item.company)
            .toPromise()) || 0;
        this.mngDeptListRes.push({
          companyId: companyId,
          companyName: item.company,
          deptCode: item.department.deptCode,
          deptFullName: item.department.deptFullName,
          deptId: item.department.id,
          deptName: item.department.deptName,
          deptTname: item.department.deptTname,
          sectorCode: item.sectorCode,
          sectorId: item.sectorId,
          sectorName: item.sectorName,
        });
        this.mngDeptListRes.sort((a, b) =>
          a.deptName.localeCompare(b.deptName)
        );
      });
    }

    // console.log(this.mngDeptListRes);
  }

  async generateDeptListByUser() {
    try {
      const adminId = this.authService.getUID();
      const res = await this.apiService
        .getManageDeptsListByUserId(adminId)
        .toPromise();
      this.mngDeptListRes = res ? res?.responseData.result : [];
      this.mngDeptListRes.sort((a, b) => a.deptName.localeCompare(b.deptName));
    } catch (error) {
      console.error(error);
    }
  }

  async generateDeptCode(deptName: string) {
    const filterMngDeptList = this.mngDeptListShow.find(
      (item) => item.deptName === deptName
    );
    if (filterMngDeptList) {
      this.trainingForm.controls.deptId.setValue(filterMngDeptList.deptCode);
    } else {
      console.warn('No matching department found');
      this.trainingForm.controls.deptId.setValue(null);
    }
    // when change dept name then generate active emp by dey
    await this.generateEmployeeAutoCompleteByDept(deptName);
    await this.generateApproversListByDept(deptName);
  }

  async generateEmployeeAutoCompleteByDept(deptName: string) {
    const filterMngDeptList = this.mngDeptListShow.find(
      (item) => item.deptName === deptName
    );
    const deptDataID = filterMngDeptList ? filterMngDeptList.deptId : 0;
    try {
      const res = await this.apiService
        .getAllActiveEmpsByDeptId(deptDataID)
        .toPromise();

      // for filter and get emp id
      this.empList = res ? res : [];

      // for show in autocomplete
      this.empNameList = this.empList.map(
        (item) => item.firstname + ' ' + item.lastname
      );
    } catch (error) {
      console.error(error);
    }
  }

  async generateApproversListByDept(deptName: string) {
    const filterMngDeptList = this.mngDeptListShow.find(
      (item) => item.deptName === deptName
    );
    try {
      const res = await this.apiService
        .getAllPrivilegeApproversByDpetId(
          filterMngDeptList ? filterMngDeptList.deptId : 0
        )
        .toPromise();
      this.allPrivilegesApproversList = res ? res.responseData.result : [];
      this.approversList = this.allPrivilegesApproversList.filter((item) =>
        item.roles.find((role) => role.role == 'Approver')
      );
      this.managersList = this.allPrivilegesApproversList.filter((item) =>
        item.roles.find((role) => role.role == 'Manager')
      );
      this.vicePresList = this.allPrivilegesApproversList.filter((item) =>
        item.roles.find((role) => role.role == 'VicePresident')
      );
      this.presidentsList = this.allPrivilegesApproversList.filter((item) =>
        item.roles.find((role) => role.role == 'President')
      );
    } catch (error) {
      console.error(error);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.empNameList?.filter((option) => option.includes(filterValue));
  }

  displayAutocomplete() {
    this.empNameListFiltered =
      this.trainingForm.controls.employeeName.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
  }

  generateCourseForms(courseName: string) {
    const filterCourseList = this.courseList.find(
      (item) => item.courseName == courseName
    );
    if (filterCourseList) {
      const startDate = this.buddhistDatePipe.transform(
        new Date(filterCourseList.startDate)
      );
      const endDate = this.buddhistDatePipe.transform(
        new Date(filterCourseList.endDate)
      );
      this.trainingForm.patchValue({
        courseObjective: filterCourseList.objective,
        courseDuration: `${startDate} - ${endDate} ${filterCourseList.time}`,
        courseDescription: filterCourseList.note,
        courseProject: filterCourseList.priceProject,
        coursePrice: this.commonService.convertNumberToStringFormatted(
          filterCourseList.price
        ),
        courseTeacher: filterCourseList.institute,
        courseLocation: filterCourseList.place,
      });
      this.trainingService.setTrainingEditFormsInValid(
        this.trainingForm.invalid
      );
      this.trainingService.trainingRequest.courseId = filterCourseList.id;
    } else {
      console.warn('No matching course found');
      this.trainingForm.patchValue({
        courseDuration: '',
        courseDescription: '',
        courseProject: '',
        coursePrice: '',
        courseTeacher: '',
        courseLocation: '',
      });
    }
  }

  generateEmpDetails(empFullName: string) {
    const filterEmpList = this.empList.find(
      (item) => item.firstname + ' ' + item.lastname === empFullName
    );
    if (filterEmpList) {
      this.trainingService.trainingRequest.userId = filterEmpList.id;
      this.trainingForm.patchValue({
        employeeId: filterEmpList.empCode,
        employeeName: empFullName,
        employeePosition: filterEmpList.position.positionName,
      });
      this.trainingService.setTrainingEditFormsInValid(
        this.trainingForm.invalid
      );
    }
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        await this.uploadFile(file);
        // this.selectedFile.push(file);
      }
    } else {
      console.error('No file selected');
    }
  }

  async uploadFile(file: File) {
    try {
      const res = await this.apiService.uploadFile(file).toPromise();
      if (res) {
        this.trainingFiles.push({ fileName: file.name, id: res.ID });
        const mappedFileId = this.trainingFiles.map((item) => item.id);
        this.trainingService.trainingRequest.fileID = mappedFileId;
      }
    } catch (error) {
      console.error(error);
    }
  }
  removeFile(index: number) {
    this.trainingFiles.splice(index, 1);
    const mappedFileId = this.trainingFiles.map((item) => item.id);
    this.trainingService.trainingRequest.fileID = mappedFileId;
  }

  async clearCompanySelected() {
    this.trainingForm.patchValue({
      deptId: '',
      approverName: '',
      budgetDescription: '',
      budgetType: '',
      courseDescription: '',
      courseDuration: '',
      courseLocation: '',
      courseName: '',
      courseObjective: '',
      coursePrice: '',
      courseProject: '',
      courseTeacher: '',
      deptCode: '',
      employeeId: '',
      employeeName: '',
      employeePosition: '',
      formsType: '',
      managerName: '',
      presidentName: '',
      vicePresName: '',
      vicePresName2: '',
    });

    this.clearTraininingReqAfterSelectedCompanyORDept();

    this.trainingService.setTrainingEditFormsInValid(this.trainingForm.invalid);
    // console.log(this.trainingService.trainingRequest);
  }

  clearDeptCodeSelected() {
    this.trainingForm.patchValue({
      approverName: '',
      budgetDescription: '',
      budgetType: '',
      courseDescription: '',
      courseDuration: '',
      courseLocation: '',
      courseName: '',
      courseObjective: '',
      coursePrice: '',
      courseProject: '',
      courseTeacher: '',
      employeeId: '',
      employeeName: '',
      employeePosition: '',
      formsType: '',
      managerName: '',
      presidentName: '',
      vicePresName: '',
      vicePresName2: '',
    });

    this.clearTraininingReqAfterSelectedCompanyORDept();
    this.trainingService.setTrainingEditFormsInValid(this.trainingForm.invalid);
  }

  clearTraininingReqAfterSelectedCompanyORDept() {
    this.trainingService.trainingRequest.action = '';
    this.trainingService.trainingRequest.actionDate = '';
    this.trainingService.trainingRequest.userId = 0;
    this.trainingService.trainingRequest.courseId = 0;
    this.trainingService.trainingRequest.projectCourse = '';
    this.trainingService.trainingRequest.managerId = 0;
    this.trainingService.trainingRequest.approverId = 0;
    this.trainingService.trainingRequest.vicepresident1Id = 0;
    this.trainingService.trainingRequest.vicepresident2Id = 0;
    this.trainingService.trainingRequest.presidentId = 0;
    this.trainingService.trainingRequest.budget = 0;
    this.trainingService.trainingRequest.budgetType = '';
    this.trainingService.setTrainingEditFormsInValid(this.trainingForm.invalid);
  }
  // async
  selectedFormsType(value: string) {
    this.trainingService.trainingRequest.action = value;
    this.trainingService.trainingRequest.action =
      this.commonService.formatDateToYYYYMMDDString(new Date());
    this.trainingService.setTrainingEditFormsInValid(this.trainingForm.invalid);
  }

  courseProjectChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.trainingService.trainingRequest.projectCourse = value;
    this.trainingService.setTrainingEditFormsInValid(this.trainingForm.invalid);
  }

  selectedPriviledgeEmp(empCode: string, role: string) {
    if (role == 'Approver') {
      this.trainingService.trainingRequest.approverId =
        this.allPrivilegesApproversList.find((item) => item.empCode == empCode)
          ?.id || 0;
    } else if (role == 'Manager') {
      this.trainingService.trainingRequest.managerId =
        this.allPrivilegesApproversList.find((item) => item.empCode == empCode)
          ?.id || 0;
    } else if (role == 'Vice1') {
      this.trainingService.trainingRequest.vicepresident1Id =
        this.allPrivilegesApproversList.find((item) => item.empCode == empCode)
          ?.id || 0;
    } else if (role == 'Vice2') {
      this.trainingService.trainingRequest.vicepresident2Id =
        this.allPrivilegesApproversList.find((item) => item.empCode == empCode)
          ?.id || 0;
    } else if (role == 'President') {
      this.trainingService.trainingRequest.presidentId =
        this.allPrivilegesApproversList.find((item) => item.empCode == empCode)
          ?.id || 0;
    }
    this.trainingService.setTrainingEditFormsInValid(this.trainingForm.invalid);
  }

  dateSaveChange(event: MatDatepickerInputEvent<Date>) {
    // console.log('Selected Date:', event.value);
    const formatDate = this.commonService.formatDateToYYYYMMDDString(
      event.value || new Date()
    );
    this.trainingService.trainingRequest.dateSave = formatDate;
    this.trainingService.trainingRequest.actionDate = formatDate;
    this.trainingService.setTrainingEditFormsInValid(this.trainingForm.invalid);
  }

  async downloadFile(id: number, fileName: string) {
    this.swalService.showLoading();
    try {
      const res = await this.apiService.downloadFileById(id).toPromise();
      if (res) {
        this.commonService.downloadFileBase64(fileName, res.type, res.file);
        this.swalService.showSuccess('กำลังเริ่มดาวน์โหลดไฟล์');
      } else {
        throw new Error('somthing went wrong');
      }
    } catch (error) {
      console.error(error);
      this.swalService.showError('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์');
    }
  }

  clearPriviledgesUser() {
    this.trainingForm.patchValue({
      approverName: '',
      managerName: '',
      vicePresName: '',
      vicePresName2: '',
      presidentName: '',
    });
  }
}
