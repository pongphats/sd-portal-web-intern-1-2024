import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  trainingUrl : string = environment.trainingService
  welfareUrl : string = environment.welfareService

  constructor(private http: HttpClient) { }
}
