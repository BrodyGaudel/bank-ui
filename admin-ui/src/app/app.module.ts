import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './user_components/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { ChangePasswordComponent } from './user_components/change-password/change-password.component';
import { UsersComponent } from './user_components/users/users.component';
import {HttpErrorInterceptor} from "./exception/http-error-interceptor";
import { UserComponent } from './user_components/user/user.component';
import { CreateUserComponent } from './user_components/create-user/create-user.component';
import { UpdateUserComponent } from './user_components/update-user/update-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChangePasswordComponent,
    UsersComponent,
    UserComponent,
    CreateUserComponent,
    UpdateUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
