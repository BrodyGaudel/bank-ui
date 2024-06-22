import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../services/account/account.service";
import {Observable, of, tap} from "rxjs";
import {AccountResponse} from "../../../dtos/account/account.response";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorHandlerService} from "../../../services/handler/error-handler.service";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent implements OnInit {

  accountObservable!: Observable<AccountResponse | null>;
  accountId!: string;
  errorMessage: string = '';
  errorDescription: string = '';
  errorCode: number = 0;
  validationErrors: Set<string> = new Set<string>();
  errors: Map<string, string> = new Map<string, string>();
  errorFlag: boolean = false;

  constructor(private accountService: AccountService,
              private activatedRoute: ActivatedRoute,
              private errorHandlerService: ErrorHandlerService,
              private router: Router) { }


  ngOnInit(): void {
    this.accountId = this.activatedRoute.snapshot.params['id'];
    this.fetchAccountDetails();
    this.subscribeToErrors();
  }

  private fetchAccountDetails(): void {
    this.accountObservable = this.accountService.findAccountByCustomerId(this.accountId).pipe(
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
        this.errorCode = error.code;
        this.errorMessage = error.message;
        this.errors = error.errors;
        this.errorDescription = error.description;
        this.validationErrors = error.validationErrors;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }

  gotoAccountDetailComponent(account: AccountResponse): void {
    this.router.navigate(['/customer-detail', account.customerId]).then();
  }

  translateStatus(status: string): string {
    if (status === 'ACTIVATED' || status == 'ACTIVATED') {
      return 'Activé';
    }
    return "Suspendu";
  }

  gotoOperationListComponent(account: AccountResponse): void {
    this.router.navigate(['/operation-list', account.id]).then();
  }
}
