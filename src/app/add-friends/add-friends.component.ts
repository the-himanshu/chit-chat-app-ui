import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrls: ['./add-friends.component.css'],
})
export class AddFriendsComponent implements OnInit {
  currentUser: any;
  friends: any;

  constructor(private router: Router, private dataRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentUser = this.dataRoute.snapshot.params['user'];
    this.currentUser = JSON.parse(this.currentUser);
    axios.get(`${environment.backendUrl}/get-friends`, {
      headers: {
        Authorization : localStorage.getItem('authToken') || '123'
      }
    }).then((res) => {
      this.friends = res.data;
    })
  }

  async viewProfile(user: any): Promise<any> {
    this.router.navigate([
      '/profile',
      user.id,
      { currentUser: JSON.stringify(this.currentUser), user: JSON.stringify(user) },
    ]);
  }

  async goBackToHome(user: any): Promise<any> {
    this.router.navigate([
      '/mainpage',
      { user: JSON.stringify(this.currentUser) },
    ]);
  }

  async viewRequests(user: any): Promise<any> {
    this.router.navigate(['/friendRequests', {user: JSON.stringify(this.currentUser)}])
  }
}
