import {Component, OnInit} from '@angular/core';
import {CustomerQueryService} from "../../../services/customers/customer-query.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {catchError, Observable, throwError} from "rxjs";
import {CustomerResponseModel} from "../../../models/customer.response.model";

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrl: './list-customer.component.css'
})
export class ListCustomerComponent implements OnInit{

  customerFormGroup!: FormGroup;
  customersResponseModel!: Observable<Array<CustomerResponseModel>>;
  currentPage: number =0;
  pageSize: number = 10;

  constructor(private customerQueryService: CustomerQueryService,
              private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.customerFormGroup=this.fb.group({keyword : this.fb.control('')});
  }

  handleSearchCustomer(): void {
    let keyword = this.customerFormGroup.value.keyword;
    this.customersResponseModel = this.customerQueryService.search(keyword,this.currentPage, this.pageSize).pipe(
      catchError( (err) => throwError(() => new Error(err.message)))
    );
  }

  handleShowCustomer(id: string): void {
    this.router.navigate(["show-customer", id]).then();
  }

  gotoNextPage(): void {
    this.currentPage = this.currentPage +1;
    this.handleSearchCustomer();
  }

  gotoPreviousPage(): void {
    if (this.currentPage >=1){
      this.currentPage = this.currentPage -1;
      this.handleSearchCustomer();
    }
  }
}

