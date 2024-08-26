import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { level } from 'src/app/interface/common';
import { budgetCreate } from 'src/app/interface/request';
import { BudgetWellFare } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-budget-wellfare-manage-page',
  templateUrl: './budget-wellfare-manage-page.component.html',
  styleUrls: ['./budget-wellfare-manage-page.component.scss'],
})
export class BudgetWellfareManagePageComponent implements OnInit {
  BudgetWellfareForm: FormGroup;
  displayedColumns: string[] = ['id', 'level', 'opd', 'ipd', 'room', 'edit'];
  dataSource = new MatTableDataSource<BudgetWellFare>([]);
  editingMode = false;
  editId: number = -1;
  showAddModal = false;
  showEditModal = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private swalService: SwalService
  ) {
    this.BudgetWellfareForm = this.fb.group({
      level: ['', Validators.required],
      opd: ['', Validators.required],
      ipd: ['', Validators.required],
      room: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getBudgetWelfare();
  }

  //--------------------------> API BudgetWellFare
  async getBudgetWelfare() {
    const res = await this.apiService.getBudgetWelfare().toPromise();
    console.log(res);
    if (res) {
      // จัดเรียงข้อมูลตามฟิลด์ level
      this.dataSource.data = res.sort((a, b) =>
        a.level.localeCompare(b.level, undefined, { numeric: true })
      );
      // เพิ่มหมายเลขลำดับ (no)
      this.dataSource.data.forEach((item, index) => {
        item.no = index + 1;
      });
    }
  }

  //--------------------------> API Save
  async onSave() {
    if (
      !this.BudgetWellfareForm.get('level')?.value ||
      !this.BudgetWellfareForm.get('opd')?.value ||
      !this.BudgetWellfareForm.get('ipd')?.value ||
      !this.BudgetWellfareForm.get('room')?.value
    ) {
      this.showErrorBudgetWellFareForm('กรุณากรอกข้อมูลให้ครบทุกช่อง');
    } else {
      const newLevel = this.BudgetWellfareForm.get('level')?.value;

      try {
        const existingBudgetWelfare = await this.apiService
          .getBudgetWelfare()
          .toPromise();

        const isDuplicate = existingBudgetWelfare?.some(
          (budget: any) => budget.level === newLevel
        );

        if (isDuplicate) {
          this.swalService.showErrorBudgetLevel(
            `พนักงานระดับ "${newLevel}" มีอยู่ในระบบแล้ว`
          );
        } else {
          const req: budgetCreate = {
            level: newLevel || '',
            opd: this.BudgetWellfareForm.value.opd?.replace(/,/g, '') ?? '0',
            ipd: this.BudgetWellfareForm.value.ipd?.replace(/,/g, '') ?? '0',
            room: this.BudgetWellfareForm.value.room?.replace(/,/g, '') ?? '0',
          };

          await this.apiService.createNewLevel(req).toPromise();
          await this.swalService.showSuccess('เพิ่มข้อมูลสำเร็จ');
          this.BudgetWellfareForm.reset();
          this.getBudgetWelfare();
        }
      } catch (error) {
        this.showErrorBudgetWellFareForm('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    }
  }

  //-----------------------------------> API Edit
  protected async onEditButtonClick() {
    const isConfirmed = await this.swalService.showConfirm(
      'คุณต้องการแก้ไขข้อมูลนี้หรือไม่?'
    );

    if (isConfirmed) {
      const req: level = {
        id: this.editId || 0,
        level: this.BudgetWellfareForm.value.level || '',
        opd: this.BudgetWellfareForm.value.opd?.replace(/,/g, '') ?? '0',
        ipd: this.BudgetWellfareForm.value.ipd?.replace(/,/g, '') ?? '0',
        room: this.BudgetWellfareForm.value.room?.replace(/,/g, '') ?? '0',
      };

      try {
        await this.apiService.editLevel(req).toPromise();
        await this.swalService.showSuccess('อัพเดทข้อมูลสำเร็จ');
        this.BudgetWellfareForm.reset();
        this.getBudgetWelfare();
      } catch (error) {
        this.showErrorBudgetWellFareForm('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
      }
    }
  }

  //--------------------------> edit
  protected onEdit(element: BudgetWellFare) {
    console.log('Element to edit:', element);
    this.editingMode = true;
    this.editId = element.id;
    this.BudgetWellfareForm.patchValue({
      level: element.level,
      opd: this.formatNumberWithComma(element.opd),
      ipd: this.formatNumberWithComma(element.ipd),
      room: this.formatNumberWithComma(element.room),
    });
  }

  //-----------------------------------> API delete

  protected async onDeleteButtonClick(id: number) {
    const isConfirmed = await this.swalService.showConfirm(
      'คุณต้องการลบข้อมูลนี้หรือไม่?'
    );

    if (isConfirmed) {
      this.apiService.deleteLevel(id).subscribe(
        (response) => {
          this.getBudgetWelfare();
          console.log('Deleted successfully', response);
        },
        (error) => {
          console.error('Error deleting', error);
        }
      );
    }
  }

  //--------------------------> modalเปิด/ปิด
  protected closeEditModal() {
    this.editId = -1;
    this.editingMode = false;
    this.showEditModal = false;
    this.BudgetWellfareForm.reset();
  }

  //-----------------------------------> แจ้งเตือนกรอกข้อมูลให้ครบ
  protected showErrorBudgetWellFareForm(message: string) {
    this.swalService.showErrorBudgetWellFareForm(message);
  }

  //-----------------------------------> input comma
  formatNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = parseInt(value).toLocaleString();
    }
    event.target.value = value;
  }

  formatNumberWithComma(val: any): string {
    let valString = val + '';
    if (valString.length > 3) {
      return (valString = parseInt(valString).toLocaleString());
    } else {
      return valString;
    }
  }
}
