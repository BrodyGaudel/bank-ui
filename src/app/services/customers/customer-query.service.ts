import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomerResponseModel} from "../../models/customer.response.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerQueryService {

  private host: string = 'http://localhost:8787/bank/queries/customers';

  constructor(private http: HttpClient) { }

  public findById(id: string): Observable<CustomerResponseModel>{
    return this.http.get<CustomerResponseModel>(this.host + '/get/' +id);
  }

  public findAll(): Observable<Array<CustomerResponseModel>>{
    return this.http.get<Array<CustomerResponseModel>>(this.host + '/list')
  }

  public search(keyword: string, page: number, size: number): Observable<Array<CustomerResponseModel>>{
    return this.http.get<Array<CustomerResponseModel>>(this.host + '/search?keyword=' + keyword + '&page=' +page + '&size=' + size);
  }
}
