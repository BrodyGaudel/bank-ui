import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {AuthenticationRequest} from "../../../dtos/security/authentication.request";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginFormGroup!: FormGroup;
  errorFlag: boolean = false;
  errorMessage: string = 'Nom d\'utilisateur ou mot de passe incorrecte.';

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      usernameOrEmail: this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(256)]),
      password: this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(256)]),
    });
  }

  handleLogin(): void {
    this.errorFlag = false;
    const request: AuthenticationRequest = this.loginFormGroup.value;
    this.authService.login(request).subscribe({
      next: result => {
        this.authService.saveToken(result.jwt);
        this.router.navigate(['/customer-create']).then();
      },
      error: err => {
        console.log(err);
        this.errorFlag = true;
      }
    });
  }


}
