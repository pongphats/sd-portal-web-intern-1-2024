import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { sector } from '../interface/common';
import { ApiService } from './api.service';
import { ApiResponse } from '../interface/response';
import { Employee } from '../interface/employee';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  trainingUrl: string = environment.trainingService;
  welfareUrl: string = environment.welfareService;

  constructor(private http: HttpClient, private apiService: ApiService) {}

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

  async getSectorAndDeptsListByCompanyName(
    companyName = 'PCCTH'
  ): Promise<sector[]> {
    let sectors: sector[] = [];
    try {
      const res = await this.apiService
        .getSectorsDeptsCompanysList()
        .toPromise();
      if (res === undefined) {
        throw new Error('Sectors list is undefined');
      } else {
        sectors = res.filter((item: sector) => item.company == companyName);
      }
    } catch (error) {
      console.error(error);
    }
    console.log(sectors);
    return sectors;
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

  convertNumberToStringFormatted2(number: number) {
    const [integerPart, decimalPart] = number.toFixed(2).split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedIntegerPart}.${decimalPart}`;
  }
}

