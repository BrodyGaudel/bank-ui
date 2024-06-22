import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/security/login/login.component";
import {CustomerCreateComponent} from "./components/customers/customer-create/customer-create.component";
import {CustomerDetailComponent} from "./components/customers/customer-detail/customer-detail.component";
import {CustomerListComponent} from "./components/customers/customer-list/customer-list.component";
import {CustomerSearchComponent} from "./components/customers/customer-search/customer-search.component";
import {CustomerUpdateComponent} from "./components/customers/customer-update/customer-update.component";
import {ForbiddenComponent} from "./components/security/forbidden/forbidden.component";
import {AccountDetailsComponent} from "./components/account/account-details/account-details.component";
import {AccountOperationComponent} from "./components/account/account-operation/account-operation.component";
import {OperationDetailComponent} from "./components/account/operation-detail/operation-detail.component";
import {OperationListComponent} from "./components/account/operation-list/operation-list.component";

const routes: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full' },
  {path: 'authentication', component: LoginComponent},
  {path: 'forbidden', component: ForbiddenComponent},
  {path: 'customer-create', component: CustomerCreateComponent},
  {path: 'customer-detail/:id', component: CustomerDetailComponent},
  {path: 'customer-list', component: CustomerListComponent},
  {path: 'customer-search', component: CustomerSearchComponent},
  {path: 'customer-update/:id', component: CustomerUpdateComponent},
  {path: 'account-detail/:id', component: AccountDetailsComponent},
  {path: 'account-operation', component: AccountOperationComponent},
  {path: 'operation-detail/:id', component: OperationDetailComponent},
  {path: 'operation-list/:id', component: OperationListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
