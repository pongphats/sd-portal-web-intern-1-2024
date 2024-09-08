export interface company {
  id: number;
  companyName: string;
}

export interface department {
  id: number;
  deptName: string;
  deptCode: string;
  deptFullName: string;
  deptTname: string;
}

export interface sector {
  sectorId: number;
  sectorFullName: string;
  sectorCode: string;
  company: string;
  sectorName: string;
  sectorTname: string;
  department: department;
}

export interface Course {
  id: number;
  courseName: string;
  startDate: string;
  endDate: string;
  hours: string;
  time: string;
  note: string;
  objective: string;
  price: number;
  priceProject: string;
  place: string;
  institute: string;
  active: number;
  type: number;
}

export interface Budget {
  year: string;
  budgetTraining: number;
  departmentCode: string;
  budgetCer: number;
  company: string;
  id: number | null;
  totalExp: number;
  budgetCerRemain: number;
  budgetTrainingRemain: number;
  totalExpRemain: number;
}

export interface fileTable {
  position: number;
  fileName: string;
  fileSize: string;
  fileId: number;
}

export interface fileEdit {
  id: number;
  fileName: string;
}

export interface level {
  id: number;
  level: string;
  opd: number;
  ipd: number;
  room: number;
}

export interface ExpenseWelfare {
  id: number;
  dateOfAdmission: string; // ISO 8601 datetime format
  description: string;
  opd: number;
  ipd: number;
  remark: string;
  roomService: number;
  userId: number;
  days: number;
  startDate: string; // ISO 8601 datetime format
  endDate: string; // ISO 8601 datetime format
  canWithdraw: number;
}

export interface ExpenseDetail {
  companyName: string;
  expenseType: string;
  dateOfAdmission: string;
  firstName: string;
  lastName: string;
  positionName: string;
  sectorName: string;
  deptName: string;
  empLevel: string;
  withdrawReq: string;
  roomService: string;
  canWithdraw: string;
  remark: string;
  description: string;
  dateRange: string;
  dateCount: string;
}

export interface DeptBudget {
  year: string;
  departmentCode: string;
  budgetCer: number;
  budgetTraining: number;
  budgetTotal: number;
}

export interface BudgetCreated {
  year: string;
  departmentCode: string;
  budgetCer: number;
  budgetTraining: number;
}
