import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { ApiResponse, Sector } from '../interface/response';
import { Employee, Role } from '../interface/employee';
import { department, sector } from '../interface/common';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  trainingUrl: string = environment.trainingService;
  welfareUrl: string = environment.welfareService;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  getCompanyIdByName(name: string): Observable<number> {
    return this.http
      .get<number>(`${this.trainingUrl}/findIdByName`, {
        params: { param: name },
      })
      .pipe(map((res) => res));
  }

  getOnlyDeptCodeByCompany(company: string): Observable<any> {
    return this.http
      .get<any>(`${this.trainingUrl}/findAllJoinDepartmentsSector`)
      .pipe(
        map((res: any[]) => {
          // Filter by company
          const filteByCompany = res.filter(
            (item: any) => item.company === company
          );
          // Map to department codes and filter duplicates using Set
          const mapByDeptCode = Array.from(
            new Set(filteByCompany.map((item: any) => item.department.deptCode))
          );
          // Sort the department codes numerically
          return mapByDeptCode.sort((a, b) => {
            return parseInt(a) - parseInt(b);
          });
        })
      );
  }

  generateAdminFullName(): Observable<string[]> {
    return this.http.get(`${this.trainingUrl}/findAllAdmin`).pipe(
      map((res: any) => {
        const adminsFullName = res.map((admin: any) => {
          return `${admin.title} ${admin.firstname} ${admin.lastname}`;
        });

        return adminsFullName;
      })
    );
  }

  formatDateToYYYYMMDDString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 ถ้าเป็นเลขเดียว
    return `${year}-${month}-${day}`;
  }

  toTimeStringHHMM24hr(timeInput: any) {
    const date = new Date(timeInput);
    const timeString = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return timeString;
  }

  getSectorAndDeptsListByCompanyName(
    companyName = 'PCCTH'
  ): Observable<sector[]> {
    return this.http
      .get<sector[]>(`${this.trainingUrl}/findAllJoinDepartmentsSector`)
      .pipe(map((res) => res.filter((item) => item.company == companyName)));
  }

  convertNumberToStringFormatted(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getUserDetailByEmpcode(empCode: string): Observable<Employee> {
    return this.http
      .get<ApiResponse<Employee>>(`${this.trainingUrl}/findByEmpCode`, {
        params: {
          empCode: empCode,
        },
      })
      .pipe(map((res) => res.responseData.result));
  }

  checkDuplicateEmpCode(empCode: string): Observable<boolean> {
    return this.http
      .post<boolean>(`${this.trainingUrl}/check/empcode?empcode=${empCode}`, {})
      .pipe(map((res) => res));
  }

  sortData(data: any[], property: string, order: 'asc' | 'desc'): any[] {
    return data.sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  mappedRole(roles: Role[]): string {
    if (roles.length > 1) {
      return roles
        .map((role) => role.role)
        .sort() // Sort roles alphabetically
        .join('And'); // Concatenate sorted roles with 'And'
    } else if (roles.length === 1) {
      return roles[0].role;
    }
    return '';
  }

  translateRole(roles: Role[]): string {
    const mappedRole = this.mappedRole(roles);
    const roleMap: { [key: string]: string } = {
      Admin: 'ผู้ดูแลระบบ',
      Approver: 'หัวหน้างาน',
      VicePresident: 'ผู้บริหาร',
      Personnel: 'แผนกบุคคล',
      User: 'พนักงาน',
      President: 'ประธานเจ้าหน้าที่บริหาร/กรรมการผู้จัดการ',
      Manager: 'ผู้บังคับบัญชา',
      ManagerAndPersonnel: 'ผู้บังคับบัญชา/แผนกบุคคล',
    };

    return roleMap[mappedRole];
  }

  splitRole(name: string): any[] {
    const roles: any[] = [];

    if (name.includes('And')) {
      // Split the name by 'And'
      const splitRoles = name.split('And');
      // Loop through each split role and push to the roles array
      splitRoles.forEach((role) => roles.push(role.trim()));
    } else {
      // If there is no 'And', just push the name as is
      roles.push(name);
    }

    return roles;
  }
  convertNumberToStringFormatted2(number: number) {
    const [integerPart, decimalPart] = number.toFixed(2).split('.');
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    );
    return `${formattedIntegerPart}.${decimalPart}`;
  }

  getSectorCompanyByName(companyName: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.trainingUrl}/findAllJoinDepartmentsSector`)
      .pipe(
        map((res) => {
          const sectors: any[] = [];
          const companyFilterData: sector[] = res.filter(
            (item) => item.company === companyName
          );
          const uniqueSectorIds = new Set<number>();

          companyFilterData.forEach((item) => {
            if (!uniqueSectorIds.has(item.sectorId)) {
              uniqueSectorIds.add(item.sectorId);
              sectors.push({
                sectorId: item.sectorId,
                sectorFullName: item.sectorFullName,
                sectorCode: item.sectorCode,
                company: item.company,
                sectorName: item.sectorName,
                sectorTname: item.sectorTname,
              });
            }
          });

          // Sort the array after processing all elements
          return sectors.sort((a, b) =>
            a.sectorCode.localeCompare(b.sectorCode)
          );
        })
      );
  }

  getDeptListBySectorId(sectorId: number): Observable<department[]> {
    return this.http
      .get<sector[]>(`${this.trainingUrl}/findAllJoinDepartmentsSector`)
      .pipe(
        map((res) => {
          const sectorFilterData: sector[] = res.filter(
            (item) => item.sectorId == sectorId
          );
          const depts: department[] = [];
          sectorFilterData.forEach((item) => {
            depts.push({
              ...item.department,
            });
          });

          return depts.sort((a, b) => a.deptName.localeCompare(b.deptName));
        })
      );
  }

  // async getSectorCompanyName(companyName: string): Promise<any[]> {
  //   const sectors: any[] = [];

  //   try {
  //     // Ensure that the method call is correctly defined on apiService
  //     const res =
  //       (await this.apiService.getSectorsDeptsCompanysList().toPromise()) || [];

  //     // Filter data by the provided company name
  //     const companyFilterData: sector[] = res.filter(
  //       (item) => item.company === companyName
  //     );

  //     const uniqueSectorIds = new Set<number>();

  //     // Process and collect unique sector entries
  //     companyFilterData.forEach((item) => {
  //       if (!uniqueSectorIds.has(item.sectorId)) {
  //         uniqueSectorIds.add(item.sectorId);
  //         const mappedData: any = {
  //           sectorid: item.sectorId,
  //           sectorcode: item.sectorCode || '',
  //           sectorname: item.sectorName || '',
  //           sectorsFullName: item.sectorFullName || '',
  //           sectorsThFullName: item.sectorTname || '',
  //         };
  //         sectors.push(mappedData);
  //       }
  //     });

  //     // Sort the resulting array by sectorcode
  //     sectors.sort((a, b) => a.sectorcode.localeCompare(b.sectorcode));
  //   } catch (error) {
  //     console.error('Error fetching sector data:', error);
  //   } finally {
  //     return sectors;
  //   }
  // }

  filterNullUndefinedValues(obj: any) {
    return Object.entries(obj)
      .filter(([_, value]) => value !== null && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }
}
