import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthForm } from 'src/app/interface/form';

@Component({
  selector: 'app-login-training-forms',
  templateUrl: './login-training-forms.component.html',
  styleUrls: ['./login-training-forms.component.scss'],
})
export class LoginTrainingFormsComponent implements OnInit {
  authForm!: FormGroup<AuthForm>;
  hide = true;

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  loginTrainingForms() {
    console.log(this.authForm.value);
    this.authForm.reset();
  }
}
