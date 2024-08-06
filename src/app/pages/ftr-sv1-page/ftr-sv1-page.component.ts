import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { budgetForm } from 'src/app/interface/form';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';

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
    private swalService: SwalService
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
  }
  protected genDeptsByCompanyName() {
    const res = this.budgetForm.controls.company.value || '';
    this.commonService.getOnlyDeptCodeByCompany(res).subscribe((depts) => {
      this.depts = depts;
    });
  }
}
