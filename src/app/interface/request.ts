export interface LoginRequest {
  email: string;
  password: string;
}

export interface saveBudgetByYearRequest {
  year: string;
  deptCode: string;
  company_Id: number;
  budgetTraining: number;
  budgetCer: number;
}

export interface CreateSectorRequest {
  companyId: number;
  sectorName: string;
  sectorFullName: string;
  sectorTname: string;
  sectorCode: string;
  deptFullName: string;
  deptTname: string;
  deptCode: string;
  deptName: string;
  firstName: string;
  lastName: string;
}

export interface CreateTrainingRequest {
  // Date string format: YYYY-MM-DD (2024-12-01) , (2024-01-30)
  // Time string format: HH:MM (22:30) (08:00)
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
  type: '';
}
