import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AccountRequestModel} from "../../models/account.request.model";
import {Observable} from "rxjs";
import {CreditRequestModel} from "../../models/credit.request.model";
import {DebitRequestModel} from "../../models/debit.request.model";
import {TransferRequestModel} from "../../models/transfer.request.model";
import {StatusRequestModel} from "../../models/status.request.model";
import {TransferResponseModel} from "../../models/transfer.response.model";

@Injectable({
  providedIn: 'root'
})
export class AccountCommandService {

  private host: string = 'http://localhost:8787/bank/commands/accounts';

  constructor(private http: HttpClient) { }

  public save(model: AccountRequestModel): Observable<string> {
    return this.http.post<string>(this.host + '/create', model, { responseType: 'text' as 'json' });
  }

  public updateStatus(model: StatusRequestModel): Observable<string> {
    return this.http.post<string>(this.host + '/update-status', model, { responseType: 'text' as 'json' });
  }

  public delete(id: string): Observable<string> {
    return this.http.delete<string>(this.host + '/delete/'+id);
  }

  public credit(model: CreditRequestModel): Observable<string>{
    return this.http.post<string>(this.host + '/credit', model, { responseType: 'text' as 'json' });
  }

  public debit(model: DebitRequestModel): Observable<string>{
    return this.http.post<string>(this.host + '/debit', model, { responseType: 'text' as 'json' });
  }


  public transfer(model: TransferRequestModel): Observable<Array<TransferResponseModel>> {
    return this.http.post<Array<TransferResponseModel>>(this.host+ '/transfer', model);
  }
}
