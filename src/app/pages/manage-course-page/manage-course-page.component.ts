import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseForm } from 'src/app/interface/form';
import { CreateTrainingRequest } from 'src/app/interface/request';
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
  ) {
    this.courseForm = this.fb.group({
      id: [''],
      courseName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      timeStart: ['', Validators.required],
      timeEnd: ['', Validators.required],
      hours: ['', Validators.required],
      note: [''],
      price: ['', Validators.required],
      priceProject: [''],
      institute: ['', Validators.required],
      place: ['', Validators.required],
      // type: [''],
    })
  }

  ngOnInit(): void {
    this.getAllCourses()
  }


  async createTraining() {
    try {

      console.log(this.courseForm.value.price)
      console.log(parseFloat((this.courseForm.value.price || '').replace(/,/g, '')))
      // show loading
      this.swalService.showLoading();

      this.courseForm.patchValue({
        startDate: this.commonService.formatDateToYYYYMMDDString(this.courseForm.value.startDate ? new Date(this.courseForm.value.startDate) : new Date()),
        endDate: this.commonService.formatDateToYYYYMMDDString(this.courseForm.value.endDate ? new Date(this.courseForm.value.endDate) : new Date()),
      });

      if (this.courseForm.valid) {
        // Merge timestart and timeend into a single time field
        const mergedTime = `${this.courseForm.value.timeStart}-${this.courseForm.value.timeEnd}`;

        // body validation
        const req: CreateTrainingRequest = {
          courseName: this.courseForm.value.courseName || '',
          startDate: this.courseForm.value.startDate || '',
          endDate: this.courseForm.value.endDate || '',
          time: mergedTime,
          hours: this.courseForm.value.hours || '',
          note: this.courseForm.value.note || '',
          price: parseFloat((this.courseForm.value.price || '').replace(/,/g, '')),
          priceProject: this.courseForm.value.priceProject || '',
          institute: this.courseForm.value.institute || '',
          place: this.courseForm.value.place || '',
          type: 'อบรม',
        };

        // call login API
        const res = await this.apiService.createTraining(req).toPromise();
        console.log(res)

        if (res?.responseMessage == 'ทำรายการเรียบร้อย') {
          this.courseForm.reset();
        } else {
          throw new Error(res?.msg);
        }


      }
    } catch (error) {
      // show error
      console.error(error);
      this.swalService.showError('ลองใหม่อีกครั้ง');
    }

    // hide loading
    Swal.close();
    // location.reload();
  }

  allCourses: any[] = [];
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns: string[] = ['courseName', 'startDate', 'endDate', 'time', 'note', 'price', 'institute', 'place', 'editOrDelete'];
  async getAllCourses() {
    const res = await this.apiService.getAllCoursesList().toPromise();
    console.log(res)
    if (res) {
      this.allCourses = res;
    } else {
      this.allCourses = [];
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



}
