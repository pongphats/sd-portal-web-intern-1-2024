import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Status, TrainingTable } from 'src/app/interface/training';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CheckTrainingModalComponent } from './components/check-training-modal/check-training-modal.component';
import { TrainingService } from 'src/app/services/training.service';
import { CreateTrainingRequestForm } from 'src/app/interface/request';

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

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private trainingService: TrainingService
  ) {}

  async ngOnInit() {
    this.userRole = this.authService.checkRole();
    const roles = this.authService.checkRole();
    const isCanEditRoles =
      roles == 'ROLE_Admin' ||
      roles == 'ROLE_Personnel' ||
      roles == 'ROLE_ManagerAndROLE_Personnel';

    console.log(roles);

    if (isCanEditRoles) {
      await this.findAllTrainingForAdminAndPersonal();
    } else if (roles != 'ROLE_User') {
      await this.findAllTrainingForPriviledgedUser();
    }
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
          this.backupTrainingList = filteredTraining;
          this.centerTrainingsList = this.backupTrainingList;
          this.trainingTableList = this.centerTrainingsList;

          console.log('backupTrainingList', this.backupTrainingList);
          console.log('trainingTableList', this.trainingTableList);
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
        this.backupTrainingList = Array.from(trainingMap.values());
        this.centerTrainingsList = this.backupTrainingList;
        this.trainingTableList = this.centerTrainingsList;
        console.log(this.trainingTableList);

        // const
      } else {
        throw new Error('Invalid user role');
      }
    } catch (error) {}
  }

  async findAllTrainingForPriviledgedUser() {
    // TODO get Training for Approvers
    // return;
    try {
      const uid = this.authService.getUID();
      const approveTraining =
        (await this.apiService.getTrainingByApproveId(uid).toPromise()) || [];
      this.backupTrainingList = approveTraining;
      this.centerTrainingsList = this.backupTrainingList;
      this.trainingTableList = this.centerTrainingsList;
    } catch (error) {}
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

  goToEditTrainingPage(data: TrainingTable) {
    const dialogRef = this.dialog.open(CheckTrainingModalComponent);
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
          ?.id || 0,
      managerId:
        data.training.status.filter((item) => item.indexOfSignature == 2)[0]
          ?.id || 0,
      vicepresident1Id:
        data.training.status.filter((item) => item.indexOfSignature == 3)[0]
          ?.id || 0,
      vicepresident2Id:
        data.training.status.filter((item) => item.indexOfSignature == 4)[0]
          ?.id || 0,
      presidentId:
        data.training.status.filter((item) => item.indexOfSignature == 5)[0]
          ?.id || 0,
      fileID: fileIdList,
    };
    this.trainingService.trainingEditId = data.training.id;
    this.trainingService.trainingEditData = data;
    this.trainingService.trainingRequest = editDataReq;
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  dateSaveChange(value : Date) {
    console.log(value);
    
  }
}
