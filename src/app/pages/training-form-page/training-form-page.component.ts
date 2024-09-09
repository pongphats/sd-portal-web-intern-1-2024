import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { BuddhistDatePipe } from '@shared/pipes/budhist-date.pipe';
import { map, Observable, startWith } from 'rxjs';
import { BudgetCreated, Course, fileTable } from 'src/app/interface/common';
import { Employee } from 'src/app/interface/employee';
import { trainingForm } from 'src/app/interface/form';
import { MngDeptListRes } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
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
  mngDeptListRes: MngDeptListRes[] = [];
  // for show in selector
  mngDeptListShow: MngDeptListRes[] = [];

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

  displayedColumns: string[] = ['position', 'fileName', 'browseUpload'];

  fileDataSource = new MatTableDataSource<fileTable>([]);

  @ViewChild('fileInput') fileInput!: ElementRef;

  tableToggle: boolean = false;

  public trainingId: string | null = null;

  currentBudget: BudgetCreated = {} as BudgetCreated;

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
    this.trainingService.deptBudgetCreated = []
    this.uId = this.authService.getUID();
    await this.initDeptSelectorByRole();
    await this.generateCoursesList();
    this.displayAutocomplete();
  }

  checkValue(value: any) {
    // console.log(value, typeof value);
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

  // init Generate methods
  async generateDeptListByUser() {
    try {
      const res = await this.apiService
        .getManageDeptsListByUserId(this.uId)
        .toPromise();
      this.mngDeptListRes = res ? res?.responseData.result : [];
      this.mngDeptListRes.sort((a, b) => a.deptName.localeCompare(b.deptName));
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
    await this.getRemainingBudget(filterMngDeptList?.deptCode || '');
  }

  async getRemainingBudget(deptCode: string) {
    try {
      const currentYear = new Date().getFullYear();
      const res = await this.apiService
        .findTotalRemain(String(currentYear), deptCode)
        .toPromise();
      if (res.responseMessage == undefined) {
        this.currentBudget = res;
      } else {
        throw new Error('ไม่มีงบประมาณ');
      }
    } catch (error) {
      console.error(error);
      this.swalService.showError(`แผนก ${deptCode} ยังไม่มีงบประมาณ`);
      this.trainingForm.reset();
    }
  }

  coursePrice: number = 0;
  async generateCourseForms(courseName: string) {
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
      // this.trainingService.trainingRequest.courseId = filterCourseList.id
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

      // keep current price
      this.coursePrice = filterCourseList.price;

      // prepare value for search creaeted training
      const deptCode = this.trainingForm.controls.deptCode.value || '';
      const hasPushTraining =
        this.trainingService.findRemainingByDeptCode(deptCode);

      if (hasPushTraining) {
        // calculate after push same deptcode in table
        this.calculateBudgetByCourseAnotherTime(
          hasPushTraining,
          filterCourseList.price
        );
      } // calculate first time of deptcode
      else {
        this.calculateBudgetByCourseFirstTime(filterCourseList.price);
      }
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

  calculateBudgetByCourseAnotherTime(
    createdBudget: BudgetCreated,
    price: number
  ) {
    const selectedBudgetType = this.trainingForm.controls.formsType.value || '';
    const sumCreatedTrainingBudget =
      selectedBudgetType == 'training'
        ? createdBudget.budgetTraining
        : createdBudget.budgetCer;
    const currentRemainingBudget =
      selectedBudgetType == 'training'
        ? this.currentBudget.budgetTraining
        : this.currentBudget.budgetCer;
    const priceTotal = sumCreatedTrainingBudget + price;
    if (currentRemainingBudget - priceTotal < 0) {
      this.swalService.showWarning('เกินงบประมาณ');
    }
  }

  calculateBudgetByCourseFirstTime(price: number) {
    const selectedBudgetType = this.trainingForm.controls.formsType.value || '';
    const currentRemainingBudget =
      selectedBudgetType == 'training'
        ? this.currentBudget.budgetTraining
        : this.currentBudget.budgetCer;
    if (currentRemainingBudget - price < 0) {
      this.swalService.showWarning('เกินงบประมาณ');
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
        (item) => item.firstname + ' ' + item.lastname
      );
    } catch (error) {
      console.error(error);
    }
  }

  generateEmpDetails(empFullName: string) {
    const filterEmpList = this.empList.find(
      (item) => item.firstname + ' ' + item.lastname === empFullName
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

  async checkBeforePushToTable() {
    const deptCode = this.trainingForm.controls.deptCode.value || '';
    const hasPushTraining =
      this.trainingService.findRemainingByDeptCode(deptCode);

    if (hasPushTraining) {
      await this.checkAndConfirmRemainingBudget(hasPushTraining);
    } else {
      await this.pushToTable();
    }
  }

  async checkAndConfirmRemainingBudget(budgetCreated: BudgetCreated) {
    const formsType = this.trainingForm.controls.formsType.value || '';
    const usedBudget =
      formsType == 'training'
        ? budgetCreated.budgetTraining + this.coursePrice
        : budgetCreated.budgetCer + this.coursePrice;
    const currentBudgetRemaining =
      formsType == 'training'
        ? this.currentBudget.budgetTraining
        : this.currentBudget.budgetCer;
    if (currentBudgetRemaining - usedBudget < 0) {
      const confirmedResult = await this.swalService.showConfirm(
        'การอบรมนี้เกินเกินงบประมาณยืนยันที่จะเพิ่มหรือไม่'
      );
      if (confirmedResult) {
        await this.pushToTable();
      } else {
        return;
      }
    } else {
      await this.pushToTable();
    }
  }

  async pushToTable() {
    try {
      const empCode = this.trainingForm.controls.employeeId.value;
      const courseId =
        this.courseList.find(
          (item) =>
            item.courseName == this.trainingForm.controls.courseName.value &&
            item.institute == this.trainingForm.controls.courseTeacher.value
        )?.id || 0;
      const employeeId = await this.commonService
        .getUserDetailByEmpcode(empCode || '')
        .toPromise();

      // call mapped approve id function
      const mappedApproveIds = this.mappedPriviledgeApproveId();
      if (employeeId) {
        // prepare object for push to table
        const currentForms = {
          ...this.trainingForm.value,
          fileID: [...this.filesId],
          empId: employeeId.id,
          adminId: this.uId,
          ...mappedApproveIds,
          courseId,
        };

        // prepare request for push to budget created
        const deptCode = this.trainingForm.controls.deptCode.value || '';
        const formsType = this.trainingForm.controls.formsType.value || '';

        const budget: BudgetCreated = {
          budgetCer: formsType == 'getCertificate' ? this.coursePrice : 0,
          budgetTraining: formsType == 'training' ? this.coursePrice : 0,
          departmentCode: deptCode,
          year: new Date().getFullYear().toString(),
        };
        this.trainingService.pushSumBudget(budget);
        this.trainingService.pushTraining(currentForms);
        this.clearFormAfterPush();
      }
    } catch (error) {
      console.error(error);
    }
  }

  clearFormAfterPush() {
    this.trainingForm.patchValue({
      employeeId: '',
      employeeName: '',
      employeePosition: '',
    });
  }

  clearApproverForms() {
    this.trainingForm.patchValue({
      approverName: null,
      managerName: null,
      vicePresName: null,
      vicePresName2: null,
      presidentName: null,
    });
  }

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  selectedFile: any[] = [];
  async onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        await this.uploadFile(file);
        this.selectedFile.push(file);
      }
    } else {
      console.error('No file selected');
    }
  }

  filesId: number[] = [];
  async uploadFile(file: File) {
    try {
      const res = await this.apiService.uploadFile(file).toPromise();
      if (res) {
        this.filesId.push(res.ID);
      }
    } catch (error) {
      console.error(error);
    }
  }

  removeFile(index: number) {
    this.selectedFile.splice(index, 1);
    this.filesId.splice(index, 1);
  }

  mappedPriviledgeApproveId() {
    const approveEmpCode = this.trainingForm.controls.approverName.value;
    const managerEmpCode = this.trainingForm.controls.managerName.value;
    const viceOneEmpCode = this.trainingForm.controls.vicePresName.value;
    const viceTwoEmpCode = this.trainingForm.controls.vicePresName2.value;
    const presidentEmpCode = this.trainingForm.controls.presidentName.value;
    const approveId =
      this.approversList.find((item) => item.empCode == approveEmpCode)?.id ||
      0;
    const managerId =
      this.managersList.find((item) => item.empCode == managerEmpCode)?.id || 0;
    const vicePresIdOne =
      this.vicePresList.find((item) => item.empCode == viceOneEmpCode)?.id || 0;
    const vicePresIdTwo =
      this.vicePresList.find((item) => item.empCode == viceTwoEmpCode)?.id || 0;
    const presidentId =
      this.presidentsList.find((item) => item.empCode == presidentEmpCode)
        ?.id || 0;

    return { approveId, managerId, vicePresIdOne, vicePresIdTwo, presidentId };
  }

  formsTypeChange() {
    this.trainingForm.patchValue({
      courseDescription: '',
      courseDuration: '',
      courseLocation: '',
      courseName: '',
      courseObjective: '',
      coursePrice: '',
      courseProject: '',
      courseTeacher: '',
    });
  }
}
