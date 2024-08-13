import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { budgetForm } from 'src/app/interface/form';
import { saveBudgetByYearRequest } from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';

export interface PeriodicElement {
  budgetYear: string;
  company: string;
  dept: string;
  budgetTrain: string;
  budgetCer: string;
  budgetTotal: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    budgetYear: '2567',
    company: 'PCCTH',
    dept: '4100',
    budgetTrain: '12000',
    budgetCer: '12000',
    budgetTotal: '24000',
  },
  {
    budgetYear: '2566',
    company: 'PCCTH',
    dept: '4101',
    budgetTrain: '12000',
    budgetCer: '12000',
    budgetTotal: '24000',
  },
  {
    budgetYear: '2565',
    company: 'PCCTH',
    dept: '4102',
    budgetTrain: '12000',
    budgetCer: '12000',
    budgetTotal: '24000',
  },
];

@Component({
  selector: 'app-ftr-sv1-page',
  templateUrl: './ftr-sv1-page.component.html',
  styleUrls: ['./ftr-sv1-page.component.scss'],
})
export class FtrSv1PageComponent implements OnInit {
  displayedColumns: string[] = [
    'company',
    'dept',
    'budgetTrain',
    'budgetCer',
    'budgetTotal',
  ];
  dataSource = ELEMENT_DATA;
  budgetForm!: FormGroup<budgetForm>;
  depts: string[] = [];
  invalidtotal_expInput: boolean = false;
  invalidYearInput: boolean = false;
  invalidNoInput: boolean = false;
  invalidFeeInput: boolean = false;
  invalidAccommodationExpInput: boolean = false;
  totalBudget: number = 0;
  remainingBudget: number = 0; // เพิ่มตัวแปรนี้เพื่อเก็บยอดเงินคงเหลือ

  totalAmount: number = 0;
  remainingAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private apiService: ApiService,
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

    this.budgetForm.get('budgetTrain')?.valueChanges.subscribe(() => {
      this.onTotalBudget();
    });

    this.budgetForm.get('budgetCer')?.valueChanges.subscribe(() => {
      this.onTotalBudget();
    });
  }

  // แจ้งเตือนว่าต้องเลือกบริษัทก่อน
  protected checkCompanySelected() {
    if (!this.budgetForm.get('company')?.value) {
      this.showErrorCompany('');
    }
  }
  protected showErrorCompany(message: string) {
    this.swalService.showErrorCompany(message);
  }

  // API  ของ depts
  protected genDeptsByCompanyName() {
    const res = this.budgetForm.controls.company.value || '';
    this.commonService.getOnlyDeptCodeByCompany(res).subscribe((depts) => {
      this.depts = depts;
    });
  }

  // API Save
  async onSave() {
    const company_id = await this.commonService
      .getCompanyIdByName(this.budgetForm.value.company!)
      .toPromise();
    const req: saveBudgetByYearRequest = {
      year: this.budgetForm.value.budgetYear || '',
      deptCode: this.budgetForm.value.dept || '',
      company_Id: Number(company_id),
      budgetTraining:
        Number(this.budgetForm.value.budgetTrain?.replace(/,/g, '')) || 0,
      budgetCer:
        Number(this.budgetForm.value.budgetCer?.replace(/,/g, '')) || 0,
    };

    const res = await this.apiService.saveBudgetByYear(req).toPromise();
    this.clearForm();
  }

  protected onInputKeyPressFee(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    // ตรวจสอบว่าถ้ามีจุดอยู่แล้ว และผู้ใช้กดจุดอีกครั้ง
    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidFeeInput = true;
    }
    // ตรวจสอบว่าถ้าไม่ใช่ตัวเลขหรือจุด
    else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidFeeInput = true;
    } else {
      this.invalidFeeInput = false;
    }
  }

  protected onInputKeyPressAccommodation(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidAccommodationExpInput = true;
    } else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
      event.preventDefault();
      this.invalidAccommodationExpInput = true;
    } else {
      this.invalidAccommodationExpInput = false;
    }
  }

  protected onBlurFee(event: Event, inputnNumber: number) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value.trim();

    if (inputValue !== '') {
      let numericValue = parseFloat(inputValue.replace(/,/g, ''));

      if (!isNaN(numericValue)) {
        if (numericValue % 1 !== 0) {
          inputValue = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        } else {
          inputValue = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          });
        }

        inputElement.value = inputValue;

        if (inputnNumber == 0) {
          this.budgetForm.get('budgetTrain')?.setValue(inputValue);
        } else if (inputnNumber == 1) {
          this.budgetForm.get('budgetCer')?.setValue(inputValue);
        }
      }
    }
  }

  //ผลรวม
  protected onBlurTotal() {
    let inputValue = this.totalBudget.toString();
    if (inputValue !== '') {
      let numericValue = parseFloat(inputValue.replace(/,/g, ''));

      if (!isNaN(numericValue)) {
        if (numericValue % 1 !== 0) {
          inputValue = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        } else {
          inputValue = numericValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
          });
        }
        this.budgetForm.get('budgetTotal')?.setValue(inputValue);
      }
    }
  }

  //ผลรวม budgetTrain + budgetCer
  protected onTotalBudget() {
    if (
      this.budgetForm.get('budgetTrain')?.value != '' &&
      this.budgetForm.get('budgetCer')?.value != ''
    ) {
      this.totalBudget =
        parseFloat(
          (this.budgetForm.get('budgetTrain')?.value || '').replace(/,/g, '')
        ) +
        parseFloat(
          (this.budgetForm.get('budgetCer')?.value || '').replace(/,/g, '')
        );
      this.invalidtotal_expInput = false;
      this.onBlurTotal();
    } else {
      this.budgetForm.get('budgetTotal')?.setValue(null);
      this.invalidtotal_expInput = true;
    }
  }

  protected editDocs() {}

  protected isEditButtonVisible(): boolean {
    return (
      !!this.budgetForm.get('company')?.valid &&
      !!this.budgetForm.get('budgetYear')?.valid &&
      !!this.budgetForm.get('dept')?.valid
    );
  }

  protected calculateAmounts(): void {
    const budgetTrain = parseFloat(
      this.budgetForm.get('budgetTrain')?.value?.replace(/,/g, '') ?? '0'
    );
    const budgetCer = parseFloat(
      this.budgetForm.get('budgetCer')?.value?.replace(/,/g, '') ?? '0'
    );

    this.totalAmount = budgetTrain + budgetCer;
    this.remainingAmount = this.totalAmount - 1000; // เปลี่ยนตัวเลขนี้เป็นจำนวนเงินที่ต้องการหัก
  }

  protected isAmountVisible(): boolean {
    return (
      !!this.budgetForm.get('company')?.valid &&
      !!this.budgetForm.get('budgetYear')?.valid &&
      !!this.budgetForm.get('dept')?.valid
    );
  }

  protected onBudgetChange(): void {
    this.calculateAmounts();
  }

  //เคลียร์ฟอร์ม
  protected clearForm() {
    location.reload();
  }
}
