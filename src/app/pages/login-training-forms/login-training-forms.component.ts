import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthForm } from 'src/app/interface/form';
import { LoginRequest } from 'src/app/interface/request';
import { AuthService } from 'src/app/services/auth.service';
import { SwalService } from 'src/app/services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-training-forms',
  templateUrl: './login-training-forms.component.html',
  styleUrls: ['./login-training-forms.component.scss'],
})
export class LoginTrainingFormsComponent implements OnInit {
  authForm!: FormGroup<AuthForm>;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private autService: AuthService,
    private swalService: SwalService,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  async loginTrainingForms() {
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
