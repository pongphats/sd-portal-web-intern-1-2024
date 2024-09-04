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

export interface createEmployeeReq {
  empCode: string;
  title: string;
  firstname: string;
  lastname: string;
  positionName: string;
  email: string;
  level: string;
  typeEmp: string;
  startDate: string;
  passDate: string;
  dept_actual: number;
  sector_actual: number;
  deptID: number[];
  companyID: number[];
  sectorID: number[];
  roles: string[];
}
// welfare-forms-page
export interface CreateExpenseRequest {
  types: string;
  level: string;
  startDate: string;
  endDate: string;
  days: number;
  ipd: number;
  opd: number;
  roomService: number;
  description: string;
  remark: string;
  adMission: string;
  userId: number;
}
export interface createPosition {
  positionName: string;
  departmentId: number;
}

export interface editPosition {
  posName: string;
  posId: number;
}

export interface budgetCreate {
  level: string;
  opd: number;
  ipd: number;
  room: number;
}

export interface expenseReportRequest {
  page: number | 0;
  size: number | 10;
  companyName: string;
  sectorId: number;
  deptId: number;
  userId: number;
  startDate: string; // string format: YYYY-MM-DD (2024-12-01) , (2024-01-30)
  endDate: string; // string format: YYYY-MM-DD (2024-12-01) , (2024-01-30)
}

export interface approveTrainingReq {
  trainingId: number;
  approveId: number;
  statusApprove: string;
}
