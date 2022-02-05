import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  currentUser: any;
  closeResult: any;

  constructor(private modalService: NgbModal, private router: Router, private dataRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUser = this.dataRoute.snapshot.params['currentUser']
    this.currentUser = JSON.parse(this.currentUser)
  }

  async editProfile(user: any) {
    this.router.navigate(['/profile/editProfile', user.id, {currentUser: JSON.stringify(this.currentUser)}])
  }
}
