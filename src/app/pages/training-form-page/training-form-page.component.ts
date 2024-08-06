import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trainingForm } from 'src/app/interface/form';

@Component({
  selector: 'app-training-form-page',
  templateUrl: './training-form-page.component.html',
  styleUrls: ['./training-form-page.component.scss']
})
export class TrainingFormPageComponent implements OnInit {

  trainingForm!: FormGroup<trainingForm>
  constructor(private  fb:FormBuilder) {
    this.trainingForm = this.fb.group({
      company: ['' , Validators.required],
      deptCode: ['', Validators.required],
      deptId: [''],
      addMissionDate: ['', Validators.required],
      formsType: ['', Validators.required],
      courseName: ['', Validators.required],
      courseObjective: [''],
      courseDuration: [''],
      courseDescription: [''],
      courseProject: [''],
      coursePrice: [''],
      courseTeacher: [''],
      courseLocation: [''],
      budgetType: ['', Validators.required],
      budgetDescription: [''],
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required],
      employeePosition: ['', Validators.required],
      approverName: [''],
      managerName: [''],
      vicePresName: [''],
      vicePresName2: [''],
      presidentName: [''],
    });
   }

  ngOnInit(): void {
  }

}
