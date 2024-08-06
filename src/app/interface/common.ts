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
