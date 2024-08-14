import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  CreateSectorRequest,
  CreateTrainingRequest,
  saveBudgetByYearRequest,
} from '../interface/request';
import { map, Observable } from 'rxjs';
import {
  ApiResponse,
  MngDeptListRes,
  saveBudgetResponse,
} from '../interface/response';
import { Course, sector } from '../interface/common';
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

  createTraining(req: CreateTrainingRequest): Observable<any> {
    return this.http
      .post<any>(`${this.trainingUrl}/createCourse`, req)
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
}
