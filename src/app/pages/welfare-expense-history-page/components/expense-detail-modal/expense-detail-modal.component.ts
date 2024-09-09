import { Component, OnInit } from '@angular/core';
import { BuddhistDatePipe } from '@shared/pipes/budhist-date.pipe';
import { NumberFormatPipe } from '@shared/pipes/number-format.pipe';
import { ExpenseDetail } from 'src/app/interface/common';
import { ApiService } from 'src/app/services/api.service';
import { SwalService } from 'src/app/services/swal.service';
import { WelfareService } from 'src/app/services/welfare.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense-detail-modal',
  templateUrl: './expense-detail-modal.component.html',
  styleUrls: ['./expense-detail-modal.component.scss'],
})
export class ExpenseDetailModalComponent implements OnInit {
  expenseDetail: ExpenseDetail = {} as ExpenseDetail;
  constructor(
    private welfareService: WelfareService,
    private apiService: ApiService,
    private buddhistDatePipe: BuddhistDatePipe,
    private numberFormatPipe: NumberFormatPipe,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.initialDetail();
  }

  async initialDetail() {
    this.swalService.showLoading();
    try {
      const expenseId = this.welfareService.expenseId;
      const expenseDetail = await this.apiService
        .getExpenseById(expenseId)
        .toPromise();
      const employee = await this.apiService
        .findUserById(expenseDetail?.userId || 0)
        .toPromise();
      if (employee && expenseDetail) {
        this.expenseDetail.dateOfAdmission =
          this.buddhistDatePipe.transform(
            new Date(expenseDetail?.dateOfAdmission)
          ) || '';
        this.expenseDetail.canWithdraw = this.numberFormatPipe.transform(
          expenseDetail.canWithdraw || 0
        );
        this.expenseDetail.companyName = employee.company.companyName || '';
        this.expenseDetail.deptName = employee.department.deptName || '';
        this.expenseDetail.description = expenseDetail.description || '';
        this.expenseDetail.empLevel = employee.level || '';
        this.expenseDetail.expenseType =
          expenseDetail.ipd != 0 ? 'ผู้ป่วยใน' : 'ผู้ป่วยนอก' || '';
        this.expenseDetail.firstName = employee.firstname || '';
        this.expenseDetail.lastName = employee.lastname || '';
        this.expenseDetail.positionName = employee.position.positionName || '';
        this.expenseDetail.remark = expenseDetail.remark || '';
        this.expenseDetail.roomService = this.numberFormatPipe.transform(
          expenseDetail.roomService || 0
        );
        this.expenseDetail.sectorName = employee.sector.sectorName || '';

        const widthDrawRequset =
          expenseDetail.ipd != 0 ? expenseDetail.ipd : expenseDetail.opd;
        this.expenseDetail.withdrawReq = this.numberFormatPipe.transform(
          widthDrawRequset || 0
        );

        const startDate = this.buddhistDatePipe.transform(
          new Date(expenseDetail.startDate || '')
        );
        const endDate = this.buddhistDatePipe.transform(
          new Date(expenseDetail.endDate || '')
        );
        const dateRange = `${startDate} - ${endDate}`;
        const dateRangeFormat = startDate === endDate ? startDate : dateRange;

        this.expenseDetail.dateRange = dateRangeFormat;
        this.expenseDetail.dateCount = String(expenseDetail.days) || "0";
        // console.log(this.expenseDetail);
        Swal.close();
      }
    } catch (error) {
      console.error(error);
      this.swalService.showError('เกิดข้อผิดพลาดในการค้นหาข้อมูล');
    }
  }
}
