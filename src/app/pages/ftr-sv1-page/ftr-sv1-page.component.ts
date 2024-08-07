import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { budgetForm } from 'src/app/interface/form';
import { saveBudgetByYearRequest } from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-ftr-sv1-page',
  templateUrl: './ftr-sv1-page.component.html',
  styleUrls: ['./ftr-sv1-page.component.scss'],
})
export class FtrSv1PageComponent implements OnInit {
  budgetForm!: FormGroup<budgetForm>;
  depts: string[] = [];

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    this.budgetForm = this.fb.group({
      company: ['', Validators.required],
      budgetYear: ['', Validators.required],
      dept: ['', Validators.required],
      budgetTrain: ['', Validators.required],
      budgetCer: ['', Validators.required],
      budgetTotal: [{ value: '', disabled: true }],
    });
    this.budgetForm.get('budgetTrain')?.valueChanges.subscribe(() => {
      this.updateTotal();
    });

    this.budgetForm.get('budgetCer')?.valueChanges.subscribe(() => {
      this.updateTotal();
    });
  }

  // API  ของ depts
  protected genDeptsByCompanyName() {
    const res = this.budgetForm.controls.company.value || '';
    this.commonService.getOnlyDeptCodeByCompany(res).subscribe((depts) => {
      this.depts = depts;
    });
  }

  // ผลรวมของ  budgetTrain +  budgetCer =  budgetTotal
  protected updateTotal() {
    const trainValue = Number(this.budgetForm.get('budgetTrain')?.value || 0);
    const cerValue = Number(this.budgetForm.get('budgetCer')?.value || 0);
    const total = trainValue + cerValue;
    this.budgetForm.get('budgetTotal')?.setValue(total.toString());
  }

  async onSave() {
    const company_id = this.commonService.getCompanyIdByName(
      this.budgetForm.value.company || ''
    );
    console.log(company_id);
    const req: saveBudgetByYearRequest = {
      year: this.budgetForm.value.budgetYear || '',
      deptCode: this.budgetForm.value.dept || '',
      company_id: Number(company_id),
      budgetTraining: this.budgetForm.value.budgetTrain || '',
      budgetCer: this.budgetForm.value.budgetCer || '',
    };

    const res = await this.apiService.saveBudgetByYear(req).toPromise();
    console.log(res);
  }
}
