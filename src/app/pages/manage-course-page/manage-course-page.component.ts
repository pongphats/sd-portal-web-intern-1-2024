import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BuddhistDatePipe } from '@shared/pipes/budhist-date.pipe';
import { CourseForm } from 'src/app/interface/form';
import { CreateTrainingRequest } from 'src/app/interface/request';
import { CreateTrainingResponse } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-course-page',
  templateUrl: './manage-course-page.component.html',
  styleUrls: ['./manage-course-page.component.scss']
})
export class ManageCoursePageComponent implements OnInit {
  courseForm!: FormGroup<CourseForm>;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private router: Router,
    private commonService: CommonService,
    private apiService: ApiService,
    private buddhistDatePipe: BuddhistDatePipe
  ) {
    this.courseForm = this.fb.group({
      id: [''],
      courseName: ['', Validators.required],
      startDate: [null],
      endDate: [null],
      timeStart: ['', Validators.required],
      timeEnd: ['', Validators.required],
      hours: ['', Validators.required],
      note: [''],
      price: ['', Validators.required],
      priceProject: [''],
      institute: ['', Validators.required],
      place: ['', Validators.required],
      // type: [''],
    }) as FormGroup<CourseForm>;
  }

  async ngOnInit() {
    await this.getAllCourses()
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource<any>([]); // เริ่มต้นด้วยข้อมูลว่าง
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  async createTraining() {
    try {
      // show loading
      this.swalService.showLoading();

      const startDate = this.commonService.formatDateToYYYYMMDDString(this.courseForm.value.startDate ? new Date(this.courseForm.value.startDate) : new Date())
      const endDate = this.commonService.formatDateToYYYYMMDDString(this.courseForm.value.endDate ? new Date(this.courseForm.value.endDate) : new Date())

      if (this.courseForm.valid) {
        // Merge timestart and timeend into a single time field
        const mergedTime = `${this.courseForm.value.timeStart}-${this.courseForm.value.timeEnd}`;

        // body validation
        const req: CreateTrainingRequest = {
          courseName: this.courseForm.value.courseName || '',
          startDate: startDate,
          endDate: endDate,
          time: mergedTime,
          hours: this.courseForm.value.hours || '',
          note: this.courseForm.value.note || '',
          price: parseFloat((this.courseForm.value.price || '').replace(/,/g, '')),
          priceProject: this.courseForm.value.priceProject || '',
          institute: this.courseForm.value.institute || '',
          place: this.courseForm.value.place || '',
          type: 'อบรม',
        };

        if (this.editMode) {
          // call editCourseById API
          const res = await this.apiService.editCourseById(this.editId, req).toPromise();

          if (res?.responseMessage == 'ทำรายการเรียบร้อย') {
            this.clearForm()
            this.getAllCourses()
            // location.reload()
          } else {
            throw new Error(res?.msg);
          }
        } else {
          // call createTraining API
          const res = await this.apiService.createTraining(req).toPromise();
          if (res?.responseMessage == 'ทำรายการเรียบร้อย') {
            this.clearForm()
            this.getAllCourses()
            // location.reload()
          } else {
            throw new Error(res?.msg);
          }
        }
      }
    } catch (error) {
      // show error
      console.error(error);
      this.swalService.showError('ลองใหม่อีกครั้ง');
    }

    // hide loading
    Swal.close();
  }

  allCourses: any[] = [];
  displayedColumns: string[] = ['courseName', 'startDate', 'endDate', 'time', 'note', 'price', 'institute', 'place', 'editOrDelete'];
  async getAllCourses() {
    const res = await this.apiService.getAllCoursesList().toPromise();
    console.log(res)
    if (res) {
      this.allCourses = res;
      this.allCourses = res.map(course => ({
        ...course,
        price: this.onBlurPriceStartEdit(course.price)
      }));
      this.dataSource.data = this.allCourses; // กำหนดข้อมูลให้กับ dataSource
      this.sort.sort({
        id: 'id', // ชื่อคอลัมน์ที่คุณต้องการให้เรียงลำดับ
        start: 'asc', // ทิศทางการเรียงลำดับ
        disableClear: true
      });
    } else {
      // this.allCourses = [];
      this.dataSource.data = [];
    }
  }

  invalidhoursInput: boolean = false;
  onInputKeyPresshours(event: KeyboardEvent) {
    const inputChar = event.key;

    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    if (!/^\d$/.test(inputChar)) {
      event.preventDefault();
      this.invalidhoursInput = true;
    } else {
      this.invalidhoursInput = false;
    }
  }

  invalidPriceInput: boolean = false;
  onInputKeyPressPrice(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidPriceInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidPriceInput = true;
    } else {
      this.invalidPriceInput = false;
    }
  }

  onBlurPrice(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value.trim();

    if (inputValue !== '') {
      // Convert string to number
      let numericValue = parseFloat(inputValue.replace(/,/g, ''));

      if (!isNaN(numericValue)) {
        // Check if the number has decimal places
        if (numericValue % 1 !== 0) {
          // Format number with comma as thousand separator and 2 decimal places
          inputValue = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        } else {
          // Format number with comma as thousand separator and add .00
          inputValue = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          });
        }

        inputElement.value = inputValue;

        // this.courseForm.get('price').setValue(inputValue);
        this.courseForm.patchValue({ price: inputValue });
      }
    }
  }


  editMode: boolean = false;
  editId: number = -1;
  editBtn(element: CreateTrainingResponse) {
    this.editMode = true;
    this.editId = Number(element.id);

    const [timeStartClone, timeEndClone] = element.time.split("-")

    this.courseForm.setValue({
      id: element.id + '',
      courseName: element.courseName + '',
      startDate: new Date(element.startDate),
      endDate: new Date(element.endDate),
      timeStart: timeStartClone,
      timeEnd: timeEndClone,
      hours: element.hours,
      note: element.note,
      price: element.price + '',
      priceProject: element.priceProject,
      institute: element.institute,
      place: element.place
    })
  }

  onBlurPriceStartEdit(numericValue: number): string {
    if (numericValue % 1 !== 0) {
      // Format number with comma as thousand separator and 2 decimal places
      return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      // Format number with comma as thousand separator and add .00
      return numericValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
      });
    }
  }

  changeDate(dataString: string) {
    return this.buddhistDatePipe.transform(dataString)
  }

  deleteId: number = -1;
  async deleteBtn(element: CreateTrainingResponse) {

    try {
      this.deleteId = Number(element.id);

      const confirmed = await this.swalService.showConfirm();
      if (confirmed) {
        const res = await this.apiService.deleteCourseById(this.deleteId).toPromise();
        this.getAllCourses()
      } else {
        console.log("ยกเลิก")
      }
      this.deleteId = -1 // clear

    } catch (error) {
      // show error
      console.error(error);
      this.swalService.showError('หัวข้อนี้ไม่สามารถลบได้');
    }

  }

  clearForm() {
    this.courseForm.reset();

    // this.courseForm.reset({
    //   id: '',
    //   courseName: '',
    //   startDate: null,
    //   endDate: null,
    //   timeStart: '',
    //   timeEnd: '',
    //   hours: '',
    //   note: '',
    //   price: '',
    //   priceProject: '',
    //   institute: '',
    //   place: ''
    // });

    this.editMode = false
    this.editId = -1
  }


  // test ตัวแปร
  testVariable() {
    console.log("editMode : ", this.editMode)
    console.log("editId : ", this.editId)
    console.log("deleteBtn : ", this.deleteBtn)
    console.log("deleteId : ", this.deleteId)
    console.log("courseForm : ", this.courseForm)
    console.log("allCourses : ", this.allCourses)
    console.log("invalidhoursInput : ", this.invalidhoursInput)
    console.log("invalidhoursInput : ", this.invalidhoursInput)
  }


}
