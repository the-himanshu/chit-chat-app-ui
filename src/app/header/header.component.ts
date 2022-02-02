import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() user!: any;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  async backToHome(user: any) {
    this.router.navigate(['/mainpage', {user: JSON.stringify(user)}])
  }

}
