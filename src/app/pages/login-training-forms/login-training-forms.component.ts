import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-training-forms',
  templateUrl: './login-training-forms.component.html',
  styleUrls: ['./login-training-forms.component.scss'],
})
export class LoginTrainingFormsComponent implements OnInit {
  email: string = '';
  password: string = '';
  hide = true;

  constructor() {}

  onSubmit() {
    if (this.email && this.password) {
      console.log('Login successful');
      // Perform login logic here (e.g., call an API)
    } else {
      console.log('Please enter both email and password');
    }
  }

  ngOnInit(): void {}
}
