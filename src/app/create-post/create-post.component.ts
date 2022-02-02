import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  createPostForm = this.formBuilder.group({
    content: '',
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {}

  async onSubmit(): Promise<any> {
    console.warn('Your order has been submitted', this.createPostForm.value);
    const backendUrl: any = environment.backendUrl;
    const authToken = localStorage.getItem('authToken') || 'abc';
    axios
      .post(
        `${backendUrl}/posts`,
        {
          content: this.createPostForm.value.content,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      )
      .then((res) => {
        this.createPostForm.reset();
        this.modalService.dismissAll();
        this.router.navigate(['/post', res.data.id]);
        this.ngOnInit()
      });
  }

  async goBack(): Promise<any> {
    this.router.navigate(['/mainpage']);
  }
}
