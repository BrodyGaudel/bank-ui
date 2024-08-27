import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {AuthenticationRequest} from "../../dtos/authentication.request";
import {AuthenticationResponse} from "../../dtos/authentication.response";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginFormGroup!: FormGroup;
  errorFlag: boolean = false;
  errorMessage: string = 'Password or username is incorrect.';

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      username: this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(256)]),
      password: this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(256)]),
    });
  }

  handleLogin(): void {
    this.errorFlag = false;
    const request: AuthenticationRequest = this.loginFormGroup.value;
    this.authService.login(request).subscribe({
      next: result => {
        this.handleLoginSuccess(result);
      },
      error: err => {
        this.handleLoginFailure(err);
      }
    });
  }

  handleLoginSuccess(response: AuthenticationResponse): void {
    this.authService.saveToken(response.jwt);
    console.log(response.jwt);
    if(response.passwordNeedToBeModified){
      this.router.navigate(['/update-password']).then();
    }else{
      this.router.navigate(['/users']).then();
    }
  }

  handleLoginFailure(err: Error): void {
    console.log(err);
    this.errorFlag = true;
  }



}
