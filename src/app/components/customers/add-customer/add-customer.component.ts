import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CustomerCommandService} from "../../../services/customers/customer-command.service";
import {AccountCommandService} from "../../../services/accounts/account-command.service";
import {CustomerRequestModel} from "../../../models/customer.request.model";
import {AccountRequestModel} from "../../../models/account.request.model";

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent implements OnInit{

  newCustomerFormGroup!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
              private customerService: CustomerCommandService,
              private accountService: AccountCommandService) { }


  ngOnInit(): void {
    this.newCustomerFormGroup = this.fb.group( {
      name : this.fb.control(null, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]),
      firstname : this.fb.control( null, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]),
      nationality : this.fb.control(null, [Validators.required, Validators.maxLength(256), Validators.minLength(2)]),
      dateOfBirth : this.fb.control(null, [Validators.required]),
      placeOfBirth : this.fb.control(null, [Validators.required, Validators.minLength(1), Validators.maxLength(256)]),
      sex : this.fb.control(null, [Validators.required]),
      cin : this.fb.control(null, [Validators.required, Validators.minLength(4), Validators.maxLength(64)])
    });
  }

  handleSaveCustomer(): void{
    let customerRequestModel: CustomerRequestModel = this.initCustomerRequestModel()
    this.createCustomer(customerRequestModel);
  }

  private initCustomerRequestModel(): CustomerRequestModel{
    let customerRequestModel: CustomerRequestModel = new CustomerRequestModel();
    customerRequestModel.name = this.newCustomerFormGroup.value.name;
    customerRequestModel.firstname = this.newCustomerFormGroup.value.firstname;
    customerRequestModel.nationality = this.newCustomerFormGroup.value.nationality;
    customerRequestModel.sex = this.newCustomerFormGroup.value.sex;
    customerRequestModel.nic = this.newCustomerFormGroup.value.cin;
    customerRequestModel.dateOfBirth = this.newCustomerFormGroup.value.dateOfBirth;
    customerRequestModel.placeOfBirth = this.newCustomerFormGroup.value.placeOfBirth;
    return customerRequestModel;
  }

  private createCustomer(model: CustomerRequestModel): void{
    this.customerService.save(model).subscribe({
      next : data  => {
        alert("Customer successfully saved");
        this.createAccount(data);
        this.router.navigate(["show-customer", data]).then();
      },
      error : err => {
        console.log(err)
        alert("Customer not saved due to : "+err.message);
      }
    });
  }

  private createAccount(customerId: string): void{
    let accountRequestModel: AccountRequestModel = new AccountRequestModel();
    accountRequestModel.customerId = customerId;
    accountRequestModel.status = "CREATED";

    this.accountService.save(accountRequestModel).subscribe({
      next : data  => {
        alert("Account successfully saved "+data);
      },
      error : err => {
        console.log(err)
        alert("Account not saved due to : "+err.message);
      }
    })
  }

}
