import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CustomerQueryService} from "../../../services/customers/customer-query.service";
import {AccountQueryService} from "../../../services/accounts/account-query.service";
import {AccountCommandService} from "../../../services/accounts/account-command.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountResponseModel} from "../../../models/account.response.model";
import {OperationResponseModel} from "../../../models/operation.response.model";
import {CreditRequestModel} from "../../../models/credit.request.model";
import {DebitRequestModel} from "../../../models/debit.request.model";
import {TransferRequestModel} from "../../../models/transfer.request.model";
import {TransferResponseModel} from "../../../models/transfer.response.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-show-account',
  templateUrl: './show-account.component.html',
  styleUrl: './show-account.component.css'
})
export class ShowAccountComponent implements OnInit{

  accountResponseModelObservable!: Observable<AccountResponseModel>;
  operationResponseModelsObservable!: Observable<Array<OperationResponseModel>>;
  accountFormGroup!: FormGroup;
  operationFromGroup!: FormGroup;
  currentPage: number =0;
  pageSize: number = 3;
  accountId!: string;
  isTransfer: boolean = false;

  constructor(private fb: FormBuilder,
              private customerQueryService: CustomerQueryService,
              private accountQueryService: AccountQueryService,
              private accountCommandService: AccountCommandService,
              private router: Router) {

  }


  ngOnInit(): void {
    this.accountFormGroup=this.fb.group({accountId : this.fb.control('')});
    this.operationFromGroup=this.fb.group({
      operationType : this.fb.control(null),
      amount : this.fb.control(0, [Validators.required]),
      description : this.fb.control(null, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]),
      destination : this.fb.control(null)
    });
  }

  handleSearchAccount(): void{
    this.accountId = this.accountFormGroup.value.accountId;
    this.getAccountById(this.accountId);
    this.getAllOperationsByAccountId(this.accountId, this.currentPage, this.pageSize);
  }

  private getAccountById(accountId: string): void{
    this.accountResponseModelObservable = this.accountQueryService.findAccountById(accountId).pipe(
      catchError( (err) => throwError(() => new Error(err.message)))
    );
  }

  private getAllOperationsByAccountId(accountId: string, page: number, size: number): void{
    this.operationResponseModelsObservable = this.accountQueryService.findAllOperationsByAccountId(accountId, page, size).pipe(
      catchError( (err) => throwError(() => new Error(err.message)))
    );
  }

  gotoNextPage(): void {
    this.currentPage = this.currentPage +1;
    this.getAllOperationsByAccountId(this.accountId, this.currentPage, this.pageSize);
  }

  gotoPreviousPage(): void {
    if (this.currentPage >=1){
      this.currentPage = this.currentPage -1;
      this.getAllOperationsByAccountId(this.accountId, this.currentPage, this.pageSize);
    }
  }

  handleSaveOperation(): void {
    let operationType = this.operationFromGroup.value.operationType;
    if(operationType == 'CREDIT'){
      this.credit();
    }else if(operationType == 'DEBIT'){
      this.debit();
    }else if(operationType == 'TRANSFER'){
      this.transfer();
    }
  }

  private credit(): void{
    let model: CreditRequestModel = new CreditRequestModel();
    model.id = this.accountFormGroup.value.accountId;
    model.amount = this.operationFromGroup.value.amount;
    model.description = this.operationFromGroup.value.description;
    this.accountCommandService.credit(model).subscribe({
      next : (data: string) : void =>{
        alert("Account credited successfully with: "+data);
        this.operationFromGroup.reset();
        this.handleSearchAccount();
      },
      error : (err) :void =>{
        alert(err);
        console.log(err);
      }
    });
  }

  private debit(): void{
    let model: DebitRequestModel = new DebitRequestModel();
    model.amount = this.operationFromGroup.value.amount;
    model.description = this.operationFromGroup.value.description;
    model.id = this.accountFormGroup.value.accountId;
    this.accountCommandService.debit(model).subscribe({
      next : (data: string) : void =>{
        alert("Account debited successfully with: "+data);
        this.operationFromGroup.reset();
        this.handleSearchAccount();
      },
      error : (err) :void =>{
        alert(err);
        console.log(err);
      }
    });
  }

  private transfer(): void{
    let model: TransferRequestModel = new TransferRequestModel();
    model.idFrom = this.accountFormGroup.value.accountId;
    model.amount = this.operationFromGroup.value.amount;
    model.description = this.operationFromGroup.value.description;
    model.idTo = this.operationFromGroup.value.destination;
    this.accountCommandService.transfer(model).subscribe({
      next : (data: any) : void =>{
        alert("Transfer successfully done: ");
        this.operationFromGroup.reset();
        this.handleSearchAccount();
      },
      error : (err) :void =>{
        alert(err);
        console.log(err);
      }
    });
  }


  setTransfer(): void {
    this.isTransfer = true;
  }

  unSetTransfer(): void {
    this.isTransfer = false;
  }

  showOperation(operation: OperationResponseModel): void {
    if (!operation) {
      alert("Operation not found. Please contact the administrator; there may be a serious problem!");
    } else {
      const formattedDate: string = new Date(operation.dateTime).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
      });

      const formattedAmount: string = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(operation.amount);

      const message: string = `
            OPERATION
            Date : ${formattedDate}
            Type : ${operation.type}
            Amount : ${formattedAmount}
            Description : ${operation.description}
        `;
      alert(message);
    }
  }


}

