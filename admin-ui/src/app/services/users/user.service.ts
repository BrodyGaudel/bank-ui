import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserResponse} from "../../dtos/user.response";
import {UserRequest} from "../../dtos/user.request";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host: string = "http://localhost:8888/USER-SERVICE/bank/users"

  constructor(private http: HttpClient, private authService: AuthService) { }

  public search(keyword: string, page: number, size: number): Observable<Array<UserResponse>> {
    const url: string = this.host + "/search?keyword=" +keyword + "&page=" + page + "&size=" + size;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.get<Array<UserResponse>>(url,{headers: headers})
  }

  public getById(id: number): Observable<UserResponse>{
    const url: string = this.host + "/get/"+id;
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.get<UserResponse>(url,{headers: headers})
  }

  public updateStatus(userId: number): Observable<UserResponse>{
    const url: string = this.host + '/enable-disable';
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    const request : {userId: number} = {userId};
    return this.http.post<UserResponse>(url, request,{headers: headers})
  }


  create(request: UserRequest): Observable<UserResponse> {
    const url:string = this.host + '/create';
    const headers: HttpHeaders = this.authService.getHttpHeaders();
    return this.http.post<UserResponse>(url, request, {headers: headers})
  }
}
