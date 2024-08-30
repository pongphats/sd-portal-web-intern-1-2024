import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SwalService } from 'src/app/services/swal.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-check-training-modal',
  templateUrl: './check-training-modal.component.html',
  styleUrls: ['./check-training-modal.component.scss'],
})
export class CheckTrainingModalComponent implements OnInit {
  sectionOneInvalid: boolean = false;

  constructor(
    private trainingService: TrainingService,
    private apiService: ApiService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.getEditSectionOneFormsStatus();
    // console.log(this.trainingService.trainingEditFormsInValid);
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
        this.swalService.showLoading()
        const res = await this.apiService.editSectionOne(id, data).toPromise();
        if (res) {
          this.swalService.showSuccess('แก้ไข้อมูลสำเร็จ');
        }
      } catch (error) {
        console.error(error);
        this.swalService.showError('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
      }
    } else {
      console.log("cancel");
      
    }
  }

  cancel() {
    console.log(
      'after cancel check val:',
      this.trainingService.trainingRequest
    );
  }
}
