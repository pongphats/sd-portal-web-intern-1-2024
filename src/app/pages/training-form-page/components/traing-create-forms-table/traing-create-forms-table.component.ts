import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-traing-create-forms-table',
  templateUrl: './traing-create-forms-table.component.html',
  styleUrls: ['./traing-create-forms-table.component.scss'],
})
export class TraingCreateFormsTableComponent implements OnInit {
  trainingList: any[] = [];

  constructor(
    private commonService: CommonService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.initTrainingList();
  }

  initTrainingList(): void {
    this.commonService.getTrainingList().subscribe((value: any[]) => {
      if (value) {
        this.trainingList = value;
        console.log(this.trainingList);
      }
    });
  }

  removeTrainning(index: number) {
    try {
      this.commonService.removeTraining(index);
    } catch (error) {
      console.error('Error removing training item:', error);
    }
  }
}
