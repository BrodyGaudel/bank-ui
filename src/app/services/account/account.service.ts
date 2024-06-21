import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {CreateAccountRequest} from "../../dtos/account/create-account.request";
import {Observable} from "rxjs";
import {CreditAccountRequest} from "../../dtos/account/credit-account.request";
import {DebitAccountRequest} from "../../dtos/account/debit-account.request";
import {UpdateAccountRequest} from "../../dtos/account/update-account.request";
import {AccountResponse} from "../../dtos/account/account.response";
import {OperationResponse} from "../../dtos/account/operation.response";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private commandHost: string = 'http://localhost:8888/ACCOUNT-SERVICE/bank/accounts/commands';
  private queryHost: string = 'http://localhost:8888/ACCOUNT-SERVICE/bank/accounts/queries'

  constructor(private http: HttpClient, private authService: AuthService) { }

  public create(request: CreateAccountRequest): Observable<string> {
    const url: string = this.commandHost + "/create"
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.post<string>(url, request, {headers: headers});
  }

  public credit(request: CreditAccountRequest): Observable<string> {
    const url: string = this.commandHost + "/credit"
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.post<string>(url, request, {headers: headers});
  }

  public debit(request: DebitAccountRequest): Observable<string> {
    const url: string = this.commandHost + "/debit"
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.post<string>(url, request, {headers: headers});
  }

  public update(request: UpdateAccountRequest): Observable<string> {
    const url: string = this.commandHost + "/update"
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.put<string>(url, request, {headers: headers});
  }

  public findAccountById(id: string): Observable<AccountResponse> {
    const url: string = this.queryHost + '/get-account/' + id;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.get<AccountResponse>(url, {headers: headers});
  }

  public findAccountByCustomerId(customerId: string): Observable<AccountResponse> {
    const url: string = this.queryHost + '/getaccountbycustomer/' + customerId;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.get<AccountResponse>(url, {headers: headers});
  }

  public findAllOperationsByAccountId(accountId: string, page: number, size: number): Observable<Array<AccountResponse>> {
    const url: string = this.queryHost + '/get-all-operations?accountId=' + accountId + '&page=' + page + '&size=' + size;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.get<Array<AccountResponse>>(url, {headers: headers});
  }

  public findOperationById(operationId: string): Observable<OperationResponse> {
    const url: string = this.queryHost + '/get-operation/' + operationId;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.get<OperationResponse>(url, {headers: headers});
  }
}
