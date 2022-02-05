import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  editProfileForm = this.formBuilder.group({
    content: '',
  });
  currentUser: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.currentUser = this.dataRoute.snapshot.params['currentUser'];
    this.currentUser = JSON.parse(this.currentUser)
  }

  async onSubmit(): Promise<any> {
    console.warn('Your order has been submitted', this.editProfileForm.value);
    const backendUrl: any = environment.backendUrl;
    const authToken = localStorage.getItem('authToken') || 'abc';
    axios
      .patch(
        `${backendUrl}/users/${this.currentUser.id}`,
        {
          bio: this.editProfileForm.value.content,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then((res) => {
        this.editProfileForm.reset();
        this.router.navigate(['/profile', this.currentUser.id, {'currentUser': JSON.stringify(res.data)}])
        this.ngOnInit()
      });
  }

  async goBack(): Promise<any> {
    this.router.navigate(['/profile', this.currentUser.id, {'currentUser': JSON.stringify(this.currentUser)}])
  }

}
