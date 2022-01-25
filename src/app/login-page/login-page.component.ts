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

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<any> {
    console.warn('Your order has been submitted', this.loginForm.value);
    console.log('sf : ', this.loginForm.value);
    const backendUrl: any = environment.backendUrl;
    console.log('BACKEND URL : ', backendUrl);
    axios
      .post(`${backendUrl}/authentication`, {
        strategy: 'local',
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .then((res) => {
        if (res.status == 201) {
          console.log('successfully authenticated');
          this.loginForm.reset();
          this.router.navigate(['/mainpage']);
        }
      })
      .catch((err) => {
        console.log("123scsdsv : ",err);  
        console.log('not authenticated');
        this.router.navigate(['/error', {error: err}]);
      });
  }
}
