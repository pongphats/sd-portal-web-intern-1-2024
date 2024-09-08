import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/services/common.service';
import { WelfareService } from 'src/app/services/welfare.service';

@Component({
  selector: 'app-expense-history-report-pdf-modal',
  templateUrl: './expense-history-report-pdf-modal.component.html',
  styleUrls: ['./expense-history-report-pdf-modal.component.scss'],
})
export class ExpenseHistoryReportPdfModalComponent implements OnInit {
  pdfUrl!: SafeResourceUrl;

  constructor(
    private welfareService: WelfareService,
    private cd: ChangeDetectorRef,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    if (this.welfareService.pdfBase64) {
      const pdfBase64 = this.welfareService.pdfBase64;
      this.pdfUrl = this.commonService.createSafePdfUrl(pdfBase64);
      this.cd.detectChanges(); // Ensure UI updates
    } else {
      console.error('No base64 report data found.');
    }
  }

  downloadReport() {
    const pdfBase64 = this.welfareService.pdfBase64
    this.commonService.downloadFileBase64(
      'รายงานการเบิกค่ารักษาพยาบาล',
      'application/pdf',
      pdfBase64
    );
  }
}
