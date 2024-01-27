import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AddCustomerComponent } from './components/customers/add-customer/add-customer.component';
import { UpdateCustomerComponent } from './components/customers/update-customer/update-customer.component';
import { ShowCustomerComponent } from './components/customers/show-customer/show-customer.component';
import { ListCustomerComponent } from './components/customers/list-customer/list-customer.component';
import { ShowAccountComponent } from './components/accounts/show-account/show-account.component';
import { ShowOperationComponent } from './components/accounts/show-operation/show-operation.component';

@NgModule({
  declarations: [
    AppComponent,
    AddCustomerComponent,
    UpdateCustomerComponent,
    ShowCustomerComponent,
    ListCustomerComponent,
    ShowAccountComponent,
    ShowOperationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgOptimizedImage,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
