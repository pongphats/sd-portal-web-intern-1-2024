export interface LoginRequest {
   email: string;
   password: string;
}

export interface saveBudgetByYearRequest {
   year: string;
   deptCode: string;
   company_id: number;
   budgetTraining : string;
   budgetCer : string;
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