import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../interface/request';
import { LoginResponse } from '../interface/response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUrl: string = environment.trainingService;

  constructor(private http: HttpClient, private jwtService: JwtHelperService) {}

  checkRole() {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Decode the JWT token
      const decodedToken = this.jwtService.decodeToken(accessToken);
      const userRoles = decodedToken.role.map(
        (role: { authority: any }) => role.authority
      );
      return userRoles[0];
    }
  }

  getUID() {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken != null) {
      const decodedToken = this.jwtService.decodeToken(accessToken);
      const id = decodedToken.sub;
      return id;
    }

    return null;
  }

  login(loginReq: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/auth/login`, loginReq)
      .pipe(map((res) => res));
  }
}
