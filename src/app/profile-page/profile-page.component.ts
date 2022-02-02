import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  currentUser: any;

  constructor(private router: Router, private dataRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUser = this.dataRoute.snapshot.params['currentUser']
    this.currentUser = JSON.parse(this.currentUser)
  }

}
