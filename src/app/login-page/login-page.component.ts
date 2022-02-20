import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: '',
    password: '',
  });
  errorBoolean = false;
  errorString = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<any> {
    console.warn('Your order has been submitted', this.loginForm.value);
    const backendUrl: any = environment.backendUrl;
    axios
      .post(`${backendUrl}/authentication`, {
        strategy: 'local',
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .then((res) => {
        if (res.status == 201) {
          localStorage.setItem('authToken', res.data.accessToken);
          this.loginForm.reset();
          this.router.navigate(['/mainpage', {user: JSON.stringify(res.data.user)}]);
        }
      })
      .catch((err) => {
        this.errorBoolean = true;
        this.errorString = err.message;
        setTimeout(() => {
          this.errorBoolean = false;
        }, 10000)
      });
  }
}
