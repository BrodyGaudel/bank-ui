import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../../services/customer/customer.service";
import {Router} from "@angular/router";
import {Observable, of, tap} from "rxjs";
import {CustomerResponse} from "../../../dtos/customer/custmer.response";
import {ErrorHandlerService} from "../../../services/handler/error-handler.service";
import {CustomerPageResponse} from "../../../dtos/customer/customer-page.response";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrl: './customer-search.component.css'
})
export class CustomerSearchComponent implements OnInit{

  searchCustomerFormGroup!: FormGroup;
  customersObservable!: Observable<CustomerPageResponse  | null>;
  page: number = 0;
  size: number = 5;
  keyword!: string;
  errorMessage: string = '';
  errorDescription: string = '';
  errorCode: number = 0;
  validationErrors: Set<string> = new Set<string>();
  errors: Map<string, string> = new Map<string, string>();
  errorFlag: boolean = false;


  constructor(private fb: FormBuilder,
              private customerService: CustomerService,
              private router: Router,
              private errorHandlerService: ErrorHandlerService) {

  }

  ngOnInit(): void {
    this.searchCustomerFormGroup = this.fb.group({
      keyword: this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(256)])
    });
    this.subscribeToErrors();
  }

  private subscribeToErrors(): void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorMessage = error.message;
        this.errorCode = error.code;
        this.errors = error.errors;
        this.errorDescription = error.description;
        this.validationErrors = error.validationErrors;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }

  private fetchCustomerDetails(kw: string, p: number, s:number): void {
    this.customersObservable = this.customerService.search(kw,p,s).pipe(
      tap(response => {
        this.errorFlag = false;
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error);
        return of(null); // Return a safe value or handle the error appropriately
      })
    );
  }

  handleSearchCustomer(): void{
    this.keyword = this.searchCustomerFormGroup.value.keyword;
    this.fetchCustomerDetails(this.keyword, this.page, this.size);
  }


  gotoNextPage(customerPage: CustomerPageResponse): void {
    if(customerPage.status.hasNext){
      this.page = this.page + 1;
      this.fetchCustomerDetails(this.keyword, this.page, this.size);
    }else{
      alert("C'est la dernière page.");
    }
  }

  gotoPreviousPage(customerPage: CustomerPageResponse): void {
    if(customerPage.status.hasPrevious){
      this.page = this.page - 1;
      this.fetchCustomerDetails(this.keyword, this.page, this.size);
    }else{
      alert("C'est la prémière page.");
    }
  }

  gotoCustomerDetailComponent(customer: CustomerResponse): void {
    this.router.navigate(['/customer-detail', customer.id]).then();
  }
}
