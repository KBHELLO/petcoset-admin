import { UserDetails, AuthenticationService } from './../../../authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  status: boolean = false;
  userDetails: UserDetails;

  constructor(
    private _authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
  }

  get userInitials(): string {
    const firstName = this.userDetails && this.userDetails.first_name || '';
    const lastName = this.userDetails && this.userDetails.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'A';
  }

  sidebarToggle() {
    this.status = !this.status;
  }

  closeSidebar() {
    this.status = false;
  }

}
