import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatePostComponent } from '../create-post/create-post.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit {
  posts: any = [];
  user: any;
  stringifiedUser: any;
  closeResult: any;
  backendUrl: any = environment.backendUrl;
  authToken: any = localStorage.getItem('authToken');

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private dataRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<any> {
    this.stringifiedUser = await this.dataRoute.snapshot.params['user'];
    this.user = JSON.parse(this.stringifiedUser);
    const backendUrl: any = environment.backendUrl;
    const authToken = localStorage.getItem('authToken') || 'abc';
    axios
      .get(`${backendUrl}/posts`, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((res) => {
        this.posts = res.data;
      })
      .catch((err) => {
        this.showErrorPage(err);
      });
  }

  async createPost(): Promise<any> {
    this.modalService
      .open(CreatePostComponent, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  async logout(): Promise<any> {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async viewPost(id: any): Promise<any> {
    this.router.navigate(['/post', id, { user: JSON.stringify(this.user) }]);
  }

  async addFriends(): Promise<any> {
    this.router.navigate(['/addFriends', { user: JSON.stringify(this.user) }]);
  }

  async viewProfile(user: any): Promise<any> {
    this.router.navigate([
      '/profile',
      user.id,
      { currentUser: JSON.stringify(this.user), user: JSON.stringify(user) },
    ]);
  }

  async deletePost(id: any): Promise<any> {
    axios
      .delete(`${this.backendUrl}/posts/${id}`, {
        headers: {
          Authorization: this.authToken,
        },
      })
      .then((res) => {
        this.ngOnInit();
      })
      .catch((err) => {
        this.showErrorPage(err);
      });
  }

  async increaseLikes(id: any, likes: any) {
    const objIndex = this.posts.findIndex((obj) => obj.id == id);
    this.posts[objIndex].isLiked = true;
    this.posts[objIndex].likes = this.posts[objIndex].likes + 1;
    axios
      .patch(
        `${this.backendUrl}/posts/${id}`,
        { likes: likes + 1, liked: true },
        {
          headers: {
            Authorization: this.authToken,
          },
        }
      )
      .then((res) => {})
      .catch((err) => {
        this.showErrorPage(err);
      });
  }

  async decreaseLikes(id: any, likes: any) {
    const objIndex = this.posts.findIndex((obj) => obj.id == id);
    this.posts[objIndex].isLiked = false;
    this.posts[objIndex].likes = this.posts[objIndex].likes - 1;
    axios
      .patch(
        `${this.backendUrl}/posts/${id}`,
        { likes: likes - 1, disliked: true },
        {
          headers: {
            Authorization: this.authToken,
          },
        }
      )
      .then((res) => {})
      .catch((err) => {
        this.showErrorPage(err);
      });
  }

  private showErrorPage(err: any) {
    err = err.toString();
    this.router.navigate(['/error', { error: err, errorCode: err.slice(-3) }]);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
