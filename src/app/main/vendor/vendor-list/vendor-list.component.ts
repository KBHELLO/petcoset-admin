import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { MOCK_VENDORS } from '../vendor.mock';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  vendorList = [];
  searchTerm = '';

  constructor(
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authService.headerText.next({
      headerStrong: 'Pending Vendors List'
    });
    this.vendorList = MOCK_VENDORS.filter(vendor => vendor.status_name === 'Pending');
  }

  get filteredVendors() {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return this.vendorList;
    }

    return this.vendorList.filter(vendor => {
      const searchableText = `${vendor.first_name} ${vendor.last_name} ${vendor.email} ${vendor.phone_number}`;
      return searchableText.toLowerCase().indexOf(query) !== -1;
    });
  }

}
