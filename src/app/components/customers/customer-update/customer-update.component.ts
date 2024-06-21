import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../../../services/customer/customer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerResponse} from "../../../dtos/customer/custmer.response";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorHandlerService} from "../../../services/handler/error-handler.service";
import {CustomerRequest} from "../../../dtos/customer/customer.request";

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.css'
})
export class CustomerUpdateComponent implements OnInit {
  customerId!: string;
  customer: CustomerResponse = new CustomerResponse();
  updateCustomerFormGroup!: FormGroup;
  errorMessage: string = '';
  errorDescription: string = '';
  errorCode: number = 0;
  validationErrors: Set<string> = new Set<string>();
  errors: Map<string, string> = new Map<string, string>();
  errorFlag: boolean = false;


  constructor(private customerService: CustomerService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private errorHandlerService: ErrorHandlerService,) { }

  ngOnInit(): void {
    this.customerId = this.activatedRoute.snapshot.params['id'];
    this.initializeCreateCustomerFormGroup();
    this.getCustomerById(this.customerId);
    this.subscribeToErrors();
  }

  private subscribeToErrors(): void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorCode = error.code;
        this.validationErrors = error.validationErrors;
        this.errors = error.errors;
        this.errorDescription = error.description;
        this.errorFlag = true;
        this.errorMessage = error.message;
      } else {
        this.errorFlag = false;
      }
    });
  }

  private getCustomerById(id: string):void {
    this.errorFlag =false;
    this.customerService.findById(id).subscribe({
      next : data  => {
        this.customer = data;
        this.addDefaultValueToCreateCustomerFormGroup();
      },
      error : err => {
        this.errorFlag = true;
        this.errorHandlerService.handleError(err);
      }
    });
  }

  private initializeCreateCustomerFormGroup() :void{
    this.updateCustomerFormGroup = this.fb.group( {
      lastname : this.fb.control(null, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]),
      nationality : this.fb.control(null, [Validators.required, Validators.maxLength(256), Validators.minLength(2)]),
      dateOfBirth : this.fb.control(null, [Validators.required]),
      placeOfBirth : this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(256)]),
      sex : this.fb.control(null, [Validators.required]),
      firstname : this.fb.control( null, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]),
      email : this.fb.control(null, [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(256)]),
      cin : this.fb.control(null, [Validators.required, Validators.minLength(4), Validators.maxLength(64)])
    });
  }

  private addDefaultValueToCreateCustomerFormGroup() :void{
    this.updateCustomerFormGroup.patchValue({
      lastname: this.customer.lastname,
      nationality: this.customer.nationality,
      dateOfBirth: this.customer.dateOfBirth,
      placeOfBirth: this.customer.placeOfBirth,
      sex: this.customer.sex,
      firstname: this.customer.firstname,
      email: this.customer.email,
      cin: this.customer.cin
    });
  }

  handleUpdateCustomer():void {
    if(confirm("Êtes-vous sûr de vouloir mettre à jour le client ?")){
      let request: CustomerRequest = this.updateCustomerFormGroup.value;
      this.customerService.update(this.customerId, request).subscribe({
        next: data => {
          alert("Modification enregistré avec succès");
          this.router.navigate(['/customer-detail', data.id]).then();
        },
        error: err => {
          console.log(err);
          this.errorFlag = true;
          this.errorHandlerService.handleError(err);
        }
      });
    }
  }
}
