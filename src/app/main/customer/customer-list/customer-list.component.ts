import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';
import { MOCK_BOOKINGS } from '../customer.mock';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  requestList = [];
  type;
  searchTerm = '';

  constructor(
    private _authService: AuthenticationService,
    private active: ActivatedRoute
  ) { }

  ngOnInit() {
    this.type = this.active.snapshot.params.type;
    this._authService.headerText.next({
      headerStrong: this.type === 'approve' ? 'Approved Customers' : 'Pending Customers'
    });
    this.requestList = MOCK_BOOKINGS.filter(booking =>
      booking.booking_status_id === (this.type === 'approve' ? 6 : 4)
    );
  }

  get filteredRequests() {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return this.requestList;
    }

    return this.requestList.filter(request => {
      const searchableText = `${request.CustomerFirstName} ${request.CustomerLastName} ${request.email} ${request.phone_number} ${request.service_name}`;
      return searchableText.toLowerCase().indexOf(query) !== -1;
    });
  }

}
