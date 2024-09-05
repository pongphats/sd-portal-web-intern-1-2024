import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/services/common.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.scss'],
})
export class ReportModalComponent implements OnInit {
  reportBase64!: string;
  pdfUrl!: SafeResourceUrl;

  constructor(
    private trainingService: TrainingService,
    private cd: ChangeDetectorRef,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    if (this.trainingService.reportBase64) {
      this.reportBase64 = this.trainingService.reportBase64;
      this.pdfUrl = this.commonService.createSafePdfUrl(this.reportBase64);
      this.cd.detectChanges(); // Ensure UI updates
    } else {
      console.error('No base64 report data found.');
    }
  }
}
