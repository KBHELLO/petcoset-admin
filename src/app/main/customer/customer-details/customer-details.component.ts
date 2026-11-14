import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/authentication.service';
import { MOCK_BOOKINGS } from '../customer.mock';
import { MOCK_VENDORS } from '../../vendor/vendor.mock';

interface AvailableVendor {
  VendorId: number;
  first_name: string;
  last_name: string;
  service_name: string;
  service_charge: number;
}

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  bookingId: number;
  bookingDetails;
  type: string;
  vendorList: AvailableVendor[] = [];
  selectedId: number = null;
  vendorSelectErrorText = '';

  constructor(
    private authService: AuthenticationService,
    private activeRoute: ActivatedRoute,
    private toaster: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.type = this.activeRoute.snapshot.params.type;
    this.bookingId = Number(this.activeRoute.snapshot.params.id);
    this.authService.headerText.next({
      headerStrong: 'Customer Details'
    });

    this.bookingDetails = MOCK_BOOKINGS.find(booking => booking.id === this.bookingId);
    if (!this.bookingDetails) {
      this.toaster.error('The requested booking could not be found.', 'Petcoset Admin');
      this.router.navigateByUrl('/admin/customer/customer-list/pending');
      return;
    }

    if (this.type === 'approve') {
      this.getVendorList();
    }
  }

  getVendorList() {
    this.vendorList = MOCK_VENDORS.map(vendor => ({
      VendorId: vendor.id,
      first_name: vendor.first_name,
      last_name: vendor.last_name,
      service_name: this.bookingDetails.service_name,
      service_charge: this.bookingDetails.total_amount
    }));
    this.selectedId = this.bookingDetails.vendor_id;
  }

  getNewVendor(id: number) {
    this.selectedId = id;
    this.vendorSelectErrorText = '';
  }

  approveRequest() {
    this.bookingDetails.booking_status_id = 6;
    this.bookingDetails.status_name = 'Approved';
    this.toaster.success('Booking approved.', 'Petcoset Admin');
    this.router.navigateByUrl('/admin/customer/customer-list/approve');
  }

  rejectRequest() {
    this.bookingDetails.booking_status_id = 7;
    this.bookingDetails.status_name = 'Rejected';
    this.toaster.success('Booking rejected.', 'Petcoset Admin');
    this.router.navigateByUrl('/admin/customer/customer-list/pending');
  }

  updateVendor() {
    const selectedVendor = this.vendorList.find(vendor => vendor.VendorId === this.selectedId);
    if (!selectedVendor) {
      this.vendorSelectErrorText = 'Please select a service provider.';
      return;
    }

    this.bookingDetails.vendor_id = selectedVendor.VendorId;
    this.bookingDetails.VendorFirstName = selectedVendor.first_name;
    this.bookingDetails.VendorLastName = selectedVendor.last_name;
    this.bookingDetails.booking_status_id = 6;
    this.bookingDetails.status_name = 'Approved';
    this.toaster.success('Service provider assigned.', 'Petcoset Admin');
    this.router.navigateByUrl('/admin/customer/customer-list/approve');
  }
}
