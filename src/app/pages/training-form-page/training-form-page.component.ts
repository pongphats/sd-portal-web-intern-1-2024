import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuddhistDatePipe } from '@shared/pipes/budhist-date.pipe';
import { map, Observable, startWith } from 'rxjs';
import { Course } from 'src/app/interface/common';
import { Employee } from 'src/app/interface/employee';
import { trainingForm } from 'src/app/interface/form';
import { MngDeptListRes } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-training-form-page',
  templateUrl: './training-form-page.component.html',
  styleUrls: ['./training-form-page.component.scss'],
})
export class TrainingFormPageComponent implements OnInit {
  trainingForm!: FormGroup<trainingForm>;
  mngDeptslist!: MngDeptListRes[];
  uId!: number;

  // for keep data in memory
  mngDeptListRes!: MngDeptListRes[];
  // for show in selector
  mngDeptListShow!: MngDeptListRes[];

  // for keep data in memory
  empList: Employee[] = [];
  empNameList: string[] = [];
  // for show in autocomplete
  empNameListFiltered!: Observable<string[]>;

  // for keep data in memory
  allPrivilegesApproversList: Employee[] = [];
  // for show in selector
  approversList: Employee[] = [];
  managersList: Employee[] = [];
  vicePresList: Employee[] = [];
  presidentsList: Employee[] = [];

  courseList!: Course[];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private commonService: CommonService,
    private buddhistDatePipe: BuddhistDatePipe,
    private trainingService: TrainingService
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
    });
  }

  async ngOnInit() {
    this.uId = this.authService.getUID();
    await this.generateDeptListByUser();
    await this.generateCoursesList();
    this.displayAutocomplete();
  }

  checkValue(value: any) {
    console.log(value, typeof value);
  }

  // init Generate methods
  async generateDeptListByUser() {
    try {
      const res = await this.apiService
        .getManageDeptsListByUserId(this.uId)
        .toPromise();
      this.mngDeptListRes = res ? res?.responseData.result : [];
    } catch (error) {
      console.error(error);
    }
  }

  async generateCoursesList() {
    try {
      const res = await this.apiService.getAllCoursesList().toPromise();
      this.courseList = res ? res : [];
    } catch (error) {
      console.error(error);
    }
  }

  // event action methods
  filterDeptByCompanyName(companyName: string): void {
    this.mngDeptListShow = this.mngDeptListRes.filter(
      (item) => item.companyName === companyName
    );
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
        (item) => item.title + ' ' + item.firstname + ' ' + item.lastname
      );
    } catch (error) {
      console.error(error);
    }
  }

  generateEmpDetails(empFullName: string) {
    const filterEmpList = this.empList.find(
      (item) =>
        item.title + ' ' + item.firstname + ' ' + item.lastname === empFullName
    );
    if (filterEmpList) {
      this.trainingForm.patchValue({
        employeeId: filterEmpList.empCode,
        employeeName: empFullName,
        employeePosition: filterEmpList.position.positionName,
      });
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

  // auto complete services
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.empNameList.filter((option) => option.includes(filterValue));
  }

  displayAutocomplete() {
    this.empNameListFiltered =
      this.trainingForm.controls.employeeName.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
  }

  pushToTable() {
    this.trainingService.pushTraining(this.trainingForm.value);
  }
}
