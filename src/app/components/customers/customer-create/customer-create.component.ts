import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerService} from "../../../services/customer/customer.service";
import {Router} from "@angular/router";
import {CustomerRequest} from "../../../dtos/customer/customer.request";
import {ErrorHandlerService} from "../../../services/handler/error-handler.service";
import {CreateAccountRequest} from "../../../dtos/account/create-account.request";

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.css'
})
export class CustomerCreateComponent implements OnInit {

  createCustomerFormGroup!: FormGroup;
  errorMessage: string = '';
  errorDescription: string = '';
  errorCode: number = 0;
  validationErrors: Set<string> = new Set<string>();
  errors: Map<string, string> = new Map<string, string>();
  errorFlag: boolean = false;

  constructor(private fb: FormBuilder,
              private customerService: CustomerService,
              private router: Router,
              private errorHandlerService: ErrorHandlerService) {}

  ngOnInit(): void {
    this.initializeCustomerFormGroup();
    this.handleError();
  }

  private initializeCustomerFormGroup(): void {
    this.createCustomerFormGroup = this.fb.group({
      firstname: this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      lastname: this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      placeOfBirth: this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      dateOfBirth: this.fb.control(null, [Validators.required]),
      nationality: this.fb.control(null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      sex: this.fb.control(null, [Validators.required]),
      cin: this.fb.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(100)]),
      email: this.fb.control(null, [Validators.required, Validators.email])
    });
  }

  private handleError() :void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorMessage = error.message;
        this.errorCode = error.code;
        this.errorDescription = error.description;
        this.validationErrors = error.validationErrors;
        this.errors = error.errors;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }

  handleCreateCustomer(): void {
    this.errorFlag = false;
    const request: CustomerRequest = this.createCustomerFormGroup.value;
    this.customerService.create(request).subscribe({
      next: response => {
        alert('Bien enregistré !');
        this.createAccount(response.id);
        this.router.navigate(['/customer-detail', response.id]).then();
      },
      error: err => {
        console.log(err);
        this.errorFlag = true;
      }
    });
  }

  private createAccount(customerId: string): void {
    let request: CreateAccountRequest = new CreateAccountRequest();
    request.customerId = customerId;
    request.currency = this.createCustomerFormGroup.value.currency;
  }


}
