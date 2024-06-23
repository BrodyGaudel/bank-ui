import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../services/account/account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorHandlerService} from "../../../services/handler/error-handler.service";
import {Observable, of, tap} from "rxjs";
import {OperationResponse} from "../../../dtos/account/operation.response";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  styleUrl: './operation-list.component.css'
})
export class OperationListComponent implements OnInit {

  page: number = 0;
  size: number = 10;
  operationsObservable!: Observable<Array<OperationResponse> | null>;
  accountId!: string;
  errorMessage: string = '';
  errorDescription: string = '';
  errorCode: number = 0;
  validationErrors: Set<string> = new Set<string>();
  errors: Map<string, string> = new Map<string, string>();
  errorFlag: boolean = false;

  constructor(private accountService: AccountService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private errorHandlerService: ErrorHandlerService) {}

  ngOnInit(): void {
    this.accountId = this.activatedRoute.snapshot.params['id'];
    this.subscribeToErrors();
    this.fetchOperationDetails(this.accountId, this.page, this.size);
  }

  private subscribeToErrors(): void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorDescription = error.description;
        this.validationErrors = error.validationErrors;
        this.errorMessage = error.message;
        this.errorCode = error.code;
        this.errors = error.errors;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }

  private fetchOperationDetails(id: string, p: number, s:number): void {
    this.operationsObservable = this.accountService.findAllOperationsByAccountId(id,p,s).pipe(
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
      this.fetchOperationDetails(this.accountId, this.page, this.size);
    }else{
      alert("C'est la dernière page.");
    }
  }

  gotoPreviousPage(): void {
    if(this.page>0){
      this.page = this.page - 1;
      this.fetchOperationDetails(this.accountId, this.page, this.size);
    }else{
      alert("c'est la prémière page");
    }
  }

  gotoOperationDetailComponent(operation: OperationResponse): void {
    this.router.navigate(["operation-detail", operation.id]).then();
  }


  gotoAccountDetailComponent(operations: Array<OperationResponse>) {
    let operation: OperationResponse = operations[0];
    this.router.navigate(["operation-detail", operation.accountId]).then();
  }
}
