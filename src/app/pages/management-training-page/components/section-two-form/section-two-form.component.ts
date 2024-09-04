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

  isRadioFailDisabled: boolean = false;
  isRadioPassDisabled: boolean = false;
  isVisiblePlan: boolean = false;
  isInputFailDisable: boolean = false;
  isInputNoneDisable: boolean = false;

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
      result1: [''],
      result2: [''],
      result3: [''],
      result4: [''],
      result5: [''],
      result6: [''],
      result7: [''],
    })

    this.evaluatorForm.valueChanges.subscribe(() => {
      this.updateRadioButtonState();
    });

    this.ressonForm = this.fb.group({
      comment: [''],
      conclusion: [''],
      cause1: [''],
      cause2: [''],
      plan: [''],
    })

    this.ressonForm.get('conclusion')?.valueChanges.subscribe(value => {
      console.log("value", value)
      if (value === 'noResult') {
        this.evaluatorForm.reset({
          result1: '',
          result2: '',
          result3: '',
          result4: '',
          result5: '',
          result6: '',
          result7: ''
        });
        this.ressonForm.patchValue({
          cause1: '',
        });
        this.isInputFailDisable = true
        this.isInputNoneDisable = false
        this.isRadioFailDisabled = true
        this.isRadioPassDisabled = true

      } else if (value === 'fail') {
        this.isRadioFailDisabled = false;
        this.isInputFailDisable = false
        this.isVisiblePlan = true;
        this.isRadioPassDisabled = true;
        this.isInputNoneDisable = true

      } else {
        this.isRadioPassDisabled = false;
        this.isRadioFailDisabled = true;
        this.isInputFailDisable = true
        this.isInputNoneDisable = true
      }
    });
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

  updateRadioButtonState(): void {
    const values = Object.values(this.evaluatorForm.value);
    console.log("values", values)
    const passCount = values.filter(value => value === 'pass').length;
    const failCount = values.filter(value => value === 'fail').length;
    const noneCount = values.filter(value => value === 'none').length;

    if (noneCount == 7) {
      this.ressonForm.patchValue({
        conclusion: 'noResult',
        cause1: '',
      })
    }
    else if (passCount >= failCount && (passCount != 0 || failCount != 0)) {
      this.ressonForm.patchValue({
        conclusion: 'pass',
        cause1: '',
        cause2: ''
      })
      this.isVisiblePlan = false;
    } else if (!(passCount >= failCount)) {
      this.ressonForm.patchValue({
        conclusion: 'fail',
        cause2: ''
      })
    }
  }
}
