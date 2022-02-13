import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css'],
})
export class FriendRequestsComponent implements OnInit {
  currentUser: any;
  friendsAndRequestsData: any;

  constructor(private router: Router, private dataRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentUser = this.dataRoute.snapshot.params['user'];
    this.currentUser = JSON.parse(this.currentUser);
    axios
      .get(
        `${environment.backendUrl}/get-friends-and-requests-data?userId=${this.currentUser.id}`,
        {
          headers: {
            Authorization: localStorage.getItem('authToken') || '123',
          },
        }
      )
      .then((res) => {
        this.friendsAndRequestsData = res.data;
      });
  }

  public async confirmRequest(id: any, friendId: any) {
    axios.patch(
      `${environment.backendUrl}/friends/${id}`,
      {
        status: 'confirmed',
      },
      {
        headers: {
          Authorization: localStorage.getItem('authToken') || '123',
        },
      }
    ).then((res) => {
      this.currentUser.friends.push(friendId);
      this.currentUser.pendindReceivedRequests.pop(friendId)
      this.ngOnInit()
    });
  }

  public async deleteRequest(id: any) {
    axios.delete(
      `${environment.backendUrl}/friends/${id}`,
      {
        headers: {
          Authorization: localStorage.getItem('authToken') || '123',
        },
      }
    ).then((res) => {
      this.ngOnInit()
    });
  }
}
