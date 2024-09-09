import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Generic9EvalForms } from 'src/app/interface/form';
import { EvalG9Req } from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { SwalService } from 'src/app/services/swal.service';
import { TrainingService } from 'src/app/services/training.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generic9-form',
  templateUrl: './generic9-form.component.html',
  styleUrls: ['./generic9-form.component.scss'],
})
export class Generic9FormComponent implements OnInit {
  g9EvalForms!: FormGroup<Generic9EvalForms>;
  formsId: number = 0;
  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    private apiService: ApiService,
    private swalService: SwalService,
    public dialogRef: MatDialogRef<Generic9FormComponent>
  ) {
    this.g9EvalForms = this.fb.group({
      resultGOne: ['', Validators.required],
      resultGTwo: ['', Validators.required],
      resultGThree: ['', Validators.required],
      resultGFour: ['', Validators.required],
      resultGFive: ['', Validators.required],
    }) as FormGroup<Generic9EvalForms>;
  }

  ngOnInit(): void {
    this.initailValue();
  }

  initailValue() {
    const generic9 =
      this.trainingService.trainingEditData.training.resultGeneric9[0];
    this.formsId = generic9.id;
    this.g9EvalForms.patchValue({
      resultGOne: generic9.result1,
      resultGTwo: generic9.result2,
      resultGThree: generic9.result3,
      resultGFour: generic9.result4,
      resultGFive: generic9.result5,
    });
  }

  async evalForms() {
    this.swalService.showLoading();
    try {
      const req: EvalG9Req = {
        result1: this.g9EvalForms.controls.resultGOne.value || '',
        result2: this.g9EvalForms.controls.resultGTwo.value || '',
        result3: this.g9EvalForms.controls.resultGThree.value || '',
        result4: this.g9EvalForms.controls.resultGFour.value || '',
        result5: this.g9EvalForms.controls.resultGFive.value || '',
      };
      const res = await this.apiService
        .editGeneric9(this.formsId, req)
        .toPromise();
      this.swalService.showSuccess("บันทึกแบบประเมินสำเร็จ");
    } catch (error) {
      console.error(error);
      this.swalService.showError('เกิดขอผิดพลาดในการประเมินผล');
    }
  }
}
