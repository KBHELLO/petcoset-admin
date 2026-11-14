import { Router } from '@angular/router';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { UserDetails, AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  status = false;
  header;
  userDetails: UserDetails;

  constructor(
    private _authService: AuthenticationService,
    private route: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.userDetails = this._authService.getUserDetails();
    this._authService.headerText
      .subscribe((response) => {
        this.header = response;
      })
  }

  get userInitials(): string {
    const firstName = this.userDetails && this.userDetails.first_name || '';
    const lastName = this.userDetails && this.userDetails.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'A';
  }

  toggleProfile() {
    this.status = !this.status;
  }

  @HostListener('document:click', ['$event'])
  closeProfileOnOutsideClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.status = false;
    }
  }

  @HostListener('document:keydown.escape')
  closeProfileOnEscape() {
    this.status = false;
  }

  logout() {
    localStorage.clear();
    this.route.navigateByUrl('/auth');
  }

}
