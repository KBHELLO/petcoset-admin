import { AuthenticationService } from './../../authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RequiredValidator } from 'src/app/core/validator/required.validator';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  parentForm: FormGroup;
  isLoginError = false;
  isSubmitting = false;
  showPassword = false;
  loginErrorMessage = 'Invalid username or password.';

  constructor(
    private _formBuilder: FormBuilder,
    private route: Router,
    private spinner: NgxSpinnerService,
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.parentForm = this._formBuilder.group({
      email: ['', Validators.compose([RequiredValidator('Email id is required')])],
      password: ['', Validators.compose([RequiredValidator('Password is required')])]
    });
  }

  loginSubmit() {
    this.isLoginError = false;
    if (this.parentForm.invalid) {
      this.markFormGroupTouched(this.parentForm)
      return;
    }

    this.isSubmitting = true;
    this.spinner.show();
    const data = {...this.parentForm.value};
    data.email_id = data.email;
    data.password = btoa(data.password);
    delete data.email;

    this._authService.request('post', 'auth', data)
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.spinner.hide();
      }))
      .subscribe(response => {
        this.isLoginError = response.res.user_data.id === -1;
        if (this.isLoginError) {
          this.loginErrorMessage = 'Invalid username or password.';
          return;
        }

        this._authService.setToken(response.res.jw_token);
        localStorage.setItem('userDetails', JSON.stringify(response.res.user_data));
        this.route.navigateByUrl('admin/dashboard');
      }, () => {
        this.isLoginError = true;
        this.loginErrorMessage = 'Unable to sign in right now. Please try again.';
      });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
