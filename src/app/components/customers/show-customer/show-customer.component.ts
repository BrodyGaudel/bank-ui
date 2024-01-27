import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerQueryService} from "../../../services/customers/customer-query.service";
import {AccountQueryService} from "../../../services/accounts/account-query.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountResponseModel} from "../../../models/account.response.model";
import {CustomerResponseModel} from "../../../models/customer.response.model";
import {AccountCommandService} from "../../../services/accounts/account-command.service";
import {StatusRequestModel} from "../../../models/status.request.model";

@Component({
  selector: 'app-show-customer',
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.css'
})
export class ShowCustomerComponent implements OnInit{

  customerId!: string;
  customerModelObservable!: Observable<CustomerResponseModel>;
  accountModelObservable!: Observable<AccountResponseModel>;

  constructor(private customerQueryService: CustomerQueryService,
              private accountQueryService: AccountQueryService,
              private accountCommandService: AccountCommandService,
              private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.customerId = this.activatedRoute.snapshot.params['id'];
    this.getCustomerById(this.customerId);
    this.getAccountByCustomerId(this.customerId);
  }

  private getCustomerById(id: string): void {
    this.customerModelObservable = this.customerQueryService.findById(id).pipe(
      catchError( (err) => throwError(() => new Error(err.message)))
    );
  }

  private getAccountByCustomerId(customerId: string): void {
    this.accountModelObservable = this.accountQueryService.findAccountByCustomerId(customerId).pipe(
      catchError( (err) => throwError(() => new Error(err.message)))
    );
  }

  handleChangeStatus(id: string, status: string): void {
    let model: StatusRequestModel = new StatusRequestModel();
    model.accountId = id;
    if(status == "ACTIVATED"){
      model.status = "SUSPENDED";
    }else{
      model.status = "ACTIVATED";
    }
    this.accountCommandService.updateStatus(model).subscribe({
      next : data  => {
        console.log(data)
        this.getAccountByCustomerId(this.customerId);
      },
      error : err => {
        console.log(err)
        alert("Account status not updated due to : "+err.message);
      }
    });
  }

  gotoShowAccountComponent(): void {
    this.router.navigate(["account"]).then();
  }

  gotoUpdateCustomerComponent(id: string): void {
    this.router.navigate(["update-customer", id]).then();
  }

  getOut(): void {
    this.router.navigate(["mail"]).then();
  }
}
