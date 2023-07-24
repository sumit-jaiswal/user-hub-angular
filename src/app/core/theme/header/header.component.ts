import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

/**
 * HeaderComponent
 *
 * This component represents the header of the application. It displays navigation links
 * and user-related information based on the user's authentication status. The component
 * uses the 'AuthService' to determine if the user is authenticated, and the
 * 'isAuthenticated$' observable to update the header based on changes in the
 * authentication state. The component provides a 'logOut' method to log out the user
 * when the 'Log Out' button is clicked, which calls the 'logout' method from the
 * 'AuthService' to clear the user's authentication token and log them out.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean> | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  logOut() {
    this.authService.logout();
  }
}
