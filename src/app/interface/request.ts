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
  sectorName: string; //sectorcode-รหัสฝ่าย sectorName-
  sectorFullName: string; //Ename
  sectorTname: string;
  sectorCode: string; //
  deptFullName: string; //แผนกอังกฤษ
  deptTname: string;
  deptCode: string; //ไอดี form
  deptName: string; //deptcode form
  firstName: string; //gen
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
  type: string;
}

export interface CreateTrainingRequestForm {
  userId: number;
  dateSave: string;
  action: string;
  actionDate: string;
  createBy: number;
  budgetType: string;
  projectCourse: string;
  etcDetails: string;
  day: number;
  courseId: number;
  budget: number;
  approverId: number;
  managerId: number;
  vicepresident1Id: number;
  vicepresident2Id: number;
  presidentId: number;
  fileID: number[];
}

export interface createAndUpdateBudgetRequest {
  year: string;
  deptCode: string;
  company_Id: number;
  budgetTraining: number;
  budgetCer: number;
}
