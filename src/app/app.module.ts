import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerCreateComponent } from './components/customers/customer-create/customer-create.component';
import { CustomerUpdateComponent } from './components/customers/customer-update/customer-update.component';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { CustomerListComponent } from './components/customers/customer-list/customer-list.component';
import { CustomerSearchComponent } from './components/customers/customer-search/customer-search.component';
import { AccountOperationComponent } from './components/account/account-operation/account-operation.component';
import { AccountDetailsComponent } from './components/account/account-details/account-details.component';
import { OperationDetailComponent } from './components/account/operation-detail/operation-detail.component';
import { OperationListComponent } from './components/account/operation-list/operation-list.component';
import { LoginComponent } from './components/security/login/login.component';
import { ForbiddenComponent } from './components/security/forbidden/forbidden.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpErrorInterceptor} from "./services/handler/http-error-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    CustomerCreateComponent,
    CustomerUpdateComponent,
    CustomerDetailComponent,
    CustomerListComponent,
    CustomerSearchComponent,
    AccountOperationComponent,
    AccountDetailsComponent,
    OperationDetailComponent,
    OperationListComponent,
    LoginComponent,
    ForbiddenComponent
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
