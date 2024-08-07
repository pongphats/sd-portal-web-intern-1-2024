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
      price: [0, Validators.required],
      priceProject: [''],
      institute: ['', Validators.required],
      place: ['', Validators.required],
      // type: [''],
    })
  }

  ngOnInit(): void {
  }


  async createTraining() {

    console.log("createTraining")
    console.log(this.courseForm)
    try {
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
          price: this.courseForm.value.price ? this.courseForm.value.price : 0,
          priceProject: this.courseForm.value.priceProject || '',
          institute: this.courseForm.value.institute || '',
          place: this.courseForm.value.place || '',
          type: 'อบรม',
        };

        // call login API
        const res = await this.apiService.createTraining(req).toPromise();
        console.log(res)

        if (res?.msg == 'ทำรายการเรียบร้อย') {
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




}
