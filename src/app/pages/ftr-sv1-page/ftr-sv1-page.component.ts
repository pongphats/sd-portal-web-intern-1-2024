import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { budgetForm } from 'src/app/interface/form';
import { saveBudgetByYearRequest } from 'src/app/interface/request';
import { Budget } from 'src/app/interface/response';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { SwalService } from 'src/app/services/swal.service';

@Component({
  selector: 'app-ftr-sv1-page',
  templateUrl: './ftr-sv1-page.component.html',
  styleUrls: ['./ftr-sv1-page.component.scss'],
})
export class FtrSv1PageComponent implements OnInit, AfterViewInit {
  budgetForm!: FormGroup<budgetForm>;
  depts: string[] = [];
  invalidtotal_expInput: boolean = false;
  invalidYearInput: boolean = false;
  invalidNoInput: boolean = false;
  invalidFeeInput: boolean = false;
  invalidAccommodationExpInput: boolean = false;
  totalBudget: number = 0;
  remainingBudget: number = 0;

  totalAmount: number = 0;
  remainingAmount: number = 0;
  filteredData: Budget[] = [];
  displayedColumns: string[] = [
    'year',
    'position',
    'name',
    'weight',
    'symbol',
    'test',
    'test1',
  ];

  dataSource = new MatTableDataSource<Budget>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

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

    this.budgetForm.get('company')?.valueChanges.subscribe(async (company) => {
      if (company) {
        const depts = await this.genDeptsByCompanyName();
        this.depts = depts || []; // อัปเดต depts เมื่อ company เปลี่ยนแปลง
        this.budgetForm.get('dept')?.setValue(''); // รีเซ็ตค่า dept
      } else {
        this.depts = [];
      }
    });

    this.budgetForm.get('budgetTrain')?.valueChanges.subscribe(() => {
      this.onTotalBudget();
    });

    this.budgetForm.get('budgetCer')?.valueChanges.subscribe(() => {
      this.onTotalBudget();
    });

    this.apiService.getAllBudget().subscribe(
      (data) => {
        this.dataSource.data = data.sort((a: any, b: any) => a.id - b.id);
      },
      (error) => {
        console.error('Error fetching budget data:', error);
      }
    );
  }

  protected checkCompanySelected() {
    if (!this.budgetForm.get('company')?.value) {
      this.showErrorCompany('');
    }
  }
  protected showErrorCompany(message: string) {
    this.swalService.showErrorCompany(message);
  }

  protected genDeptsByCompanyName() {
    const res = this.budgetForm.controls.company.value || '';
    return this.commonService.getOnlyDeptCodeByCompany(res).toPromise();
  }

  async onSave() {
    const company_id = await this.commonService
      .getCompanyIdByName(this.budgetForm.value.company!)
      .toPromise();
    const req: saveBudgetByYearRequest = {
      year: Number(this.budgetForm.value.budgetYear) - 543 + '' || '',
      deptCode: this.budgetForm.value.dept || '',
      company_Id: Number(company_id),
      budgetTraining:
        Number(this.budgetForm.value.budgetTrain?.replace(/,/g, '')) || 0,
      budgetCer:
        Number(this.budgetForm.value.budgetCer?.replace(/,/g, '')) || 0,
    };

    const res = await this.apiService.saveBudgetByYear(req).toPromise();

    this.clear();
  }

  protected onInputKeyPressFee(event: KeyboardEvent) {
    const inputChar = event.key;
    const inputValue = (event.target as HTMLInputElement).value;

    if (inputValue.includes('.') && inputChar === '.') {
      event.preventDefault();
      this.invalidFeeInput = true;
    } else if (!/^\d$/.test(inputChar) && inputChar !== '.') {
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

  protected calculateAmounts(): void {
    const budgetTrain = parseFloat(
      this.budgetForm.get('budgetTrain')?.value?.replace(/,/g, '') ?? '0'
    );
    const budgetCer = parseFloat(
      this.budgetForm.get('budgetCer')?.value?.replace(/,/g, '') ?? '0'
    );

    this.totalAmount = budgetTrain + budgetCer;
    this.remainingAmount = this.totalAmount - 1000;
  }

  protected onBudgetChange(): void {
    this.calculateAmounts();
  }

  protected clearForm() {
    this.budgetForm.reset();
  }

  protected clear() {
    location.reload();
  }

  protected number(year: string) {
    return Number(year) + 543;
  }

  protected async onEdit(element: Budget) {
    console.log('Element to edit:', element);
    this.budgetForm.patchValue({
      company: element.company.toString(),
      budgetYear: this.number(element.year).toString(),
      budgetTrain: element.budgetTraining.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      budgetCer: element.budgetCer.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    });
    const depts = await this.genDeptsByCompanyName();
    this.depts = depts;
    if (this.depts.includes(element.departmentCode)) {
      this.budgetForm.patchValue({ dept: element.departmentCode });
    } else {
      console.error('Department code not found in the fetched departments.');
    }
    console.log('Form after patching:', this.budgetForm.value);
    this.onTotalBudget();
  }
}
