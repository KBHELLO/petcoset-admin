import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { MOCK_VENDORS } from '../../vendor/vendor.mock';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  vendorCount = 0;
  verifiedVendorCount = 0;

  constructor(
    private _authService: AuthenticationService,
    private route: Router
  ) { }

  ngOnInit() {
    this._authService.headerText.next({
      headerStrong: 'Dashboard'
    });
    this.getVendorCounts();
  }

  getVendorCounts() {
    this.vendorCount = MOCK_VENDORS.filter(vendor => vendor.status_name === 'Pending').length;
    this.verifiedVendorCount = MOCK_VENDORS.filter(vendor => vendor.status_name === 'Verified').length;
  }

  getpath(value) {
    if (value === 'vendor')
      this.route.navigateByUrl('admin/vendor/vendor-list')
    if (value === 'vendor-verified')
      this.route.navigateByUrl('admin/vendor/vendor-verified-list');
    if(value === 'customer') 
      this.route.navigateByUrl('admin/customer/customer-list/pending');
    if(value === 'customer-approve') {
      this.route.navigateByUrl('admin/customer/customer-list/approve');
    }
  }

}
