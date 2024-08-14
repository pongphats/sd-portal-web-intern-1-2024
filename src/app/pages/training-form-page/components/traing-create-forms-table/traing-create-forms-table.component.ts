import { Component, OnInit } from '@angular/core';
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

  creatorId !: number

  constructor(
    private commonService: CommonService,
    private swalService: SwalService,
    private authService: AuthService,
    private trainingService: TrainingService
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
        console.log(this.trainingList);
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
}
