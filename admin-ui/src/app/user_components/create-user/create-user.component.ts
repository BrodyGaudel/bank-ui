import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../services/users/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserRequest} from "../../dtos/user.request";
import {UserResponse} from "../../dtos/user.response";
import {ErrorHandlerService} from "../../exception/error-handler.service";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {

  errorFlag: boolean = false;
  errorMessage!: string;
  errorCode!: number;
  errorValidation!: [];
  createUserFormGroup!: FormGroup;

  constructor(private authService: AuthService,
              private errorHandlerService: ErrorHandlerService,
              private router: Router,
              private userService: UserService,
              private fb: FormBuilder,) {

  }

  ngOnInit(): void {
    this.initCreateUserFormGroup();
  }

  handleSubmit(): void {
    let request: UserRequest = this.createUserFormGroup.value;
    this.userService.create(request).subscribe({
      next: result => {
        this.handleCreationSuccess(result);
      },
      error: err => {
        this.handleCreationFailure(err);
      }
    });
  }

  initCreateUserFormGroup(): void {
    this.createUserFormGroup = this.fb.group({
      firstname: this.fb.control(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(256)
      ]),

      lastname: this.fb.control(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(256)
      ]),

      dateOfBirth: this.fb.control(null, [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/) // Validation d'une date au format 'YYYY-MM-DD'
      ]),

      placeOfBirth: this.fb.control(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(256)
      ]),

      gender: this.fb.control(null, [
        Validators.required,
        Validators.pattern(/^([MF])$/) // Valide 'Male', 'Female'
      ]),

      nationality: this.fb.control(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(256)
      ]),

      cin: this.fb.control(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(256)
      ]),

      email: this.fb.control(null, [
        Validators.required,
        Validators.email,
        Validators.maxLength(256)
      ]),

      username: this.fb.control(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(256)
      ]),

      password: this.fb.control(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(256),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/) // Doit contenir au moins une lettre et un chiffre
      ])
    });

  }

  private handleCreationSuccess(result: UserResponse): void {
    this.router.navigate(['/user', result.id]).then();
  }

  private handleCreationFailure(err: any) {
    console.log(err);
    this.errorHandlerService.handleError(err);
    this.subscribeToErrors();
    this.errorFlag = true;
  }

  private subscribeToErrors(): void {
    this.errorHandlerService.error$.subscribe(error => {
      if (error) {
        this.errorMessage = error.message;
        this.errorCode = error.code;
        this.errorValidation = error.validationErrors;
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
    });
  }
}
