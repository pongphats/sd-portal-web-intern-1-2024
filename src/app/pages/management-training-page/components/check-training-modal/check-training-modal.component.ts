import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { approveTrainingReq } from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SwalService } from 'src/app/services/swal.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-check-training-modal',
  templateUrl: './check-training-modal.component.html',
  styleUrls: ['./check-training-modal.component.scss'],
})
export class CheckTrainingModalComponent implements OnInit {
  sectionOneInvalid: boolean = false;
  userRole!: string;
  canEditSectionOne!: boolean;
  isWatingApprove!: boolean;
  trainingResultStatus!: string;
  isApproverWating!: boolean;
  isAllApprove!: boolean;
  isSectionTwoEval!: boolean;
  constructor(
    private trainingService: TrainingService,
    private apiService: ApiService,
    private swalService: SwalService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CheckTrainingModalComponent>
  ) {}

  ngOnInit(): void {
    // get Role and uId
    this.userRole = this.authService.checkRole();
    const UID = this.authService.getUID();
    // waiting approve check
    this.isWatingApprove =
      this.trainingService.trainingEditData.result_status == 'รอประเมิน';
    this.isApproverWating = this.trainingService.trainingEditData.isDo
      ? this.trainingService.trainingEditData.isDo == 'รอประเมิน'
      : false;

    // all approve check
    this.isAllApprove =
      this.trainingService.trainingEditData.result_status == 'อนุมัติ';

    // role check
    this.canEditSectionOne =
      this.userRole == 'ROLE_Personnel' ||
      this.userRole == 'ROLE_Admin' ||
      this.userRole == 'ROLE_ManagerAndROLE_Personnel';

    // section two Evaluator check
    this.isSectionTwoEval =
      this.trainingService.trainingEditData.training.approve1.id == UID;

    // receive section form validate
    this.getEditSectionOneFormsStatus();
  }

  getEditSectionOneFormsStatus() {
    this.trainingService
      .getTrainingEditFormsInValid()
      .subscribe((value: boolean) => {
        if (value != undefined) {
          this.sectionOneInvalid = value;
          console.log(this.sectionOneInvalid);
        }
      });
  }

  async editSectionOneForms() {
    // console.log('after edit check val:', this.trainingService.trainingRequest);
    const id = this.trainingService.trainingEditId;
    const data = this.trainingService.trainingRequest;
    const confirm = await this.swalService.showConfirm('ยืนยันการแก้ไขฟอร์ม');
    if (confirm) {
      try {
        this.swalService.showLoading();
        const res = await this.apiService.editSectionOne(id, data).toPromise();
        if (res) {
          this.swalService.showSuccess('แก้ไข้อมูลสำเร็จ');
        }
      } catch (error) {
        console.error(error);
        this.swalService.showError('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
      }
    } else {
      console.log('cancel');
    }
  }

  cancel() {
    console.log(
      'after cancel check val:',
      this.trainingService.trainingRequest
    );
  }

  async approveAction(result: string) {
    const swalResutl = await this.swalService.showConfirm(
      `ยืนยันที่จะ${result}การอบรมนี้หรือไม่`
    );
    if (swalResutl) {
      this.swalService.showLoading();
      try {
        const approveId = this.authService.getUID();
        const trainingId = this.trainingService.trainingEditData.training.id;
        const req: approveTrainingReq = {
          approveId: approveId,
          statusApprove: result,
          trainingId: trainingId,
        };
        const res = await this.apiService.approveTraining(req).toPromise();
        this.swalService.showSuccess(`ยืนยันการ${result}สำเร็จ`);
        this.dialogRef.close();
      } catch (error) {
        console.error(error);
        this.swalService.showError(`เกิดข้อผิดพลาดในการ${result}การอบรม`);
        this.dialogRef.close();
      }
    }
  }
}
