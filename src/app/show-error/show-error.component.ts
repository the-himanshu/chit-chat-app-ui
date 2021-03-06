import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show-error',
  templateUrl: './show-error.component.html',
  styleUrls: ['./show-error.component.css']
})
export class ShowErrorComponent implements OnInit {
  errorData = 'This is the default error'
  errorCode = 0
  constructor(private router: Router, private dataRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.errorData = this.dataRoute.snapshot.params['error'];
    this.errorCode = this.dataRoute.snapshot.params['errorCode'];
   }
}
