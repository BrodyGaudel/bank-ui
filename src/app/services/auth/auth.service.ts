import { Injectable } from '@angular/core';
import {JwtService} from "../jwt/jwt.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {AuthenticationRequest} from "../../dtos/security/authentication.request";
import {AuthenticationResponse} from "../../dtos/security/authentication.response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private host:string = "http://localhost:8888";

  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private rolesSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private router: Router, private http: HttpClient, private jwtService: JwtService) {
    this.loadToken();
  }

  public login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    const url:string = this.host + '/USER-SERVICE/bank/authentication/login'
    return this.http.post<AuthenticationResponse>(url, request);
  }

  public logout(): void {
    localStorage.removeItem('jwt');
    this.updateAuthenticationState(null);
    this.router.navigate(['/authentication']).then();
  }

  public getHttpHeaders(): HttpHeaders {
    this.loadToken();
    let token: string | null = this.tokenSubject.value;
    if(token == null){
      let authorization: string = 'Bearer ';
      return new HttpHeaders({"Authorization": authorization});
    }else{
      let authorization: string = 'Bearer ' + token;
      return new HttpHeaders({"Authorization": authorization});
    }
  }

  public isAdmin(): boolean {
    return this.rolesSubject.value.includes('ADMIN');
  }

  public isSuperAdmin(): boolean {
    return this.rolesSubject.value.includes('SUPER_ADMIN');
  }

  public isModerator(): boolean {
    return this.rolesSubject.value.includes('MODERATOR');
  }


  public getLoggedUser(): string | undefined {
    const token = this.tokenSubject.value;
    if (token) {
      const decodedToken = this.jwtService.decodeToken(token);
      return decodedToken.sub;
    }
    return undefined;
  }

  public getRoles(): Observable<string[]> {
    return this.rolesSubject.asObservable();
  }

  public getIsLoggedIn(): Observable<boolean> {
    this.loadToken();
    return this.isLoggedInSubject.asObservable();
  }


  public saveToken(jwt: string): void {
    localStorage.setItem('jwt', jwt);
    this.updateAuthenticationState(jwt);
  }

  public isTokenExpired(): boolean {
    const token = this.tokenSubject.value;
    return token ? this.jwtService.isTokenExpired(token) : true;
  }

  public getToken(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  private loadToken(): void {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.updateAuthenticationState(token);
    }
  }

  private updateAuthenticationState(jwt: string | null): void {
    if (jwt) {
      this.tokenSubject.next(jwt);
      this.isLoggedInSubject.next(true);
      this.decodeJWT(jwt);
    } else {
      this.tokenSubject.next(null);
      this.isLoggedInSubject.next(false);
      this.rolesSubject.next([]);
    }
  }

  private decodeJWT(jwt: string): void {
    const decodedToken = this.jwtService.decodeToken(jwt);
    this.rolesSubject.next(decodedToken.roles);
  }




}
