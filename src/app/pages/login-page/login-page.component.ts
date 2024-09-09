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
import { AuthService } from 'src/app/services/auth.service';
import { SwalService } from 'src/app/services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  hide = true;
  authForm!: FormGroup<AuthForm>;

  constructor(
    private autService: AuthService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  getErrorMessage() {
    if (this.authForm.controls.email.hasError('required')) {
      return 'กรุณากรอกอีเมล';
    }

    return this.authForm.controls.email.hasError('email')
      ? 'อีเมลไม่ถูกต้อง'
      : '';
  }

  async loginSubmit() {
    try {
      // show loading
      this.swalService.showLoading();

      // body validation
      const req: LoginRequest = {
        email: this.authForm.controls.email.value || '',
        password: this.authForm.controls.password.value || '',
      };

      // call login API
      const res = await this.autService.login(req).toPromise();
      if (res?.msg == 'Login successful') {
        localStorage.setItem('access_token', res.accessToken);
        const userId = this.autService.getUID();
        this.autService.setUserId(userId);
        this.router.navigate(['/pccth/management-training']);
      } else {
        throw new Error(res?.msg);
      }

      // hide loading
      Swal.close();
    } catch (error) {
      // show error
      console.error(error);
      this.swalService.showError('โปรดตรวจสอบ Email และ รหัสผ่านใหม่อีกครั้ง');
    }
  }
}
