import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { SectorManageForm } from 'src/app/interface/form';
import { CreateSectorRequest } from 'src/app/interface/request';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SwalService } from 'src/app/services/swal.service';


// Auto
export interface User {
  deptManage: string;
}

@Component({
  selector: 'app-manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.scss']
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
    this.filteredOptions = this.sectorManageForm.get('deptManage')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : '')),
      map(deptManage => (deptManage ? this._filter(deptManage) : this.adminEmps.slice())),
    );

    this.genAdmin();//1

    this.loadSpecificCompanySectors();//2

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
        console.log(res)
        console.log('Admin Options:', this.adminEmps); // ดูว่ามีข้อมูลถูกต้องหรือไม่
      } else {
        this.adminEmps = []; // Or handle the case where `res` is `undefined`
      }

    }

    catch (error) {
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

    //not Edit Mode
    //companyId ส่งไปหลัง
    console.log("Pass")
    const companyId = this.sectorManageForm.value.company || ''; // แปลงค่าจากฟอร์มเป็นหมายเลข
    console.log(companyId)
    const res = await this.commonService.getCompanyIdByName(companyId).toPromise();
    console.log(res)
    console.log(this.sectorManageForm)
    // console.log('deptManage value:', this.sectorManageForm.value.deptManage);

    // ตรวจสอบและแยกชื่อเต็ม
    const deptManageValue = this.sectorManageForm.value.deptManage || ''; // ค่าจากฟอร์ม
    console.log('deptManage value:', this.sectorManageForm.value.deptManage);

    const manageFullName = typeof deptManageValue === 'string' ? deptManageValue.split(' ') : [];
    const manageFirstName =
      manageFullName.length === 3 ? manageFullName[1] : (manageFullName[0] || '');
    const manageLastName =
      manageFullName.length === 3 ? manageFullName[2] : (manageFullName[1] || '');

    //interface request -> CreateSectorRequest / form -> SectorManageForm
    //หน้า request หลัง form
    const req: CreateSectorRequest = {
      companyId: res || 0,
      sectorTname: this.sectorManageForm.value.sectorTname || '',  //ฝ่ายไทย
      sectorFullName: this.sectorManageForm.value.sectorEname || '',   //ฝ่ายอังกฤษ
      sectorCode: this.sectorManageForm.value.sectorCode || '',      //รหัสฝ่าย
      deptTname: this.sectorManageForm.value.deptTname || '',        //แผนกไทย
      deptFullName: this.sectorManageForm.value.deptEname || '',    //แผนกอังกฤษ
      deptCode: this.sectorManageForm.value.deptId || '',
      firstName: manageFirstName,
      lastName: manageLastName,
      sectorName: this.sectorManageForm.value.sectorCode || '', //
      deptName: this.sectorManageForm.value.deptCode || '',  //รหัสแผนก 
    };

    console.log(req)
    try {
      //call api (save)
      const apiRes = await this.apiService.createSectorAndDept(req).toPromise();
      console.log('Sector and Department created successfully:', apiRes);

      // Update the table data แสดงข้อมูลในตารางเลยหลังเพิ่ม
      await this.loadSpecificCompanySectors(); // Re-fetch data to include new sector/department
      // this.sectorManageForm.reset(); // Reset form after successful creation
      this.clearForm()


      // // Update the table data
      // await this.loadSpecificCompanySectors(); // Re-fetch data to include new sector/department

    } catch (error) {
      // การจัดการข้อผิดพลาด
      console.error('Error creating sector and department:', error);
    }




  }

  // ฟังก์ชันสำหรับการอัปเดตข้อมูล
  async editSectorDept() {
    const companyId = this.sectorManageForm.value.company || ''; // แปลงค่าจากฟอร์มเป็นหมายเลข
    console.log(companyId)
    const numberCompany = await this.commonService.getCompanyIdByName(companyId).toPromise();
    console.log("numberCompany", numberCompany)


    const deptManageValue = this.sectorManageForm.value.deptManage || '';
    const manageFullName = typeof deptManageValue === 'string' ? deptManageValue.split(' ') : [];
    const manageFirstName = manageFullName.length === 3 ? manageFullName[1] : (manageFullName[0] || '');
    const manageLastName = manageFullName.length === 3 ? manageFullName[2] : (manageFullName[1] || '');

    console.log("selectedSector", this.selectedSector)


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
      // const apiRes = await this.apiService.editSectorAndDept(req, this.selectedSector.id, this.selectedSector.deptId).toPromise();
      const apiRes = await this.apiService.editSectorAndDept(req, this.selectedSector.sectorId, this.selectedSector.department.id).toPromise();

      console.log('Sector and Department updated successfully:', apiRes);

      await this.loadSpecificCompanySectors(); // โหลดข้อมูลใหม่เพื่อแสดงการอัปเดต
      this.clearForm(); // รีเซ็ตฟอร์มหลังจากการอัปเดต
    } catch (error) {
      console.error('Error updating sector and department:', error);
    }
  }




  //Table
  // dataManageCompany: any[] = [];

  dataManageCompany = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  //แสดงในตารางไม่ครบตรงนี้ จาก swagger
  displayedColumns: string[] = ['sectorTname', 'sectorFullName', 'sectorCode', 'department.deptTname', 'department.deptFullName', 'department.deptName', 'department.deptCode', 'actions'];


  async loadSpecificCompanySectors() {
    // ดึงค่าของ companyId จากฟอร์ม
    const companyId = this.sectorManageForm.value.company || '';
    console.log(`Loading sectors for company: ${companyId}`); // 
    try {
      const companySectors = await this.commonService.getSectorAndDeptsListByCompanyName(companyId);

      console.log('OtherCompany sector: ', companySectors)

      this.dataManageCompany.data = companySectors;

      console.log('Data for table:', this.dataManageCompany.data);



    } catch (error) {
      console.error('Error loading manage company data:', error);
    }

  }

  // async
  // async clearFormAll() {
  //   this.sectorManageForm.reset()
  // }
  // public clearFormAll(): void{
  //   this.sectorManageForm.reset()
  // }


  async clearForm() {
    // Get the current value of the 'company' control
    const companyValue = this.sectorManageForm.get('company')?.value;

    // Reset the form values except 'company'
    this.sectorManageForm.reset({
      company: companyValue
    });
    //เปลี่ยนสถานะกลับไปที่โหมดการสร้าง
    this.isEditing = false;
    this.showDeleteButton = false; // ซ่อนปุ่มลบข้อมูล

  }

  // this.sectorManageForm.get('deptEname')?.reset();

  isEditing: boolean = false;
  selectedSector: any = null;

  // async onRowClick(row: any) {
  //   this.selectedSector = row;
  //   this.sectorManageForm.patchValue({
  //     company: row.company,
  //     sectorTname: row.sectorTname,
  //     sectorEname: row.sectorFullName,
  //     sectorCode: row.sectorCode,
  //     deptTname: row.department.deptTname,
  //     deptEname: row.department.deptFullName,
  //     deptCode: row.department.deptName,
  //     deptId: row.department.deptCode,

  //   });


  //   this.isEditing = true; // Switch to edit mode
  //   this.showDeleteButton = true; // แสดงปุ่มลบข้อมูล
  // }

  deptId!: number;
  adminRes: any;
  async onRowClick(row: any) {
    this.selectedSector = row;
    console.log(row)
    this.deptId = row.department.id;

    // Fetch admin details
    try {
      const deptCode = row.department.deptCode;
      const deptName = row.department.deptName;
      const companyName = row.company;

      this.adminRes = await this.apiService.getAdminByDeptCodeDeptNameCompanyName(deptCode, deptName, companyName).toPromise();
      console.log("adminRes", this.adminRes)

      if (this.adminRes) {
        const admin = this.adminRes; // Assuming this is the response from your API
        const fullName = `${admin.title} ${admin.firstname} ${admin.lastname}`;
        console.log("fullname", fullName)

        this.sectorManageForm.patchValue({
          company: row.company,
          sectorTname: row.sectorTname,
          sectorEname: row.sectorFullName,
          sectorCode: row.sectorCode,
          deptTname: row.department.deptTname,
          deptEname: row.department.deptFullName,
          deptCode: row.department.deptName,
          deptId: row.department.deptCode,
          deptManage: fullName
        });

        this.isEditing = true; // Switch to edit mode
        this.showDeleteButton = true; // Show delete button
      } else {
        console.error('Admin details not found');
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  }





  deleteDataRow(element: any): void {
    // Remove element from dataManageCompany.data
    const data = this.dataManageCompany.data;
    const index = data.indexOf(element);
    if (index >= 0) {
      data.splice(index, 1);
      this.dataManageCompany.data = [...data]; // Trigger change detection
    }
  }

  // เมธอดสำหรับลบข้อมูล
  async deleteData() {
    const confirmed = await this.swalService.showConfirm("ต้องการลบใช่มั้ย")
    if (confirmed) {
      const res = await this.apiService.deleteDepartmantId(this.deptId).toPromise();
      this.swalService.showSuccess("สำเร็จ")
      this.clearForm()
      await this.loadSpecificCompanySectors(); //update table หลัง ลบ
    } else {
      console.log("cancel")
    }
    // const res = await this.apiService.deleteDepartmantId(this.deptId).toPromise(); //api delete
    // this.clearForm()
    // await this.loadSpecificCompanySectors(); //update table หลัง ลบ
  }







}
