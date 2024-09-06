import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthForm } from 'src/app/interface/form';

@Component({
  selector: 'app-login-welfare-page',
  templateUrl: './login-welfare-page.component.html',
  styleUrls: ['./login-welfare-page.component.scss']
})
export class LoginWelfarePageComponent implements OnInit {

  hide = true;
  authForm!: FormGroup<AuthForm>;

  constructor(
    private fb: FormBuilder,
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

}
