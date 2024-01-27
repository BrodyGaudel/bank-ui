import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShowOperationComponent} from "./components/accounts/show-operation/show-operation.component";
import {AddCustomerComponent} from "./components/customers/add-customer/add-customer.component";
import {ListCustomerComponent} from "./components/customers/list-customer/list-customer.component";
import {UpdateCustomerComponent} from "./components/customers/update-customer/update-customer.component";
import {ShowCustomerComponent} from "./components/customers/show-customer/show-customer.component";
import {ShowAccountComponent} from "./components/accounts/show-account/show-account.component";

const routes: Routes = [
  {path: '', redirectTo: 'account', pathMatch: 'full' },
  {path: 'account', component: ShowAccountComponent},
  {path: 'operation', component: ShowOperationComponent},
  {path: 'add-customer', component: AddCustomerComponent},
  {path: 'list-customer', component: ListCustomerComponent},
  {path: 'update-customer', component: UpdateCustomerComponent},
  {path: 'show-customer/:id', component: ShowCustomerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
