import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseForm } from 'src/app/interface/form';
import { SwalService } from 'src/app/services/swal.service';

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
    private router: Router
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


  addSv1Btn() {

    console.log("addSv1Btn")
    // this.courseForm.patchValue({
    //   startDate: this.formatDateToYYYYMMDD(this.CourseForm.value.startDate),
    //   endDate: this.formatDateToYYYYMMDD(this.CourseForm.value.endDate),
    // });

    //   if (this.CourseForm.valid) {
    //     // Get the values of timestart and timeend
    //     const timestartValue = this.toTimeString(this.CourseForm.get('timestart').value);
    //     const timeendValue = this.toTimeString(this.CourseForm.get('timeend').value);

    //     console.log(timestartValue, typeof timestartValue);

    //     // Merge timestart and timeend into a single time field
    //     const mergedTime = `${timestartValue}-${timeendValue}`;

    //     // Update the CourseForm with the merged time
    //     this.CourseForm.patchValue({ time: mergedTime });

    //     // Send the form data as JSON to the backend
    //     const formData = {
    //       courseName: this.CourseForm.get('courseName').value,
    //       startDate: this.CourseForm.get('startDate').value,
    //       endDate: this.CourseForm.get('endDate').value,
    //       time: mergedTime,
    //       hours: this.CourseForm.get('hours').value,
    //       note: this.CourseForm.get('note').value,
    //       price: parseFloat(this.CourseForm.get('price').value.replace(/,/g, '')),
    //       priceProject: this.CourseForm.get('priceProject').value,
    //       institute: this.CourseForm.get('institute').value,
    //       place: this.CourseForm.get('place').value,
    //       type: 'อบรม',
    //     };

    //     this._service.addCourse(formData).subscribe({
    //       next: (response) => {
    //         this.CourseForm.reset();
    //         Swal.fire({
    //           title: 'สำเร็จ',
    //           text: 'บันทึกข้อมูลเสร็จสิ้น',
    //           icon: 'success',
    //           allowEscapeKey: false,
    //           allowOutsideClick: false,
    //           confirmButtonText: 'ตกลง',
    //         }).then((result) => {
    //           if (result.isConfirmed) {
    //             this.getFindAll();
    //           }
    //         });
    //       },
    //       error: (error) => {
    //         console.error('Error:', error);
    //       },
    //     });
    //   }
    //   // location.reload();
  }



}
