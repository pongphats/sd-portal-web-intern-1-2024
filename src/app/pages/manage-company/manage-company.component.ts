import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { SectorManageForm } from 'src/app/interface/form';
import {
  createAndUpdateBudgetRequest,
  CreateSectorRequest,
  createPosition,
  editPosition,
} from 'src/app/interface/request';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SwalService } from 'src/app/services/swal.service';

import { Position } from 'src/app/interface/employee';
import { id } from 'date-fns/locale';
import Swal from 'sweetalert2';

// Auto
export interface User {
  deptManage: string;
}

@Component({
  selector: 'app-manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.scss'],
})
export class ManageCompanyComponent implements OnInit {
  sectorManageForm!: FormGroup<SectorManageForm>;
  showDeleteButton: boolean = false; //ลบ

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private apiService: ApiService,
    private swalService: SwalService
  ) {
    this.sectorManageForm = this.fb.group({
      company: ['PCCTH', [Validators.required]],
      sectorTname: ['', [Validators.required]],
      sectorEname: ['', [Validators.required]],
      sectorCode: ['', [Validators.required]],
      deptTname: ['', [Validators.required]],
      deptEname: ['', [Validators.required]],
      deptId: ['', [Validators.required]], //ไอดีแผนก
      deptCode: ['', [Validators.required]], //รหัสแผนก
      deptManage: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    //Auto
    this.filteredOptions = this.sectorManageForm
      .get('deptManage')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : '')),
        map((deptManage) =>
          deptManage ? this._filter(deptManage) : this.adminEmps.slice()
        )
      );

    this.genAdmin(); //1

    this.loadSpecificCompanySectors(); //2

    this.loadPositionManagement(); //3 table2

    //this.dataManageCompany.paginator = this.paginator;
  }

  //
  ngAfterViewInit() {
    this.dataManageCompany.paginator = this.paginator;
  }

  //Auto
  adminEmps: string[] = [];
  async genAdmin() {
    try {
      //api
      const res = await this.commonService.generateAdminFullName().toPromise();
      if (res) {
        this.adminEmps = res;
        console.log(res);
        console.log('Admin Options:', this.adminEmps); // ดูว่ามีข้อมูลถูกต้องหรือไม่
      } else {
        this.adminEmps = []; // Or handle the case where `res` is `undefined`
      }
    } catch (error) {
      console.error('Error generating admin full names:', error);
    }
  }

  //Auto
  filteredOptions!: Observable<string[]>;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.adminEmps
      .filter((option: string) => option.toLowerCase().includes(filterValue))
      .sort();
  }
  //add
  async createSectorDept() {
    console.log('Pass');
    const companyId = this.sectorManageForm.value.company || ''; // แปลงค่าจากฟอร์มเป็นหมายเลข
    console.log(companyId);
    const res = await this.commonService
      .getCompanyIdByName(companyId)
      .toPromise();
    console.log(res);
    console.log(this.sectorManageForm);

    const deptManageValue = this.sectorManageForm.value.deptManage || ''; // ค่าจากฟอร์ม
    console.log('deptManage value:', this.sectorManageForm.value.deptManage);

    const manageFullName =
      typeof deptManageValue === 'string' ? deptManageValue.split(' ') : [];
    const manageFirstName =
      manageFullName.length === 3 ? manageFullName[1] : manageFullName[0] || '';
    const manageLastName =
      manageFullName.length === 3 ? manageFullName[2] : manageFullName[1] || '';

    const req: CreateSectorRequest = {
      companyId: res || 0,
      sectorTname: this.sectorManageForm.value.sectorTname || '', //ฝ่ายไทย
      sectorFullName: this.sectorManageForm.value.sectorEname || '', //ฝ่ายอังกฤษ
      sectorCode: this.sectorManageForm.value.sectorCode || '', //รหัสฝ่าย
      deptTname: this.sectorManageForm.value.deptTname || '', //แผนกไทย
      deptFullName: this.sectorManageForm.value.deptEname || '', //แผนกอังกฤษ
      deptCode: this.sectorManageForm.value.deptId || '',
      firstName: manageFirstName,
      lastName: manageLastName,
      sectorName: this.sectorManageForm.value.sectorCode || '', //
      deptName: this.sectorManageForm.value.deptCode || '', //รหัสแผนก
    };

    console.log(req);
    try {
      // Call API (save)
      const apiRes = await this.apiService.createSectorAndDept(req).toPromise();
      console.log('Sector and Department created successfully:', apiRes);

      // Show success message with SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'เพิ่มข้อมูลสำเร็จ',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#22c55e',
      });

      // Update the table data and reset form
      await this.loadSpecificCompanySectors(); // Re-fetch data to include new sector/department
      this.clearForm();
    } catch (error) {
      console.error('Error creating sector and department:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'There was an error creating the sector and department.',
        confirmButtonText: 'OK',
      });
    }
  }

  async editSectorDept() {
    const companyId = this.sectorManageForm.value.company || ''; // แปลงค่าจากฟอร์มเป็นหมายเลข
    console.log(companyId);
    const numberCompany = await this.commonService
      .getCompanyIdByName(companyId)
      .toPromise();
    console.log('numberCompany', numberCompany);

    const deptManageValue = this.sectorManageForm.value.deptManage || '';
    const manageFullName =
      typeof deptManageValue === 'string' ? deptManageValue.split(' ') : [];
    const manageFirstName =
      manageFullName.length === 3 ? manageFullName[1] : manageFullName[0] || '';
    const manageLastName =
      manageFullName.length === 3 ? manageFullName[2] : manageFullName[1] || '';

    console.log('selectedSector', this.selectedSector);

    const req: CreateSectorRequest = {
      companyId: numberCompany || 0,
      sectorTname: this.sectorManageForm.value.sectorTname || '',
      sectorFullName: this.sectorManageForm.value.sectorEname || '',
      sectorCode: this.sectorManageForm.value.sectorCode || '',
      deptTname: this.sectorManageForm.value.deptTname || '',
      deptFullName: this.sectorManageForm.value.deptEname || '',
      deptCode: this.sectorManageForm.value.deptCode || '',
      firstName: manageFirstName,
      lastName: manageLastName,
      sectorName: this.sectorManageForm.value.sectorCode || '',
      deptName: this.sectorManageForm.value.deptCode || '',
    };

    try {
      // ส่ง `sectorId` และ `deptId` เข้าไปในฟังก์ชันแก้ไข
      const apiRes = await this.apiService
        .editSectorAndDept(
          req,
          this.selectedSector.sectorId,
          this.selectedSector.department.id
        )
        .toPromise();
      console.log('Sector and Department updated successfully:', apiRes);

      // แสดงข้อความป๊อปอัพว่าการแก้ไขสำเร็จ
      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'แก้ไขข้อมูลสำเร็จ',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#22c55e',
      });

      await this.loadSpecificCompanySectors(); // โหลดข้อมูลใหม่เพื่อแสดงการอัปเดต
      this.clearForm(); // รีเซ็ตฟอร์มหลังจากการอัปเดต
    } catch (error) {
      console.error('Error updating sector and department:', error);

      // แสดงข้อความป๊อปอัพเมื่อเกิดข้อผิดพลาด
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'There was an error updating the sector and department.',
        confirmButtonText: 'OK',
      });
    }
  }

  //Table
  dataManageCompany = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //แสดงในตารางไม่ครบตรงนี้ จาก swagger
  displayedColumns: string[] = [
    'sectorTname',
    'sectorFullName',
    'sectorCode',
    'department.deptTname',
    'department.deptFullName',
    'department.deptName',
    'department.deptCode',
  ];

  async loadSpecificCompanySectors() {
    // ดึงค่าของ companyId จากฟอร์ม
    const companyId = this.sectorManageForm.value.company || '';
    console.log(`Loading sectors for company: ${companyId}`); //
    try {
      const companySectors =
        (await this.commonService
          .getSectorAndDeptsListByCompanyName(companyId)
          .toPromise()) || [];

      console.log('OtherCompany sector: ', companySectors);

      this.dataManageCompany.data = companySectors;

      console.log('Data for table:', this.dataManageCompany.data);
    } catch (error) {
      console.error('Error loading manage company data:', error);
    }
  }

  async clearForm() {
    // Get the current value of the 'company' control
    const companyValue = this.sectorManageForm.get('company')?.value;

    // Reset the form values except 'company'
    this.sectorManageForm.reset({
      company: companyValue,
    });
    //เปลี่ยนสถานะกลับไปที่โหมดการสร้าง
    this.isEditing = false;
    this.showDeleteButton = false; // ซ่อนปุ่มลบข้อมูล
  }

  isEditing: boolean = false;
  selectedSector: any = null;

  deptId!: number;
  adminRes: any;
  async onRowClick(row: any) {
    this.selectedSector = row;
    console.log(row);
    this.deptId = row.department.id;

    // Fetch admin details
    try {
      const deptCode = row.department.deptCode;
      const deptName = row.department.deptName;
      const companyName = row.company;

      this.adminRes = await this.apiService
        .getAdminByDeptCodeDeptNameCompanyName(deptCode, deptName, companyName)
        .toPromise();
      console.log('adminRes', this.adminRes);

      if (this.adminRes) {
        const admin = this.adminRes; // Assuming this is the response from your API
        const fullName = `${admin.title} ${admin.firstname} ${admin.lastname}`;
        console.log('fullname', fullName);

        this.sectorManageForm.patchValue({
          company: row.company,
          sectorTname: row.sectorTname,
          sectorEname: row.sectorFullName,
          sectorCode: row.sectorCode,
          deptTname: row.department.deptTname,
          deptEname: row.department.deptFullName,
          deptCode: row.department.deptName,
          deptId: row.department.deptCode,
          deptManage: fullName,
        });

        this.isEditing = true; // Switch to edit mode
        this.showDeleteButton = true; // Show delete button

        // Fetch and display positions for the selected department Table2*****
        await this.loadPositionManagement();
      } else {
        console.error('Admin details not found');
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  }

  // ลบปลอม
  deleteDataRow(element: any): void {
    // Remove element from dataManageCompany.data
    const data = this.dataManageCompany.data;
    const index = data.indexOf(element);
    if (index >= 0) {
      data.splice(index, 1);
      this.dataManageCompany.data = [...data]; // Trigger change detection
    }
  }

  // ลบข้อมูลจริง
  async deleteData() {
    const confirmed = await this.swalService.showConfirm('ต้องการลบใช่มั้ย');
    if (confirmed) {
      const res = await this.apiService
        .deleteDepartmantId(this.deptId)
        .toPromise();
      this.swalService.showSuccess('สำเร็จ');
      this.clearForm();
      await this.loadSpecificCompanySectors(); //update table หลัง ลบ
    } else {
      console.log('cancel');
    }
  }

  //Taable 2
  positionManagement = new MatTableDataSource<any>([]);
  displayedColumns2: string[] = ['positionNo', 'positionName'];

  // async loadPositionManagement() {
  //   try {
  //     // Call API to get position data for the selected department
  //     const positions = await this.apiService.getAllPositionDept(this.deptId).toPromise();
  //     console.log('Positions for selected department:', positions);

  //   } catch (error) {
  //     console.error('Error loading position management data:', error);
  //   }
  // }

  async loadPositionManagement() {
    try {
      // API
      const responsePosition = await this.apiService
        .getAllPositionDept(this.deptId)
        .toPromise();

      // Handle cases where response might be undefined ตรวจสอบว่า response ไม่เป็น undefined และเป็น array
      if (responsePosition && Array.isArray(responsePosition)) {
        console.log('Positions for selected department:', responsePosition);

        // Map the positions data to include a sequential position number
        const mappedPositions = responsePosition.map(
          (position: any, index: number) => ({
            positionNo: index + 1, // Position number starts from 1
            positionName: position.positionName, // Assuming the API returns an object with positionName
            positionId: position.id, //เก็บ id เพื่อเอาไปแก้
          })
        );

        // Set the data for the MatTableDataSource
        this.positionManagement.data = mappedPositions;
      } else {
        console.error(
          'Unexpected data format or no data for positions:',
          responsePosition
        );
        this.positionManagement.data = []; // Clear data if the format is unexpected or if data is undefined
      }
    } catch (error) {
      console.error('Error loading position management data:', error);
      this.positionManagement.data = []; // Ensure table is cleared if an error occurs
    }
  }

  positionManage: string = ''; //ตำแหน่ง

  onRowClick2(row: any) {
    console.log('Row clicked:', row); // เพิ่มบรรทัดนี้
    this.positionManage = row.positionName;

    console.log('Position Manage Updated:', this.positionManage); // ตรวจสอบการอัปเดต
    this.positionId = row.positionId; //positionId ที่เก็บ id จากตอนกดrow2
    console.log('Id is:', this.positionId);
    this.selectedRowShowButton = row; //ปุ่มลบแสดง
    this.isEditingPositon = true; // เปลี่ยนสถานะเป็นการแก้ไข
    this.selectedRowShowButton = true; //ลบแสดง??
    this.isPositionNameEntered = true; //แสดงเพิ่มลบ

    // เลื่อนหน้าจอไปฟอร์ม
    this.scrollToForm();
  }
  // เลื่อนหน้าจอไปฟอร์ม
  @ViewChild('formContainer') formContainer!: ElementRef;
  // เลื่อนหน้าจอไปฟอร์ม
  scrollToForm() {
    if (this.formContainer) {
      this.formContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  selectedRowShowButton: any = null; // ใช้เก็บแถวที่ถูกเลือก

  async clearForm2() {
    this.positionManage = '';
    this.positionId = 0;
    //เปลี่ยนสถานะกลับไปที่โหมดการสร้าง
    this.isEditingPositon = false;
    this.selectedRowShowButton = false; //ซ่อนปุ่มลบ
    this.isPositionNameEntered = false;
  }

  isEditingPositon: boolean = false;
  positionId!: number;

  async createPositon() {
    this.isPositionNameEntered = true;
    const req: createPosition = {
      positionName: this.positionManage,
      departmentId: this.deptId,
    };

    console.log('req', req);

    try {
      // API
      const apiRes = await this.apiService.createPosition(req).toPromise();
      console.log('create position response:', apiRes);

      // โหลดข้อมูลตำแหน่งใหม่
      await this.loadPositionManagement(); // 3 table2

      // รีเซ็ต
      this.clearForm2();

      // แสดงป๊อปอัพแจ้งเตือนความสำเร็จ
      Swal.fire({
        title: 'สำเร็จ',
        text: 'เพิ่มตำแหน่งสำเร็จ',
        icon: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#22c55e',
      }).then((result) => {
        if (result.isConfirmed) {
          // กด 'ตกลง' แล้ว
        }
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลตำแหน่งได้',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  }

  async editPositon() {
    if (!this.positionId) {
      console.error('Position ID is null or undefined.');
      return;
    }

    // สร้างคำขอแก้ไขข้อมูลตำแหน่ง
    const req: editPosition = {
      posName: this.positionManage,
      posId: this.positionId,
    };

    console.log('Editing position with request:', req);

    try {
      // API
      const apiRes = await this.apiService.editPosition(req).toPromise();
      console.log('Edit position response:', apiRes);

      await this.loadPositionManagement(); // 3 table2

      this.clearForm2(); // รีเซ็ตฟอร์มหลังจากการอัปเดต

      Swal.fire({
        title: 'สำเร็จ',
        text: 'แก้ไขข้อมูลตำแหน่งเรียบร้อย',
        icon: 'success',
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#22c55e',
      }).then((result) => {
        if (result.isConfirmed) {
          // 'ตกลง'
        }
      });
    } catch (error) {
      // จัดการข้อผิดพลาดที่อาจเกิดขึ้น
      console.error('Error editing position:', error);

      // แสดงป๊อปอัพแจ้งเตือนข้อผิดพลาด
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถแก้ไขข้อมูลตำแหน่งได้',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  }

  async deletePosition() {
    // ค่าที่ต้องการแสดงคือ positionManage = ระบุตำแหน่ง: รับมา
    const positionName = this.positionManage;

    // ข้อความยืนยัน
    const confirmMessage = `ต้องการลบ ตำแหน่ง: ${positionName} ใช่มั้ย`;

    // แสดงกล่องยืนยันพร้อมข้อความที่ปรับปรุงแล้ว
    const confirmed = await this.swalService.showConfirm(confirmMessage);

    if (confirmed) {
      try {
        // เรียกใช้ API เพื่อลบ
        const res = await this.apiService
          .deletePosition(this.positionId)
          .toPromise();
        this.swalService.showSuccess('สำเร็จ');
        this.clearForm2();
        await this.loadPositionManagement(); // update table หลังจากลบ
      } catch (error) {
        console.error('ลบไม่สำเร็จ', error);
        this.swalService.showError('เกิดข้อผิดพลาดในการลบ');
      }
    } else {
      console.log('cancel');
    }
  }

  isPositionNameEntered: boolean = false; //ถ้าเริ่มพิมพ์ตำแหน่ง
  // ใส่ข้อมูลแล้วปุ่มแสดง
  onPositionManageChange() {
    this.isPositionNameEntered = !!this.positionManage;
  }
}
