import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  createEmployeeReq,
  CreateSectorRequest,
  CreateTrainingRequest,
  CreateTrainingRequestForm,
  saveBudgetByYearRequest,
} from '../interface/request';
import { map, Observable } from 'rxjs';
import {
  ApiResponse,
  Budget,
  Company,
  ExpenseRemain,
  MngDeptListRes,
  saveBudgetResponse,
} from '../interface/response';
import { Course, level, sector } from '../interface/common';
import { Employee } from '../interface/employee';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  trainingUrl: string = environment.trainingService;
  welfareUrl: string = environment.welfareService;

  constructor(private http: HttpClient) {}

  saveBudgetByYear(
    req: saveBudgetByYearRequest
  ): Observable<ApiResponse<saveBudgetResponse>> {
    const body: saveBudgetByYearRequest = {
      ...req,
    };
    return this.http
      .post<ApiResponse<saveBudgetResponse>>(
        `${this.trainingUrl}/createbudget`,
        body
      )
      .pipe(map((res) => res));
  }

  createSectorAndDept(req: CreateSectorRequest): Observable<any> {
    const url = `${this.trainingUrl}/create/sectorAndDept`;
    return this.http
      .post<any>(url, req, {
        responseType: 'text' as 'json',
      })
      .pipe(map((res) => res));
  }

  getSectorsDeptsCompanysList(): Observable<sector[]> {
    return this.http
      .get<sector[]>(`${this.trainingUrl}/findAllJoinDepartmentsSector`)
      .pipe(map((res) => res));
  }

  getManageDeptsListByUserId(
    uid: number
  ): Observable<ApiResponse<MngDeptListRes[]>> {
    return this.http
      .get<ApiResponse<MngDeptListRes[]>>(
        `${this.trainingUrl}/getManageDeptList`,
        {
          params: { uid },
        }
      )
      .pipe(map((res) => res));
  }

  // manage-course-page
  createTraining(req: CreateTrainingRequest): Observable<any> {
    return this.http
      .post<any>(`${this.trainingUrl}/createCourse`, req)
      .pipe(map((res) => res));
  }

  getAllCoursesList(): Observable<Course[]> {
    return this.http
      .get<Course[]>(`${this.trainingUrl}/findAllCourses`)
      .pipe(map((res) => res));
  }

  editCourseById(id: number, body: CreateTrainingRequest): Observable<any> {
    return this.http
      .put<any>(`${this.trainingUrl}/editCourse?courseID=${id}`, body)
      .pipe(map((res) => res));
  }

  deleteCourseById(id: number): Observable<ApiResponse<any>> {
    return this.http
      .delete<ApiResponse<any>>(`${this.trainingUrl}/deleteCourseById`, {
        params: { courseID: id },
      })
      .pipe(map((res) => res));
  }

  // welfare-forms-page
  getExpenseRemainByUserIdAndLevel(
    userId: number,
    level: string
  ): Observable<any> {
    console.log(userId, level);
    return this.http
      .get<any>(
        `${this.welfareUrl}/expenses/getExpenseRemaining?userId=${userId}&level=${level}`
      )
      .pipe(map((res) => res));
  }

  getAllActiveEmpsByDeptId(deptId: number): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(`${this.trainingUrl}/findActiveEmployeesByDeptId`, {
        params: { deptId: deptId },
      })
      .pipe(map((res) => res));
  }

  getAllPrivilegeApproversByDpetId(
    deptId: number
  ): Observable<ApiResponse<Employee[]>> {
    return this.http
      .get<ApiResponse<Employee[]>>(
        `${this.trainingUrl}/findAllPrivilegeApproversByDept`,
        {
          params: {
            deptId: deptId,
          },
        }
      )
      .pipe(map((res) => res));
  }

  editSectorAndDept(
    req: CreateSectorRequest,
    sectorId: number,
    deptId: number
  ): Observable<ApiResponse<any>> {
    const url = `${this.trainingUrl}/edit/SectorAndDept/${sectorId}/${deptId}`;
    return this.http.post<ApiResponse<any>>(url, req).pipe(map((res) => res));
  }

  getAdminByDeptCodeDeptNameCompanyName(
    deptCode: string,
    deptName: string,
    companyName: string
  ): Observable<ApiResponse<any>> {
    const url = `${this.trainingUrl}/find/admin/dept?deptCode=${deptCode}&deptName=${deptName}&companyName=${companyName}`;
    return this.http
      .get<any>(url)
      .pipe(map((res) => res.responseData.result[0]));
  }

  getEmplistByName(term: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.trainingUrl}/seacrhUser/byNames?searchTerm=${term}`)
      .pipe(map((response: any) => response.responseData));
  }

  getAllBudget(): Observable<Budget[]> {
    return this.http
      .get<Budget[]>(`${this.trainingUrl}/findAllBudget`)
      .pipe(map((res) => res));
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http
      .post(`${this.trainingUrl}/uploadFile`, formData)
      .pipe(map((res) => res));
    // const headers = new HttpHeaders({
    //   Accept: 'application/json', // แก้ไขตามความต้องการของ API
    // });

    // return this.http.post(`${this.api}/uploadFile`, formData, {
    //   headers: headers,
    // });
  }

  createTrainingForms(req: CreateTrainingRequestForm) {
    return this.http
      .post<any>(`${this.trainingUrl}/createTraining`, req)
      .pipe(map((res) => res));
  }

  findAllSectorDepartmentPostions(): Observable<Company[]> {
    return this.http
      .get<Company[]>(`${this.trainingUrl}/findAllJoinDepartments`)
      .pipe(map((res) => res));
  }

  getEmpLevels(): Observable<level[]> {
    return this.http
      .get<ApiResponse<level[]>>(`${this.welfareUrl}/budget/getBudget`)
      .pipe(map((res) => res.responseData.result));
  }

  uploadPccUser(data: any): Observable<any> {
    return this.http
      .post<any>(`${this.trainingUrl}/csv/upload/users/pccth`, data)
      .pipe(map((res) => res));
  }

  uploadWsUser(data: any): Observable<any> {
    return this.http
      .post<any>(`${this.trainingUrl}/csv/upload/users/wisesoft`, data)
      .pipe(map((res) => res));
  }

  createEmployee(data: createEmployeeReq): Observable<any> {
    return this.http
      .post<any>(`${this.trainingUrl}/createEmployee`, data)
      .pipe(map((res) => res));
  }

  editEmployee(data: createEmployeeReq, uid: number): Observable<any> {
    return this.http.put<any>(
      `${this.trainingUrl}/editEmployee?userId=${uid}`,
      data
    ).pipe(map((res) => res));;
  }
}
