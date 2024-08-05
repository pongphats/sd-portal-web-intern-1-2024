import { FormControl } from '@angular/forms';

export interface AuthForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

export interface SectorManageForm {
  company: FormControl<string | null>;
  sectorTname: FormControl<string | null>;
  sectorEname: FormControl<string | null>;
  sectorCode: FormControl<string | null>;
  deptTname: FormControl<string | null>;
  deptEname: FormControl<string | null>;
  deptName: FormControl<string | null>;
  deptCode: FormControl<string | null>;
  deptManage: FormControl<string | null>;
}

export interface budgetForm {
  company: FormControl<string | null>;
  budgetYear: FormControl<string | null>;
  deptYear: FormControl<string | null>;
  dept: FormControl<string | null>;
  budgetTrain: FormControl<string | null>;
  budgetCer: FormControl<string | null>;
  budgetTotal: FormControl<string | null>;
}

export interface CourseForm {
  id: FormControl<string | null>;
  courseName: FormControl<string | null>;
  startDate: FormControl<string | null>;
  endDate: FormControl<string | null>;
  timeStart: FormControl<string | null>;
  timeEnd: FormControl<string | null>;
  hours: FormControl<string | null>;
  note: FormControl<string | null>;
  price: FormControl<number | null>;
  priceProject: FormControl<string | null>;
  institute: FormControl<string | null>;
  place: FormControl<string | null>;
  // type: FormControl<string | null>;

}
