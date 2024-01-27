import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OperationResponseModel} from "../../models/operation.response.model";
import {AccountResponseModel} from "../../models/account.response.model";

@Injectable({
  providedIn: 'root'
})
export class AccountQueryService {

  private host: string = 'http://localhost:8787/bank/queries/accounts';

  constructor(private http: HttpClient) { }

  public findAccountById(accountId: string): Observable<AccountResponseModel>{
    return this.http.get<AccountResponseModel>(this.host + '/get-account-by-id/' + accountId);
  }

  public findAccountByCustomerId(customerId: string): Observable<AccountResponseModel>{
    return this.http.get<AccountResponseModel>(this.host + '/get-account-by-customer-id/' + customerId);
  }

  public findAllAccounts(): Observable<Array<AccountResponseModel>>{
    return this.http.get<Array<AccountResponseModel>>(this.host + '/get-all-accounts');
  }

  public findOperationById(id: string): Observable<OperationResponseModel>{
    return this.http.get<OperationResponseModel>(this.host + '/get-operation-by-id/' + id);
  }

  public findAllOperationsByAccountId(accountId: string, page: number, size: number): Observable<Array<OperationResponseModel>>{
    return this.http.get<Array<OperationResponseModel>>(this.host + '/get-operation-by-account-id/' + accountId +'?page=' + page + "&size=" + size);
  }

}
