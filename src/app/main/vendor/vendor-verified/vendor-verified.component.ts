import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { MOCK_VENDORS } from '../vendor.mock';

@Component({
  selector: 'app-vendor-verified',
  templateUrl: './vendor-verified.component.html',
  styleUrls: ['./vendor-verified.component.scss']
})
export class VendorVerifiedComponent implements OnInit {

  verifiedVendorList = [];
  searchTerm = '';

  constructor(
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authService.headerText.next({
      headerStrong: 'Verified Vendors List'
    });
    this.verifiedVendorList = MOCK_VENDORS.filter(vendor => vendor.status_name === 'Verified');
  }

  get filteredVendors() {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return this.verifiedVendorList;
    }

    return this.verifiedVendorList.filter(vendor => {
      const searchableText = `${vendor.first_name} ${vendor.last_name} ${vendor.email} ${vendor.phone_number}`;
      return searchableText.toLowerCase().indexOf(query) !== -1;
    });
  }

}
