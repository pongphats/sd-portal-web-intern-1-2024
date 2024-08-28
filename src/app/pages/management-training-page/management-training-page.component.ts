import { Component, OnInit } from '@angular/core';
import { TrainingTable } from 'src/app/interface/training';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    this.userRole = this.authService.checkRole();
    const roles = this.authService.checkRole();
    const isCanEditRoles =
      roles == 'ROLE_Admin' ||
      roles == 'ROLE_Personnel' ||
      roles == 'ROLE_ManagerAndROLE_Personnel';

    if (isCanEditRoles) {
      await this.findAllTrainingForAdminAndPersonal();
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
          this.trainingTableList = this.centerTrainingsList.slice(0, 5);

          console.log('backupTrainingList', this.backupTrainingList);
          console.log('trainingTableList', this.trainingTableList);
        } else {
          throw new Error('mngDeptList or training not found');
        }
      } else if (
        this.userRole == 'ROLE_Personnel' ||
        this.userRole == 'ROLE_PersonalAndROLE_Manager'
      ) {
        // TODO: filter training by Personnel
      } else {
        throw new Error('Invalid user role');
      }
    } catch (error) {}
  }

  async findAllTrainingForPriviledgedUser() {
    // TODO get Training for Approvers
    // return;
  }

  dateRange(startDate: string, endDate: string) : string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  }
}
