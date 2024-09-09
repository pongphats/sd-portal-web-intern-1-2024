import { Component, OnInit } from '@angular/core';
import { el } from 'date-fns/locale';
import { CreateTrainingRequestForm } from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-traing-create-forms-table',
  templateUrl: './traing-create-forms-table.component.html',
  styleUrls: ['./traing-create-forms-table.component.scss'],
})
export class TraingCreateFormsTableComponent implements OnInit {
  trainingList: any[] = [];

  mappedTrainListCreateForms: CreateTrainingRequestForm[] = [];
  creatorId!: number;

  constructor(
    private commonService: CommonService,
    private swalService: SwalService,
    private authService: AuthService,
    private trainingService: TrainingService,
    private apiService: ApiService
  ) {
    this.creatorId = this.authService.getUID();
  }

  ngOnInit(): void {
    this.initTrainingList();
  }

  initTrainingList(): void {
    this.trainingService.getTrainingList().subscribe((value: any[]) => {
      if (value) {
        this.trainingList = value;
      }
    });
  }

  removeTrainning(index: number) {
    try {
      this.trainingService.removeTraining(index);
    } catch (error) {
      console.error('Error removing training item:', error);
    }
  }

  async saveTraining() {
    this.swalService.showLoading();
    try {
      const itemList = this.trainingList;
      for (let i = 0; i < itemList.length; i++) {
        const element = itemList[i];
        const mappedValue =
          this.trainingService.mappingCreatTrainingFormsToRequestForm(element);
        await this.apiService.createTrainingForms(mappedValue).toPromise();
      }
      this.swalService.showSuccess("บันทึกฟอร์มส่งอบรมทั้งหมดสำเร็จ").then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      })
    } catch (error) {
      this.swalService.showError('ไม่สามารถบันทึกฟอร์มส่งอบรมได้สำเร็จทั้งหมด');
      console.error(error);
      
    }
  }
}
