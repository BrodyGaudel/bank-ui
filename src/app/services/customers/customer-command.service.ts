import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CustomerRequestModel} from "../../models/customer.request.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomerCommandService {

  private host: string = 'http://localhost:8787/bank/commands/customers';

  constructor(private http: HttpClient) { }

  public save(model: CustomerRequestModel): Observable<string>{
    return this.http.post<string>(this.host + '/create', model, { responseType: 'text' as 'json' });
  }

  public update(id: string, model: CustomerRequestModel): Observable<string>{
    return this.http.put<string>(this.host + '/update/' + id, model, { responseType: 'text' as 'json' });
  }

  public delete(id: string) {
    return this.http.delete(this.host + '/delete/' + id);
  }
}
