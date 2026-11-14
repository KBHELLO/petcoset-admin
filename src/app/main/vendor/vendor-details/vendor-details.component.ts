import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { MOCK_VENDORS } from '../vendor.mock';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {

  parentForm: FormGroup;
  bookingId;
  vendorDetails: any = {};
  vendorBankDetails = [];
  isUpdateError = false;
  isUpdated;


  constructor(
    private _authService: AuthenticationService,
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.bookingId = this._activatedRoute.snapshot.params.id;
    this._authService.headerText.next({
      headerStrong: 'Vendor Details'
    });
    this.getvendorDetailsbyId();
    this.initParentForm();
  }

  getvendorDetailsbyId() {
    this.vendorDetails = MOCK_VENDORS.find(vendor => vendor.id === Number(this.bookingId)) || {};
  }

  initParentForm() {
    this.parentForm = this._formBuilder.group({
      payment_gateway_account_id: ['']
    })
  }

  updateVendor() {
    if (this.parentForm.invalid) {
      this.markFormGroupTouched(this.parentForm);
    } else {
      if (this.vendorDetails.account_number) {
        this.vendorDetails.payment_gateway_account_id =
          this.parentForm.value.payment_gateway_account_id;
        this.isUpdated = 'Account Updated Successfully';
      } else {
        this.isUpdateError = true;
      }
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getBackPath() {
    if(this.vendorDetails['status_name'] === 'Pending')
      return '/admin/vendor/vendor-list';
    if(this.vendorDetails['status_name'] ==='Verified')
      return '/admin/vendor/vendor-verified-list';
  }

}
