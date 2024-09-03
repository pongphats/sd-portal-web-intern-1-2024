export interface Employee {
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
  typeEmp: null | string;
  startDate: null | string;
  passDate: null | string;
}

export interface Role {
  id: number;
  role: string;
}

export interface Sector {
  id: number;
  sectorName: string;
  sectorCode: string;
  sectorTname: null | string;
  sectorFullName: null | string;
}

export interface Department {
  id: number;
  deptName: string;
  deptCode: string;
  deptFullName: null | string;
  deptTname: null | string;
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
