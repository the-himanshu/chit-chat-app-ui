import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ShowErrorComponent } from './show-error/show-error.component';
import { HeaderComponent } from './header/header.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ViewPostComponent } from './view-post/view-post.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddFriendsComponent } from './add-friends/add-friends.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    MainScreenComponent,
    ShowErrorComponent,
    HeaderComponent,
    CreatePostComponent,
    ViewPostComponent,
    ProfilePageComponent,
    EditProfileComponent,
    AddFriendsComponent,
    FriendRequestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomePageComponent },
      { path: 'login', component: LoginPageComponent },
      { path: 'mainpage', component: MainScreenComponent, data: {user: 'user'} },
      { path: 'error', component: ShowErrorComponent, data: {error: 'error here', errorCode: '404'} },
      { path: 'addFriends', component: AddFriendsComponent, data: {user: 'user'}},
      { path: 'friendRequests', component: FriendRequestsComponent, data: {user: 'user'}},
      { path: 'post/:postId', component: ViewPostComponent, data: {user: 'user'} },
      { path: 'friendList/:profileId', component: FriendRequestsComponent, data: {user: 'user'} },
      { path: 'profile/:profileId', component: ProfilePageComponent, data: {currentUser: 'user info', user: 'user info'} },
      { path: 'profile/editProfile/:profileId', component: EditProfileComponent, data: {currentUser: 'user info'} },
    ])
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
