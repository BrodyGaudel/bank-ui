import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./user_components/login/login.component";
import {UsersComponent} from "./user_components/users/users.component";
import {ChangePasswordComponent} from "./user_components/change-password/change-password.component";
import {UserComponent} from "./user_components/user/user.component";
import {CreateUserComponent} from "./user_components/create-user/create-user.component";

const routes: Routes = [
  {path: '', redirectTo: 'authentication', pathMatch: 'full' },
  {path: 'authentication', component: LoginComponent},
  {path: 'user/:id', component: UserComponent},
  {path: 'users', component: UsersComponent},
  {path: 'create', component: CreateUserComponent},
  {path: 'update-password', component: ChangePasswordComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
