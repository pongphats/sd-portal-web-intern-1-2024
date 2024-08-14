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
  sectorName: number;
  deptCode: string;
  deptId: number;
  deptName: string;
  deptTname: string;
  deptFullName: string;
}

export interface CreateTrainingResponse {
  // Date string format: YYYY-MM-DD (2024-12-01) , (2024-01-30)
  // Time string format: HH:MM (22:30) (08:00)
  id: string
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


