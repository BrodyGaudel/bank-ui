import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, of, tap} from "rxjs";
import {AccountResponse} from "../../../dtos/account/account.response";
import {AccountService} from "../../../services/account/account.service";
import {ErrorHandlerService} from "../../../services/handler/error-handler.service";
import {catchError} from "rxjs/operators";
import {CustomerService} from "../../../services/customer/customer.service";
import {CustomerResponse} from "../../../dtos/customer/custmer.response";
import {OperationResponse} from "../../../dtos/account/operation.response";
import {Router} from "@angular/router";
import {DebitAccountRequest} from "../../../dtos/account/debit-account.request";
import {CreditAccountRequest} from "../../../dtos/account/credit-account.request";
import {TransferRequest} from "../../../dtos/account/transfer.request";

@Component({
  selector: 'app-account-operation',
  templateUrl: './account-operation.component.html',
  styleUrl: './account-operation.component.css'
})
export class AccountOperationComponent implements OnInit{

  searchAccountFormGroup!: FormGroup;
  accountObservable!: Observable<AccountResponse | null>;
  customerObservable!: Observable<CustomerResponse | null>;
  operationsObservable!: Observable<Array<OperationResponse> | null>;
  accountId!: string;
  errorMessage: string = '';
  errorDescription: string = '';
  errorCode: number = 0;
  validationErrors: Set<string> = new Set<string>();
  errors: Map<string, string> = new Map<string, string>();
  errorFlag: boolean = false;
  page: number = 0;
  size: number = 3;
  operationFromGroup!: FormGroup;


  constructor(private accountService: AccountService,
              private customerService: CustomerService,
              private fb: FormBuilder,
              private errorHandlerService: ErrorHandlerService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.searchAccountFormGroup = this.fb.group({
      accountId: this.fb.control(null, [Validators.required, Validators.minLength(12), Validators.maxLength(16)])
    });
    this.initOperationFormGroup();
    this.subscribeToErrors();
  }

  private subscribeToErrors(): void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorDescription = error.description;
        this.errorCode = error.code;
        this.validationErrors = error.validationErrors;
        this.errorMessage = error.message;
        this.errors = error.errors;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }

  private initOperationFormGroup(): void {
    this.operationFromGroup=this.fb.group({
      type: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null)
    });

  }

  private fetchAccountDetails(id: string): void {
    this.accountObservable = this.accountService.findAccountById(id).pipe(
      tap(response => {
        this.errorFlag = false;
        this.fetchCustomerDetails(response.customerId);
        this.fetchAllOperationsDetails(response.id, this.page, this.size);
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error);
        return of(null); // Return a safe value or handle the error appropriately
      })
    );
  }

  handleSearchAccount(): void {
    this.accountId = this.searchAccountFormGroup.value.accountId;
    this.fetchAccountDetails(this.accountId);
  }

  private fetchCustomerDetails(customerId: string): void {
    this.customerObservable = this.customerService.findById(customerId).pipe(
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

  private fetchAllOperationsDetails(id: string, pageNumber: number, sizePage:number): void {
    this.operationsObservable = this.accountService.findAllOperationsByAccountId(id,pageNumber,sizePage).pipe(
      tap(response => {
        this.errorFlag = false;
        console.log(response.length);
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error);
        return of(null); // Return a safe value or handle the error appropriately
      })
    );
  }

  gotoNextPage(operations: OperationResponse[]): void {
    if(operations.length >= this.size){
      this.page = this.page + 1;
      this.fetchAllOperationsDetails(this.accountId, this.page, this.size);
    }else{
      alert("C'est la dernière page.");
    }
  }

  gotoPreviousPage(): void {
    if(this.page>0){
      this.page = this.page - 1;
      this.fetchAllOperationsDetails(this.accountId, this.page, this.size);
    }else{
      alert("c'est la prémière page");
    }
  }

  gotoOperationDetailComponent(operation: OperationResponse): void {
    this.router.navigate(["operation-detail", operation.id]).then();
  }

  handleAccountOperation(): void {
    let id :string = this.accountId;
    let operationType=this.operationFromGroup.value.type;
    let amount :number =this.operationFromGroup.value.amount;
    let description :string =this.operationFromGroup.value.description;
    let accountDestination :string =this.operationFromGroup.value.accountDestination;
    if(operationType=='DEBIT'){
      this.debitAccount(id,description, amount);
    }else if(operationType=='CREDIT'){
      this.creditAccount(id,description, amount);
    }else if(operationType=='TRANSFER'){
      this.transferAccount(id,description, amount, accountDestination);
    }
  }

  private debitAccount(id: string, description: string, amount: number): void {
    let request: DebitAccountRequest = new DebitAccountRequest();
    request.accountId = id;
    request.description = description;
    request.amount = amount;
    this.accountService.debit(request).subscribe({
      next : (data)=>{
        alert("Opération de type DEBIT effectuée avec succès!");
        this.operationFromGroup.reset();
        console.log(data);
        this.handleSearchAccount();
      },
      error : (err)=>{
        console.log(err);
        this.operationFromGroup.reset();
        this.errorHandlerService.handleError(err);
        this.handleSearchAccount();
      }
    });
  }

  private creditAccount(id: string, description: string, amount: number): void {
    let request: CreditAccountRequest = new CreditAccountRequest();
    request.description = description;
    request.accountId = id;
    request.amount = amount;
    this.accountService.credit(request).subscribe({
      next : (data)=>{
        alert("Opération de type CREDIT effectuée avec succès!");
        this.operationFromGroup.reset();
        console.log(data);
        this.handleSearchAccount();
      },
      error : (err)=>{
        console.log(err);
        this.operationFromGroup.reset();
        this.errorHandlerService.handleError(err);
        this.handleSearchAccount();
      }
    });
  }

  private transferAccount(id: string, description: string, amount: number, accountDestination: string) {
    let request: TransferRequest = new TransferRequest();
    request.accountIdFrom = id;
    request.accountIdTo = accountDestination;
    request.amount = amount;
    request.description = description;
    this.accountService.transfer(request).subscribe({
      next : (data)=>{
        alert("Opération de type TRANSFER effectuée avec succès!");
        this.operationFromGroup.reset();
        console.log(data)
        this.handleSearchAccount();
      },
      error : (err)=>{
        console.log(err);
        this.operationFromGroup.reset();
        this.errorHandlerService.handleError(err);
        this.handleSearchAccount();
      }
    });
  }

}
