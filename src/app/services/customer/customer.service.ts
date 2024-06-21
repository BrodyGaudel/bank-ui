import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";
import {CustomerResponse} from "../../dtos/customer/custmer.response";
import {CustomerPageResponse} from "../../dtos/customer/customer-page.response";
import {CustomerRequest} from "../../dtos/customer/customer.request";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private host: string = 'http://localhost:8888/CUSTOMER-SERVICE/bank/customers';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public findById(id: string): Observable<CustomerResponse> {
    const url:string = `${this.host}/get/${id}`;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.get<CustomerResponse>(url, {headers: headers});
  }

  public search(keyword: string, page: number, size: number): Observable<CustomerPageResponse> {
    const url:string = this.host + '/search?keyword='+keyword+'&page='+page + '&size='+size;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.get<CustomerPageResponse>(url, {headers: headers});
  }

  public create(request: CustomerRequest): Observable<CustomerResponse> {
    const url:string = `${this.host}/create`;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.post<CustomerResponse>(url, request, {headers: headers});
  }

  public update(id: string, request: CustomerRequest): Observable<CustomerResponse> {
    const url:string = `${this.host}/update/${id}`;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.put<CustomerResponse>(url, request, {headers: headers});
  }

  public delete(id: string): Observable<void> {
    const url:string = `${this.host}/delete/${id}`;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.delete<void>(url, {headers: headers});
  }
}
