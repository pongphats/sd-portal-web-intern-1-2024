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

  checkRole(): string {
    const accessToken = localStorage.getItem('access_token');
    let role = '';
    if (accessToken) {
      // Decode the JWT token
      const decodedToken = this.jwtService.decodeToken(accessToken);
      const userRoles = decodedToken.role.map(
        (role: { authority: any }) => role.authority
      );
      if (userRoles.length > 1) {
        role = userRoles.sort().join('And');
        // console.log(userRoles.sort().join('And'));
        return role;
      } else {
        role = userRoles[0];
        return role;
      }
    } else {
      return '';
    }
  }

  getUID(): number {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken != null) {
      const decodedToken = this.jwtService.decodeToken(accessToken);
      const id = decodedToken.sub;
      return id;
    } else {
      return 0;
    }
  }

  login(loginReq: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/auth/login`, loginReq)
      .pipe(map((res) => res));
  }
  logout() {
    localStorage.removeItem('token');
  }
}
