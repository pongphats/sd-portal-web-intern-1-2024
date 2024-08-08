import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-traing-create-forms-table',
  templateUrl: './traing-create-forms-table.component.html',
  styleUrls: ['./traing-create-forms-table.component.scss'],
})
export class TraingCreateFormsTableComponent implements OnInit {
  trainingList: any[] = [];

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.initTrainingList();
  }

  initTrainingList(): void {
    this.commonService.getTrainingList().subscribe((value: any[]) => {
      if (value) {
        this.trainingList = value;
      }
    });
  }
}
