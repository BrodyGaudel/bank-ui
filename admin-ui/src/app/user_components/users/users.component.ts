import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {UserService} from "../../services/users/user.service";
import {Observable} from "rxjs";
import {UserResponse} from "../../dtos/user.response";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  searchFormGroup!: FormGroup;
  usersObservable!: Observable<Array<UserResponse>>;
  page: number = 0;
  size: number = 9;
  keyword: string = "";

  constructor(private authService: AuthService, private userService: UserService,
              private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('', [Validators.minLength(1), Validators.maxLength(256)]),
    });

    //Load the list of default users
    this.usersObservable = this.searchUser(this.keyword, this.page, this.size);

    //Listen to changes in the form to launch the search automatically (optional)
    this.searchFormGroup.get('keyword')?.valueChanges.subscribe(value => {
      this.keyword = value;
      this.page = 0; //Reset to first page when searching
      this.usersObservable = this.searchUser(this.keyword, this.page, this.size);
    });
  }

  searchUser(keyword: string, p: number, s: number): Observable<Array<UserResponse>> {
    return this.userService.search(keyword, p, s).pipe();
  }

  //Method called when the search form is submitted
  onSearch(): void {
    this.keyword = this.searchFormGroup.value.keyword;
    this.page = 0; //Reset to first page when searching
    this.usersObservable = this.searchUser(this.keyword, this.page, this.size);
  }

  //Method for managing page changes (to be called from the pagination in the template)
  onPageChange(page: number): void {
    this.page = page;
    this.usersObservable = this.searchUser(this.keyword, this.page, this.size);
  }


  gotoNextPage(page: number, length: number): void {
    if(length>=this.size){
      this.onPageChange(page);
    }else {
      console.log("No more data available.");
    }
  }

  gotoPreviousPage(page: number): void {
    if(page>=0){
      this.onPageChange(page);
    }else {
      console.log("No more data available.");
    }
  }

  gotoShowUserComponent(id: number): void {
    this.router.navigate(["user",id]).then();
  }
}
