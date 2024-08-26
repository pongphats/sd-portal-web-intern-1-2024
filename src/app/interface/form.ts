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
  deptId: FormControl<string | null>; //id 4หลัก  //dept code from back
  deptCode: FormControl<string | null>; //dept name จากหลังบ้าน มาใส่ ใน deptCode
  deptManage: FormControl<string | null>;
}

export interface budgetForm {
  company: FormControl<string | null>;
  budgetYear: FormControl<string | null>;
  dept: FormControl<string | null>;
  budgetTrain: FormControl<string | null>;
  budgetCer: FormControl<string | null>;
  budgetTotal: FormControl<string | null>;
}

export interface CourseForm {
  id: FormControl<string | null>;
  courseName: FormControl<string | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  timeStart: FormControl<string | null>;
  timeEnd: FormControl<string | null>;
  hours: FormControl<string | null>;
  note: FormControl<string | null>;
  price: FormControl<string | null>;
  priceProject: FormControl<string | null>;
  institute: FormControl<string | null>;
  place: FormControl<string | null>;
  // type: FormControl<string | null>;
}

export interface trainingForm {
  company: FormControl<string | null>;
  deptCode: FormControl<string | null>;
  deptId: FormControl<string | null>;
  addMissionDate: FormControl<Date | null>;
  formsType: FormControl<string | null>;
  courseName: FormControl<string | null>;
  courseObjective: FormControl<string | null>;
  courseDuration: FormControl<string | null>;
  courseDescription: FormControl<string | null>;
  courseProject: FormControl<string | null>;
  coursePrice: FormControl<string | null>;
  courseTeacher: FormControl<string | null>;
  courseLocation: FormControl<string | null>;
  budgetType: FormControl<string | null>;
  budgetDescription: FormControl<string | null>;
  employeeId: FormControl<string | null>;
  employeeName: FormControl<string | null>;
  employeePosition: FormControl<string | null>;
  approverName: FormControl<string | null>;
  managerName: FormControl<string | null>;
  vicePresName: FormControl<string | null>;
  vicePresName2: FormControl<string | null>;
  presidentName: FormControl<string | null>;
}

export interface WelfareForm {
  fullName: FormControl<string | null>;
}

export interface userForms {
  companyName: FormControl<string | null>;
  sectorName: FormControl<string | null>;
  sectorCode: FormControl<string | null>;
  deptName: FormControl<string | null>;
  deptCode: FormControl<string | null>;
  empCode: FormControl<string | null>;
  empPrefix: FormControl<string | null>;
  empFirstName: FormControl<string | null>;
  empLastName: FormControl<string | null>;
  empEmail: FormControl<string | null>;
  empPosition: FormControl<string | null>;
  empLevel: FormControl<string | null>;
  empPrivileges: FormControl<string | null>;
  empType: FormControl<string | null>;
  empStartDate: FormControl<Date | null>;
  empPassDate: FormControl<Date | null>;
}
// export interface expenseForm {
//   treatmentType: FormControl<string | null>;
//   startDate: FormControl<string | null>;
//   endDate: FormControl<string | null>;
//   daysCount: FormControl<string | null>;
//   medicalCost: FormControl<string | null>;
//   roomAndBoardCost: FormControl<string | null>;
//   datails: FormControl<string | null>;
//   notes: FormControl<string | null>;
// }

export interface ExpenseForm {
  treatmentType: FormControl<string | null>;
  startDate: FormControl<string | null>;
  endDate: FormControl<string | null>;
  daysCount: FormControl<string | null>;
  medicalCost: FormControl<string | null>;
  roomAndBoardCost: FormControl<string | null>;
  details: FormControl<string | null>;
  notes: FormControl<string | null>;
}

export interface SearchEmpTableForms {
  searchType: FormControl<string | null>;
  searchValue: FormControl<string | null>;
}
