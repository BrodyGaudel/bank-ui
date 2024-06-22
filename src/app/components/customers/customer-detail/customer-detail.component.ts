import {Component, OnInit} from '@angular/core';
import {Observable, of, tap} from "rxjs";
import {CustomerResponse} from "../../../dtos/customer/custmer.response";
import {CustomerService} from "../../../services/customer/customer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorHandlerService} from "../../../services/handler/error-handler.service";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css'
})
export class CustomerDetailComponent implements OnInit {

  customerObservable!: Observable<CustomerResponse | null>;
  customerId!: string;
  errorMessage: string = '';
  errorDescription: string = '';
  errorCode: number = 0;
  validationErrors: Set<string> = new Set<string>();
  errors: Map<string, string> = new Map<string, string>();
  errorFlag: boolean = false;

  constructor(private customerService: CustomerService,
              private activatedRoute: ActivatedRoute,
              private errorHandlerService: ErrorHandlerService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.customerId = this.activatedRoute.snapshot.params['id'];
    this.fetchCustomerDetails();
    this.subscribeToErrors();
  }

  private fetchCustomerDetails(): void {
    this.customerObservable = this.customerService.findById(this.customerId).pipe(
      tap(response => {
        this.errorFlag = false;
        console.log(response.id);
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error);
        return of(null); // Return a safe value or handle the error appropriately
      })
    );
  }

  private subscribeToErrors(): void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorMessage = error.message;
        this.errorCode = error.code;
        this.validationErrors = error.validationErrors;
        this.errors = error.errors;
        this.errorDescription = error.description;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }

  showSex(sex: string): string {
    if(sex == "M"){
      return "Masculin";
    }
    return "Feminin";
  }

  deleteCustomer(id: string): void {
    if(confirm("Êtes-vous sûr de vouloir supprimer ce client ?")){
      this.customerService.delete(id).subscribe({
        next: result => {
          console.log(result);
          alert("Ce client a été supprimé avec succès.");
          this.router.navigate(["customer-create"]).then();
        },
        error: err => {
          console.log(err);
          alert("Impossible de supprimer ce client");
        }
      })
    }
  }

  updateCustomer(id: string): void {
    this.router.navigate(["customer-update", id]).then();
  }

  gotoAccountDetailComponent(id: string) {
    this.router.navigate(['account-detail', id]).then();
  }
}
