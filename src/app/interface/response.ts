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

