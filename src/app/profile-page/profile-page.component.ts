import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  currentUser: any;
  viewUser: any;
  stringifiedUser: any;
  closeResult: any;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private dataRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = this.dataRoute.snapshot.params['currentUser'];
    this.viewUser = this.dataRoute.snapshot.params['user'];
    this.stringifiedUser = this.dataRoute.snapshot.params['currentUser'];
    this.currentUser = JSON.parse(this.currentUser);
    this.viewUser = JSON.parse(this.viewUser);
  }

  async editProfile(user: any) {
    this.router.navigate([
      '/profile/editProfile',
      user.id,
      { currentUser: JSON.stringify(this.currentUser) },
    ]);
  }

  async addFriend(source: any, target: any) {
    this.currentUser.pendingSentRequests.push(target.id);
    axios
      .post(
        `${environment.backendUrl}/friends`,
        {
          source: source.id,
          target: target.id,
        },
        {
          headers: {
            Authorization: localStorage.getItem('authToken') || '123',
          },
        }
      )
      .then((res) => {
        axios.get(
          `${environment.backendUrl}/users/${this.currentUser.id}`,
          {
            headers: {
              Authorization: localStorage.getItem('authToken') || '123',
            },
          }
        );
      }).then((response: any) => {
        this.currentUser = response.data;
      });
  }
}
