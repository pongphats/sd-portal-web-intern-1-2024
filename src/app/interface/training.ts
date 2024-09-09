export interface TrainingTable {
  isDoResult: string;
  isDo: string;
  result_status: string;
  training: Training;
}

interface Training {
  id: number;
  dateSave: string;
  day: number;
  budget: number;
  budgetType: string;
  etcDetails: string;
  projectCourse: string;
  createBy: number;
  action: string;
  actionDate: string;
  user: User;
  courses: Course[];
  approve1: User;
  status: Status[];
  result: Result[];
  resultGeneric9: ResultGeneric9[];
  trainingFiles: any[];
}

interface User {
  id: number;
  empCode: string;
  firstname: string;
  lastname: string;
  email: string;
  level: string;
  status: number;
  title: string;
  roles: Role[];
  sectors: Sector[];
  departments: Department[];
  companys: Company[];
  position: Position;
  department: Department;
  company: Company;
  sector: Sector;
  typeEmp: string | null;
  startDate: string | null;
  passDate: string | null;
}

interface Role {
  id: number;
  role: string;
}

interface Sector {
  id: number;
  sectorName: string;
  sectorCode: string;
  sectorTname: string | null;
  sectorFullName: string | null;
}

interface Department {
  id: number;
  deptName: string;
  deptCode: string;
  deptFullName: string | null;
  deptTname: string | null;
}

interface Company {
  id: number;
  companyName: string;
}

export interface Position {
  id: number;
  positionName: string;
  department: Department;
}

interface Course {
  id: number;
  courseName: string;
  startDate: string;
  endDate: string;
  hours: number | null;
  time: string;
  note: string;
  objective: string;
  price: number;
  priceProject: number | null;
  place: string;
  institute: string;
  active: number;
  type: number;
}

export interface Status {
  id: number;
  status: string;
  active: number;
  approvalDate: string;
  approveId: User;
  indexOfSignature: number;
}

interface Result {
  id: number;
  result1: string;
  result2: string;
  result3: string;
  result4: string;
  result5: string;
  result6: string;
  result7: string;
  result: string;
  comment: string;
  cause: string;
  plan: string;
  evaluationDate: string;
}

interface ResultGeneric9 {
  id: number;
  result1: string;
  result2: string;
  result3: string;
  result4: string;
  result5: string;
}
