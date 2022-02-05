import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { FeathersService } from '../feathers.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css'],
  providers: [FeathersService],
})
export class ViewPostComponent implements OnInit {
  post: any;
  comments: any;
  stringifiedUser: any;
  backendUrl: any = environment.backendUrl;
  authToken: any = localStorage.getItem('authToken');
  commentForm = this.formBuilder.group({
    content: '',
  });

  constructor(
    private router: Router,
    private dataRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private feathersService: FeathersService
  ) {}

  ngOnInit(): void {
    const postId = this.dataRoute.snapshot.params['postId'];
    this.stringifiedUser = this.dataRoute.snapshot.params['user'];
    axios
      .get(`${this.backendUrl}/posts/${postId}`, {
        headers: {
          Authorization: this.authToken,
        },
      })
      .then((res) => {
        this.post = res.data;
        this.post.comments = this.post.comments.sort((a: any, b: any) =>
          a.createdAt > b.createdAt ? -1 : 1
        );
      })
      .catch((err) => {
        err = err.toString();
        this.router.navigate([
          '/error',
          { error: err, errorCode: err.slice(-3) },
        ]);
      });
  }

  async GoHome(): Promise<any> {
    this.router.navigate(['/mainpage', {user: this.stringifiedUser}]);
  }

  async onSubmit(post: any): Promise<any> {
    console.warn('Your order has been submitted', this.commentForm.value);
    axios
      .post(
        `${this.backendUrl}/comments`,
        {
          postId: post.id,
          content: this.commentForm.value.content,
        },
        {
          headers: {
            Authorization: this.authToken,
          },
        }
      )
      .then((res) => {
        this.ngOnInit();
      })
      .catch((err) => {
        err = err.toString();
        this.router.navigate([
          '/error',
          { error: err, errorCode: err.slice(-3) },
        ]);
      });
  }
}
