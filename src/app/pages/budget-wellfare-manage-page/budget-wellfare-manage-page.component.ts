import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BudgetWellFare } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(private fb: FormBuilder, private apiService: ApiService) {
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
    // const res = await this.apiService.getBudgetWelfare().toPromise();
    // console.log(res);
    // if (res) {
    //   // จัดเรียงข้อมูลตามฟิลด์ level
    //   this.dataSource.data = res.sort((a, b) =>
    //     a.level.localeCompare(b.level, undefined, { numeric: true })
    //   );
    //   // เพิ่มหมายเลขลำดับ (no)
    //   this.dataSource.data.forEach((item, index) => {
    //     item.no = index + 1;
    //   });
    // }
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

  onEditButtonClick() {}

  closeEditModal() {
    this.editingMode = false;
    this.showEditModal = false;
    this.BudgetWellfareForm.reset();
  }
}
