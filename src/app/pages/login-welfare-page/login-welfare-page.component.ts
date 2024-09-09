import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthForm } from 'src/app/interface/form';
import { LoginRequest } from 'src/app/interface/request';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { SwalService } from 'src/app/services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-welfare-page',
  templateUrl: './login-welfare-page.component.html',
  styleUrls: ['./login-welfare-page.component.scss'],
})
export class LoginWelfarePageComponent implements OnInit {
  hide = true;
  authForm!: FormGroup<AuthForm>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private swalService: SwalService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    }) as FormGroup<AuthForm>;
  }

  ngOnInit(): void {}

  async loginWelfare() {
    this.swalService.showLoading();
    try {
      const req: LoginRequest = {
        email: this.authForm.controls.email.value || '',
        password: this.authForm.controls.password.value || '',
      };
      const res = await this.authService.login(req).toPromise();
      if (res?.msg == 'Login successful') {
        localStorage.setItem('access_token', res.accessToken);
        const userId = this.authService.getUID();
        this.authService.setUserId(userId);
        this.router.navigate(['/pccth/wellfare-portal/welfare-forms']);
      } else {
        throw new Error(res?.msg);
      }
      Swal.close();
    } catch (error) {
      this.swalService.showError('โปรดตรวจสอบ Email และ รหัสผ่านใหม่อีกครั้ง');
    }
  }
}
