import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {PasswordRequest} from "../../dtos/password.request";
import {ErrorHandlerService} from "../../exception/error-handler.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {

  passwordFormGroup!: FormGroup;
  errorFlag: boolean = false;
  errorMessage: string = 'Something went wrong';
  errorDescription: string = '';
  errorCode: number = 0;
  validationErrors: string[] = [];

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private errorHandlerService: ErrorHandlerService,) {
  }

  ngOnInit(): void {
    this.passwordFormGroup = this.fb.group({
      password: this.fb.control(null, [Validators.required, Validators.minLength(8), Validators.maxLength(256)]),
      confirmPassword: this.fb.control(null, [Validators.required, Validators.minLength(8), Validators.maxLength(256)]),
    });
  }

  handleLogin(): void {
    this.errorFlag = false;
    const request: PasswordRequest = this.passwordFormGroup.value;
    if(request.password === request.confirmPassword || request.password == request.confirmPassword) {
      this.authService.changePassword(request).subscribe({
        next: result => {
          this.router.navigate(['/users']).then();
        },
        error: err => {
          console.log(err);
          this.errorFlag = true;

        }
      });
    }else{
      this.errorFlag = true;
      this.errorMessage = 'Password do not match';
    }

  }

  private handleError() :void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorMessage = error.message;
        this.errorCode = error.code;
        this.errorDescription = error.description;
        this.validationErrors = error.validationErrors;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }

}
