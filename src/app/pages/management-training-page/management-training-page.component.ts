import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Position, Status, TrainingTable } from 'src/app/interface/training';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CheckTrainingModalComponent } from './components/check-training-modal/check-training-modal.component';
import { TrainingService } from 'src/app/services/training.service';
import {
  CreateTrainingRequestForm,
  PrintHistoryTrainingReportRequest,
  TrainingReportRequest,
} from 'src/app/interface/request';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/services/swal.service';
import { ReportModalComponent } from './components/report-modal/report-modal.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrainingSearchForms } from 'src/app/interface/form';
import { CommonService } from 'src/app/services/common.service';
import { Course, department, sector } from 'src/app/interface/common';
import { PrintTipsModalComponent } from './components/print-tips-modal/print-tips-modal.component';

@Component({
  selector: 'app-management-training-page',
  templateUrl: './management-training-page.component.html',
  styleUrls: ['./management-training-page.component.scss'],
})
export class ManagementTrainingPageComponent implements OnInit {
  userRole!: string;

  backupTrainingList!: TrainingTable[];
  centerTrainingsList!: TrainingTable[];
  trainingTableList!: TrainingTable[];
  isCanEditSection!: boolean;
  pageLength!: number;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  searchFormsGroup!: FormGroup<TrainingSearchForms>;
  courses!: Course[];
  sectors!: any[];
  depts!: sector[];
  positions!: Position[];
  isSearchMode: boolean = false;
  isSearchBtnDisabled: boolean = false;
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private trainingService: TrainingService,
    private swalService: SwalService,
    private fb: FormBuilder,
    private commonService: CommonService
  ) {
    this.searchFormsGroup = this.fb.group({
      companyName: ['PCCTH'],
      courseName: [''],
      deptAndSector: [''],
      endDate: [null],
      startDate: [null],
      positionName: [''],
    }) as FormGroup<TrainingSearchForms>;
  }

  async ngOnInit() {
    this.swalService.showLoading();
    this.userRole = this.authService.checkRole();
    const roles = this.authService.checkRole();
    const isCanEditRoles =
      roles == 'ROLE_Admin' ||
      roles == 'ROLE_Personnel' ||
      roles == 'ROLE_ManagerAndROLE_Personnel';
    this.isCanEditSection = isCanEditRoles;
    if (isCanEditRoles) {
      await this.findAllTrainingForAdminAndPersonal();
    } else if (roles != 'ROLE_User') {
      await this.findAllTrainingForPriviledgedUser();
    }
    await this.initValueToAllSelector();
    this.searchFormsGroup.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
  }

  async initValueToAllSelector() {
    try {
      const company =
        this.searchFormsGroup.controls.companyName.value || 'PCCTH';
      const sectors =
        (await this.commonService
          .getSectorCompanyByName(company)
          .toPromise()) || [];
      const allCourse =
        (await this.apiService.getAllCoursesList().toPromise()) || [];
      const companyData =
        (await this.commonService
          .getSectorAndDeptsListByCompanyName(company)
          .toPromise()) || [];
      this.courses = allCourse;
      this.sectors = sectors.sort((a, b) =>
        a.sectorName.localeCompare(b.sectorName)
      );
      this.depts = companyData.sort((a, b) =>
        a.department.deptName.localeCompare(b.department.deptName)
      );
      const allPosition = this.backupTrainingList.map(
        (item) => item.training.user.position
      );
      this.positions = allPosition.filter(
        (position, index, self) =>
          index ===
          self.findIndex((p) => p.positionName === position.positionName)
      );
      console.log('sector check: ', this.sectors);
      console.log('dept check:', this.depts);

      // this.depts = sectorAnddept.map(item => item.department)
      // console.log('check sector Anddept', sectorAnddept);
    } catch (error) {
      console.error(error);
    }
  }

  // async change

  loadingpage() {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 0;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.pageLength = this.centerTrainingsList.length;
    this.trainingTableList = this.centerTrainingsList.slice(
      startIndex,
      endIndex
    );
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.loadingpage())).subscribe();
  }

  filterByStatus(status: string) {
    const filters: { [key: string]: (item: TrainingTable) => boolean } = {
      allApprove: (item: TrainingTable) => item.result_status === 'อนุมัติ',
      waitApprove: (item: TrainingTable) =>
        item.result_status === 'รอประเมิน' || item.isDo === 'รอประเมิน',
      waitEval: (item: TrainingTable) =>
        item.training.result[0].result == null &&
        item.result_status == 'อนุมัติ',
      Eval: (item: TrainingTable) => item.training.result[0].result != null,
      waitG9Eval: (item: TrainingTable) =>
        item.training.resultGeneric9[0].result5 == null &&
        item.result_status == 'อนุมัติ',
      G9Eval: (item: TrainingTable) =>
        item.training.resultGeneric9[0].result5 != null,
    };

    this.centerTrainingsList = this.backupTrainingList.filter(
      filters[status] || (() => true)
    );
    this.loadingpage();
  }
  // async findAllTraining
  async findAllTrainingForAdminAndPersonal() {
    try {
      if (this.userRole == 'ROLE_Admin') {
        // TODO: filter training by admin
        const adminId = this.authService.getUID();
        const mngDeptList = await this.apiService
          .getManageDeptsListByUserId(adminId)
          .toPromise();
        const training = await this.apiService.findAllTraining().toPromise();
        if (mngDeptList && training) {
          const mngDeptIdList = mngDeptList.responseData.result.map(
            (item) => item.deptId
          );
          const filteredTraining = training.filter((item) =>
            mngDeptIdList.includes(item.training.user.department.id)
          );
          this.backupTrainingList = filteredTraining.sort((a, b) => {
            const dateA = new Date(a.training.dateSave).getTime();
            const dateB = new Date(b.training.dateSave).getTime();

            return dateB - dateA; // เรียงจากล่าสุดไปเก่าสุด
          });
          this.centerTrainingsList = this.backupTrainingList;
          // this.trainingTableList = this.centerTrainingsList;

          // console.log('backupTrainingList', this.backupTrainingList);
          // console.log('trainingTableList', this.trainingTableList);
        } else {
          throw new Error('mngDeptList or training not found');
        }
      } else if (
        this.userRole == 'ROLE_Personnel' ||
        this.userRole == 'ROLE_ManagerAndROLE_Personnel'
      ) {
        // TODO: filter training by Personnel
        const uid = this.authService.getUID();
        const allTraining =
          (await this.apiService.findAllTraining().toPromise()) || [];
        const approveTraining =
          (await this.apiService.getTrainingByApproveId(uid).toPromise()) || [];

        const trainingMap = new Map(
          approveTraining.map((training) => [training.training.id, training])
        );

        // Merge allTraining into the map, prioritizing approveTraining data
        allTraining.forEach((training) => {
          if (!trainingMap.has(training.training.id)) {
            trainingMap.set(training.training.id, training);
          }
        });
        this.backupTrainingList = Array.from(trainingMap.values()).sort(
          (a, b) => {
            const dateA = new Date(a.training.dateSave).getTime();
            const dateB = new Date(b.training.dateSave).getTime();

            return dateB - dateA; // เรียงจากล่าสุดไปเก่าสุด
          }
        );
        this.centerTrainingsList = this.backupTrainingList;
        // this.trainingTableList = this.centerTrainingsList;
        console.log(this.trainingTableList);

        // const
      } else {
        throw new Error('Invalid user role');
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingpage();
      Swal.close();
    }
  }

  async findAllTrainingForPriviledgedUser() {
    // TODO get Training for Approvers
    // return;
    try {
      const uid = this.authService.getUID();
      const approveTraining =
        (await this.apiService.getTrainingByApproveId(uid).toPromise()) || [];
      this.backupTrainingList = approveTraining.sort((a, b) => {
        const dateA = new Date(a.training.dateSave).getTime();
        const dateB = new Date(b.training.dateSave).getTime();

        return dateB - dateA; // เรียงจากล่าสุดไปเก่าสุด
      });
      this.centerTrainingsList = this.backupTrainingList;
      this.trainingTableList = this.centerTrainingsList;
      // this.loadingpage();
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingpage();
      Swal.close();
    }
  }

  dateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  }

  watingApproveCheck(statusArray: Status[]): boolean {
    const hasNullStatus = statusArray.some((status) => status.status === null);
    const hasNoDisapproval = statusArray.some(
      (status) => status.status !== 'ไม่อนุมัติ'
    );

    return hasNullStatus && hasNoDisapproval;
  }

  isAllApprove(statusArray: Status[]): boolean {
    return statusArray.every((status) => status.status === 'อนุมัติ');
  }

  goToEditTrainingPage(data: TrainingTable) {
    const dialogRef = this.dialog.open(CheckTrainingModalComponent, {
      width: '80%', // กำหนดความกว้างเป็น 80% ของหน้าจอ
    });
    console.log(
      'data table',
      this.trainingTableList.find(
        (item) => item.training.id == data.training.id
      )
    );

    const fileIdList = data.training.trainingFiles.map((item) => item.id);
    console.log(fileIdList);

    const editDataReq: CreateTrainingRequestForm = {
      userId: data.training.user.id,
      dateSave: data.training.dateSave,
      action: data.training.action,
      actionDate: data.training.actionDate,
      createBy: 0,
      budgetType: data.training.budgetType,
      projectCourse: data.training?.projectCourse || '',
      etcDetails: data.training.etcDetails,
      day: data.training.day,
      courseId: data.training.courses[0].id,
      budget: data.training.budget,
      approverId:
        data.training.status.filter((item) => item.indexOfSignature == 1)[0]
          ?.approveId.id || 0,
      managerId:
        data.training.status.filter((item) => item.indexOfSignature == 2)[0]
          ?.approveId.id || 0,
      vicepresident1Id:
        data.training.status.filter((item) => item.indexOfSignature == 3)[0]
          ?.approveId.id || 0,
      vicepresident2Id:
        data.training.status.filter((item) => item.indexOfSignature == 4)[0]
          ?.approveId.id || 0,
      presidentId:
        data.training.status.filter((item) => item.indexOfSignature == 5)[0]
          ?.approveId.id || 0,
      fileID: fileIdList,
    };
    this.trainingService.trainingEditId = data.training.id;
    this.trainingService.trainingEditData = data;
    this.trainingService.trainingRequest = editDataReq;
    this.trainingService.trainingStatus = data.result_status;
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.swalService.showLoading();
      const roles = this.authService.checkRole();
      const isCanEditRoles =
        roles == 'ROLE_Admin' ||
        roles == 'ROLE_Personnel' ||
        roles == 'ROLE_ManagerAndROLE_Personnel';
      if (isCanEditRoles) {
        this.findAllTrainingForAdminAndPersonal();
      } else {
        this.findAllTrainingForPriviledgedUser();
      }
    });
  }

  dateSaveChange(value: Date) {
    console.log(value);
  }

  async openModalReport(data: TrainingTable) {
    this.swalService.showLoading();
    // mapping signature
    /*
    index,role
    1,Approver
    2,Manager
    3,Vice1
    4,Vice2
    5,President 
    */
    let signatureReq: TrainingReportRequest = {
      trainId: data.training.id,
      approverId:
        data.training.status.find((item) => item.indexOfSignature == 1)
          ?.approveId.id ?? null,
      managerId:
        data.training.status.find((item) => item.indexOfSignature == 2)
          ?.approveId.id ?? null,
      presidentId:
        data.training.status.find((item) => item.indexOfSignature == 5)
          ?.approveId.id ?? null,
      vice1:
        data.training.status.find((item) => item.indexOfSignature == 3)
          ?.approveId.id ?? null,
      vice2:
        data.training.status.find((item) => item.indexOfSignature == 4)
          ?.approveId.id ?? null,
    };
    try {
      const res =
        (await this.apiService
          .getTrainingReportByTrainIdBase64(signatureReq)
          .toPromise()) || '';
      // console.log('report :', res);
      this.openReportModal(res);

      Swal.close();
    } catch (error) {
      console.error(error);
      this.swalService.showError('ไม่พบรายเซ็นผู้ประเมินผล');
    }
    // data.training.status[0].
  }

  openReportModal(base64: string) {
    const dialogRef = this.dialog.open(ReportModalComponent, {
      width: '80%', // กำหนดความกว้างเป็น 80% ของหน้าจอ
    });
    this.trainingService.reportBase64 = base64;
    dialogRef.afterClosed().subscribe((result) => {});
  }

  // searchTraining()

  async printHistoryTraining() {
    const formValues = this.searchFormsGroup.value;
    const deptSecValue: any = formValues.deptAndSector;

    const deptIdValue =
      deptSecValue && deptSecValue.type === 'dept' ? deptSecValue.id : null;

    const secIdValue =
      deptSecValue && deptSecValue.type === 'sector' ? deptSecValue.id : null;

    const courseId = formValues.companyName
      ? this.courses.find((item) => item.courseName === formValues.companyName)
          ?.id || null
      : null;

    const startDate = formValues.startDate
      ? this.commonService.formatDateToYYYYMMDDString(
          new Date(formValues.startDate)
        )
      : null;

    const endDate = formValues.endDate
      ? this.commonService.formatDateToYYYYMMDDString(
          new Date(formValues.endDate)
        )
      : null;

    const req: PrintHistoryTrainingReportRequest = {
      courseID: courseId,
      deptID: deptIdValue,
      endDate: endDate,
      sectorID: secIdValue,
      startDate: startDate,
    };

    try {
      const res = await this.apiService
        .printHistoryTrainingReport(req)
        .toPromise();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  filterTrainingData() {
    const formValues = this.searchFormsGroup.value;

    const deptSecValue: any = formValues.deptAndSector;

    const deptIdValue =
      deptSecValue && deptSecValue.type === 'dept'
        ? deptSecValue.id
        : undefined;

    const secIdValue =
      deptSecValue && deptSecValue.type === 'sector'
        ? deptSecValue.id
        : undefined;

    this.centerTrainingsList = this.backupTrainingList.filter((item) => {
      const matchesCompany = formValues.companyName
        ? item.training.user.company.companyName === formValues.companyName
        : true;

      const matchesDept = deptIdValue
        ? item.training.user.department.id == deptIdValue
        : true;

      const matchesSector = secIdValue
        ? item.training.user.sector.id == secIdValue
        : true;

      const matchesPosition = formValues.positionName
        ? item.training.user.position.positionName === formValues.positionName
        : true;

      const matchesDateRange =
        formValues.startDate && formValues.endDate
          ? new Date(item.training.courses[0].startDate) >=
              new Date(formValues.startDate) &&
            new Date(item.training.courses[0].endDate) <=
              new Date(formValues.endDate)
          : true;

      const matchesCourseName = formValues.courseName
        ? item.training.courses[0].courseName === formValues.courseName
        : true;

      return (
        matchesCompany &&
        matchesDept &&
        matchesSector &&
        matchesPosition &&
        matchesDateRange &&
        matchesCourseName
      );
    });
    this.isSearchMode = true;
    this.loadingpage();
  }

  clearSearch() {
    this.searchFormsGroup.reset();
    this.centerTrainingsList = this.backupTrainingList;
    this.isSearchMode = false;
    this.isSearchBtnDisabled = true;
    this.loadingpage();
  }

  checkFormValidity() {
    const formValues = this.searchFormsGroup.value;
    const isFormFilled = Object.values(formValues).some(
      (value) => value !== ''
    );
    this.isSearchBtnDisabled = !isFormFilled;
  }

  showPrintTip() {
    const dialogRef = this.dialog.open(PrintTipsModalComponent);
  }
}
