import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuddhistDatePipe } from '@shared/pipes/budhist-date.pipe';
import { Course } from 'src/app/interface/common';
import { trainingForm } from 'src/app/interface/form';
import { MngDeptListRes } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

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

  courseList!: Course[];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private commonService: CommonService,
    private buddhistDatePipe : BuddhistDatePipe
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
    console.log(companyName);

    this.mngDeptListShow = this.mngDeptListRes.filter(
      (item) => item.companyName === companyName
    );
  }

  generateDeptCode(deptName: string) {
    const filterMngDeptList = this.mngDeptListShow.find(
      (item) => item.deptName === deptName
    );
    if (filterMngDeptList) {
      this.trainingForm.controls.deptId.setValue(filterMngDeptList.deptCode);
    } else {
      console.warn('No matching department found');
      this.trainingForm.controls.deptId.setValue(null);
    }
  }

  generateCourseForms(courseName: string) {
    const filterCourseList = this.courseList.find(
      (item) => item.courseName == courseName
    );
    if (filterCourseList) {
      const startDate = this.buddhistDatePipe.transform(new Date(filterCourseList.startDate))
      const endDate = this.buddhistDatePipe.transform(new Date(filterCourseList.endDate))
      this.trainingForm.patchValue({
        courseObjective: filterCourseList.objective,
        courseDuration: `${startDate} - ${endDate} ${filterCourseList.time}`,
        courseDescription: filterCourseList.note,
        courseProject: filterCourseList.priceProject,
        coursePrice: this.commonService.convertNumberToStringFormatted(filterCourseList.price),
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
}
