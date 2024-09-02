import { company } from './common';

export interface ApiResponse<T> {
  responseMessage: string;
  responseData: {
    result: T;
  };
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  msg: string;
}

export interface saveBudgetResponse {
  id: number;
  year: string;
  budgetTraining: number;
  budgetCer: number;
  total_exp: number;
  company: company;
  departmentCode: string;
}

export interface MngDeptListRes {
  companyName: string;
  companyId: number;
  sectorCode: string;
  sectorId: number;
  sectorName: string;
  deptCode: string;
  deptId: number;
  deptName: string;
  deptTname: string;
  deptFullName: string;
}

export interface CreateTrainingResponse {
  // Date string format: YYYY-MM-DD (2024-12-01) , (2024-01-30)
  // Time string format: HH:MM (22:30) (08:00)
  id: string;
  courseName: string;
  startDate: string;
  endDate: string;
  hours: string;
  time: string;
  note: string;
  price: number;
  priceProject: string;
  place: string;
  institute: string;
  type: string;
}

export interface Budget {
  year: string;
  budgetTraining: number;
  departmentCode: string;
  budgetCer: number;
  company: string;
  id: number;
  totalExp: number;
  budgetCerRemain: number;
  budgetTrainingRemain: number;
  totalExpRemain: number;
}

// Budget-welfare
export interface BudgetWellFare {
  id: number;
  level: string;
  opd: number;
  ipd: number;
  room: number;
  no: number;
}

// welfare-forms
export interface ExpenseRemainResponse {
  opd: number;
  ipd: number;
  room: number;
}

export interface Position {
  id: string;
  name: string;
}

export interface Department {
  deptid: number;
  deptname: string;
  deptcode: string;
  positions: Position[];
}

export interface Sector {
  sectorid: number;
  sectorname: string;
  sectorcode: string;
  departments: Department[];
}

export interface Company {
  company: string;
  sectors: Sector[];
}
export interface ExpenseRemainByYearResponse {
  id: number;
  userId: number;
  dateOfAdmission: string;
  startDate: string;
  endDate: string;
  days: number;
  opd: number;
  ipd: number;
  roomService: number;
  canWithdraw: number;
  description: string;
  remark: string;
}

