import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

  //--------------------------> edit
  protected onEdit(element: BudgetWellFare) {
    console.log('Element to edit:', element);
    this.editingMode = true;
    this.BudgetWellfareForm.patchValue({
      level: element.level,
      opd: element.opd,
      ipd: element.ipd,
      room: element.room,
    });
  }

  //--------------------------> modalเปิด/ปิด
  protected closeEditModal() {
    this.editingMode = false;
    this.showEditModal = false;
    this.BudgetWellfareForm.reset();
  }

  //--------------------------> เคลียร์ข้อมูล
  protected close() {
    setTimeout(() => {
      location.reload();
    }, 400);
  }

  //-----------------------------------> แจ้งเตือนกรอกข้อมูลให้ครบ
  protected async checkBudgetWellFareForm() {
    if (
      !this.BudgetWellfareForm.get('level')?.value ||
      !this.BudgetWellfareForm.get('opd')?.value ||
      !this.BudgetWellfareForm.get('ipd')?.value ||
      !this.BudgetWellfareForm.get('room')?.value
    ) {
      this.showErrorBudgetWellFareForm('');
    } else {
      // แสดงข้อความความสำเร็จ และรอให้ผู้ใช้กดปุ่มตกลง
      await this.swalService.showSuccess('เพิ่มข้อมูลสำเร็จ');

      // หลังจากผู้ใช้กดตกลงแล้ว จึงทำการรีเซ็ตฟอร์ม
      this.BudgetWellfareForm.reset();
    }
  }

  //-----------------------------------> แจ้งเตือนกรอกข้อมูลให้ครบ
  protected showErrorBudgetWellFareForm(message: string) {
    this.swalService.showErrorBudgetWellFareForm(message);
  }

  //-----------------------------------> แจ้งเตือนว่าคุณต้องการแจ้งเตือนว่าต้องการแก้ไขหรือไม่
  protected async onEditButtonClick() {
    const isConfirmed = await this.swalService.showConfirm(
      'คุณต้องการแก้ไขข้อมูลนี้หรือไม่?'
    );

    if (isConfirmed) {
      this.close();
    }
  }

  //-----------------------------------> แจ้งเตือนลบข้อมูล
  protected async onDeleteButtonClick() {
    const isConfirmed = await this.swalService.showConfirm(
      'คุณต้องการลบข้อมูลนี้หรือไม่?'
    );

    if (isConfirmed) {
      this.close();
    }
  }
  //-----------------------------------> input comma
  formatNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = parseInt(value).toLocaleString();
    }
    event.target.value = value;
  }
}
