import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
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
  isNoneDisabled: boolean = false

  uidLogin!: number;

  constructor(
    private trainingService: TrainingService,
    private fb: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService
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

    this.ressonForm = this.fb.group({
      comment: [''],
      conclusion: [''],
      causeFail: [''],
      causeNone: [''],
      plan: [''],
    })
  }

  async ngOnInit() {
    await this.initSectionTwo();
    await this.settingObserver();
  }

  async initSectionTwo() {
    console.log('pure : initSectionTwo')
    try {
      const data = this.trainingService.trainingEditData;

      // TODO: Set Data Approver
      const approveData = data.training.approve1
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

      // TODO: Set Data 'evaluatorForm' & 'ressonForm'
      const evaluateData = data.training.result[0]
      this.evaluatorForm.patchValue({
        result1: evaluateData.result1,
        result2: evaluateData.result2,
        result3: evaluateData.result3,
        result4: evaluateData.result4,
        result5: evaluateData.result5,
        result6: evaluateData.result6,
        result7: evaluateData.result7,
      })

      if (evaluateData.result == 'fail') {
        this.ressonForm.patchValue({
          comment: evaluateData.comment,
          conclusion: evaluateData.result,
          causeFail: evaluateData.cause,
          causeNone: '',
          plan: evaluateData.plan,
        })
        this.isVisiblePlan = true;
        this.isRadioPassDisabled = true;
        this.isInputNoneDisable = true;

      } else if (evaluateData.result == 'noResult') {
        this.ressonForm.patchValue({
          comment: evaluateData.comment,
          conclusion: evaluateData.result,
          causeFail: '',
          causeNone: evaluateData.cause,
          plan: evaluateData.plan,
        })
        this.isRadioPassDisabled = true
        this.isRadioFailDisabled = true
        this.isInputFailDisable = true
        this.isNoneDisabled = true
      } else {
        this.ressonForm.patchValue({
          comment: evaluateData.comment,
          conclusion: evaluateData.result,
          causeFail: '',
          causeNone: '',
          plan: '',
        })
        this.isRadioFailDisabled = true;
        this.isInputFailDisable = true
        this.isInputNoneDisable = true
      }

      // TODO: check uid Login
      this.uidLogin = this.authService.getUID();
      if (this.uidLogin != approveData.id) {
        this.evaluatorForm.controls['result1'].disable();
        this.evaluatorForm.controls['result2'].disable();
        this.evaluatorForm.controls['result3'].disable();
        this.evaluatorForm.controls['result4'].disable();
        this.evaluatorForm.controls['result5'].disable();
        this.evaluatorForm.controls['result6'].disable();
        this.evaluatorForm.controls['result7'].disable();

        this.ressonForm.controls['comment'].disable();
        this.ressonForm.controls['conclusion'].disable();
        this.ressonForm.controls['causeFail'].disable();
        this.ressonForm.controls['causeNone'].disable();
        this.ressonForm.controls['plan'].disable();
      }

      // TODO: set start value in 'sectionTwoRequest' 
      this.trainingService.sectionTwoRequest = evaluateData

    } catch (error) {
      console.error(error);
    }
  }

  async settingObserver() {

    this.evaluatorForm.valueChanges.subscribe(() => {
      this.updateRadioButtonState();
    });

    this.ressonForm.get('conclusion')?.valueChanges.subscribe(value => {

      console.log("value", value)
      // *CASE1 = noResult
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
          causeFail: '',
          plan: ''
        });
        this.isVisiblePlan = false;
        this.isRadioPassDisabled = true
        this.isRadioFailDisabled = true
        this.isInputFailDisable = true
        this.isInputNoneDisable = false
        this.isNoneDisabled = true
      }
      // *CASE2 = fail
      else if (value === 'fail') {
        this.isVisiblePlan = true;
        this.isRadioPassDisabled = true;
        this.isRadioFailDisabled = false;
        this.isInputFailDisable = false;
        this.isInputNoneDisable = true;
        this.isNoneDisabled = false

      }
      // *CASE3 = pass
      else {
        this.isVisiblePlan = false;
        this.isRadioPassDisabled = false;
        this.isRadioFailDisabled = true;
        this.isInputFailDisable = true
        this.isInputNoneDisable = true
        this.isNoneDisabled = false

      }
      this.trainingService.sectionTwoRequest.result = this.ressonForm.get('conclusion')?.value;
    });

    this.ressonForm.get('comment')?.valueChanges.subscribe(value => {
      this.trainingService.sectionTwoRequest.comment = value;
    });

    this.ressonForm.get('causeFail')?.valueChanges.subscribe(value => {
      this.trainingService.sectionTwoRequest.cause = value;
    });

    this.ressonForm.get('causeNone')?.valueChanges.subscribe(value => {
      this.trainingService.sectionTwoRequest.cause = value;
    });

    this.ressonForm.get('plan')?.valueChanges.subscribe(value => {
      this.trainingService.sectionTwoRequest.plan = value;
    });
  }

  updateRadioButtonState(): void {
    const values = Object.values(this.evaluatorForm.value);
    // console.log("values", values)

    const passCount = values.filter(value => value === 'pass').length;
    const failCount = values.filter(value => value === 'fail').length;
    const noneCount = values.filter(value => value === 'none').length;

    // *CASE1 = none all
    if (noneCount == 7) {
      this.ressonForm.patchValue({
        conclusion: 'noResult',
        causeFail: '',
      })
    }
    // *CASE2 = pass >= fail
    else if (passCount >= failCount && (passCount != 0 || failCount != 0)) {
      this.ressonForm.patchValue({
        conclusion: 'pass',
        causeFail: '',
        causeNone: ''
      })
    }
    // *CASE3 = fail > pass
    else if (!(passCount >= failCount)) {
      this.ressonForm.patchValue({
        conclusion: 'fail',
        causeNone: ''
      })
    }

    // TODO: set update value in 'sectionTwoRequest' 
    this.trainingService.sectionTwoRequest.result1 = this.evaluatorForm.get('result1')?.value;
    this.trainingService.sectionTwoRequest.result2 = this.evaluatorForm.get('result2')?.value;
    this.trainingService.sectionTwoRequest.result3 = this.evaluatorForm.get('result3')?.value;
    this.trainingService.sectionTwoRequest.result4 = this.evaluatorForm.get('result4')?.value;
    this.trainingService.sectionTwoRequest.result5 = this.evaluatorForm.get('result5')?.value;
    this.trainingService.sectionTwoRequest.result6 = this.evaluatorForm.get('result6')?.value;
    this.trainingService.sectionTwoRequest.result7 = this.evaluatorForm.get('result7')?.value;
  }
}
