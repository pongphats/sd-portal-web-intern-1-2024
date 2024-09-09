import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { approveTrainingReq } from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
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
    private commonService: CommonService,
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
          // console.log(this.sectionOneInvalid);
        }
      });
  }

  async editSectionOneForms() {
    // console.log('after edit check val:', this.trainingService.trainingRequest);
    const id = this.trainingService.trainingEditId;
    const data = this.trainingService.trainingRequest;
    const confirm = await this.swalService.showConfirm('ยืนยันการแก้ไขฟอร์ม');
    if (confirm) {
      this.swalService.showLoading;
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
      // console.log('cancel');
    }
  }

  cancel() {
    // console.log(
    //   'after cancel check val:',
    //   this.trainingService.trainingRequest
    // );
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

  async saveOrEditSectionTwo() {
    const dateCurrent = this.commonService.formatDateToYYYYMMDDString(
      new Date()
    );
    this.trainingService.sectionTwoRequest.evaluationDate = dateCurrent;

    const data = this.trainingService.sectionTwoRequest;
    const id = this.trainingService.trainingEditData.training.result[0].id;

    let confirm;
    if (data.result == 'pass') {
      confirm =
        data.plan == '' && data.cause == ''
          ? await this.swalService.showConfirm(
              'คุณยืนยันการประเมินการอบรมใช่หรือไม่'
            )
          : false;
    } else if (data.result == 'fail') {
      confirm =
        data.plan == '' && data.cause == ''
          ? this.swalService.showWarning('กรุณากรอกเหตุผลและแผนการพัฒนา')
          : data.plan != '' && data.cause == ''
          ? this.swalService.showWarning('กรุณากรอกเหตุผล')
          : data.plan == '' && data.cause != ''
          ? this.swalService.showWarning('กรุณากรอกแผนการพัฒนา')
          : await this.swalService.showConfirm(
              'คุณยืนยันการประเมินการอบรมใช่หรือไม่'
            );
    } else if (data.result == 'noResult') {
      const allResultsEmpty = [
        data.result1,
        data.result2,
        data.result3,
        data.result4,
        data.result5,
        data.result6,
        data.result7,
      ].every((result) => result === '');
      confirm =
        data.cause != '' && allResultsEmpty
          ? await this.swalService.showConfirm(
              'คุณยืนยันการประเมินการอบรมใช่หรือไม่'
            )
          : data.cause == ''
          ? this.swalService.showWarning('กรุณากรอกเหตุผล')
          : false;
    }

    // TODO: บันทึก
    if (confirm) {
      try {
        const res = await this.apiService.editSectionTwo(id, data).toPromise();
        if (res) {
          (await this.swalService.showSuccess('ทำการประเมินเรียบร้อยแล้ว'))
            ? this.dialogRef.close()
            : false;
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }
}
