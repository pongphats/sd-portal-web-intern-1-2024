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