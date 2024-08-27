import {Component, OnInit} from '@angular/core';
import {Observable, of, tap} from "rxjs";
import {UserResponse} from "../../dtos/user.response";
import {AuthService} from "../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/users/user.service";
import {ErrorHandlerService} from "../../exception/error-handler.service";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  userObservable!: Observable<UserResponse>;
  userId!: number;
  errorMessage: string = '';
  errorCode: number = 0;
  errorFlag: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private errorHandlerService: ErrorHandlerService) {

  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params['id'];
    this.fetchUserDetails();
    this.subscribeToErrors();
  }

  private fetchUserDetails(): void {
    this.userObservable = this.userService.getById(this.userId).pipe(
      tap(response => {
        this.errorFlag = false;
        console.log(response.id);
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error);
        return of(new UserResponse()); // Return a safe value or handle the error appropriately
      })
    )
  }

  private subscribeToErrors(): void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorMessage = error.message;
        this.errorCode = error.code;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }

  enabledOrDisabled(id: number) :void {
    this.userObservable = this.userService.updateStatus(id).pipe(
      tap(response => {
        this.errorFlag = false;
        console.log(response.id);
      }),
      catchError(error => {
        this.errorHandlerService.handleError(error);
        return of(new UserResponse());
      })
    )
  }

  textEnabled(enabled: boolean) :"YES"|"NO" {
    if(enabled){
      return "YES"
    }
    return "NO";
  }

  styleEnabled(enabled: boolean) :"text-success"|"text-danger" {
    if(enabled){
      return "text-success";
    }
    return "text-danger";
  }
}
