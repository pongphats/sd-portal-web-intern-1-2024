import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-section-two-form',
  templateUrl: './section-two-form.component.html',
  styleUrls: ['./section-two-form.component.scss']
})
export class SectionTwoFormComponent implements OnInit {

  approverForm!: FormGroup;
  evaluatorForm!: FormGroup;
  ressonForm!: FormGroup;

  constructor(
    private trainingService: TrainingService,
    private fb: FormBuilder,
  ) {
    this.approverForm = this.fb.group({
      evaluatorName: [''],
      evaluatorPosition: [''],
      evaluatorDept: [''],
      evaluatorSector: [''],
    })

    this.evaluatorForm = this.fb.group({
      result1 : [''],
      result2 : [''],
      result3 : [''],
      result4 : [''],
      result5 : [''],
      result6 : [''],
      result7 : [''],
    })

    this.ressonForm = this.fb.group({
      comment: ['555'],
      conclusion: ['pass'],
      cause1: ['oh'],
      cause2: ['mg'],
    })
  }

  async ngOnInit() {
    await this.initSectionTwo();
  }

  async initSectionTwo() {
    console.log('pure : initSectionTwo')
    try {
      const data = this.trainingService.trainingEditData;

      const approveData = data.training.approve1
      // console.log("approver : ", approveData)
      this.approverForm.controls['evaluatorName'].setValue(
        approveData.firstname + ' ' + approveData.lastname
      );
      this.approverForm.controls['evaluatorPosition'].setValue(
        approveData.position.positionName
      );
      this.approverForm.controls['evaluatorSector'].setValue(
        approveData.sector.sectorName
      );
      this.approverForm.controls['evaluatorDept'].setValue(
        approveData.department.deptName
      );


    } catch (error) {
      console.error(error);
    } 
  }
}
