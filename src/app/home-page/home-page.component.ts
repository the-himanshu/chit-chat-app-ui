import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  registrationForm = this.formBuilder.group({
    username: '123',
    email: '',
    password: '',
  });

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<any> {
    console.warn('Your order has been submitted', this.registrationForm.value);
    const backendUrl: any = environment.backendUrl;
    axios
      .post(`${backendUrl}/users`, {
        username: this.registrationForm.value.username,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
      })
      .then((res) => {
        this.router.navigate(['/login']);
        this.registrationForm.reset();
      })
      .catch((err) => {
        err = err.toString();
        this.router.navigate([
          '/error',
          { error: err, errorCode: err.slice(-3) },
        ]);
      });
  }
}
