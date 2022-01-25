import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  registrationForm = this.formBuilder.group({
    username: '123',
    email: '',
    password: ''
  });

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<any> {
    console.warn('Your order has been submitted', this.registrationForm.value);
    console.log("sf : ", this.registrationForm.value.username);
    const backendUrl: any = environment.backendUrl
    console.log("BACKEND URL : ",backendUrl);
    const responsedata = await axios.post(`${backendUrl}/users`, {
      username: this.registrationForm.value.username,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
    })
    if(responsedata.status == 201) {
      console.log("created");
    }
    this.registrationForm.reset();
  }

}
