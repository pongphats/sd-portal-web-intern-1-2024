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
      .post<ApiResponse<saveBudgetResponse>>(`${this.trainingUrl}`, body)
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
}
