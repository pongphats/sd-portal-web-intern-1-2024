import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  trainingUrl: string = environment.trainingService;
  welfareUrl: string = environment.welfareService;
  constructor(private http: HttpClient) {}

  getCompanyIdByName(name: string): Observable<number> {
    return this.http
      .get<number>(`${this.trainingUrl}findIdByName`, {
        params: { param: name },
      })
      .pipe(map((res) => res));
  }

  getOnlyDeptCodeByCompany(company: string): Observable<any> {
    return this.http
      .get<any>(`${this.trainingUrl}/findAllJoinDepartmentssector`)
      .pipe(
        map((res: any[]) => {
          const filteByCompany = res.filter(
            (item: any) => item.company === company
          );
          const mapByDeptCode = filteByCompany.map(
            (item: any) => item.department.deptCode
          );
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
}
